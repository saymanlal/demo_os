import json, os
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse, Connect
from .ollama_llm import OllamaLLM

# Initialize LLM once
llm = OllamaLLM(model="phi3")

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

    try:
        call = client.calls.create(
            to=to_number,
            from_=os.getenv("TWILIO_PHONE_NUMBER"),
            url="https://unbumptious-ultratropical-eugenia.ngrok-free.dev/api/twilio/voice/"
        )
        return JsonResponse({
            "status": "calling",
            "sid": call.sid
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def twilio_voice(request):
    response = VoiceResponse()
    connect = Connect()
    connect.stream(url="wss://unbumptious-ultratropical-eugenia.ngrok-free.dev/ws/twilio/stream/")
    response.append(connect)
    return HttpResponse(str(response), content_type="text/xml")

@csrf_exempt
def handle_speech(request):
    """
    This endpoint will be called with Twilio's <Gather> or <Stream> input.
    It takes SpeechResult from Twilio, passes it to Ollama LLM, and returns a TwiML <Say>.
    """
    body = request.POST
    user_input = body.get("SpeechResult", "")

    resp = VoiceResponse()

    if user_input:
        try:
            ai_response = llm.generate(user_input)
            resp.say(ai_response, voice="Polly.Joanna")
        except Exception as e:
            resp.say("Sorry, I couldn't respond right now.", voice="Polly.Joanna")
    else:
        resp.say("Hello, can you speak now?", voice="Polly.Joanna")

    return HttpResponse(str(resp), content_type="text/xml")
