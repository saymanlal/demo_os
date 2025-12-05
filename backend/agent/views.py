from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def greet(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    message = request.POST.get("message", "")
    reply = f"Hello, you said: {message}"
    return JsonResponse({"response": reply})
