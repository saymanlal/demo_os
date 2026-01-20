import uuid
from .complaint_states import ComplaintState


class ComplaintSession:
    def __init__(self, caller_number):
        self.state = ComplaintState.ASK_DESCRIPTION
        self.data = {}
        self.caller_number = caller_number
        self.call_sid = None

    def handle_input(self, text: str):
        text = text.lower()

        if self.state == ComplaintState.ASK_DESCRIPTION:
            self.data["description"] = text
            self.state = ComplaintState.ASK_LOCATION
            return "Kripya apna shetra ya gaon batayein.", False

        if self.state == ComplaintState.ASK_LOCATION:
            self.data["location"] = text
            self.state = ComplaintState.CONFIRM
            return (
                "Kya main aapki complaint darj kar doon? "
                "Kripya haan ya nahi mein jawab dein.",
                False
            )

        if self.state == ComplaintState.CONFIRM:
            if "haan" in text or "yes" in text:
                self.state = ComplaintState.REGISTER
                return self._register(), True
            else:
                self.state = ComplaintState.DONE
                return "Theek hai. Dhanyavaad.", True

        return "Dhanyavaad.", True

    def _register(self):
        complaint_id = f"MPBV-{uuid.uuid4().hex[:8].upper()}"
        self.data["complaint_id"] = complaint_id

        print("✅ COMPLAINT REGISTERED:", self.data)

        return (
            f"Aapki complaint safaltapoorvak darj kar li gayi hai. "
            f"Aapka complaint number hai {complaint_id}. "
            "Dhanyavaad."
        )
