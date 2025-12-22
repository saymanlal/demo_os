import json
import base64
import audioop
from channels.generic.websocket import AsyncWebsocketConsumer
from home.services.azure_stt import AzureSpeechStream

class TwilioMediaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        self.call_sid = None
        self.stream_sid = None
        self.azure_stt = AzureSpeechStream()

        print("🔗 Twilio WebSocket connected")

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        message = json.loads(text_data)
        event = message.get("event")

        if event == "start":
            self.call_sid = message["start"]["callSid"]
            self.stream_sid = message["start"]["streamSid"]
            print(f"📞 Call started | {self.call_sid}")

        elif event == "media":
            payload = message["media"]["payload"]

            # Decode base64
            mulaw_bytes = base64.b64decode(payload)

            # μ-law → 16-bit PCM @ 8kHz
            pcm_8k = audioop.ulaw2lin(mulaw_bytes, 2)

            # Resample 8k → 16k
            pcm_16k, _ = audioop.ratecv(
                pcm_8k, 2, 1, 8000, 16000, None
            )

            # Push to Azure
            self.azure_stt.push_audio(pcm_16k)

        elif event == "stop":
            print(f"🛑 Call ended | {self.call_sid}")
            self.azure_stt.close()
            await self.close()

    async def disconnect(self, close_code):
        print(f"❌ WebSocket disconnected | code={close_code}")
