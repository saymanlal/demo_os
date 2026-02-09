import os
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Connect, Stream

from home.services.call_logger import CallLoggerService


@csrf_exempt
def twilio_voice(request):
    """
    Twilio Voice Webhook Handler
    
    ✅ Extracts caller and IVR numbers
    ✅ Passes them to WebSocket as custom parameters
    ✅ Starts media streaming for real-time audio
    ✅ LOGS CALL TO DATABASE (NEW)
    """
    
    # ═══════════════════════════════════════════════════════════
    # STEP 1: Get Base URL
    # ═══════════════════════════════════════════════════════════
    base_url = os.getenv("TWILIO_BASE_URL")
    if not base_url:
        print("❌ TWILIO_BASE_URL environment variable missing")
        return HttpResponse("Configuration error", status=500)

    # ═══════════════════════════════════════════════════════════
    # STEP 2: Extract Call Details from Twilio Request
    # ═══════════════════════════════════════════════════════════
    
    # 📱 Caller Number (who called)
    caller_number = request.POST.get('From', 'UNKNOWN')
    
    # 🏢 IVR Number (which Twilio number was called)
    ivr_number = request.POST.get('To', None)
    
    # 📞 Call SID for logging
    call_sid = request.POST.get('CallSid', 'UNKNOWN')
    
    # 🌍 Caller Location (optional)
    caller_city = request.POST.get('FromCity', '')
    caller_state = request.POST.get('FromState', '')
    caller_country = request.POST.get('FromCountry', '')
    
    # ═══════════════════════════════════════════════════════════
    # 🔥 NEW: LOG CALL START TO DATABASE
    # ═══════════════════════════════════════════════════════════
    CallLoggerService.log_call_start(
        call_sid=call_sid,
        phone_number=caller_number,
        call_type='inbound',
        from_number=caller_number,
        to_number=ivr_number,
        
  # Will link later if consumer identified
    )
    
    # ═══════════════════════════════════════════════════════════
    # STEP 3: Log Call Details
    # ═══════════════════════════════════════════════════════════
    print("=" * 60)
    print("📞 INCOMING CALL")
    print("=" * 60)
    print(f"   Call SID:      {call_sid}")
    print(f"   From:          {caller_number}")
    print(f"   To (IVR):      {ivr_number}")
    if caller_city:
        print(f"   Location:      {caller_city}, {caller_state}, {caller_country}")
    print("=" * 60)

    # ═══════════════════════════════════════════════════════════
    # STEP 4: Create TwiML Response
    # ═══════════════════════════════════════════════════════════
    response = VoiceResponse()
    
    # ═══════════════════════════════════════════════════════════
    # STEP 5: Setup WebSocket Connection
    # ═══════════════════════════════════════════════════════════
    connect = Connect()
    
    # Convert HTTPS to WSS for WebSocket
    wss_url = base_url.replace("https://", "wss://") + "/ws/twilio/media/"
    
    # Create Stream with custom parameters
    stream = Stream(url=wss_url, track="inbound_track")
    
    # ✅ CRITICAL: Pass caller and IVR numbers as custom parameters
    # These will be available in WebSocket's "start" event
    stream.parameter(name='from', value=caller_number)
    stream.parameter(name='to', value=ivr_number)
    stream.parameter(name='call_sid', value=call_sid)
    
    # Add stream to connect verb
    connect.append(stream)
    
    # Add connect to response
    response.append(connect)
    
    # ✅ Keep call alive for up to 10 minutes (600 seconds)
    response.pause(length=600)
    
    # ═══════════════════════════════════════════════════════════
    # STEP 6: Return TwiML Response
    # ═══════════════════════════════════════════════════════════
    twiml = str(response)
    
    print("📤 Sending TwiML response:")
    print(twiml)
    print("=" * 60)
    
    return HttpResponse(twiml, content_type="text/xml")