import time
from asgiref.sync import sync_to_async
from home.models import Complaint
from home.services.complaint_states import ComplaintState


class ComplaintSession:
    def __init__(self, caller_number):
        self.state = ComplaintState.ASK_DESCRIPTION
        self.caller_number = caller_number

        self.step = 1
        self.is_completed = False

        # 🔒 Confirmation lock (prevents duplicate processing)
        self.processing_confirmation = False
        self.last_input_time = 0

        self.data = {
            "category": "Electricity",
            "description": None,
            "location": None,
        }

    async def handle_input(self, text: str):
        """
        Main state machine for complaint registration
        Returns: (response_text, should_end_call)
        ✅ Now async to support database operations
        """
        
        # 🛑 HARD STOP: Already completed
        if self.is_completed:
            print("⚠️ Ignoring input - complaint already completed")
            return None, True

        # 🛑 Debounce rapid inputs (500ms)
        now = time.time()
        if now - self.last_input_time < 0.5:
            print("⚠️ Debounced - too fast")
            return None, False
        self.last_input_time = now

        text = text.strip()
        if not text:
            return None, False

        lower = text.lower()
        print(f"🔄 State: {self.state.value} | Step: {self.step} | Input: {text}")

        # ═══════════════════════════════════════════════════════
        # STEP 1: DESCRIPTION
        # ═══════════════════════════════════════════════════════
        if self.step == 1:
            self.data["description"] = text
            self.step = 2
            self.state = ComplaintState.ASK_LOCATION
            return (
                "Dhanyavaad. Kripya us jagah ka naam batayein "
                "jahan yeh samasya hai.",
                False
            )

        # ═══════════════════════════════════════════════════════
        # STEP 2: LOCATION
        # ═══════════════════════════════════════════════════════
        elif self.step == 2:
            self.data["location"] = text
            self.step = 3
            self.state = ComplaintState.CONFIRM
            return (
                "Kya main aapki complaint darj kar doon? "
                "Kripya haan ya nahi mein jawab dein.",
                False
            )

        # ═══════════════════════════════════════════════════════
        # STEP 3: CONFIRMATION (YES/NO)
        # ═══════════════════════════════════════════════════════
        elif self.step == 3:
            
            # 🔒 Prevent double-processing
            if self.processing_confirmation:
                print("⚠️ Already processing confirmation - ignoring")
                return None, False

            # ─────────────────────────────────────────────────────
            # YES DETECTION (Hindi + English)
            # ─────────────────────────────────────────────────────
            is_yes = (
                "हा" in text or "हां" in text or  # Hindi "haan"
                "haan" in lower or "han" in lower or
                "yes" in lower or "ha " in lower or "haa" in lower
            )

            if is_yes:
                print("✅ YES detected - registering complaint")
                self.processing_confirmation = True
                return await self._register()

            # ─────────────────────────────────────────────────────
            # NO DETECTION (Hindi + English)
            # ─────────────────────────────────────────────────────
            is_no = (
                "नही" in text or "नहीं" in text or  # Hindi "nahi"
                "nahi" in lower or "nai" in lower or
                "no" in lower or "nahin" in lower
            )

            if is_no:
                print("❌ NO detected - resetting to description")
                self.processing_confirmation = True
                
                # Reset to step 1
                self.step = 1
                self.state = ComplaintState.ASK_DESCRIPTION
                self.data["description"] = None
                self.data["location"] = None
                
                # Clear lock after reset
                self.processing_confirmation = False
                
                return (
                    "Theek hai. Kripya apni samasya dobara batayein.",
                    False
                )

            # ─────────────────────────────────────────────────────
            # INVALID INPUT - Ask Again
            # ─────────────────────────────────────────────────────
            print("⚠️ Invalid confirmation input")
            return (
                "Kripya sirf haan ya nahi mein uttar dein.",
                False
            )

        # ═══════════════════════════════════════════════════════
        # FALLBACK (Should never reach here)
        # ═══════════════════════════════════════════════════════
        print("⚠️ Unexpected state - ending call")
        return None, True

    # ═══════════════════════════════════════════════════════
    # REGISTER COMPLAINT IN DATABASE (ASYNC-SAFE)
    # ═══════════════════════════════════════════════════════
    async def _register(self):
        """
        Creates complaint in database and returns confirmation message
        ✅ Uses sync_to_async for Django ORM compatibility
        """
        try:
            # ✅ Wrap Django ORM call in sync_to_async
            complaint = await sync_to_async(Complaint.objects.create)(
                caller_number=self.caller_number,
                category=self.data["category"],
                description=self.data["description"],
                location=self.data["location"],
            )

            # Mark session as completed
            self.is_completed = True
            self.state = ComplaintState.DONE
            self.data["complaint_id"] = complaint.complaint_id

            print(f"✅ Complaint registered: {complaint.complaint_id}")

            return (
                f"Aapki shikayat safalta se darj kar li gayi hai. "
                f"Aapka complaint number hai {complaint.complaint_id}. "
                f"Kripya ise surakshit rakhein. Dhanyavaad.",
                True  # ✅ End call after this
            )

        except Exception as e:
            print(f"❌ Database error: {e}")
            self.processing_confirmation = False
            return (
                "Kshama kijiye, complaint darj karne mein samasya aa rahi hai. "
                "Kripya dobara koshish karein.",
                False
            )