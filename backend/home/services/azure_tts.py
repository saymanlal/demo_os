import os
import azure.cognitiveservices.speech as speechsdk


class AzureTTS:
    def __init__(self, voice="en-US-JennyNeural"):
        self.speech_config = speechsdk.SpeechConfig(
            subscription=os.getenv("AZURE_SPEECH_KEY"),
            region=os.getenv("AZURE_SPEECH_REGION")
        )
        self.speech_config.speech_synthesis_voice_name = voice

        # IMPORTANT: raw PCM output
        self.speech_config.set_speech_synthesis_output_format(
            speechsdk.SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm
        )

    def synthesize(self, text: str) -> bytes:
        # No AudioConfig needed
        synthesizer = speechsdk.SpeechSynthesizer(
            speech_config=self.speech_config,
            audio_config=None
        )

        result = synthesizer.speak_text_async(text).get()

        if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
            raise RuntimeError("Azure TTS failed")

        return result.audio_data  # ✅ PCM 16kHz bytes