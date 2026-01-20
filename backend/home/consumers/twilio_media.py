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
    """
    Twilio Media Stream WebSocket Handler
    Handles real-time audio streaming between Twilio and Azure services
    """

    # ═════════════════════════════════════════════════════════
    # WEBSOCKET CONNECT
    # ═════════════════════════════════════════════════════════
    async def connect(self):
        """Initialize WebSocket connection and services"""
        
        await self.accept()
        print("🔗 Twilio WebSocket connected")

        # Get event loop for thread-safe async calls
        self.loop = asyncio.get_running_loop()

        # Call state
        self.call_sid = None
        self.stream_sid = None
        self.call_active = True

        # Conversation state
        self.is_agent_speaking = False
        self.final_handled = False

        # ✅ Initialize Azure TTS
        try:
            self.tts = AzureTTS()
            print("✅ Azure TTS initialized")
        except Exception as e:
            print(f"❌ TTS init failed: {e}")
            await self.close()
            return

        # ✅ Initialize Azure STT with callback
        try:
            self.azure_stt = AzureSpeechStream(
                on_final_text=self.sync_final_text_callback
            )
            print("✅ Azure STT initialized")
        except Exception as e:
            print(f"❌ STT init failed: {e}")
            await self.close()
            return

        # ✅ Initialize complaint session
        self.complaint_session = ComplaintSession("UNKNOWN")
        print("✅ Complaint session ready")

    # ═════════════════════════════════════════════════════════
    # STT CALLBACK (THREAD-SAFE)
    # ═════════════════════════════════════════════════════════
    def sync_final_text_callback(self, text: str):
        """
        Called by Azure STT from background thread
        Safely schedules async handler in main event loop
        """
        
        # Skip if call ended or agent is speaking
        if (
            not self.call_active or
            self.is_agent_speaking or
            self.final_handled or
            self.complaint_session.is_completed
        ):
            return

        # ✅ Thread-safe async call
        asyncio.run_coroutine_threadsafe(
            self.handle_final_text(text),
            self.loop
        )

    # ═════════════════════════════════════════════════════════
    # HANDLE USER INPUT
    # ═════════════════════════════════════════════════════════
    async def handle_final_text(self, text: str):
        """Process final recognized text from Azure STT"""
        
        # Skip if already handling final response
        if self.final_handled:
            print("⚠️ Final already handled - skipping")
            return

        print(f"📝 USER: {text}")

        # ✅ FIXED: await async method
        response_text, should_end = await self.complaint_session.handle_input(text)

        # 🔒 Ignore noise/debounced input
        if not response_text:
            print("⚠️ No response (debounced/noise)")
            return

        print(f"🏛️ RESPONSE: {response_text}")

        # Speak the response
        await self.speak(response_text)

        # 🔚 END CALL AFTER FINAL RESPONSE
        if should_end:
            print("🔚 Ending call - final response sent")
            self.final_handled = True
            
            # Wait for TTS to complete
            await asyncio.sleep(2.0)

            # Redirect to final TwiML
            complaint_id = self.complaint_session.data.get("complaint_id")
            if complaint_id:
                self.redirect_to_final_twiml(complaint_id)
            else:
                print("⚠️ No complaint_id - cannot redirect")

    # ═════════════════════════════════════════════════════════
    # TEXT-TO-SPEECH (AZURE → TWILIO)
    # ═════════════════════════════════════════════════════════
    async def speak(self, text: str):
        """
        Convert text to speech and stream to Twilio
        
        Flow: Text → Azure TTS (PCM 16kHz) → Downsample (8kHz) → μ-law → Twilio
        """
        
        if not self.call_active or not self.stream_sid:
            print(f"⚠️ Cannot speak - active:{self.call_active} stream:{self.stream_sid}")
            return

        print(f"🔊 Starting TTS for: {text[:50]}...")

        # Pause STT to avoid echo
        self.is_agent_speaking = True
        self.azure_stt.pause()

        try:
            # ─────────────────────────────────────────────────
            # Step 1: Synthesize with Azure TTS (PCM 16kHz)
            # ─────────────────────────────────────────────────
            print("📡 Synthesizing audio...")
            pcm_16k = self.tts.synthesize(text)
            print(f"✅ Got {len(pcm_16k)} bytes PCM")

            # ─────────────────────────────────────────────────
            # Step 2: Downsample 16kHz → 8kHz (Twilio format)
            # ─────────────────────────────────────────────────
            pcm_8k, _ = audioop.ratecv(
                pcm_16k,    # input data
                2,          # sample width (16-bit)
                1,          # channels (mono)
                16000,      # input rate
                8000,       # output rate
                None        # state
            )

            # ─────────────────────────────────────────────────
            # Step 3: Convert PCM → μ-law (Twilio codec)
            # ─────────────────────────────────────────────────
            mulaw = audioop.lin2ulaw(pcm_8k, 2)

            # ─────────────────────────────────────────────────
            # Step 4: Base64 encode for WebSocket
            # ─────────────────────────────────────────────────
            payload = base64.b64encode(mulaw).decode("utf-8")

            # ─────────────────────────────────────────────────
            # Step 5: Send to Twilio via WebSocket
            # ─────────────────────────────────────────────────
            await self.send(text_data=json.dumps({
                "event": "media",
                "streamSid": self.stream_sid,
                "media": {"payload": payload}
            }))

            print(f"🔊 SPOKE: {text}")

            # ─────────────────────────────────────────────────
            # Step 6: Wait for audio to play (estimate)
            # ─────────────────────────────────────────────────
            # Rough estimate: 50ms per character
            wait_time = max(1.0, len(text) * 0.05)
            await asyncio.sleep(wait_time)

        except Exception as e:
            print(f"❌ TTS error: {e}")

        finally:
            # Resume STT listening
            self.is_agent_speaking = False
            if self.call_active:
                self.azure_stt.resume()
                print("▶️ STT resumed")

    # ═════════════════════════════════════════════════════════
    # REDIRECT TO FINAL TWIML
    # ═════════════════════════════════════════════════════════
    def redirect_to_final_twiml(self, complaint_id):
        """
        Redirect active call to final TwiML endpoint
        Used to end call gracefully after complaint registration
        """
        
        try:
            client = Client(
                os.getenv("TWILIO_ACCOUNT_SID"),
                os.getenv("TWILIO_AUTH_TOKEN")
            )

            url = f"{os.getenv('TWILIO_BASE_URL')}/api/twilio/final/{complaint_id}/"

            client.calls(self.call_sid).update(
                url=url,
                method="POST"
            )

            print(f"➡️ Call redirected to final TwiML | {complaint_id}")

        except Exception as e:
            print(f"❌ Twilio redirect failed: {e}")

    # ═════════════════════════════════════════════════════════
    # RECEIVE TWILIO EVENTS
    # ═════════════════════════════════════════════════════════
    async def receive(self, text_data=None, bytes_data=None):
        """Handle incoming WebSocket messages from Twilio"""
        
        if not text_data:
            return

        try:
            msg = json.loads(text_data)
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON: {e}")
            return

        event = msg.get("event")

        # ─────────────────────────────────────────────────────
        # 📞 CALL START EVENT
        # ─────────────────────────────────────────────────────
        if event == "start":
            self.call_sid = msg["start"]["callSid"]
            self.stream_sid = msg["start"]["streamSid"]

            # Extract caller number
            start_data = msg["start"]
            caller = (
                start_data.get("customParameters", {}).get("from") or
                start_data.get("from") or
                start_data.get("caller") or
                "UNKNOWN"
            )
            
            self.complaint_session.caller_number = caller

            print(f"📞 Call started | SID: {self.call_sid} | From: {caller}")

            # ✅ Greet user
            await self.speak(
                "Namaskar. Madhya Pradesh Vidyut Vibhag helpline mein aapka swagat hai. "
                "Kripya apni bijli sambandhit samasya batayein."
            )

        # ─────────────────────────────────────────────────────
        # 🎧 AUDIO STREAM EVENT (User speaking)
        # ─────────────────────────────────────────────────────
        elif event == "media":
            # Skip if agent is speaking or call ended
            if (
                not self.call_active or
                self.is_agent_speaking or
                self.complaint_session.is_completed
            ):
                return

            try:
                # ─────────────────────────────────────────────
                # Step 1: Decode base64 μ-law audio from Twilio
                # ─────────────────────────────────────────────
                payload = msg["media"]["payload"]
                mulaw = base64.b64decode(payload)

                # ─────────────────────────────────────────────
                # Step 2: Convert μ-law → PCM 8kHz
                # ─────────────────────────────────────────────
                pcm_8k = audioop.ulaw2lin(mulaw, 2)

                # ─────────────────────────────────────────────
                # Step 3: Upsample 8kHz → 16kHz (Azure format)
                # ─────────────────────────────────────────────
                pcm_16k, _ = audioop.ratecv(
                    pcm_8k,     # input data
                    2,          # sample width (16-bit)
                    1,          # channels (mono)
                    8000,       # input rate
                    16000,      # output rate
                    None        # state
                )

                # ─────────────────────────────────────────────
                # Step 4: Push to Azure STT
                # ─────────────────────────────────────────────
                self.azure_stt.push_audio(pcm_16k)

            except Exception as e:
                print(f"❌ Audio processing error: {e}")
                # Don't crash - just log and continue

        # ─────────────────────────────────────────────────────
        # 🛑 CALL STOP EVENT
        # ─────────────────────────────────────────────────────
        elif event == "stop":
            print(f"🛑 Call stopped | {self.call_sid}")
            self.call_active = False
            
            # Cleanup Azure STT
            try:
                self.azure_stt.close()
            except Exception as e:
                print(f"⚠️ STT cleanup error: {e}")

        # ─────────────────────────────────────────────────────
        # ⚠️ UNKNOWN EVENT
        # ─────────────────────────────────────────────────────
        else:
            print(f"⚠️ Unknown event: {event}")

    # ═════════════════════════════════════════════════════════
    # WEBSOCKET DISCONNECT
    # ═════════════════════════════════════════════════════════
    async def disconnect(self, close_code):
        """Cleanup when WebSocket closes"""
        
        print(f"❌ WebSocket closed | code={close_code}")
        
        self.call_active = False
        
        # Cleanup Azure STT
        try:
            self.azure_stt.close()
        except Exception as e:
            print(f"⚠️ Disconnect cleanup error: {e}")

        print("✅ Cleanup complete")