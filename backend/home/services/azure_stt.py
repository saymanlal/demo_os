import os
import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech import languageconfig


class AzureSpeechStream:
    def __init__(self, on_final_text):
        self.on_final_text = on_final_text

        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.region = os.getenv("AZURE_SPEECH_REGION")

        if not self.speech_key or not self.region:
            raise RuntimeError("Azure Speech credentials missing")

        self.closed = False
        self.paused = False

        self._build_recognizer()
        self.recognizer.start_continuous_recognition()

    def _build_recognizer(self):
        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.speech_key,
            region=self.region
        )

        self.auto_lang_config = languageconfig.AutoDetectSourceLanguageConfig(
            languages=["hi-IN", "en-IN", "en-US"]
        )

        self.audio_format = speechsdk.audio.AudioStreamFormat(
            samples_per_second=16000,
            bits_per_sample=16,
            channels=1
        )

        self.push_stream = speechsdk.audio.PushAudioInputStream(
            self.audio_format
        )

        self.audio_config = speechsdk.audio.AudioConfig(
            stream=self.push_stream
        )

        self.recognizer = speechsdk.SpeechRecognizer(
            speech_config=self.speech_config,
            audio_config=self.audio_config,
            auto_detect_source_language_config=self.auto_lang_config
        )

        self._wire_events()

    def _wire_events(self):
        self.recognizer.recognizing.connect(
            lambda e: print("🟡 PARTIAL:", e.result.text)
        )

        def recognized(evt):
            if self.closed or self.paused:
                return
            if evt.result.text:
                print("🟢 FINAL:", evt.result.text)
                self.on_final_text(evt.result.text)

        self.recognizer.recognized.connect(recognized)

        def session_stopped(evt):
            if not self.closed:
                print("🔁 Azure session restarted")
                try:
                    self.recognizer.start_continuous_recognition()
                except Exception:
                    pass

        self.recognizer.session_stopped.connect(session_stopped)

    def push_audio(self, pcm_bytes: bytes):
        if self.closed or self.paused:
            return
        try:
            self.push_stream.write(pcm_bytes)
        except Exception:
            pass

    def pause(self):
        self.paused = True

    def resume(self):
        if self.closed:
            return

        self.paused = False
        try:
            self.recognizer.stop_continuous_recognition()
        except Exception:
            pass

        try:
            self.recognizer.start_continuous_recognition()
            print("🔄 Azure STT restarted")
        except Exception:
            pass

    def close(self):
        self.closed = True
        self.paused = True
        try:
            self.push_stream.close()
        except Exception:
            pass
        try:
            self.recognizer.stop_continuous_recognition()
        except Exception:
            pass
