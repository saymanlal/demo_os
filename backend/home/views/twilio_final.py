from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def final_twiml(request, complaint_id):
    return HttpResponse(
        """<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Hangup/>
</Response>""",
        content_type="text/xml"
    )
