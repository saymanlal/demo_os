"""
Groq AI Voice Complaint Officer
FREE & FAST using Groq Chat Completions
Govt-grade, JSON-driven complaint intake
"""

import os
import requests
import json
import time


SYSTEM_PROMPT = """
You are an AI Government Complaint Registration Officer
for the Animal Husbandry Department (Pashu Vibhag).

You are speaking to farmers on a PHONE CALL.

STRICT RULES:
- Speak ONLY in simple, respectful Hindi.
- Do NOT joke, flirt, or chat casually.
- Ignore unrelated or abusive talk and redirect politely.
- Ask ONE clear question at a time.
- Keep responses short (1–2 sentences).

YOUR ONLY GOAL:
Register exactly ONE animal-related complaint per call.

REQUIRED INFORMATION:
1. Animal type (gaay, bhains, bakri, etc.)
2. Problem description
3. Village
4. District
5. State
6. Urgency (normal | urgent | emergency)

If ANY information is missing, ask for it.

WHEN ALL INFORMATION IS COLLECTED:
Output ONLY the JSON below and NOTHING ELSE.

{
  "complaint_ready": true,
  "animal_type": "",
  "problem_summary": "",
  "village": "",
  "district": "",
  "state": "",
  "urgency": "normal | urgent | emergency"
}

DO NOT explain the JSON.
DO NOT add text before or after JSON.
"""


class GeminiLLM:
    def __init__(self, model="llama-3.1-8b-instant"):
        """
        Groq FREE models:
        - llama-3.1-8b-instant (recommended, stable)
        - mixtral-8x7b-32768
        - gemma2-9b-it
        """

        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise RuntimeError("❌ GROQ_API_KEY not found in environment")

        self.model = model
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.last_call_time = 0

        print(f"✅ Groq LLM initialized with model: {self.model}")

    # -------------------------------
    # Core API Call
    # -------------------------------
    def _make_api_call(self, user_text: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_text},
            ],
            "temperature": 0.2,   # LOW temperature = deterministic govt behaviour
            "max_tokens": 300,
            "stream": False,
        }

        response = requests.post(
            self.base_url,
            headers=headers,
            json=payload,
            timeout=15,
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Groq API error {response.status_code}: {response.text[:200]}"
            )

        data = response.json()
        return data["choices"][0]["message"]["content"].strip()

    # -------------------------------
    # Public Generate Method
    # -------------------------------
    def generate(self, user_text: str) -> str:
        """
        Called on every STT FINAL transcript
        """

        # Basic rate limiting (1 req/sec)
        now = time.time()
        diff = now - self.last_call_time
        if diff < 1:
            time.sleep(1 - diff)

        self.last_call_time = time.time()

        try:
            print(f"📤 USER → LLM: {user_text}")
            response = self._make_api_call(user_text)
            print(f"🤖 LLM → RESPONSE: {response}")
            return response

        except Exception as e:
            print(f"❌ Groq LLM error: {e}")
            return (
                "Kshama kijiye, takneeki samasya aa rahi hai. "
                "Kripya apni baat dobara kahe."
            )

    # -------------------------------
    # Utility: JSON Detection
    # -------------------------------
    @staticmethod
    def is_json(text: str) -> bool:
        if not text:
            return False
        text = text.strip()
        return text.startswith("{") and text.endswith("}")
