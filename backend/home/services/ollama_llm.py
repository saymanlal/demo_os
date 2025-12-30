import requests
import json
import re


class OllamaLLM:
    def __init__(self, model="phi3"):
        self.model = model
        self.url = "http://127.0.0.1:11434/api/chat"

    def generate_sentences(self, prompt: str):
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a real-time AI voice assistant on a phone call. "
                        "Reply naturally, clearly, and briefly. "
                        "Do not ramble."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "stream": True
        }

        response = requests.post(
            self.url,
            json=payload,
            stream=True,
            timeout=60
        )

        buffer = ""

        for line in response.iter_lines():
            if not line:
                continue

            data = json.loads(line.decode("utf-8"))

            if "message" in data:
                token = data["message"].get("content", "")
                buffer += token

                # sentence boundary detection
                sentences = re.split(r'(?<=[.!?])\s+', buffer)

                for s in sentences[:-1]:
                    clean = s.strip()
                    if clean:
                        yield clean

                buffer = sentences[-1]

            if data.get("done"):
                final = buffer.strip()
                if final:
                    yield final
                break
