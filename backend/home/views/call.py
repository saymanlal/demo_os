import json, os
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client
from django.http import HttpResponse
from twilio.twiml.voice_response import VoiceResponse, Connect

@csrf_exempt
def start_call(request):
    body = json.loads(request.body)
    to_number = body.get("phone")

    if not to_number:
        return JsonResponse({"error": "phone required"}, status=400)

    client = Client(
        os.getenv("TWILIO_ACCOUNT_SID"),
        os.getenv("TWILIO_AUTH_TOKEN")
    )

    call = client.calls.create(
        to=to_number,
        from_=os.getenv("TWILIO_PHONE_NUMBER"),
        url="https://unbumptious-ultratropical-eugenia.ngrok-free.dev/api/twilio/voice/"
    )

    return JsonResponse({
        "status": "calling",
        "sid": call.sid
    })

def twilio_voice(request):
    response = VoiceResponse()
    connect = Connect()
    connect.stream(url="wss://unbumptious-ultratropical-eugenia.ngrok-free.dev/ws/twilio/stream/")
    response.append(connect)
    return HttpResponse(str(response), content_type="text/xml")