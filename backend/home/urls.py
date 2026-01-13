from django.urls import path
from backend.home.views.otp import SendPhoneOTP
from backend.home.views.login_otp import LoginSendOTP
from backend.home.views.auth import SignupView, VerifyPhoneOTP
from backend.home.views.dashboard import DashboardView
from backend.home.views.call import start_call



from backend.home.views.twilio_voice import twilio_voice
from backend.home.views.forgot_password import (
    ForgotPasswordSendOTP,
    VerifyForgotPasswordOTP,
    ResetPassword
)

urlpatterns = [
    # 🔐 SIGNUP FLOW
    path("auth/signup/", SignupView.as_view()),          
    path("auth/send-otp/", SendPhoneOTP.as_view()),      

    # 🔑 LOGIN FLOW
    path("auth/login-otp/", LoginSendOTP.as_view()),     

    # ✅ VERIFY (COMMON FOR SIGNUP + LOGIN)
    path("auth/verify-otp/", VerifyPhoneOTP.as_view()),
    path("auth/forgot-password/", ForgotPasswordSendOTP.as_view()),
    path("auth/verify-forgot-otp/", VerifyForgotPasswordOTP.as_view()),
    path("auth/reset-password/", ResetPassword.as_view()),

    path("dashboard/", DashboardView.as_view(), name="dashboard"),
    
    # 📞 CALL ROUTES
    path("call/start/", start_call),
    path("twilio/voice/", twilio_voice),
     # <-- AI speech processing
]
