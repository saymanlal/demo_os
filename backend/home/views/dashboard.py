from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import localtime
from django.db.models import Sum
from django.utils.dateparse import parse_date

from home.permissions import IsAdminUserCustom
from home.models import PhoneOTP, Complaint, CallLog


# =====================================================
# USER DASHBOARD (UNCHANGED)
# =====================================================

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        user_data = {
            "id": user.id,
            "name": user.first_name,
            "phone": user.username,
            "email": user.email,
            "joined_at": user.date_joined.date()
        }

        otp_obj = PhoneOTP.objects.filter(
            phone=user.username
        ).order_by("-created_at").first()

        phone_verified = False
        otp_attempts_used = 0

        if otp_obj:
            phone_verified = not otp_obj.is_expired()
            otp_attempts_used = otp_obj.attempts

        auth_data = {
            "phone_verified": phone_verified,
            "login_method": "OTP",
            "last_login": localtime(user.last_login) if user.last_login else None
        }

        stats_data = {
            "total_logins": 1 if user.last_login else 0,
            "last_active": localtime(user.last_login) if user.last_login else None,
            "otp_attempts_used": otp_attempts_used,
            "otp_attempts_limit": 5
        }

        plan_data = {
            "name": "Free",
            "status": "Active",
            "valid_till": None,
            "can_upgrade": True
        }

        return Response({
            "user": user_data,
            "auth": auth_data,
            "stats": stats_data,
            "plan": plan_data
        })


# =====================================================
# ADMIN DASHBOARD SUMMARY
# =====================================================

class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):

        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        calls = CallLog.objects.all()
        complaints = Complaint.objects.all()

        if start_date:
            calls = calls.filter(created_at__date__gte=parse_date(start_date))
            complaints = complaints.filter(created_at__date__gte=parse_date(start_date))

        if end_date:
            calls = calls.filter(created_at__date__lte=parse_date(end_date))
            complaints = complaints.filter(created_at__date__lte=parse_date(end_date))

        total_calls = calls.count()
        inbound_calls = calls.filter(call_type="inbound").count()
        outbound_calls = calls.filter(call_type="outbound").count()
        completed_calls = calls.filter(status="completed").count()
        failed_calls = calls.filter(status="failed").count()

        total_talk_time = calls.aggregate(
            total=Sum("duration")
        )["total"] or 0

        total_complaints = complaints.count()
        resolved = complaints.filter(status="RESOLVED").count()
        pending = complaints.filter(status="REGISTERED").count()

        return Response({
            "calls": {
                "total": total_calls,
                "inbound": inbound_calls,
                "outbound": outbound_calls,
                "completed": completed_calls,
                "failed": failed_calls,
                "total_talk_time_seconds": total_talk_time,
            },
            "complaints": {
                "total": total_complaints,
                "resolved": resolved,
                "pending": pending
            }
        })


class AdminCallListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):

        phone = request.query_params.get("phone")
        status = request.query_params.get("status")
        call_type = request.query_params.get("type")

        calls = CallLog.objects.all().order_by("-created_at")

        if phone:
            calls = calls.filter(phone_number__icontains=phone)

        if status:
            calls = calls.filter(status=status)

        if call_type:
            calls = calls.filter(call_type=call_type)

        data = [
            {
                "call_sid": c.call_sid,
                "phone": c.phone_number,
                "type": c.call_type,
                "duration": c.duration,
                "status": c.status,
                "recording_url": c.recording_url,
                "created_at": c.created_at,
            }
            for c in calls
        ]

        return Response(data)


# =====================================================
# ADMIN COMPLAINT LIST
# =====================================================

class AdminComplaintListView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        complaints = Complaint.objects.order_by("-created_at")

        data = [
            {
                "complaint_id": c.complaint_id,
                "caller": c.caller_number,
                "status": c.status,
                "category": c.category,
                "area": c.area_name,
                "verified": c.verified,
                "created_at": c.created_at,
            }
            for c in complaints
        ]

        return Response(data)


from django.db.models import Count, Avg
from django.db.models.functions import TruncDate, TruncMonth


# =====================================================
# ADMIN CALL TREND (LINE GRAPH)
# =====================================================

class AdminCallTrendView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        group_by = request.query_params.get("group_by", "day")

        if group_by == "month":
            data = (
                CallLog.objects
                .annotate(period=TruncMonth("created_at"))
                .values("period")
                .annotate(total=Count("id"))
                .order_by("period")
            )
        else:
            data = (
                CallLog.objects
                .annotate(period=TruncDate("created_at"))
                .values("period")
                .annotate(total=Count("id"))
                .order_by("period")
            )

        return Response([
            {
                "period": item["period"],
                "total_calls": item["total"]
            }
            for item in data
        ])


# =====================================================
# ADMIN CALL STATUS DISTRIBUTION (PIE CHART)
# =====================================================

class AdminCallStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        data = (
            CallLog.objects
            .values("status")
            .annotate(total=Count("id"))
        )

        return Response([
            {
                "status": item["status"],
                "count": item["total"]
            }
            for item in data
        ])


# =====================================================
# ADMIN COMPLAINT STATUS TREND
# =====================================================

class AdminComplaintStatusView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        data = (
            Complaint.objects
            .values("status")
            .annotate(total=Count("id"))
        )

        return Response([
            {
                "status": item["status"],
                "count": item["total"]
            }
            for item in data
        ])


# =====================================================
# ADMIN AVERAGE CALL DURATION
# =====================================================

class AdminAverageDurationView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        avg_duration = CallLog.objects.aggregate(
            avg=Avg("duration")
        )["avg"] or 0

        return Response({
            "average_call_duration_seconds": round(avg_duration, 2)
        })



import csv
from django.http import HttpResponse


class AdminExportCallsCSV(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="calls_export.csv"'

        writer = csv.writer(response)
        writer.writerow([
            "Call SID",
            "Phone",
            "Type",
            "Duration",
            "Status",
            "Recording URL",
            "Created At"
        ])

        calls = CallLog.objects.all().order_by("-created_at")

        for call in calls:
            writer.writerow([
                call.call_sid,
                call.phone_number,
                call.call_type,
                call.duration,
                call.status,
                call.recording_url,
                call.created_at
            ])

        return response
    


from django.shortcuts import redirect


class AdminRecordingView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    def get(self, request, call_sid):
        try:
            call = CallLog.objects.get(call_sid=call_sid)

            if not call.recording_url:
                return Response({"error": "No recording found"}, status=404)

            return redirect(call.recording_url)

        except CallLog.DoesNotExist:
            return Response({"error": "Call not found"}, status=404)



