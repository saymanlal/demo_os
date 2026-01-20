import os
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Connect


@csrf_exempt
def twilio_voice(request):
    base_url = os.getenv("TWILIO_BASE_URL")

    vr = VoiceResponse()

    vr.say(
        "Namaskar. Madhya Pradesh Vidyut Vibhag helpline mein aapka swagat hai. "
        "Kripya apni bijli sambandhit samasya batayein.",
        language="hi-IN",
        voice="alice"
    )

    connect = Connect()
    connect.stream(
        url=base_url.replace("https://", "wss://") + "/ws/twilio/media/"
    )

    vr.append(connect)
    vr.pause(length=600)

    return HttpResponse(str(vr), content_type="text/xml")
