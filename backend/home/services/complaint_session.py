import time
from asgiref.sync import sync_to_async
from home.models import Complaint
from home.services.complaint_states import ComplaintState
from home.services.consumer_registry import consumer_registry


class ComplaintSession:
    def __init__(self, caller_number, ivr_number):
        self.state = ComplaintState.GREETING
        self.caller_number = caller_number
        self.ivr_number = ivr_number

        self.step = 0  # 0=greeting, 1=problem, 2=meter, 3=name, 4=confirm, 5=register
        self.is_completed = False

        # 🔒 Locks
        self.processing_confirmation = False
        self.last_input_time = 0

        # Retry tracking
        self.meter_retry_count = 0
        self.max_meter_retries = 3

        # Data collection
        self.data = {
            "category": "Electricity",
            "description": None,
            "location": None,
            "meter_no": None,
            "consumer_name": None,
            "area_code": None,
            "area_name": None,
        }

    async def handle_input(self, text: str):
        """
        Main state machine for verified complaint registration
        Returns: (response_text, should_end_call)
        """
        
        # 🛑 Already completed
        if self.is_completed:
            print("⚠️ Ignoring input - complaint already completed")
            return None, True

        # 🛑 Debounce (500ms)
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
        # STEP 0: GREETING (Auto-triggered, no user input needed)
        # ═══════════════════════════════════════════════════════
        # This is handled by initial greeting in TwilioMediaConsumer

        # ═══════════════════════════════════════════════════════
        # STEP 1: ASK_PROBLEM
        # ═══════════════════════════════════════════════════════
        if self.step == 1:
            self.data["description"] = text
            self.step = 2
            self.state = ComplaintState.VERIFY_METER
            return (
                "Dhanyavaad. Aage badhne ke liye, kripya apna meter number "
                "ya consumer ID batayein.",
                False
            )

        # ═══════════════════════════════════════════════════════
        # STEP 2: VERIFY_METER
        # ═══════════════════════════════════════════════════════
        elif self.step == 2:
            meter_no = text.strip().upper()
            
            # Verify meter with registry
            consumer_data = consumer_registry.verify_meter(
                meter_no,
                self.ivr_number
            )

            if consumer_data:
                # ✅ Meter verified - store data
                self.data["meter_no"] = meter_no
                self.data["consumer_name"] = consumer_data["consumer_name"]
                self.data["area_code"] = consumer_data["area_code"]
                self.data["area_name"] = consumer_data["area_name"]
                self.data["location"] = consumer_data.get("house_no", "")

                # Move to name confirmation
                self.step = 3
                self.state = ComplaintState.VERIFY_NAME
                
                return (
                    f"Yeh meter Shri {consumer_data['consumer_name']} ke naam par "
                    f"darj hai. Kya yeh aap hi hain? Kripya haan ya nahi bolein.",
                    False
                )

            else:
                # ❌ Meter not found
                self.meter_retry_count += 1
                
                if self.meter_retry_count >= self.max_meter_retries:
                    print(f"❌ Max meter retries reached: {self.meter_retry_count}")
                    return (
                        "Kshama kijiye, aapka meter number verify nahi ho pa raha. "
                        "Kripya sahi jankari ke saath dobara call karein. Dhanyavaad.",
                        True  # End call
                    )
                
                return (
                    f"Yeh meter number verify nahi ho pa raha. "
                    f"Kripya dobara koshish karein. "
                    f"Baaki {self.max_meter_retries - self.meter_retry_count} prayas.",
                    False
                )

        # ═══════════════════════════════════════════════════════
        # STEP 3: VERIFY_NAME (YES/NO Confirmation)
        # ═══════════════════════════════════════════════════════
        elif self.step == 3:
            
            if self.processing_confirmation:
                print("⚠️ Already processing name confirmation")
                return None, False

            # YES Detection
            is_yes = (
                "हा" in text or "हां" in text or
                "haan" in lower or "han" in lower or
                "yes" in lower or "ha " in lower or "haa" in lower
            )

            if is_yes:
                print(f"✅ Name confirmed by user: {self.data['consumer_name']}")
                self.processing_confirmation = True
                
                # Move to final confirmation
                self.step = 4
                self.state = ComplaintState.CONFIRM
                self.processing_confirmation = False
                
                return (
                    f"Dhanyavaad. Aapki pehchan safalta se verify ho gayi hai. "
                    f"Kya main aapki complaint darj kar doon? "
                    f"Kripya haan ya nahi bolein.",
                    False
                )

            # NO Detection
            is_no = (
                "नही" in text or "नहीं" in text or
                "nahi" in lower or "nai" in lower or
                "no" in lower or "nahin" in lower
            )

            if is_no:
                print("❌ User denied being the consumer")
                self.processing_confirmation = True
                
                return (
                    "Kshama kijiye, aap is meter ke adhikrit upbhokta nahi lagte. "
                    "Kripya sahi jankari ke saath dobara call karein. Dhanyavaad.",
                    True  # End call
                )

            # Invalid input
            return (
                "Kripya sirf haan ya nahi mein uttar dein.",
                False
            )

        # ═══════════════════════════════════════════════════════
        # STEP 4: CONFIRM (Final consent before registration)
        # ═══════════════════════════════════════════════════════
        elif self.step == 4:
            
            if self.processing_confirmation:
                print("⚠️ Already processing final confirmation")
                return None, False

            # YES Detection
            is_yes = (
                "हा" in text or "हां" in text or
                "haan" in lower or "han" in lower or
                "yes" in lower or "ha " in lower or "haa" in lower
            )

            if is_yes:
                print("✅ Final consent given - registering complaint")
                self.processing_confirmation = True
                return await self._register()

            # NO Detection
            is_no = (
                "नही" in text or "नहीं" in text or
                "nahi" in lower or "nai" in lower or
                "no" in lower or "nahin" in lower
            )

            if is_no:
                print("❌ User declined registration")
                self.processing_confirmation = True
                
                # Reset to problem step
                self.step = 1
                self.state = ComplaintState.ASK_PROBLEM
                self.data["description"] = None
                self.processing_confirmation = False
                
                return (
                    "Theek hai. Kripya apni samasya dobara batayein.",
                    False
                )

            # Invalid input
            return (
                "Kripya sirf haan ya nahi mein uttar dein.",
                False
            )

        # ═══════════════════════════════════════════════════════
        # FALLBACK
        # ═══════════════════════════════════════════════════════
        print("⚠️ Unexpected state - ending call")
        return None, True

    # ═══════════════════════════════════════════════════════
    # REGISTER COMPLAINT (ASYNC-SAFE)
    # ═══════════════════════════════════════════════════════
    async def _register(self):
        """
        Register verified complaint in database
        """
        try:
            # Create complaint with verified data
            complaint = await sync_to_async(Complaint.objects.create)(
                caller_number=self.caller_number,
                category=self.data["category"],
                description=self.data["description"],
                location=self.data.get("location", ""),
                meter_no=self.data["meter_no"],
                consumer_name=self.data["consumer_name"],
                area_code=self.data["area_code"],
            )

            # Mark as completed
            self.is_completed = True
            self.state = ComplaintState.DONE
            self.data["complaint_id"] = complaint.complaint_id

            print(f"✅ Verified complaint registered: {complaint.complaint_id}")

            return (
                f"Aapki shikayat safalta se darj kar li gayi hai. "
                f"Aapka complaint number hai {complaint.complaint_id}. "
                f"Kripya ise surakshit rakhein. Dhanyavaad.",
                True  # End call
            )

        except Exception as e:
            print(f"❌ Database error: {e}")
            self.processing_confirmation = False
            return (
                "Kshama kijiye, complaint darj karne mein samasya aa rahi hai. "
                "Kripya dobara koshish karein.",
                False
            )