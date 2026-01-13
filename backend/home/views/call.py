import json
import os
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from twilio.rest import Client


@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
def start_call(request):

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
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    to_number = body.get("phone")
    if not to_number:
        return JsonResponse({"error": "phone required"}, status=400)

    base_url = os.getenv("TWILIO_BASE_URL")
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")

    if not all([base_url, account_sid, auth_token, from_number]):
        return JsonResponse({"error": "Twilio env missing"}, status=500)

    try:
        client = Client(account_sid, auth_token)

        call = client.calls.create(
            to=to_number,
            from_=from_number,
            url=f"{base_url}/api/twilio/voice/"
        )

        response = JsonResponse({
            "status": "calling",
            "sid": call.sid
        })

        response["Access-Control-Allow-Origin"] = "https://aiofficeos.vercel.app"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
