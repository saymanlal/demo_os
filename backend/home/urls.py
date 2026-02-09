from django.urls import path
from home.views.otp import SendPhoneOTP
from home.views.login_otp import LoginSendOTP

from home.views.auth import SignupView, VerifyPhoneOTP, MeView

from home.views.dashboard import (
    DashboardView,
    AdminDashboardView,
    AdminCallListView,
    AdminComplaintListView,
    AdminCallTrendView,
    AdminCallStatusView,
    AdminComplaintStatusView,
    AdminAverageDurationView,
    AdminExportCallsCSV,
    AdminRecordingView
)


from home.views.call import start_call, call_status_callback
from home.views.twilio_final import final_twiml
from home.views.twilio_voice import twilio_voice
from home.views.forgot_password import (
    ForgotPasswordSendOTP,
    VerifyForgotPasswordOTP,
    ResetPassword
)

urlpatterns = [
    # AUTH
    path("auth/signup/", SignupView.as_view()),
    path("auth/send-otp/", SendPhoneOTP.as_view()),
    path("auth/login-otp/", LoginSendOTP.as_view()),
    path("auth/verify-otp/", VerifyPhoneOTP.as_view()),
    path("auth/forgot-password/", ForgotPasswordSendOTP.as_view()),
    path("auth/verify-forgot-otp/", VerifyForgotPasswordOTP.as_view()),
    path("auth/reset-password/", ResetPassword.as_view()),

    # USER DASHBOARD
    path("dashboard/", DashboardView.as_view(), name="dashboard"),

    # ADMIN APIs
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin_dashboard"),
    path("admin/calls/", AdminCallListView.as_view(), name="admin_calls"),
    path("admin/complaints/", AdminComplaintListView.as_view(), name="admin_complaints"),

    # CALL ROUTES
    path("call/start/", start_call, name="start_call"),
    path("twilio/voice/", twilio_voice, name="twilio_voice"),
    path("twilio/status-callback/", call_status_callback, name="twilio_status_callback"),
    path("twilio/final/<str:complaint_id>/", final_twiml, name="twilio_final"),
    # ANALYTICS
path("admin/analytics/call-trend/", AdminCallTrendView.as_view()),
path("admin/analytics/call-status/", AdminCallStatusView.as_view()),
path("admin/analytics/complaint-status/", AdminComplaintStatusView.as_view()),
path("admin/analytics/avg-duration/", AdminAverageDurationView.as_view()),
path("admin/export/calls/", AdminExportCallsCSV.as_view()),
path("admin/recording/<str:call_sid>/", AdminRecordingView.as_view()),
path("auth/me/", MeView.as_view()),



]
