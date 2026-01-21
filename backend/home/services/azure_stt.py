import os
import re
import azure.cognitiveservices.speech as speechsdk
from azure.cognitiveservices.speech import languageconfig


class AzureSpeechStream:
    def __init__(self, on_final_text):
        self.on_final_text = on_final_text

        self.speech_key = os.getenv("AZURE_SPEECH_KEY")
        self.region = os.getenv("AZURE_SPEECH_REGION")

        if not self.speech_key or not self.region:
            raise RuntimeError("Azure Speech credentials missing")

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

        self.push_stream = speechsdk.audio.PushAudioInputStream(self.audio_format)
        self.audio_config = speechsdk.audio.AudioConfig(stream=self.push_stream)

        self.recognizer = speechsdk.SpeechRecognizer(
            speech_config=self.speech_config,
            audio_config=self.audio_config,
            auto_detect_source_language_config=self.auto_lang_config
        )

        self._wire_events()
        self.recognizer.start_continuous_recognition()
        print("✅ Azure STT initialized (SAFE cleaner)")

    # ---------------- CLEANER ---------------- #

    def _clean_stt_text(self, text: str) -> str:
        """
        STRICT RULES:
        - Hindi sentences = DO NOT rewrite words
        - Only normalize yes/no style answers
        - Never convert words like 'nayi' into English garbage
        """

        if not text or not text.strip():
            return ""

        original = text
        text = text.strip()

        lower = text.lower()

        # 1️⃣ YES / NO NORMALIZATION (SAFE)
        yes_patterns = [
            r'^han\.?$', r'^haan\.?$', r'^yes\.?$', r'^ok\.?$',
            r'^okay\.?$', r'^han ji$', r'^haan ji$'
        ]

        no_patterns = [
            r'^no\.?$', r'^nahi\.?$', r'^nahin\.?$'
        ]

        for p in yes_patterns:
            if re.fullmatch(p, lower):
                return "Haan"

        for p in no_patterns:
            if re.fullmatch(p, lower):
                return "Nahi"

        # 2️⃣ REMOVE VERY LIGHT FILLERS (NO WORD REPLACEMENT)
        filler_patterns = [
            r'\buh\b', r'\bum\b', r'\bah\b', r'\bhuh\b'
        ]

        for fp in filler_patterns:
            text = re.sub(fp, '', text, flags=re.IGNORECASE)

        # 3️⃣ CLEAN EXTRA SPACES & TRAILING PUNCTUATION
        text = re.sub(r'\s+', ' ', text).strip()
        text = text.rstrip('.,!?;:।')

        if original != text:
            print(f"🧹 STT CLEANER: '{original}' → '{text}'")

        return text

    # ---------------- EVENTS ---------------- #

    def _wire_events(self):
        self.recognizer.recognizing.connect(
            lambda evt: print(f"🟡 PARTIAL: {evt.result.text}")
        )

        def recognized(evt):
            if not evt.result.text:
                return

            raw_text = evt.result.text
            cleaned_text = self._clean_stt_text(raw_text)

            print(f"🟢 FINAL RAW: {raw_text}")
            print(f"🟢 FINAL CLEANED: {cleaned_text}")

            if cleaned_text:
                self.on_final_text(cleaned_text)
            else:
                print("⚠️ Empty after cleaning, skipped")

        self.recognizer.recognized.connect(recognized)

        self.recognizer.session_started.connect(
            lambda evt: print("🔊 Azure STT session started")
        )

        self.recognizer.session_stopped.connect(
            lambda evt: print("🛑 Azure STT session stopped")
        )

    # ---------------- STREAM ---------------- #

    def push_audio(self, pcm_bytes: bytes):
        try:
            self.push_stream.write(pcm_bytes)
        except Exception as e:
            print(f"❌ Audio push error: {e}")

    def close(self):
        try:
            self.recognizer.stop_continuous_recognition()
            self.push_stream.close()
            print("✅ Azure STT closed")
        except Exception as e:
            print(f"❌ Close error: {e}")


# ---------------- TEST ---------------- #

if __name__ == "__main__":
    def cb(t):
        print("CALLBACK:", t)

    stream = AzureSpeechStream(cb)

    tests = [
        "Han.",
        "Yes",
        "No.",
        "Haan ji",
        "nayi samasya hai",
        "mere ghar ki light raat se band hai"
    ]

    for t in tests:
        print(stream._clean_stt_text(t))

    stream.close()
