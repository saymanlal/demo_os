from home.models import Complaint
from home.services.complaint_states import ComplaintState
import logging
import re

logger = logging.getLogger(__name__)

YES_WORDS = ['haan', 'han', 'ha', 'yes', 'ok']
NO_WORDS = ['nahi', 'nahin', 'na', 'no']


class ComplaintSession:
    def __init__(self, caller_number):
        self.caller_number = caller_number
        self.state = ComplaintState.ASK_INTENT
        self.language = "hi"
        self.data = {}
        self.current_complaint = None

    def _clean(self, text: str) -> str:
        return re.sub(r'\s+', ' ', text.lower().strip())

    def _has_word(self, text, words):
        for w in words:
            if re.search(rf'\b{re.escape(w)}\b', text):
                return True
        return False

    def _looks_like_description(self, text):
        # If user already describes a problem, assume NEW complaint
        return len(text.split()) >= 4

    def handle_input(self, text):
        text = self._clean(text)

        # ---- ASK INTENT ----
        if self.state == ComplaintState.ASK_INTENT:
            if self._has_word(text, ['yes', 'complaint']):
                self.language = "en"

            self.state = ComplaintState.ASK_TYPE
            return (
                "Is this a new complaint or an existing complaint?"
                if self.language == "en"
                else "Kya yeh nayi samasya hai ya pehle se darj complaint?",
                False
            )

        # ---- ASK TYPE ----
        if self.state == ComplaintState.ASK_TYPE:
            # Explicit NEW
            if self._has_word(text, ['new', 'nayi']):
                self.state = ComplaintState.ASK_DESCRIPTION
                return (
                    "Please describe your problem."
                    if self.language == "en"
                    else "Kripya apni samasya batayein.",
                    False
                )

            # Explicit EXISTING
            if self._has_word(text, ['existing', 'purani', 'number', 'id']):
                self.state = ComplaintState.ASK_EXISTING_ID
                return (
                    "Please tell your complaint number."
                    if self.language == "en"
                    else "Kripya apna complaint number batayein.",
                    False
                )

            # 🚀 AUTO-DETECT NEW (important fix)
            if self._looks_like_description(text):
                self.data["description"] = text
                self.state = ComplaintState.ASK_LOCATION
                return (
                    "Please tell the location."
                    if self.language == "en"
                    else "Kripya jagah ka naam batayein.",
                    False
                )

            return (
                "Please say new or existing."
                if self.language == "en"
                else "Kripya nayi ya purani complaint bolein.",
                False
            )

        # ---- NEW COMPLAINT FLOW ----
        if self.state == ComplaintState.ASK_DESCRIPTION:
            self.data["description"] = text
            self.state = ComplaintState.ASK_LOCATION
            return (
                "Please tell the location."
                if self.language == "en"
                else "Kripya jagah ka naam batayein.",
                False
            )

        if self.state == ComplaintState.ASK_LOCATION:
            self.data["location"] = text
            self.state = ComplaintState.CONFIRM_NEW
            return (
                f"Should I register the complaint at {self.data['location']}?"
                if self.language == "en"
                else "Kya main complaint darj karun?",
                False
            )

        if self.state == ComplaintState.CONFIRM_NEW:
            if self._has_word(text, YES_WORDS):
                c = Complaint.objects.create(
                    caller_number=self.caller_number,
                    category="Electricity",
                    description=self.data["description"],
                    location=self.data["location"],
                    status="PENDING"
                )
                self.state = ComplaintState.DONE
                return (
                    f"Your complaint is registered. Number {c.complaint_id}."
                    if self.language == "en"
                    else f"Aapki complaint darj ho gayi hai. Number {c.complaint_id}.",
                    True
                )

            self.state = ComplaintState.ASK_DESCRIPTION
            return (
                "Okay, please describe again."
                if self.language == "en"
                else "Theek hai, kripya dobara samasya batayein.",
                False
            )

        # ---- EXISTING COMPLAINT FLOW ----
        if self.state == ComplaintState.ASK_EXISTING_ID:
            try:
                c = Complaint.objects.get(complaint_id=text.upper())
                self.current_complaint = c
                self.state = ComplaintState.ASK_CLOSE
                return (
                    f"Complaint status is {c.status}. Do you want to close it?"
                    if self.language == "en"
                    else f"Complaint ka status {c.status} hai. Kya aap ise band karna chahte hain?",
                    False
                )
            except Complaint.DoesNotExist:
                return (
                    "Complaint number not found."
                    if self.language == "en"
                    else "Complaint number nahi mila.",
                    False
                )

        if self.state == ComplaintState.ASK_CLOSE:
            if self._has_word(text, YES_WORDS):
                self.current_complaint.status = "CLOSED"
                self.current_complaint.save()
                self.state = ComplaintState.DONE
                return (
                    "Your complaint has been closed. Thank you."
                    if self.language == "en"
                    else "Aapki complaint band kar di gayi hai. Dhanyavaad.",
                    True
                )

            self.state = ComplaintState.DONE
            return (
                "Okay. Thank you for calling."
                if self.language == "en"
                else "Theek hai. Call karne ke liye dhanyavaad.",
                True
            )

        return ("Dhanyavaad.", True)
