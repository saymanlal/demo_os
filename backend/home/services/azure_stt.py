import os
import re
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

        self.speech_config = speechsdk.SpeechConfig(
            subscription=self.speech_key,
            region=self.region
        )

        self.auto_lang_config = languageconfig.AutoDetectSourceLanguageConfig(
            languages=["hi-IN", "en-IN"]
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
        print("✅ Azure STT initialized")


    # ----------------------------
    # NUMBER + LETTER NORMALIZER
    # ----------------------------
    def _normalize_numbers_and_letters(self, text: str) -> str:
        text = text.lower()

        # CRITICAL: Handle special Hindi words FIRST before letter mapping
        # नई gets corrupted to नE if ई is mapped to E first
        special_hindi_words = {
            "नई": "nayi",
            "नयी": "nayi", 
            "नया": "naya",
            "नए": "naye",
            "पुरानी": "purani",
            "पुराना": "purana",
            "पुराने": "purane"
        }
        
        for hindi, english in special_hindi_words.items():
            text = text.replace(hindi, english)

        # Enhanced number mapping with spoken variations
        number_map = {
            "zero": "0", "जीरो": "0",
            "one": "1", "ek": "1", "एक": "1",
            "two": "2", "do": "2", "दो": "2",
            "three": "3", "teen": "3", "तीन": "3", "थ्री": "3",
            "four": "4", "char": "4", "चार": "4", "फोर": "4",
            "five": "5", "paanch": "5", "पांच": "5", "panch": "5", "फाइव": "5",
            "six": "6", "chhe": "6", "छह": "6", "chhah": "6", "सिक्स": "6",
            "seven": "7", "saat": "7", "सात": "7", "सेवन": "7",
            "eight": "8", "aath": "8", "आठ": "8", "aat": "8", "एट": "8",
            "nine": "9", "nau": "9", "नौ": "9", "नाइन": "9",
            "ten": "10", "das": "10", "दस": "10",
            "eleven": "11", "gyaarah": "11", "ग्यारह": "11",
            "twelve": "12", "baarah": "12", "बारह": "12",
        }

        # Apply number mapping with word boundaries for English words
        for k, v in number_map.items():
            if k.isascii():  # English words need word boundaries
                text = re.sub(rf"\b{k}\b", v, text)
            else:  # Hindi words can be replaced directly
                text = text.replace(k, v)

        # Letter mapping - common in complaint IDs
        letter_map = {
            "एम": "M", "पी": "P", "वी": "V",
            "बी": "B", "सी": "C", "डी": "D",
            "ए": "A", "ई": "E", "एफ": "F",
            "जी": "G", "एच": "H", "आई": "I",
            "जे": "J", "के": "K", "एल": "L",
            "एन": "N", "ओ": "O", "क्यू": "Q",
            "आर": "R", "एस": "S", "टी": "T",
            "यू": "U", "डब्ल्यू": "W", "एक्स": "X",
            "वाई": "Y", "जेड": "Z"
        }

        for k, v in letter_map.items():
            text = text.replace(k, v)

        # Handle common spoken patterns for complaint IDs
        # "डबल सी" -> "CC", "ट्रिपल ए" -> "AAA"
        double_pattern = re.compile(r"(डबल|double)\s*([a-z])", re.IGNORECASE)
        text = double_pattern.sub(lambda m: m.group(2).upper() * 2, text)
        
        triple_pattern = re.compile(r"(ट्रिपल|triple)\s*([a-z])", re.IGNORECASE)
        text = triple_pattern.sub(lambda m: m.group(2).upper() * 3, text)

        return text.upper()


    # ----------------------------
    # CLEAN STT TEXT
    # ----------------------------
    def _clean_stt_text(self, text: str) -> str:
        if not text:
            return ""

        original = text
        text = text.strip()

        # Remove punctuation but keep Hindi and English characters
        text = re.sub(r"[।,.\?!;:]", "", text)
        
        # Normalize whitespace
        text = re.sub(r"\s+", " ", text).strip()

        # CRITICAL: Normalize numbers FIRST before yes/no to prevent conflicts
        # "नाइन" (nine) contains patterns that could trigger NO normalization
        text = self._normalize_numbers_and_letters(text)

        # Now convert Hindi words to English equivalents
        # YES variations (both Hindi and English)
        hindi_yes_patterns = [
            (r"हाँ|हा|हां", "haan"),
            (r"हूँ|हू|हुह|हुहह", "haan"),
            (r"हम्म|हन", "haan")
        ]
        for pattern, replacement in hindi_yes_patterns:
            text = re.sub(pattern, replacement, text, flags=re.I)
        
        # NO variations (both Hindi and English) - carefully to avoid "नाइन"
        hindi_no_patterns = [
            (r"नहीं|नही", "nahi"),
            (r"ना(?![इईउऊए])", "nahi")  # Match "ना" but not if followed by vowels
        ]
        for pattern, replacement in hindi_no_patterns:
            text = re.sub(pattern, replacement, text, flags=re.I)
        
        # NEW complaint variations - already handled in _normalize_numbers_and_letters
        # OLD complaint variations - already handled in _normalize_numbers_and_letters

        # Enhanced YES normalization - English variations
        text = re.sub(
            r"\b(haan|han|ha|haa|huh|huhh|hmm|hnn|hn|yes|yeah|yep|yup|haanji|hanji)\b",
            "haan",
            text,
            flags=re.I
        )

        # Enhanced NO normalization - English variations
        text = re.sub(
            r"\b(nahi|nahin|na|nah|nhi|ni|no|nope|nahii|nahee)\b",
            "nahi",
            text,
            flags=re.I
        )

        # NEW complaint normalization - English variations (nayi already set in normalize_numbers_and_letters)
        text = re.sub(
            r"\b(nai|naya|new)\b",
            "nayi",
            text,
            flags=re.I
        )

        # OLD/EXISTING complaint normalization - English variations (purani already set)
        text = re.sub(
            r"\b(purana|old|existing)\b",
            "purani",
            text,
            flags=re.I
        )

        if original != text:
            print(f"🧹 STT FIXED: '{original}' → '{text}'")

        return text


    # ----------------------------
    # EVENTS
    # ----------------------------
    def _wire_events(self):
        self.recognizer.recognizing.connect(
            lambda evt: print(f"🟡 PARTIAL: {evt.result.text}")
        )

        def recognized(evt):
            if evt.result.text:
                raw = evt.result.text
                cleaned = self._clean_stt_text(raw)

                print(f"🟢 FINAL RAW: {raw}")
                print(f"🟢 FINAL CLEANED: {cleaned}")

                if cleaned:
                    self.on_final_text(cleaned)

        self.recognizer.recognized.connect(recognized)

        self.recognizer.session_started.connect(
            lambda evt: print("🔊 Azure STT session started")
        )

        self.recognizer.session_stopped.connect(
            lambda evt: print("🛑 Azure STT session stopped")
        )


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
            print(f"❌ STT close error: {e}")