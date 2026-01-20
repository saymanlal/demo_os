import json
import base64
import audioop
import asyncio
import os

from channels.generic.websocket import AsyncWebsocketConsumer
from twilio.rest import Client

from home.services.azure_stt import AzureSpeechStream
from home.services.azure_tts import AzureTTS
from home.services.complaint_session import ComplaintSession


class TwilioMediaConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        print("🔗 Twilio WebSocket connected")

        self.loop = asyncio.get_running_loop()

        self.call_sid = None
        self.stream_sid = None
        self.call_active = True

        # 🔒 Agent speaking flag
        self.is_agent_speaking = False
        self.final_handled = False

        self.tts = AzureTTS()
        self.azure_stt = AzureSpeechStream(
            on_final_text=self.sync_final_text_callback
        )

        self.complaint_session = ComplaintSession("UNKNOWN")

    # -----------------------------
    # STT CALLBACK (THREAD SAFE)
    # -----------------------------
    def sync_final_text_callback(self, text: str):
        # 🔒 Ignore STT if call ended OR agent speaking OR complaint done
        if (
            not self.call_active or
            self.is_agent_speaking or
            self.complaint_session.is_completed
        ):
            return

        asyncio.run_coroutine_threadsafe(
            self.handle_final_text(text),
            self.loop
        )

    async def handle_final_text(self, text):
        if self.final_handled:
            return

        print("📝 USER:", text)

        response_text,should_end = self.complaint_session.handle_input(text)

        # 🔒 Ignore debounce / noise
        if not response_text:
            return

        print(f"🏛️ RESPONSE: {response_text}")

        await self.speak(response_text)

    # -----------------------------
    # SPEAK (SAFE)
    # -----------------------------
    async def speak(self, text: str):
        if not self.call_active or not self.stream_sid:
            return

        self.is_agent_speaking = True
        self.azure_stt.pause()

        pcm_16k = self.tts.synthesize(text)
        pcm_8k, _ = audioop.ratecv(
            pcm_16k, 2, 1, 16000, 8000, None
        )
        mulaw = audioop.lin2ulaw(pcm_8k, 2)
        payload = base64.b64encode(mulaw).decode("utf-8")

        await self.send(text_data=json.dumps({
            "event": "media",
            "streamSid": self.stream_sid,
            "media": {"payload": payload}
        }))

        print(f"🔊 SPOKE: {text}")

        # ⏳ Wait for speech duration
        await asyncio.sleep(max(1.0, len(text) * 0.05))

        self.is_agent_speaking = False
        self.azure_stt.resume()

    def redirect_to_final_twiml(self, complaint_id):
        client = Client(
            os.getenv("TWILIO_ACCOUNT_SID"),
            os.getenv("TWILIO_AUTH_TOKEN")
        )

        url = f"{os.getenv('TWILIO_BASE_URL')}/api/twilio/final/{complaint_id}/"

        client.calls(self.call_sid).update(url=url, method="POST")

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        msg = json.loads(text_data)
        event = msg.get("event")

        if event == "start":
            self.call_sid = msg["start"]["callSid"]
            self.stream_sid = msg["start"]["streamSid"]

            caller = message["start"].get("from", "UNKNOWN")
            self.complaint_session.caller_number = caller

            print(f"📞 Call started | {self.call_sid}")

            await self.speak(
                "Kripya apni bijli sambandhit samasya batayein."
            )

        elif event == "media":
            # 🔒 Drop audio after completion or during agent speech
            if (
                self.is_agent_speaking or
                self.complaint_session.is_completed
            ):
                return

            mulaw = base64.b64decode(msg["media"]["payload"])
            pcm_8k = audioop.ulaw2lin(mulaw, 2)
            pcm_16k, _ = audioop.ratecv(pcm_8k, 2, 1, 8000, 16000, None)
            self.azure_stt.push_audio(pcm_16k)

        elif event == "stop":
            self.call_active = False

    async def disconnect(self, close_code):
        print("❌ WebSocket closed")
        self.call_active = False
        if hasattr(self, "azure_stt"):
            self.azure_stt.close()
