import os
import azure.cognitiveservices.speech as speechsdk
import threading
from typing import Optional, Callable


class AzureTTS:
    def __init__(self, 
                 voice_name: str = "en-US-JennyNeural",
                 language: str = "en-US"):
        """
        Azure Text-to-Speech (TTS) for voice responses
        
        Args:
            voice_name: Azure voice name (e.g., "en-US-JennyNeural")
            language: Language code (e.g., "en-US")
        """
        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.region = os.getenv("AZURE_SPEECH_REGION")

        if not self.speech_key or not self.region:
            raise RuntimeError("Azure Speech credentials missing for TTS")

        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.speech_key,
            region=self.region
        )
        
        # Set voice and language
        self.speech_config.speech_synthesis_voice_name = voice_name
        self.speech_config.speech_synthesis_language = language
        
        # Audio format for telephony (16kHz, 16bit mono)
        self.speech_config.set_speech_synthesis_output_format(
            speechsdk.SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm
        )
        
        print(f"✅ Azure TTS initialized - Voice: {voice_name}")

    def speak_simple(self, text: str) -> bytes:
        """
        Simple synchronous TTS (most reliable method)
        
        Args:
            text: Text to convert to speech
            
        Returns:
            bytes: PCM audio data (16kHz, 16-bit, mono)
        """
        print(f"🗣️  TTS Speaking: {text[:50]}...")
        
        try:
            # Create synthesizer without audio config (uses in-memory output)
            synthesizer = speechsdk.SpeechSynthesizer(
                speech_config=self.speech_config,
                audio_config=None
            )
            
            # Start synthesis
            result = synthesizer.speak_text_async(text).get()
            
            # Check result
            if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
                print("✅ Audio synthesized successfully")
                
                # Get audio data directly
                audio_data = result.audio_data
                print(f"📊 TTS Generated {len(audio_data)} bytes of audio")
                
                return audio_data
                
            elif result.reason == speechsdk.ResultReason.Canceled:
                cancellation_details = speechsdk.SpeechSynthesisCancellationDetails.from_result(result)
                print(f"❌ TTS Synthesis canceled: {cancellation_details.reason}")
                return b''
            
            return b''
            
        except Exception as e:
            print(f"❌ TTS error: {e}")
            return b''

    def speak_async(self, text: str, callback: Optional[Callable[[bytes], None]] = None):
        """
        Convert text to speech asynchronously
        
        Args:
            text: Text to convert to speech
            callback: Function to call with audio bytes when ready
        """
        print(f"🗣️  Async TTS: {text[:50]}...")
        
        def synthesize_thread():
            try:
                audio_data = self.speak_simple(text)
                if callback and audio_data:
                    callback(audio_data)
            except Exception as e:
                print(f"❌ Async TTS error: {e}")
                if callback:
                    callback(b'')
        
        thread = threading.Thread(target=synthesize_thread, daemon=True)
        thread.start()
        return thread

    def close(self):
        """Clean up resources"""
        print("🛑 TTS closed")


# For backward compatibility
AzureVoiceAssistant = AzureTTS


# Test function
if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    print("🧪 Testing Azure TTS...")
    
    try:
        tts = AzureTTS()
        
        # Test TTS
        audio = tts.speak_simple("Hello, this is a test of Azure Text to Speech.")
        
        if audio:
            print(f"✅ Success! Generated {len(audio)} bytes of audio")
            
            # Save to file for testing
            with open("test_audio.raw", "wb") as f:
                f.write(audio)
            print("💾 Audio saved to test_audio.raw")
            print("🎧 Play with: ffplay -f s16le -ar 16000 -ac 1 test_audio.raw")
        else:
            print("❌ No audio generated")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")