"""
backend/home/services/call_logger.py
FINAL CLEAN VERSION
"""

from home.models import CallLog, Complaint
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class CallLoggerService:

    # ============================================
    # CREATE CALL LOG
    # ============================================
    @staticmethod
    def log_call_start(
        call_sid,
        phone_number,
        call_type="inbound",
        from_number="",
        to_number="",
    ):
        try:
            call_log, created = CallLog.objects.get_or_create(
                call_sid=call_sid,
                defaults={
                    "phone_number": phone_number,
                    "call_type": call_type,
                    "from_number": from_number,
                    "to_number": to_number,
                    "status": "in-progress",
                    "duration": 0,
                    "created_at": timezone.now(),
                },
            )

            if created:
                logger.info(f"✅ Call logged: {call_sid}")
            else:
                logger.info(f"⚠️ Call already exists: {call_sid}")

            return call_log

        except Exception as e:
            logger.error(f"❌ Error logging call {call_sid}: {str(e)}")
            return None

    # ============================================
    # UPDATE CALL STATUS
    # ============================================
    @staticmethod
    def update_call_status(
        call_sid,
        status,
        duration=None,
        recording_url=None,
        error_message=None,
        complaint_id=None,
    ):
        try:
            call_log = CallLog.objects.get(call_sid=call_sid)

            call_log.status = status

            if duration is not None:
                call_log.duration = int(duration)

            if recording_url:
                call_log.recording_url = recording_url

            if error_message:
                call_log.error_message = error_message

            if complaint_id:
                try:
                    complaint = Complaint.objects.get(id=complaint_id)
                    call_log.complaint = complaint
                except Complaint.DoesNotExist:
                    logger.warning("⚠️ Complaint not found while linking")

            call_log.save()

            logger.info(f"✅ Call updated: {call_sid} → {status}")
            return call_log

        except CallLog.DoesNotExist:
            logger.warning(f"⚠️ CallLog not found for SID: {call_sid}")
            return None

        except Exception as e:
            logger.error(f"❌ Error updating call {call_sid}: {str(e)}")
            return None
