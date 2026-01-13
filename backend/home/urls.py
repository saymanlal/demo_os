from django.urls import path

# OTP + AUTH
from backend.home.views.otp import SendPhoneOTP
from backend.home.views.login_otp import LoginSendOTP
from backend.home.views.auth import SignupView, VerifyPhoneOTP
from backend.home.views.forgot_password import (
    ForgotPasswordSendOTP,
    VerifyForgotPasswordOTP,
    ResetPassword
)

# User Dashboard
from backend.home.views.dashboard import DashboardView

# Call + Twilio
from backend.home.views.call import start_call
from backend.home.views.twilio_voice import twilio_voice

urlpatterns = [
    # 🔐 SIGNUP
    path("auth/signup/", SignupView.as_view()),
    path("auth/send-otp/", SendPhoneOTP.as_view()),

    # 🔑 LOGIN
    path("auth/login-otp/", LoginSendOTP.as_view()),

    # 🟢 VERIFY OTP
    path("auth/verify-otp/", VerifyPhoneOTP.as_view()),

    # 🔁 FORGOT PASSWORD
    path("auth/forgot-password/", ForgotPasswordSendOTP.as_view()),
    path("auth/verify-forgot-otp/", VerifyForgotPasswordOTP.as_view()),
    path("auth/reset-password/", ResetPassword.as_view()),

    # 🏠 USER DASHBOARD
    path("dashboard/", DashboardView.as_view(), name="dashboard"),

    # 📞 TWILIO CALL FLOW
    path("call/start/", start_call),
    path("twilio/voice/", twilio_voice),
]
