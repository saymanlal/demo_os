import os
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from twilio.twiml.voice_response import VoiceResponse, Connect


@csrf_exempt
def twilio_voice(request):
    base_url = os.getenv("TWILIO_BASE_URL")
    if not base_url:
        return HttpResponse("TWILIO_BASE_URL missing", status=500)

    response = VoiceResponse()
    connect = Connect()

    # convert HTTPS → WSS automatically
    wss_url = base_url.replace("https://", "wss://") + "/ws/twilio/media/"

    connect.stream(
        url=wss_url,
        track="inbound_track"
    )

    response.append(connect)
    response.pause(length=600)  # keep the call open for streaming

    return HttpResponse(str(response), content_type="text/xml")