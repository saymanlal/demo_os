import os
import threading
import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech import languageconfig


class AzureSpeechStream:
    """
    Azure Speech-to-Text with continuous recognition
    Thread-safe callback handling for Twilio media streams
    """

    def __init__(self, on_final_text):
        self.on_final_text = on_final_text

        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.region = os.getenv("AZURE_SPEECH_REGION")

        if not self.speech_key or not self.region:
            raise RuntimeError("❌ Azure Speech credentials missing")

        self.closed = False
        self.paused = False
        self.lock = threading.Lock()

        # Track if recognizer is running
        self.is_recognizing = False

        self._build_recognizer()
        self._start_recognition()

        print("✅ Azure STT initialized")

    def _build_recognizer(self):
        """Configure Azure Speech recognizer"""
        
        # Speech config
        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.speech_key,
            region=self.region
        )

        # Enable detailed logging for debugging
        self.speech_config.set_property(
            speechsdk.PropertyId.Speech_LogFilename,
            "azure_stt_debug.log"
        )

        # Auto language detection (Hindi + English)
        self.auto_lang_config = languageconfig.AutoDetectSourceLanguageConfig(
            languages=["hi-IN", "en-IN", "en-US"]
        )

        # ✅ CRITICAL: Correct audio format for Twilio
        # Twilio sends: μ-law 8kHz mono
        # We convert to: PCM 16kHz mono
        self.audio_format = speechsdk.audio.AudioStreamFormat(
            samples_per_second=16000,
            bits_per_sample=16,
            channels=1
        )

        # Push stream (we manually feed audio)
        self.push_stream = speechsdk.audio.PushAudioInputStream(
            self.audio_format
        )

        # Audio config
        self.audio_config = speechsdk.audio.AudioConfig(
            stream=self.push_stream
        )

        # Create recognizer
        self.recognizer = speechsdk.SpeechRecognizer(
            speech_config=self.speech_config,
            audio_config=self.audio_config,
            auto_detect_source_language_config=self.auto_lang_config
        )

        self._wire_events()

    def _wire_events(self):
        """Connect all Azure STT event handlers"""

        # ─────────────────────────────────────────────────────
        # PARTIAL TRANSCRIPTION (real-time)
        # ─────────────────────────────────────────────────────
        def on_recognizing(evt):
            if evt.result.text and not self.paused:
                print(f"🟡 PARTIAL: {evt.result.text}")

        self.recognizer.recognizing.connect(on_recognizing)

        # ─────────────────────────────────────────────────────
        # FINAL TRANSCRIPTION (complete sentence)
        # ─────────────────────────────────────────────────────
        def on_recognized(evt):
            if self.closed or self.paused:
                return

            if evt.result.reason == speechsdk.ResultReason.RecognizedSpeech:
                if evt.result.text:
                    print(f"🟢 FINAL: {evt.result.text}")
                    
                    # ✅ Thread-safe callback
                    try:
                        self.on_final_text(evt.result.text)
                    except Exception as e:
                        print(f"❌ Callback error: {e}")

            elif evt.result.reason == speechsdk.ResultReason.NoMatch:
                print("⚠️ No speech detected")

        self.recognizer.recognized.connect(on_recognized)

        # ─────────────────────────────────────────────────────
        # SESSION STARTED
        # ─────────────────────────────────────────────────────
        def on_session_started(evt):
            print("🎙️ Azure session started")
            self.is_recognizing = True

        self.recognizer.session_started.connect(on_session_started)

        # ─────────────────────────────────────────────────────
        # SESSION STOPPED (DO NOT AUTO-RESTART)
        # ─────────────────────────────────────────────────────
        def on_session_stopped(evt):
            print("⏸️ Azure session stopped")
            self.is_recognizing = False

            # ❌ DO NOT AUTO-RESTART HERE
            # Let pause/resume handle it explicitly

        self.recognizer.session_stopped.connect(on_session_stopped)

        # ─────────────────────────────────────────────────────
        # CANCELED (error handling)
        # ─────────────────────────────────────────────────────
        def on_canceled(evt):
            print(f"⚠️ Recognition canceled: {evt.reason}")
            
            if evt.reason == speechsdk.CancellationReason.Error:
                print(f"❌ Error details: {evt.error_details}")
            
            self.is_recognizing = False

        self.recognizer.canceled.connect(on_canceled)

    def _start_recognition(self):
        """Start continuous recognition (called once on init)"""
        with self.lock:
            if not self.is_recognizing and not self.closed:
                try:
                    self.recognizer.start_continuous_recognition()
                    print("▶️ Azure recognition started")
                except Exception as e:
                    print(f"❌ Failed to start recognition: {e}")

    def push_audio(self, pcm_bytes: bytes):
        """
        Push PCM 16kHz mono audio to Azure
        Called from Twilio WebSocket for each audio chunk
        """
        if self.closed or self.paused:
            return

        try:
            self.push_stream.write(pcm_bytes)
        except Exception as e:
            print(f"❌ Push audio error: {e}")

    def pause(self):
        """
        Pause recognition (during TTS playback)
        Does NOT stop the recognizer
        """
        if self.closed:
            return

        with self.lock:
            if not self.paused:
                self.paused = True
                print("⏸️ Azure STT paused")

    def resume(self):
        """
        Resume recognition after TTS
        Restarts recognizer if it stopped
        """
        if self.closed:
            return

        with self.lock:
            self.paused = False

            # ✅ Restart if needed
            if not self.is_recognizing:
                try:
                    self.recognizer.stop_continuous_recognition()
                except:
                    pass

                try:
                    self.recognizer.start_continuous_recognition()
                    print("🔄 Azure STT resumed")
                except Exception as e:
                    print(f"❌ Resume failed: {e}")
            else:
                print("▶️ Azure STT resumed (already running)")

    def close(self):
        """
        Cleanup on call end
        """
        if self.closed:
            return

        print("🛑 Closing Azure STT...")

        with self.lock:
            self.closed = True
            self.paused = True

            try:
                self.recognizer.stop_continuous_recognition()
            except:
                pass

            try:
                self.push_stream.close()
            except:
                pass

        print("✅ Azure STT closed")