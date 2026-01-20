"""
Pashumitra - Veterinary Doctor Assistant
Groq AI Powered - 100% FREE & SUPER FAST
Uses Llama 3.1 70B - Better than Gemini
Professional Veterinary Guidance in Hindi or English
"""

import os
import requests
import json
import time
from collections import deque

class PashumitraLLM:
    def __init__(self, model="llama-3.1-70b-versatile", max_history=10):
        """
        Pashumitra - Professional Veterinary Assistant
        Available FREE Groq models:
        - llama-3.1-70b-versatile (BEST - 70B parameters)
        - llama-3.1-8b-instant
        - mixtral-8x7b-32768
        - gemma2-9b-it
        """
        self.api_key = os.getenv("GROQ_API_KEY")
        
        if not self.api_key:
            print("❌ GROQ_API_KEY not found in .env")
            print("\n💡 GET FREE API KEY:")
            print("   1. Go to: https://console.groq.com/")
            print("   2. Sign up (FREE, no credit card)")
            print("   3. Go to API Keys section")
            print("   4. Click 'Create API Key'")
            print("   5. Copy the key")
            print("   6. Add to .env: GROQ_API_KEY=your_key_here")
            raise RuntimeError("GROQ_API_KEY missing")
        
        self.model = model
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        self.last_call_time = 0
        
        # Conversation history storage
        self.conversation_history = deque(maxlen=max_history)
        self.max_history = max_history
        
        # Store user information
        self.user_name = None
        self.current_language = None
        
        # Professional Veterinary System Prompt - STRICT RULES
        self.system_prompt = """You are Pashumitra, a female veterinary doctor assistant from India.

IMPORTANT RULES (STRICTLY FOLLOW):
1. LANGUAGE:
   - If user speaks Hindi, respond ONLY in Hindi
   - If user speaks English, respond ONLY in English
   - NO language mixing - never use Hinglish
   - Maintain same language throughout conversation unless user changes

2. GENDER & IDENTITY:
   - You are FEMALE: Always use "main" (Hindi) / "I" (English)
   - Use feminine forms: "bol rahi hoon", "kar sakti hoon", "de sakti hoon"
   - Never use masculine forms like "kar sakta hoon"

3. RESPONSE LENGTH:
   - MAXIMUM 2 sentences (30-40 words)
   - Concise, to-the-point answers
   - No lengthy explanations

4. MEMORY:
   - Remember user's name if given
   - Remember previous conversation details
   - Reference past context when relevant

5. PROFESSIONAL CONDUCT:
   - Clinical, professional tone
   - For serious cases: ALWAYS recommend visiting veterinarian
   - Evidence-based advice only
   - Use proper medical terminology when needed

6. ABOUT YOU:
   - Name: Pashumitra
   - Role: Veterinary Assistant
   - Gender: Female
   - Always refer to yourself as female

SPECIALTIES: Cows, Buffaloes, Goats, Dogs, Cats, Poultry, Birds, Fish

Example Hindi: "आपके कुत्ते को तुरंत पशु चिकित्सक के पास ले जाएँ। यह गंभीर लक्षण है।"
Example English: "Please visit a veterinarian immediately. These symptoms require urgent attention."

REMEMBER: You are NOT a replacement for a veterinarian."""

        # Test connection
        try:
            print(f"🔗 Testing Pashumitra connection...")
            test_response = self._make_api_call("Hello", test_mode=True)
            print(f"✅ Pashumitra connected successfully!")
            print(f"⚡ Using model: {self.model}")
            print(f"👩‍⚕️ Female Veterinary Assistant")
            print(f"💬 Strict: 2 sentences max, no language mixing")
            print(f"🧠 Memory: {max_history} conversations")
        except Exception as e:
            print(f"❌ Connection failed: {e}")
            print("💡 Trying alternative model...")
            alternative_models = ["llama-3.1-8b-instant", "mixtral-8x7b-32768", "gemma2-9b-it"]
            
            for alt_model in alternative_models:
                try:
                    self.model = alt_model
                    test_response = self._make_api_call("Hello", test_mode=True)
                    print(f"✅ Connected with: {self.model}")
                    break
                except:
                    continue
            else:
                print("❌ All models failed")
                print("💡 Please check: https://console.groq.com/keys")
    
    def _detect_language(self, text: str) -> str:
        """Detect if text is Hindi or English"""
        # Simple detection: Check for Hindi characters
        hindi_chars = set('अआइईउऊऋएऐओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहळक्षज्ञ')
        text_chars = set(text)
        
        # If more than 20% characters are Hindi, consider it Hindi
        if len(text_chars.intersection(hindi_chars)) > 0:
            hindi_count = sum(1 for char in text if char in hindi_chars)
            if hindi_count > len(text) * 0.2:
                return "hindi"
        
        return "english"
    
    def _prepare_messages(self, user_input: str) -> list:
        """Prepare conversation history with new user input"""
        
        # Detect language for this message
        lang = self._detect_language(user_input)
        if lang != self.current_language:
            self.current_language = lang
        
        # Add name context if available
        enhanced_system_prompt = self.system_prompt
        if self.user_name:
            enhanced_system_prompt += f"\n\nUSER'S NAME: {self.user_name}"
        
        messages = [{"role": "system", "content": enhanced_system_prompt}]
        
        # Add conversation history
        for user_msg, assistant_msg in self.conversation_history:
            messages.append({"role": "user", "content": user_msg})
            messages.append({"role": "assistant", "content": assistant_msg})
        
        # Extract and store name if mentioned
        name_keywords = ['my name is', 'मेरा नाम है', 'नाम है', 'call me', 'i am']
        for keyword in name_keywords:
            if keyword in user_input.lower():
                parts = user_input.lower().split(keyword)
                if len(parts) > 1:
                    name = parts[1].strip().split()[0].capitalize()
                    if name and len(name) > 1:
                        self.user_name = name
                        print(f"✅ User name stored: {self.user_name}")
        
        # Add current user input
        messages.append({"role": "user", "content": user_input})
        
        return messages
    
    def _make_api_call(self, text: str, test_mode=False) -> str:
        """Make API call to Groq AI with conversation history"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        if test_mode:
            messages = [{"role": "system", "content": self.system_prompt},
                       {"role": "user", "content": "Hello"}]
        else:
            messages = self._prepare_messages(text)
        
        data = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 80,  # Reduced for shorter responses
            "temperature": 0.7,
            "stream": False
        }
        
        response = requests.post(
            self.base_url, 
            headers=headers, 
            json=data, 
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if test_mode:
                return "Connection successful"
            return result['choices'][0]['message']['content'].strip()
        else:
            error_msg = f"API Error {response.status_code}"
            if response.text:
                try:
                    error_data = response.json()
                    if 'error' in error_data:
                        error_msg = error_data['error'].get('message', error_msg)
                except:
                    error_msg = response.text[:100]
            raise Exception(error_msg)
    
    def generate(self, text: str) -> str:
        """Generate response with memory"""
        
        # Rate limiting
        current_time = time.time()
        time_since_last = current_time - self.last_call_time
        if time_since_last < 1:
            time.sleep(1 - time_since_last)
        
        try:
            self.last_call_time = time.time()
            
            print(f"📤 User: '{text[:50]}...'")
            
            response = self._make_api_call(text)
            
            # Store conversation
            self.conversation_history.append((text, response))
            
            # Check response quality
            self._validate_response(text, response)
            
            print(f"✅ Pashumitra: '{response[:60]}...'")
            print(f"📊 Memory: {len(self.conversation_history)}/{self.max_history}")
            
            return response
            
        except Exception as e:
            print(f"❌ Error: {e}")
            return "Technical issue. Please repeat your question."
    
    def _validate_response(self, user_input: str, response: str):
        """Validate response meets requirements"""
        # Check response length (2 sentences max)
        sentences = response.replace('!', '.').replace('?', '.').split('.')
        non_empty_sentences = [s.strip() for s in sentences if s.strip()]
        
        if len(non_empty_sentences) > 2:
            print(f"⚠️ Warning: Response has {len(non_empty_sentences)} sentences (max 2)")
        
        # Check for gender errors
        masculine_indicators_hindi = ['kar sakta', 'bol sakta', 'de sakta', 'कर सकता', 'बोल सकता', 'दे सकता']
        for indicator in masculine_indicators_hindi:
            if indicator in response.lower():
                print(f"⚠️ Warning: Masculine form detected: {indicator}")
        
        # Check language consistency
        user_lang = self._detect_language(user_input)
        response_lang = self._detect_language(response)
        
        if user_lang != response_lang:
            print(f"⚠️ Warning: Language switch detected. User: {user_lang}, Response: {response_lang}")
    
    def clear_memory(self):
        """Clear conversation history"""
        self.conversation_history.clear()
        self.user_name = None
        self.current_language = None
        print("🧹 Memory cleared (name & conversation)")
    
    def get_memory_summary(self):
        """Get summary of conversation memory"""
        if not self.conversation_history:
            return "No conversation history"
        
        summary = f"Pashumitra Memory Summary:\n"
        summary += f"User Name: {self.user_name or 'Not provided'}\n"
        summary += f"Conversations: {len(self.conversation_history)}\n\n"
        
        for i, (user, assistant) in enumerate(self.conversation_history, 1):
            summary += f"{i}. User: {user[:40]}...\n   Assistant: {assistant[:40]}...\n"
        
        return summary
    
    def remember_name_test(self):
        """Test if assistant remembers the name"""
        if self.user_name:
            return f"I remember your name is {self.user_name}."
        return "I don't know your name yet. What's your name?"


# TEST FUNCTION
def test_pashumitra():
    """Test the fixed Pashumitra assistant"""
    print("\n" + "="*60)
    print("🧪 TESTING FIXED PASHUMITRA")
    print("="*60)
    
    assistant = PashumitraLLM(max_history=5)
    
    # Test 1: Name memory
    print("\n1️⃣ Testing name memory:")
    response1 = assistant.generate("Mera naam Yash hai")
    print(f"Response: {response1}")
    
    # Test 2: Hindi conversation (should stay in Hindi)
    print("\n2️⃣ Hindi conversation:")
    response2 = assistant.generate("Mere kutte ko bukhar hai")
    print(f"Response: {response2}")
    
    # Test 3: Check name memory
    print("\n3️⃣ Name check:")
    response3 = assistant.generate("Maine tumhe apna naam kya bataya tha?")
    print(f"Response: {response3}")
    
    # Test 4: English conversation (should stay in English)
    print("\n4️⃣ English conversation:")
    response4 = assistant.generate("My cat is not eating")
    print(f"Response: {response4}")
    
    # Test 5: Gender check
    print("\n5️⃣ Gender check (should use female forms):")
    response5 = assistant.generate("Tum kaun ho?")
    print(f"Response: {response5}")
    
    print("\n" + "="*60)
    print(assistant.get_memory_summary())
    print("="*60)


# ======== Backward compatibility ========
GeminiLLM = PashumitraLLM

if __name__ == "__main__":
    # Run tests
    test_pashumitra()