from twilio.twiml.voice_response import VoiceResponse, Start, Stream


def media_stream_twiml():
    response = VoiceResponse()

    start = Start()
    start.append(
        Stream(
            url="wss://flutiest-dara-repellantly.ngrok-free.dev/ws/twilio/media/"
        )
    )

    response.append(start)
    response.say(
        "Namaskar. Madhya Pradesh Vidyut Vibhag helpline mein aapka swagat hai."
    )

    return str(response)
