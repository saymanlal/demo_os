import requests

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

class OllamaLLM:
    def __init__(self, model="mistral:7b-instruct-q4_K_M"):
        self.model = model

    def generate(self, prompt: str) -> str:
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        r = requests.post(OLLAMA_URL, json=payload, timeout=60)
        r.raise_for_status()

        return r.json().get("response", "").strip()
