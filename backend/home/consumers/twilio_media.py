import json
import base64
import audioop
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

from home.services.azure_stt import AzureSpeechStream
from home.services.azure_tts import AzureTTS
from home.services.complaint_session import ComplaintSession


class TwilioMediaConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()
        print("🔗 Twilio WebSocket connected")

        self.call_sid = None
        self.stream_sid = None
        self.loop = asyncio.get_event_loop()
        self.call_active = True

        # 🔒 Agent speaking flag
        self.is_agent_speaking = False

        self.tts = AzureTTS()

        self.complaint_session = ComplaintSession(
            caller_number="UNKNOWN"
        )

        self.azure_stt = AzureSpeechStream(
            on_final_text=self.sync_final_text_callback
        )

        print("✅ Azure STT + Azure TTS + ComplaintSession initialized")

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

    # -----------------------------
    # MAIN LOGIC
    # -----------------------------
    async def handle_final_text(self, text: str):
        if not self.call_active:
            return

        print(f"📝 USER SAID: {text}")

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

    # -----------------------------
    # TWILIO EVENTS
    # -----------------------------
    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        message = json.loads(text_data)
        event = message.get("event")

        if event == "start":
            self.call_sid = message["start"]["callSid"]
            self.stream_sid = message["start"]["streamSid"]

            caller = message["start"].get("from", "UNKNOWN")
            self.complaint_session.caller_number = caller

            print(f"📞 Call started | {self.call_sid}")

            await self.speak(
                "Namaskar. Madhya Pradesh Vidyut Vibhag helpline mein aapka swagat hai. "
                "Kripya apni bijli sambandhit samasya batayein."
            )

        elif event == "media":
            # 🔒 Drop audio after completion or during agent speech
            if (
                self.is_agent_speaking or
                self.complaint_session.is_completed
            ):
                return

            payload = message["media"]["payload"]
            mulaw = base64.b64decode(payload)
            pcm_8k = audioop.ulaw2lin(mulaw, 2)
            pcm_16k, _ = audioop.ratecv(
                pcm_8k, 2, 1, 8000, 16000, None
            )

            self.azure_stt.push_audio(pcm_16k)

        elif event == "stop":
            print(f"🛑 Call ended by Twilio | {self.call_sid}")
            await self.end_call()

    # -----------------------------
    # CLEAN END
    # -----------------------------
    async def end_call(self):
        if not self.call_active:
            return

        self.call_active = False
        try:
            self.azure_stt.close()
        except Exception:
            pass

        await self.close()

    async def disconnect(self, close_code):
        print(f"❌ WebSocket disconnected | code={close_code}")
        self.call_active = False
        if hasattr(self, "azure_stt"):
            self.azure_stt.close()
