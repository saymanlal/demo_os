import os
import azure.cognitiveservices.speech as speechsdk


class AzureTTS:
    def __init__(self):
        self.speech_config = speechsdk.SpeechConfig(
            subscription=os.getenv("AZURE_SPEECH_KEY"),
            region=os.getenv("AZURE_SPEECH_REGION")
        )

        # PCM output for Twilio
        self.speech_config.set_speech_synthesis_output_format(
            speechsdk.SpeechSynthesisOutputFormat.Raw16Khz16BitMonoPcm
        )

    def _fix_pronunciation(self, text: str) -> str:
        """Fix common pronunciation issues for natural speech"""
        # Fix "band" (बंद) pronunciation - replace with phonetic equivalent
        # "band karna" sounds like music band, so use "बंद" or "close"
        text = text.replace("band karna", "बंद karna")
        text = text.replace("band kar", "बंद kar")
        text = text.replace("ise band", "ise बंद")
        
        return text

    def synthesize(self, text: str) -> bytes:
        # Fix pronunciation issues
        text = self._fix_pronunciation(text)
        
        # 🔥 AUTO voice switch
        if any("\u0900" <= ch <= "\u097F" for ch in text):
            # If Hindi characters → Aarti voice
            self.speech_config.speech_synthesis_voice_name = "hi-IN-AartiNeural"
        else:
            # Hinglish → Indian English
            self.speech_config.speech_synthesis_voice_name = "en-IN-NeerjaNeural"

        synthesizer = speechsdk.SpeechSynthesizer(
            speech_config=self.speech_config,
            audio_config=None
        )

        result = synthesizer.speak_text_async(text).get()

        if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
            raise RuntimeError("Azure TTS failed")

        return result.audio_data  # ✅ PCM 16kHz bytes