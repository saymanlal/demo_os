from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from twilio.twiml.voice_response import VoiceResponse, Connect

@csrf_exempt
def twilio_voice(request):
    response = VoiceResponse()

    connect = Connect()
    connect.stream(
        url="wss://osteitic-eladia-ocreate.ngrok-free.dev/ws/twilio/media/",
        track="inbound_track"
    )

    response.append(connect)
    response.pause(length=600)

    return HttpResponse(str(response), content_type="text/xml")
