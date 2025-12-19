from django.urls import path
from home.views.otp import SendPhoneOTP
from home.views.login_otp import LoginSendOTP
from home.views.auth import SignupView, VerifyPhoneOTP
from home.views.dashboard import DashboardView

urlpatterns = [
    # 🔐 SIGNUP FLOW
    path("auth/signup/", SignupView.as_view()),          # create user
    path("auth/send-otp/", SendPhoneOTP.as_view()),      # signup OTP (phone)

    # 🔑 LOGIN FLOW
    path("auth/login-otp/", LoginSendOTP.as_view()),     # login OTP (phone/email)

    # ✅ VERIFY (COMMON FOR SIGNUP + LOGIN)
    path("auth/verify-otp/", VerifyPhoneOTP.as_view()),

    path("dashboard/", DashboardView.as_view(), name="dashboard"),
]
