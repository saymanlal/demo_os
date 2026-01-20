from twilio.twiml.voice_response import VoiceResponse, Start, Stream, Pause


def media_stream_twiml():
    response = VoiceResponse()

    # 🔊 Twilio greeting (safe)
    response.say(
        "Namaskar. Madhya Pradesh Vidyut Vibhag helpline mein aapka swagat hai. "
        "Kripya apni bijli sambandhit samasya batayein."
    )

    # ⏸️ Important pause so user can start speaking
    response.pause(length=1)

    # 🎙️ Start media stream (USER VOICE)
    start = Start()
    start.append(
        Stream(
            url="wss://flutiest-dara-repellantly.ngrok-free.dev/ws/twilio/media/",
            track="inbound"   # 🔥 only user voice
        )
    )

    response.append(start)

    return str(response)
