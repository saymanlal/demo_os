from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from gtts import gTTS
import tempfile
import os

@csrf_exempt
def greet(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    user_msg = request.POST.get("message", "")
    bot_reply = f"Hello, you said {user_msg}"

    # Generate temporary audio file
    tts = gTTS(bot_reply, lang='en')
    tmp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp3")
    tts.save(tmp_file.name)

    # Return audio file
    response = FileResponse(open(tmp_file.name, "rb"), content_type="audio/mpeg")
    response["Content-Disposition"] = 'inline; filename="response.mp3"'

    # Clean up after sending (don't delete immediately or file breaks)
    # We'll rely on OS temp cleanup

    return response
