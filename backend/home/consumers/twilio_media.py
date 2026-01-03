import json
import base64
import audioop
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from home.services.azure_stt import AzureSpeechStream
from home.services.gemini_llm import GeminiLLM

class TwilioMediaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("🔗 Twilio WebSocket connected")

        self.call_sid = None
        self.stream_sid = None

        # Store async loop for callbacks
        self.loop = asyncio.get_event_loop()
        
        # Initialize Gemini LLM
        self.llm = GeminiLLM()
        print("✅ Gemini LLM initialized")

        # Initialize Azure STT with sync callback
        self.azure_stt = AzureSpeechStream(on_final_text=self.sync_final_text_callback)
        print("✅ Azure STT initialized")

    def sync_final_text_callback(self, text: str):
        """Sync callback for Azure STT (will schedule async processing)"""
        # Schedule async processing in the event loop
        asyncio.run_coroutine_threadsafe(
            self.async_handle_final_text(text), 
            self.loop
        )

    async def async_handle_final_text(self, text: str):
        """Async handler for final text"""
        print(f"📝 USER SAID (callback): {text}")
        
        try:
            # Generate response from Gemini LLM
            print(f"🤖 Generating AI response...")
            reply = self.llm.generate(text)
            print(f"🤖 AI REPLY: {reply}")
            
            # TODO: Add TTS response here if needed
            
        except Exception as e:
            print(f"❌ Error generating AI response: {e}")
            fallback = "I understand. How can I help you?"
            print(f"🤖 FALLBACK REPLY: {fallback}")

    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return

        try:
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
                pcm_16k, _ = audioop.ratecv(pcm_8k, 2, 1, 8000, 16000, None)

                # Push audio to Azure STT
                self.azure_stt.push_audio(pcm_16k)

            elif event == "stop":
                print(f"🛑 Call ended | {self.call_sid}")
                self.azure_stt.close()
                await self.close()
                
        except Exception as e:
            print(f"❌ Error processing message: {e}")

    async def disconnect(self, close_code):
        print(f"❌ WebSocket disconnected | code={close_code}")
        if hasattr(self, 'azure_stt'):
            self.azure_stt.close()