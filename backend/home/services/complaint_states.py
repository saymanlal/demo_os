from enum import Enum

class ComplaintState(Enum):
    ASK_INTENT = 1
    ASK_TYPE = 2
    ASK_DESCRIPTION = 3
    ASK_LOCATION = 4
    CONFIRM_NEW = 5
    ASK_EXISTING_ID = 6
    READ_EXISTING = 7
    ASK_CLOSE = 8
    DONE = 9
