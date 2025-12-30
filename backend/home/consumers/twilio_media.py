import json
import base64
import audioop
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

from home.services.azure_stt import AzureSpeechStream
from home.services.ollama_llm import OllamaLLM
from home.services.azure_tts import AzureTTS
from home.utils.audio import pcm16k_to_twilio


class TwilioMediaConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        await self.accept()

        self.call_sid = None
        self.stream_sid = None

        self.llm = OllamaLLM(model="phi3")
        self.tts = AzureTTS()

        self.azure_stt = AzureSpeechStream(
            on_final_text=self.on_final_text
        )

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

            mulaw_bytes = base64.b64decode(payload)
            pcm_8k = audioop.ulaw2lin(mulaw_bytes, 2)

            pcm_16k, _ = audioop.ratecv(
                pcm_8k, 2, 1, 8000, 16000, None
            )

            self.azure_stt.push_audio(pcm_16k)

        elif event == "stop":
            print(f"🛑 Call ended | {self.call_sid}")
            self.azure_stt.close()
            await self.close()

    def on_final_text(self, text: str):
        print("🧠 USER:", text)

        async def stream_ai_response():
            try:
                for sentence in self.llm.generate_sentences(text):
                    print("🤖 AI:", sentence)

                    pcm_audio = self.tts.synthesize(sentence)
                    payload = pcm16k_to_twilio(pcm_audio)

                    message = {
                        "event": "media",
                        "streamSid": self.stream_sid,
                        "media": {
                            "payload": payload
                        }
                    }

                    await self.send(text_data=json.dumps(message))

            except Exception as e:
                print("❌ AI STREAM ERROR:", e)

        asyncio.create_task(stream_ai_response())

    async def disconnect(self, close_code):
        print(f"❌ WebSocket disconnected | code={close_code}")
