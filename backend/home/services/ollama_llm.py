import os
import re
from google import genai


class OllamaLLM:
    """
    Streaming, sentence-based Gemini LLM
    (name kept to avoid refactors)
    """

    def __init__(self):
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise RuntimeError("GOOGLE_API_KEY not set")

        self.client = genai.Client(api_key=api_key)

        # ⚠️ THIS IS THE KEY FIX
        self.model = "gemini-1.0-pro"

    def generate_sentences(self, prompt: str):
        stream = self.client.models.generate_content_stream(
            model=self.model,
            contents=[
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                "You are a real-time AI voice assistant on a phone call. "
                                "Reply clearly, briefly, and naturally.\n\n"
                                f"User: {prompt}"
                            )
                        }
                    ],
                }
            ],
        )

        buffer = ""

        for chunk in stream:
            if not chunk.text:
                continue

            buffer += chunk.text

            # split on sentence boundaries
            sentences = re.split(r'(?<=[.!?])\s+', buffer)

            for s in sentences[:-1]:
                s = s.strip()
                if s:
                    yield s

            buffer = sentences[-1]

        # flush remaining text
        final = buffer.strip()
        if final:
            yield final
