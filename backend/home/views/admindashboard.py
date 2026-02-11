from django.db.models import Count, Avg, Sum
from django.db.models.functions import TruncDay
from rest_framework.views import APIView
from rest_framework.response import Response
from home.models import CallLog, Complaint


class AdminDashboardView(APIView):
    def get(self, request):
        total_calls = CallLog.objects.count()
        completed_calls = CallLog.objects.filter(status__iexact="completed").count()
        inbound_calls = CallLog.objects.filter(call_type__iexact="inbound").count()
        outbound_calls = CallLog.objects.filter(call_type__iexact="outbound").count()

        total_complaints = Complaint.objects.count()
        resolved_complaints = Complaint.objects.filter(status__iexact="resolved").count()

        total_talk_time = CallLog.objects.aggregate(
            total=Sum("duration")
        )["total"] or 0

        return Response({
            "calls": {
                "total": total_calls,
                "completed": completed_calls,
                "inbound": inbound_calls,
                "outbound": outbound_calls,
                "total_talk_time_seconds": total_talk_time
            },
            "complaints": {
                "total": total_complaints,
                "resolved": resolved_complaints
            }
        })


class CallTrendView(APIView):
    def get(self, request):

        trend = (
            CallLog.objects
            .annotate(day=TruncDay("created_at"))
            .values("day")
            .annotate(total_calls=Count("id"))
            .order_by("day")
        )

        formatted = [
            {
                "period": item["day"].strftime("%d %b"),
                "total_calls": item["total_calls"]
            }
            for item in trend
        ]

        return Response(formatted)


class CallStatusView(APIView):
    def get(self, request):
        data = (
            CallLog.objects
            .values("status")
            .annotate(count=Count("id"))
        )
        return Response(list(data))


class ComplaintStatusView(APIView):
    def get(self, request):
        data = (
            Complaint.objects
            .values("status")
            .annotate(count=Count("id"))
        )
        return Response(list(data))


class AvgDurationView(APIView):
    def get(self, request):
        avg = CallLog.objects.aggregate(
            avg=Avg("duration")
        )["avg"] or 0

        return Response({
            "average_call_duration_seconds": round(avg)
        })