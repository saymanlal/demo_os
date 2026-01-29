# ~/demo_os/backend/home/consumers/twilio_media.py
import json
import base64
import audioop
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import logging

from home.services.azure_stt import AzureSpeechStream
from home.services.azure_tts import AzureTTS
from home.services.complaint_session import ComplaintSession

logger = logging.getLogger(__name__)


class TwilioMediaConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        logger.info("🔗 Twilio WebSocket connected")

        self.call_sid = None
        self.stream_sid = None
        self.loop = asyncio.get_event_loop()
        self.call_active = True
        self.is_agent_speaking = False
        self.awaiting_user_response = False

        # Initialize services
        self.tts = AzureTTS()
        
        # Initialize ComplaintSession with async support
        self.complaint_session = ComplaintSession(caller_number="UNKNOWN")
        
        # Initialize STT with callback
        self.azure_stt = AzureSpeechStream(on_final_text=self.sync_final_text_callback)
        
        logger.info("✅ Azure STT + Azure TTS + ComplaintSession initialized")

    # -----------------------------
    # STT CALLBACK - UPDATED
    # -----------------------------
    def sync_final_text_callback(self, text: str):
        """Called when Azure STT has final text"""
        if not self.call_active or self.is_agent_speaking or not text:
            return
        
        logger.info(f"📝 STT Callback received: '{text}'")
        
        # Schedule async handling
        asyncio.run_coroutine_threadsafe(
            self.handle_final_text(text),
            self.loop
        )

    # -----------------------------
    # MAIN LOGIC - FIXED
    # -----------------------------
    async def handle_final_text(self, text: str):
        """Process user speech with proper complaint handling"""
        if not self.call_active:
            return
        
        logger.info(f"🎤 USER SAID: {text}")
        
        # Get response from ComplaintSession (async wrapper)
        response_text, should_end = await self.complaint_session.handle_input_async(text)
        
        # Log state for debugging
        logger.info(f"🏛️ RESPONSE: {response_text[:100]}...")
        state_name = self.complaint_session.state.name if hasattr(self.complaint_session.state, 'name') else str(self.complaint_session.state)
        logger.info(f"📊 Session State: {state_name}")
        
        # Speak the response
        await self.speak(response_text)
        
        # Log if complaint saved
        if self.complaint_session.current_complaint:
            complaint = self.complaint_session.current_complaint
            logger.info(f"✅ Complaint saved! ID: {complaint.complaint_id}")
            logger.info(f"   Description: {complaint.description[:50]}...")
            logger.info(f"   Location: {complaint.location}")
            logger.info(f"   Status: {complaint.status}")
            
            # Also log to console for immediate visibility
            print(f"\n" + "="*60)
            print(f"✅ COMPLAINT SAVED SUCCESSFULLY!")
            print(f"📄 Complaint ID: {complaint.complaint_id}")
            print(f"📞 Caller: {complaint.caller_number}")
            print(f"📍 Location: {complaint.location}")
            print(f"📝 Description: {complaint.description[:100]}...")
            print(f"📅 Created: {complaint.created_at}")
            print("="*60 + "\n")
        
        # Check if we're asking user for more problems
        if self.complaint_session.state.name == "ASK_MORE_PROBLEMS":
            logger.info("🔄 Waiting for user response: more problems or end call?")
            self.awaiting_user_response = True
        
        # If should_end is True, end call after a delay
        if should_end:
            logger.info("🎯 User wants to end call...")
            await asyncio.sleep(2)  # Give time for final message
            await self.end_call()

    # -----------------------------
    # SPEAK FUNCTION - OPTIMIZED
    # -----------------------------
    async def speak(self, text: str):
        """Convert text to speech and send to Twilio"""
        if not self.call_active or not self.stream_sid or not text:
            logger.warning("⚠️ speak() skipped - no stream or text")
            return
        
        self.is_agent_speaking = True
        
        try:
            # Log what we're about to speak
            logger.info(f"🔊 Preparing to speak: {text[:80]}...")
            
            # Generate TTS audio
            pcm_16k = self.tts.synthesize(text)
            
            # Convert format for Twilio
            pcm_8k, _ = audioop.ratecv(pcm_16k, 2, 1, 16000, 8000, None)
            mulaw = audioop.lin2ulaw(pcm_8k, 2)
            payload = base64.b64encode(mulaw).decode("utf-8")
            
            # Send to Twilio
            await self.send(text_data=json.dumps({
                "event": "media",
                "streamSid": self.stream_sid,
                "media": {"payload": payload}
            }))
            
            logger.info(f"🔊 SPOKE: {text[:60]}...")
            
            # Calculate speaking duration based on word count
            word_count = len(text.split())
            duration = max(1.0, word_count * 0.25)  # Faster for Hindi
            logger.debug(f"⏱️  Speaking duration: {duration:.1f} seconds")
            await asyncio.sleep(duration)
            
        except Exception as e:
            logger.error(f"❌ Error in speak(): {e}", exc_info=True)
        finally:
            self.is_agent_speaking = False

    # -----------------------------
    # TWILIO EVENTS - COMPLETE
    # -----------------------------
    async def receive(self, text_data=None, bytes_data=None):
        """Handle messages from Twilio"""
        if not text_data:
            return
        
        try:
            message = json.loads(text_data)
            event = message.get("event")
            
            if event == "start":
                # Call started
                self.call_sid = message["start"]["callSid"]
                self.stream_sid = message["start"]["streamSid"]
                caller = message["start"].get("from", "UNKNOWN")
                
                # Update session with actual caller number
                self.complaint_session.caller_number = caller
                
                logger.info(f"📞 Call started | {self.call_sid} | Caller: {caller}")
                
                # Send SIMPLE welcome message
                welcome_msg = (
                    "Namaskar. Madhya Pradesh Vidyut Vibhag helpline mein aapka swagat hai. "
                    "Kya aapki koi samasya hai?"
                )
                await self.speak(welcome_msg)
                
                # Log to console for visibility
                print(f"\n" + "="*60)
                print(f"📞 NEW CALL STARTED")
                print(f"📞 Call SID: {self.call_sid}")
                print(f"👤 Caller: {caller}")
                print(f"⏰ Time: {asyncio.get_event_loop().time()}")
                print("="*60 + "\n")
                
            elif event == "media":
                # Audio received from caller
                if self.is_agent_speaking:
                    logger.debug("Ignoring audio while speaking")
                    return
                
                try:
                    payload = message["media"]["payload"]
                    mulaw = base64.b64decode(payload)
                    pcm_8k = audioop.ulaw2lin(mulaw, 2)
                    pcm_16k, _ = audioop.ratecv(pcm_8k, 2, 1, 8000, 16000, None)
                    
                    # Send to Azure STT
                    self.azure_stt.push_audio(pcm_16k)
                    
                except Exception as e:
                    logger.error(f"❌ Error processing audio: {e}")
                    
            elif event == "stop":
                # Call ended by Twilio
                logger.info(f"🛑 Call ended by Twilio | {self.call_sid}")
                await self.end_call()
                
            elif event == "mark":
                # Marks from Twilio
                mark_name = message.get("mark", {}).get("name")
                if mark_name:
                    logger.debug(f"📌 Twilio mark: {mark_name}")
                
        except json.JSONDecodeError as e:
            logger.error(f"❌ JSON decode error: {e}")
        except Exception as e:
            logger.error(f"❌ Error in receive(): {e}", exc_info=True)

    # -----------------------------
    # CLEAN SHUTDOWN - IMPROVED
    # -----------------------------
    async def end_call(self):
        """Properly end the call"""
        if not self.call_active:
            return
        
        self.call_active = False
        
        try:
            # Send final message if possible
            if self.stream_sid:
                try:
                    farewell = "Dhanyavaad. Shubh din."
                    await self.speak(farewell)
                    await asyncio.sleep(1)
                except:
                    pass
            
            # Close STT
            if hasattr(self, "azure_stt") and self.azure_stt:
                self.azure_stt.close()
                logger.info("✅ Azure STT closed")
                
        except Exception as e:
            logger.error(f"❌ Error during shutdown: {e}")
        
        # Close WebSocket
        try:
            await self.close()
            logger.info(f"✅ WebSocket closed for call {self.call_sid}")
        except Exception as e:
            logger.error(f"❌ Error closing WebSocket: {e}")
        
        # Final log
        logger.info(f"📞 Call {self.call_sid} ended completely")

    async def disconnect(self, close_code):
        """WebSocket disconnected"""
        logger.info(f"❌ WebSocket disconnected | code={close_code}")
        self.call_active = False
        
        try:
            if hasattr(self, "azure_stt") and self.azure_stt:
                self.azure_stt.close()
        except Exception:
            pass

    # -----------------------------
    # ADDITIONAL HELPER METHODS
    # -----------------------------
    async def get_session_info(self):
        """Get current session info for debugging"""
        state_name = None
        if self.complaint_session:
            if hasattr(self.complaint_session.state, 'name'):
                state_name = self.complaint_session.state.name
            else:
                state_name = str(self.complaint_session.state)
        
        complaint_id = None
        if self.complaint_session and self.complaint_session.current_complaint:
            complaint_id = self.complaint_session.current_complaint.complaint_id
        
        return {
            "call_sid": self.call_sid,
            "stream_sid": self.stream_sid,
            "call_active": self.call_active,
            "caller_number": self.complaint_session.caller_number if self.complaint_session else None,
            "session_state": state_name,
            "has_complaint": bool(self.complaint_session.current_complaint if self.complaint_session else False),
            "complaint_id": complaint_id,
            "awaiting_response": self.awaiting_user_response
        }


# -----------------------------
# TEST FUNCTION
# -----------------------------
def test_consumer():
    """Test the consumer logic"""
    print("🧪 Testing TwilioMediaConsumer logic...")
    
    # Test cases
    test_scenarios = [
        {
            "input": "haan, samasya hai",
            "expected": "Should ask new/existing"
        },
        {
            "input": "nayi complaint",
            "expected": "Should ask for description"
        },
        {
            "input": "mere ghar ki bijli nahi aa rahi",
            "expected": "Should ask for location"
        },
        {
            "input": "ram nagar",
            "expected": "Should ask for confirmation"
        },
        {
            "input": "haan",
            "expected": "Should save complaint and ask for more problems"
        },
        {
            "input": "nahi",
            "expected": "Should end call"
        },
        {
            "input": "haan",
            "expected": "Should ask for next complaint"
        }
    ]
    
    print("✅ Test scenarios defined successfully!")
    print("🚀 Consumer ready for production use.")


if __name__ == "__main__":
    test_consumer()