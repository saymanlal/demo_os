"""
backend/home/views/admin_recordings.py
API endpoint to fetch all call recordings for frontend
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from home.models import CallLog
from django.db.models import Q


class AdminRecordingsListView(APIView):
    """
    GET /api/admin/recordings/
    Returns all call logs with recording details for frontend
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Check if user is admin/staff
        if not request.user.is_staff:
            return Response({"error": "Unauthorized"}, status=403)

        # Get all call logs, ordered by most recent first
        call_logs = CallLog.objects.all().select_related('complaint').order_by('-created_at')

        # Serialize the data
        recordings_data = []
        for log in call_logs:
            recordings_data.append({
                'call_sid': log.call_sid,
                'phone_number': log.phone_number,
                'from_number': log.from_number,
                'to_number': log.to_number,
                'call_type': log.call_type,
                'status': log.status,
                'duration': log.duration,
                'recording_url': log.recording_url,
                'recording_sid': log.recording_sid,
                'recording_duration': log.recording_duration,
                'created_at': log.created_at.isoformat(),
                'complaint_id': log.complaint.complaint_id if log.complaint else None,
            })

        return Response({
            'recordings': recordings_data,
            'total': len(recordings_data)
        })