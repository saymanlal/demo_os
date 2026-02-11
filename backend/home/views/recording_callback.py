"""
backend/home/views/recording_callback.py
NEW FILE - Handles Twilio recording completion callbacks
"""

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from home.services.call_logger import CallLoggerService
import logging

logger = logging.getLogger(__name__)


@csrf_exempt
def recording_callback(request):
    """
    🎙️ Twilio Recording Callback
    
    Called by Twilio when a call recording is completed and ready.
    This webhook receives the recording URL and metadata.
    
    POST parameters from Twilio:
    - CallSid: The SID of the call
    - RecordingSid: The SID of the recording
    - RecordingUrl: The URL to access the recording
    - RecordingDuration: Duration of the recording in seconds
    - RecordingStatus: Status of the recording (completed, etc.)
    """
    
    if request.method != 'POST':
        return HttpResponse(status=405)
    
    try:
        # Get recording data from Twilio
        call_sid = request.POST.get('CallSid')
        recording_sid = request.POST.get('RecordingSid')
        recording_url = request.POST.get('RecordingUrl')
        recording_duration = request.POST.get('RecordingDuration')
        recording_status = request.POST.get('RecordingStatus')
        
        logger.info(f"🎙️ Recording callback received for call: {call_sid}")
        logger.info(f"   Recording SID: {recording_sid}")
        logger.info(f"   Status: {recording_status}")
        logger.info(f"   Duration: {recording_duration}s")
        
        # Update the CallLog with recording information
        if call_sid and recording_url:
            CallLoggerService.update_recording(
                call_sid=call_sid,
                recording_sid=recording_sid,
                recording_url=recording_url,
                recording_duration=recording_duration
            )
            
            logger.info(f"✅ Recording saved for call: {call_sid}")
        else:
            logger.warning(f"⚠️ Missing recording data in callback")
        
        return HttpResponse(status=200)
        
    except Exception as e:
        logger.error(f"❌ Error in recording callback: {str(e)}")
        return HttpResponse(status=500)