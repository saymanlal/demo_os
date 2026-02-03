import json
import base64
import audioop
import asyncio
import os
import re

from channels.generic.websocket import AsyncWebsocketConsumer
from twilio.rest import Client

from home.services.azure_stt import AzureSpeechStream
from home.services.azure_tts import AzureTTS
from home.services.complaint_session import ComplaintSession
from home.services.complaint_states import ComplaintState


class TwilioMediaConsumer(AsyncWebsocketConsumer):
    """
    Twilio Media Stream WebSocket Handler
    
    ✅ Real-time audio streaming between Twilio ↔ Azure STT/TTS
    ✅ Meter + Name verification flow
    ✅ Hindi/English meter number normalization
    ✅ Area-based IVR detection
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

        # ✅ Initialize complaint session (numbers set in start event)
        self.complaint_session = ComplaintSession(
            caller_number="UNKNOWN",
            ivr_number=None
        )
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

        # ✅ Normalize Hindi/English input (especially for meter numbers)
        normalized_text = self._normalize_input(text)
        if normalized_text != text:
            print(f"🔤 Normalized: '{text}' → '{normalized_text}'")

        # ✅ Process user input through complaint session
        response_text, should_end = await self.complaint_session.handle_input(normalized_text)

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

            # Redirect to final TwiML (if complaint was registered)
            complaint_id = self.complaint_session.data.get("complaint_id")
            if complaint_id:
                self.redirect_to_final_twiml(complaint_id)
                print(f"✅ Complaint registered: {complaint_id}")
            else:
                print("⚠️ No complaint_id - call ended without registration")

    # ═════════════════════════════════════════════════════════
    # HINDI/ENGLISH NORMALIZATION
    # ═════════════════════════════════════════════════════════
    def _normalize_input(self, text: str) -> str:
        """
        Normalize Hindi/English mixed input to pure English alphanumeric
        
        Examples:
            "एमपीएमएम 1001" → "MPMM1001"
            "मेरा मीटर नंबर है एम पी एम एम वन ज़ीरो ज़ीरो वन" → "MPMM1001"
            "MPMM1001" → "MPMM1001" (unchanged)
        """
        
        # Hindi to English letter mapping (comprehensive)
        hindi_map = {
            # Letters
            'ए': 'A', 'बी': 'B', 'सी': 'C', 'डी': 'D', 'ई': 'E', 'इ': 'E',
            'एफ': 'F', 'जी': 'G', 'एच': 'H', 'आई': 'I', 'जे': 'J',
            'के': 'K', 'एल': 'L', 'एम': 'M', 'एन': 'N', 'ओ': 'O',
            'पी': 'P', 'क्यू': 'Q', 'आर': 'R', 'एस': 'S', 'टी': 'T',
            'यू': 'U', 'वी': 'V', 'डब्ल्यू': 'W', 'एक्स': 'X', 'वाई': 'Y', 'ज़ेड': 'Z',
            
            # Hindi digits (spoken form)
            'शून्य': '0', 'ज़ीरो': '0', 'जीरो': '0',
            'वन': '1', 'एक': '1',
            'टू': '2', 'दो': '2',
            'थ्री': '3', 'तीन': '3',
            'फोर': '4', 'चार': '4',
            'फाइव': '5', 'पांच': '5', 'पाँच': '5',
            'सिक्स': '6', 'छह': '6',
            'सेवन': '7', 'सात': '7',
            'एट': '8', 'आठ': '8',
            'नाइन': '9', 'नौ': '9',
            
            # Common words to remove
            'मेरा': '', 'मीटर': '', 'नंबर': '', 'है': '',
            'का': '', 'की': '', 'के': '',
        }
        
        # Remove punctuation
        text = re.sub(r'[।.,!?]', '', text)
        
        # Split into words
        words = text.split()
        normalized = []
        
        for word in words:
            word_upper = word.upper()
            
            # If already alphanumeric, keep it
            if word_upper.isalnum():
                normalized.append(word_upper)
                continue
            
            # Try Hindi to English mapping
            if word in hindi_map:
                converted = hindi_map[word]
                if converted:  # Skip empty strings (filler words)
                    normalized.append(converted)
            else:
                # Keep unknown words as-is
                normalized.append(word_upper)
        
        # Join without spaces (for meter numbers like MPMM1001)
        result = ''.join(normalized)
        
        # Clean up any remaining non-alphanumeric characters
        result = re.sub(r'[^A-Z0-9]', '', result)
        
        return result

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

            # ✅ Extract caller and IVR numbers from custom parameters
            start_data = msg["start"]
            custom_params = start_data.get("customParameters", {})
            
            # Get caller number
            caller = (
                custom_params.get("from") or
                custom_params.get("From") or
                start_data.get("from") or
                "UNKNOWN"
            )
            
            # ✅ CRITICAL: Get IVR number (which number was called)
            ivr_number = (
                custom_params.get("to") or
                custom_params.get("To") or
                start_data.get("to") or
                None
            )
            
            # ✅ Set both numbers in complaint session
            self.complaint_session.caller_number = caller
            self.complaint_session.ivr_number = ivr_number

            print("=" * 60)
            print(f"📞 Call started | SID: {self.call_sid}")
            print(f"   📱 From: {caller}")
            print(f"   🏢 IVR: {ivr_number}")
            print("=" * 60)

            # ✅ Set state to ASK_PROBLEM and greet user
            self.complaint_session.step = 1
            self.complaint_session.state = ComplaintState.ASK_PROBLEM
            
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
            if event != "connected":  # Skip "connected" event (common)
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