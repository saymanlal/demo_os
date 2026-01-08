import json, base64, audioop, asyncio, os
from channels.generic.websocket import AsyncWebsocketConsumer
from twilio.rest import Client
from home.services.azure_stt import AzureSpeechStream
from home.services.gemini_llm import GeminiLLM

class TwilioMediaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("🔗 WebSocket connected")

        self.call_sid = None
        self.loop = asyncio.get_event_loop()

        self.llm = GeminiLLM()
        self.azure_stt = AzureSpeechStream(self.sync_callback)

    def sync_callback(self, text):
        asyncio.run_coroutine_threadsafe(
            self.process_user_text(text),
            self.loop
        )

    async def process_user_text(self, text):
        print("📝 USER:", text)
        reply = self.llm.generate(text)
        print("🤖 AI:", reply)
        await asyncio.sleep(0.5)
        self.send_twilio_tts(reply)

    def send_twilio_tts(self, text):
        try:
            client = Client(
                os.getenv("TWILIO_ACCOUNT_SID"),
                os.getenv("TWILIO_AUTH_TOKEN")
            )

            base_url = os.getenv("TWILIO_BASE_URL")
            wss_url = base_url.replace("https://", "wss://") + "/ws/twilio/media/"

            twiml = f"""
<Response>
    <Say voice="Polly.Aditi">{text}</Say>
    <Connect>
        <Stream url="{wss_url}" track="inbound_track" />
    </Connect>
    <Pause length="600"/>
</Response>
""".strip()

            client.calls(sid=self.call_sid).update(twiml=twiml)
            print("📢 SPOKE:", text)

        except Exception as e:
            print("❌ TTS SEND ERROR:", e)

    async def receive(self, text_data=None, bytes_data=None):
        msg = json.loads(text_data)

        if msg["event"] == "start":
            self.call_sid = msg["start"]["callSid"]
            print(f"📞 Call SID: {self.call_sid}")

        elif msg["event"] == "media":
            pcm_8k = audioop.ulaw2lin(base64.b64decode(msg["media"]["payload"]), 2)
            pcm_16k, _ = audioop.ratecv(pcm_8k, 2, 1, 8000, 16000, None)
            self.azure_stt.push_audio(pcm_16k)

        elif msg["event"] == "stop":
            self.azure_stt.close()
            await self.close()
            print("🛑 Call ended")

    async def disconnect(self, code):
        print("🔌 WS Closed")
        self.azure_stt.close()
