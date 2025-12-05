def detect_greeting(text: str) -> str:
    if not text:
        return "Say something so I can respond."

    text = text.lower().strip()

    greetings = {
        "hello": "Hi there!",
        "hi": "Hello!",
        "hey": "Hey! How can I help you?",
        "good morning": "Good morning! Hope you're doing well.",
        "good afternoon": "Good afternoon!",
        "good evening": "Good evening!"
    }

    for key, value in greetings.items():
        if key in text:
            return value

    return "I’m not sure what you meant. Try saying hello."
