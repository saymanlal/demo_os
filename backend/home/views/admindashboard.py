from django.db.models import Count, Avg
from django.db.models.functions import TruncDay
from rest_framework.views import APIView
from rest_framework.response import Response
from backend.models import CallLog, Complaint


class AdminDashboardView(APIView):
    def get(self, request):

        total_calls = CallLog.objects.count()
        completed_calls = CallLog.objects.filter(status__iexact="completed").count()

        total_complaints = Complaint.objects.count()
        resolved_complaints = Complaint.objects.filter(status__iexact="resolved").count()

        avg_duration = CallLog.objects.aggregate(
            avg=Avg("duration")
        )["avg"] or 0

        return Response({
            "stats": {
                "total_calls": total_calls,
                "completed_calls": completed_calls,
                "total_complaints": total_complaints,
                "resolved_complaints": resolved_complaints,
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
