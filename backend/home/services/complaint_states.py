from enum import Enum


class ComplaintState(Enum):
    """IVR State Machine States"""
    GREETING = "greeting"
    ASK_PROBLEM = "ask_problem"
    VERIFY_METER = "verify_meter"
    VERIFY_NAME = "verify_name"
    CONFIRM = "confirm"
    REGISTER = "register"
    DONE = "done"