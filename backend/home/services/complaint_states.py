# ~/demo_os/backend/home/services/complaint_states.py
from enum import Enum

class ComplaintState(Enum):
    ASK_INTENT = 1
    ASK_TYPE = 2
    ASK_DESCRIPTION = 3
    ASK_LOCATION = 4
    CONFIRM_NEW = 5
    ASK_EXISTING_ID = 6
    ASK_CLOSE = 7  # ADDED: For asking if user wants to close existing complaint
    ASK_MORE_PROBLEMS = 8
    DONE = 9