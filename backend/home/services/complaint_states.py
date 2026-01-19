from enum import Enum


class ComplaintState(Enum):
    ASK_CATEGORY = "ASK_CATEGORY"
    ASK_DESCRIPTION = "ASK_DESCRIPTION"
    ASK_LOCATION = "ASK_LOCATION"
    CONFIRM = "CONFIRM"
    REGISTER = "REGISTER"
    DONE = "DONE"
