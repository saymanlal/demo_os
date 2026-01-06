import os
import azure.cognitiveservices.speech as speechsdk


class AzureSpeechStream:
    def __init__(self, on_final_text, language="en-US"):
        self.on_final_text = on_final_text

        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.region = os.getenv("AZURE_SPEECH_REGION")

        if not self.speech_key or not self.region:
            raise RuntimeError("Azure Speech credentials missing")

        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.speech_key,
            region=self.region
        )
        self.speech_config.speech_recognition_language = language

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
            audio_config=self.audio_config
        )

        self._wire_events()
        self.recognizer.start_continuous_recognition()

    def _wire_events(self):
        self.recognizer.recognizing.connect(
            lambda evt: print(f"🟡 PARTIAL: {evt.result.text}")
        )

        def recognized(evt):
            if evt.result.text:
                print(f"🟢 FINAL: {evt.result.text}")
                self.on_final_text(evt.result.text)

        self.recognizer.recognized.connect(recognized)

        self.recognizer.session_stopped.connect(
            lambda evt: print("🛑 Azure session stopped")
        )

    def push_audio(self, pcm_bytes: bytes):
        self.push_stream.write(pcm_bytes)

    def close(self):
        self.push_stream.close()
        self.recognizer.stop_continuous_recognition()