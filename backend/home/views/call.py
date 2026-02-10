import json
import os
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from twilio.rest import Client

from home.services.call_logger import CallLoggerService


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def start_call(request):
    """
    Start outbound call via Twilio
    ✅ LOGS OUTBOUND CALLS
    🎙️ RECORDS CALLS (NEW)
    """

    # ✅ CORS PREFLIGHT
    if request.method == "OPTIONS":
        response = HttpResponse(status=200)
        response["Access-Control-Allow-Origin"] = "https://aiofficeos.vercel.app"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    # ✅ POST
    try:
        body = json.loads(request.body.decode("utf-8"))

        to_number = body.get("phone")
        if not to_number:
            return JsonResponse({"error": "phone required"}, status=400)

        base_url = os.getenv("TWILIO_BASE_URL")
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        from_number = os.getenv("TWILIO_PHONE_NUMBER")

        if not all([base_url, account_sid, auth_token, from_number]):
            return JsonResponse({"error": "Twilio env missing"}, status=500)

        client = Client(account_sid, auth_token)

        # ═══════════════════════════════════════════════════════════
        # Create Twilio Call with Status Callback + RECORDING
        # ═══════════════════════════════════════════════════════════
        call = client.calls.create(
            to=to_number,
            from_=from_number,
            url=f"{base_url}/api/twilio/voice/",
            method="POST",
            
            # 📊 Status callback to capture call end
            status_callback=f"{base_url}/api/twilio/status-callback/",
            status_callback_method="POST",
            status_callback_event=["completed", "failed", "busy", "no-answer"],
            
            # 🎙️ NEW: ENABLE CALL RECORDING
            record=True,
            recording_status_callback=f"{base_url}/api/twilio/recording-callback/",
            recording_status_callback_method="POST",
        )

        # ═══════════════════════════════════════════════════════════
        # 🔥 LOG OUTBOUND CALL
        # ═══════════════════════════════════════════════════════════
        CallLoggerService.log_call_start(
            call_sid=call.sid,
            phone_number=to_number,
            call_type='outbound',
            from_number=from_number,
            to_number=to_number,
        )

        print(f"✅ Call initiated with recording: {call.sid}")

        response = JsonResponse({
            "status": "calling",
            "sid": call.sid,
            "recording_enabled": True  # Let frontend know recording is on
        })

        response["Access-Control-Allow-Origin"] = "https://aiofficeos.vercel.app"
        response["Access-Control-Allow-Credentials"] = "true"

        return response

    except Exception as e:
        print(f"❌ Error starting call: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)


# ═══════════════════════════════════════════════════════════
# 📊 STATUS CALLBACK WEBHOOK
# ═══════════════════════════════════════════════════════════

@csrf_exempt
def call_status_callback(request):
    """
    Twilio Status Callback Webhook
    Called when call ends (completed, failed, busy, no-answer)
    
    ✅ Updates call duration and status in database
    """
    
    # Extract Twilio parameters
    call_sid = request.POST.get('CallSid')
    call_status = request.POST.get('CallStatus')  # completed, busy, failed, no-answer
    call_duration = request.POST.get('CallDuration', 0)  # in seconds
    
    # Log for debugging
    print("=" * 60)
    print("📊 CALL STATUS CALLBACK")
    print("=" * 60)
    print(f"   Call SID:      {call_sid}")
    print(f"   Status:        {call_status}")
    print(f"   Duration:      {call_duration}s")
    print("=" * 60)
    
    # ═══════════════════════════════════════════════════════════
    # 🔥 UPDATE CALL LOG IN DATABASE
    # ═══════════════════════════════════════════════════════════
    CallLoggerService.update_call_status(
        call_sid=call_sid,
        status=call_status,
        duration=int(call_duration) if call_duration else 0,
    )
    
    return HttpResponse(status=200)