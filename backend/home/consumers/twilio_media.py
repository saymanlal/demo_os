import json
import base64
import audioop
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

from home.services.azure_stt import AzureSpeechStream
from home.services.azure_tts import AzureTTS
from home.services.complaint_session import ComplaintSession

logger = logging.getLogger(__name__)

class TwilioMediaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

        self.call_sid = None
        self.stream_sid = None
        self.loop = asyncio.get_event_loop()
        self.call_active = True
        self.is_agent_speaking = False

        self.tts = AzureTTS()
        self.complaint_session = ComplaintSession("UNKNOWN")
        self.azure_stt = AzureSpeechStream(self.sync_final_text_callback)

    def sync_final_text_callback(self, text):
        if not self.call_active or self.is_agent_speaking:
            return
        asyncio.run_coroutine_threadsafe(
            self.handle_final_text(text),
            self.loop
        )

    async def handle_final_text(self, text):
        response, should_end = self.complaint_session.handle_input(text)
        await self.speak(response)
        if should_end:
            await asyncio.sleep(2)
            await self.end_call()

    async def speak(self, text):
        if not self.stream_sid or not text:
            return

        self.is_agent_speaking = True
        pcm = self.tts.synthesize(text)
        pcm8, _ = audioop.ratecv(pcm, 2, 1, 16000, 8000, None)
        mulaw = audioop.lin2ulaw(pcm8, 2)
        payload = base64.b64encode(mulaw).decode()

        await self.send(json.dumps({
            "event": "media",
            "streamSid": self.stream_sid,
            "media": {"payload": payload}
        }))

        await asyncio.sleep(max(1, len(text.split()) * 0.3))
        self.is_agent_speaking = False

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return
        msg = json.loads(text_data)

        if msg["event"] == "start":
            self.call_sid = msg["start"]["callSid"]
            self.stream_sid = msg["start"]["streamSid"]
            self.complaint_session.caller_number = msg["start"].get("from")

            await self.speak(
                "Namaskar. Kya aapki koi samasya ya complaint hai?"
            )

        elif msg["event"] == "media" and not self.is_agent_speaking:
            mulaw = base64.b64decode(msg["media"]["payload"])
            pcm = audioop.ulaw2lin(mulaw, 2)
            pcm16, _ = audioop.ratecv(pcm, 2, 1, 8000, 16000, None)
            self.azure_stt.push_audio(pcm16)

        elif msg["event"] == "stop":
            await self.end_call()

    async def end_call(self):
        self.call_active = False
        try:
            self.azure_stt.close()
        except:
            pass
        await self.close()
