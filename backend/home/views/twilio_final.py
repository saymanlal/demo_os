from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from home.services.call_logger import CallLoggerService


@csrf_exempt
def final_twiml(request, complaint_id):
    """
    Final TwiML response - hangs up the call
    
    ✅ Optionally update call status here
    """
    
    # ═══════════════════════════════════════════════════════════
    # 🔥 OPTIONAL: Update call status when hanging up
    # ═══════════════════════════════════════════════════════════
    call_sid = request.POST.get('CallSid')
    
    if call_sid:
        # Mark as completed since we're hanging up
        CallLoggerService.update_call_status(
            call_sid=call_sid,
            status='completed'
        )
        
        print(f"✅ Call {call_sid} marked as completed (hangup)")
    
    return HttpResponse(
        """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Hangup/>
</Response>""",
        content_type="text/xml"
    )