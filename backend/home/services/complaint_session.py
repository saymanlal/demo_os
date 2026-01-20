import time
from home.models import Complaint


class ComplaintSession:
    def __init__(self, caller_number: str):
        self.caller_number = caller_number
        self.step = 1
        self.is_completed = False

        # 🔒 NEW: confirmation lock
        self.confirmation_locked = False
        self.confirmation_time = None

        self.data = {
            "category": "Electricity",
            "description": None,
            "location": None,
        }

    def handle_input(self, text: str):

        # 🔒 HARD STOP after completion
        if self.is_completed:
            return None, True

        # 🔒 Ignore inputs during debounce window (2 sec)
        if self.confirmation_locked:
            if time.time() - self.confirmation_time < 2.0:
                return None, False
            else:
                self.confirmation_locked = False

        text = text.strip()
        lower = text.lower()

        # STEP 1
        if self.step == 1:
            self.data["description"] = text
            self.step = 2
            return (
                "Dhanyavaad. Kripya us jagah ka naam batayein "
                "jahan yeh samasya hai.",
                False
            )

        # STEP 2
        if self.step == 2:
            self.data["location"] = text
            self.step = 3
            return (
                f"Aap keh rahe hain ki {self.data['description']} "
                f"yeh samasya {self.data['location']} mein hai. "
                f"Kya main complaint darj kar doon? Haan ya Nahi.",
                False
            )

        # STEP 3 — CONFIRMATION (🔥 FIXED)
        if self.step == 3:
            # 🔒 lock immediately on first yes/no
            if (
                "ह" in text or
                "haan" in lower or
                "han" in lower or
                "yes" in lower
            ):
                self.confirmation_locked = True
                self.confirmation_time = time.time()
                return self._register()

            if (
                "न" in text or
                "nahi" in lower or
                "no" in lower
            ):
                self.confirmation_locked = True
                self.confirmation_time = time.time()
                self.step = 1
                return (
                    "Theek hai. Kripya apni samasya dobara batayein.",
                    False
                )

            return "Kripya sirf Haan ya Nahi mein uttar dein.", False

        return None, True

    def _register(self):
        complaint = Complaint.objects.create(
            caller_number=self.caller_number,
            category=self.data["category"],
            description=self.data["description"],
            location=self.data["location"],
        )


        return (
            f"Aapki shikayat safalta se darj kar li gayi hai. "
            f"Aapka complaint number hai {complaint.complaint_id}. "
            f"Kripya ise surakshit rakhein. Aap call kaat sakte hain.",
            True
        )
