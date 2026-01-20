from home.models import Complaint


class ComplaintSession:
    def __init__(self, caller_number: str):
        self.caller_number = caller_number
        self.step = 1
        self.data = {
            "category": "Electricity",
            "description": None,
            "location": None,
        }

    def handle_input(self, text: str):
        text = text.strip()
        lower = text.lower()

        # -------------------------
        # STEP 1: PROBLEM DESCRIPTION
        # -------------------------
        if self.step == 1:
            self.data["description"] = text
            self.step = 2
            return (
                "Dhanyavaad. Kripya us jagah ka naam batayein "
                "jahan yeh samasya hai.",
                False
            )

        # -------------------------
        # STEP 2: LOCATION
        # -------------------------
        if self.step == 2:
            self.data["location"] = text
            self.step = 3
            return (
                f"Aap keh rahe hain ki {self.data['description']} "
                f"yeh samasya {self.data['location']} mein hai. "
                f"Kya main complaint darj kar doon? Haan ya Nahi.",
                False
            )

        # -------------------------
        # STEP 3: CONFIRMATION (FINAL FIX)
        # -------------------------
        if self.step == 3:

            # ✅ YES detection (Hindi + English, bulletproof)
            if (
                lower.startswith("ह") or
                "haan" in lower or
                "han" in lower or
                "ha" in lower or
                "yes" in lower
            ):
                return self._register()

            # ❌ NO detection
            if (
                lower.startswith("न") or
                "nahi" in lower or
                "nahin" in lower or
                "no" in lower
            ):
                self.step = 1
                return (
                    "Theek hai. Kripya apni samasya dobara batayein.",
                    False
                )

            return "Kripya sirf Haan ya Nahi mein uttar dein.", False

        return "Dhanyavaad.", True

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
            f"Kripya ise surakshit rakhein.",
            True
        )
