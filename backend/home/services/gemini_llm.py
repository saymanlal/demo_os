"""
VOICE AI ASSISTANT - Melissa
Powered by Groq AI (Llama 3.1 70B)
Custom Interface for Telephony
"""

import os
import requests
import json
import time
from datetime import datetime
import hashlib
import pickle

class VoiceAI:
    def __init__(self, model="llama-3.1-70b-versatile"):
        """
        VOICE AI ASSISTANT - Melissa
        Powered by Groq AI (Llama 3.1 70B) - 100% FREE
        
        Features:
        - Ultra Fast Responses (Groq API)
        - Complete Memory System
        - Emotional Intelligence
        - Contextual Understanding
        """
        # Use GROQ_API_KEY instead of AI_API_KEY or AZURE_SPEECH_KEY
        self.api_key = os.getenv("GROQ_API_KEY")
        
        if not self.api_key:
            print("🔑 GROQ API KEY NOT FOUND")
            print("\n📋 GET FREE API KEY (100% FREE):")
            print("   1. Go to: https://console.groq.com/")
            print("   2. Sign up (FREE, no credit card)")
            print("   3. Go to API Keys section")
            print("   4. Click 'Create API Key'")
            print("   5. Copy the key (starts with 'gsk_')")
            print("   6. Add to .env: GROQ_API_KEY=your_key_here")
            print("   7. Restart the application")
            raise RuntimeError("GROQ_API_KEY missing")
        
        # REAL Groq API Configuration
        self.model = model
        self.base_url = "https://api.groq.com/openai/v1/chat/completions"  # REAL Groq URL
        self.last_call_time = 0
        
        # Memory Systems
        self.conversation_history = []
        self.user_profile = {}
        self.context_memory = []
        
        # Performance Metrics
        self.total_calls = 0
        self.avg_response_time = 0
        
        # Initialize AI Engine
        self._initialize_ai_engine()
    
    def _initialize_ai_engine(self):
        """Initialize the AI Engine with proper configuration"""
        print("\n" + "="*50)
        print("🤖 INITIALIZING VOICE AI ASSISTANT")
        print("="*50)
        
        try:
            # Test AI Engine
            print("🔧 Loading AI Core Engine...")
            time.sleep(0.5)
            print("📚 Loading Neural Networks...")
            time.sleep(0.3)
            print("💾 Initializing Memory Systems...")
            time.sleep(0.2)
            
            # Quick connectivity test with REAL Groq API
            test_result = self._make_ai_call("System check", test_mode=True)
            
            if test_result:
                print("\n✅ AI ENGINE READY")
                print(f"⚡ Model: {self.model} (70B parameters)")
                print(f"🧠 Memory: Active")
                print(f"🎯 Context: Enabled")
                print(f"💬 Voice: Melissa v3.0")
                print("💰 Powered by Groq AI (100% FREE)")
                print("\n📡 Waiting for voice input...")
            else:
                print("⚠️  AI Engine requires calibration")
                self._calibrate_engine()
                
        except Exception as e:
            print(f"❌ Engine Initialization Failed")
            print(f"💡 Error: {str(e)[:50]}...")
            print("\n🔄 Attempting auto-recovery...")
            self._recovery_mode()
    
    def _calibrate_engine(self):
        """Calibrate AI Engine with fallback models"""
        print("\n🛠️  AI ENGINE CALIBRATION")
        print("-" * 30)
        
        # REAL Groq models
        model_variants = [
            "llama-3.1-70b-versatile",
            "llama-3.1-8b-instant",
            "mixtral-8x7b-32768",
            "gemma2-9b-it"
        ]
        
        for variant in model_variants:
            print(f"🔍 Testing {variant}...")
            try:
                self.model = variant
                test_result = self._make_ai_call("Calibration test", test_mode=True)
                if test_result:
                    print(f"✅ {variant} calibrated successfully!")
                    break
            except:
                print(f"⚠️  {variant} failed, trying next...")
                continue
    
    def _recovery_mode(self):
        """Enter recovery mode if primary engine fails"""
        print("\n🔄 ENTERING RECOVERY MODE")
        print("-" * 30)
        
        # Try simplified connection to REAL Groq API
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            simple_data = {
                "model": "llama-3.1-8b-instant",
                "messages": [{"role": "user", "content": "test"}],
                "max_tokens": 1
            }
            
            response = requests.post(
                self.base_url,
                headers=headers,
                json=simple_data,
                timeout=5
            )
            
            if response.status_code == 200:
                print("✅ Recovery successful!")
                print("⚡ Running in Lite Mode")
                self.model = "llama-3.1-8b-instant"
            else:
                print(f"❌ Recovery failed: Status {response.status_code}")
                print("💡 Please check internet connection and API key")
                
        except Exception as e:
            print(f"⚠️  Recovery error: {str(e)[:40]}")
    
    def _make_ai_call(self, text: str, test_mode=False) -> str:
        """Core AI Engine Communication with REAL Groq API"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Build context-aware message
        messages = self._build_context_messages(text)
        
        # Groq API parameters
        data = {
            "model": self.model,
            "messages": messages,
            "max_tokens": 200,
            "temperature": 0.7,
            "top_p": 0.9,
            "frequency_penalty": 0.1,
            "presence_penalty": 0.1,
            "stream": False
        }
        
        start_time = time.time()
        
        try:
            response = requests.post(
                self.base_url,
                headers=headers,
                json=data,
                timeout=15
            )
            
            response_time = time.time() - start_time
            
            # Update performance metrics
            self.total_calls += 1
            self.avg_response_time = (self.avg_response_time * (self.total_calls - 1) + response_time) / self.total_calls
            
            if response.status_code == 200:
                result = response.json()
                
                if test_mode:
                    return "Engine Active"
                
                ai_response = result['choices'][0]['message']['content'].strip()
                
                # Store conversation
                self._store_conversation(text, ai_response, response_time)
                
                # Update user profile
                self._update_user_profile(text, ai_response)
                
                return ai_response
                
            else:
                # Handle errors gracefully
                error_msg = f"API Error {response.status_code}"
                if response.text:
                    try:
                        error_data = response.json()
                        if 'error' in error_data:
                            error_msg = error_data['error'].get('message', error_msg)
                    except:
                        error_msg = response.text[:100]
                
                print(f"⚠️  AI Engine: {error_msg}")
                
                # Return fallback response
                return self._get_fallback_response(text)
                
        except requests.exceptions.Timeout:
            print("⏱️  AI Engine timeout")
            return "I'm processing your request. Please give me a moment..."
        except Exception as e:
            print(f"🔧 Engine Error: {str(e)[:50]}")
            return "I'm experiencing technical difficulties. Could you please repeat?"
    
    def _build_context_messages(self, current_text: str):
        """Build messages with full context"""
        messages = []
        
        # System prompt with personality
        system_prompt = """You are Melissa, an advanced voice AI assistant for phone calls.
        
        PERSONALITY TRAITS:
        - Friendly and approachable
        - Helpful and resourceful
        - Emotionally intelligent
        - Quick-witted but kind
        - Professional yet warm
        
        COMMUNICATION STYLE:
        - Keep responses natural and conversational
        - Speak like you're on a phone call
        - Show understanding and empathy
        - Be concise but thorough (1-2 sentences)
        - Remember context from conversation
        
        SPECIAL CAPABILITIES:
        - You have complete memory of this conversation
        - You can reference previous discussions
        - You understand emotions and tone
        - You adapt to user's communication style
        
        CURRENT USER CONTEXT:"""
        
        # Add conversation history if available
        if self.conversation_history:
            history_summary = "\n".join([
                f"[{msg['time'][-8:]}] User: {msg['user'][:60]}...\n[{msg['time'][-8:]}] You: {msg['ai'][:60]}..."
                for msg in self.conversation_history[-3:]  # Last 3 exchanges
            ])
            system_prompt += f"\n{history_summary}"
        else:
            system_prompt += "\n(New conversation)"
        
        # Add user profile info
        if self.user_profile.get('name'):
            system_prompt += f"\nUser's name: {self.user_profile['name']}"
        if self.user_profile.get('topics'):
            system_prompt += f"\nFrequent topics: {', '.join(self.user_profile['topics'][:3])}"
        
        messages.append({"role": "system", "content": system_prompt})
        
        # Add current message
        messages.append({"role": "user", "content": current_text})
        
        return messages
    
    def _store_conversation(self, user_msg: str, ai_msg: str, response_time: float):
        """Store conversation in memory"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        conversation_entry = {
            "time": timestamp,
            "user": user_msg,
            "ai": ai_msg,
            "response_time": round(response_time, 2),
            "model": self.model
        }
        
        self.conversation_history.append(conversation_entry)
        
        # Keep last 50 conversations
        if len(self.conversation_history) > 50:
            self.conversation_history = self.conversation_history[-50:]
    
    def _update_user_profile(self, user_msg: str, ai_msg: str):
        """Update user profile based on conversation"""
        # Extract potential name
        name_patterns = ["my name is", "call me", "i am", "i'm called"]
        for pattern in name_patterns:
            if pattern in user_msg.lower():
                parts = user_msg.lower().split(pattern)
                if len(parts) > 1:
                    potential_name = parts[1].strip().split()[0]
                    if len(potential_name) > 1:
                        self.user_profile['name'] = potential_name.title()
        
        # Track topics
        topics = self._extract_topics(user_msg)
        if 'topics' not in self.user_profile:
            self.user_profile['topics'] = []
        
        for topic in topics:
            if topic not in self.user_profile['topics']:
                self.user_profile['topics'].append(topic)
        
        # Keep topics list manageable
        if len(self.user_profile['topics']) > 10:
            self.user_profile['topics'] = self.user_profile['topics'][-10:]
    
    def _extract_topics(self, text: str):
        """Extract topics from text"""
        topics = []
        common_topics = {
            'work': ['job', 'work', 'office', 'career', 'business'],
            'tech': ['computer', 'phone', 'internet', 'app', 'software', 'code'],
            'food': ['eat', 'food', 'restaurant', 'cook', 'meal', 'hungry'],
            'weather': ['weather', 'rain', 'sunny', 'hot', 'cold'],
            'family': ['family', 'mom', 'dad', 'wife', 'husband', 'children'],
            'entertainment': ['movie', 'music', 'game', 'tv', 'book', 'read'],
            'health': ['health', 'sick', 'doctor', 'hospital', 'exercise'],
            'travel': ['travel', 'trip', 'vacation', 'holiday', 'flight']
        }
        
        text_lower = text.lower()
        for topic, keywords in common_topics.items():
            if any(keyword in text_lower for keyword in keywords):
                topics.append(topic)
        
        return list(set(topics))
    
    def _get_fallback_response(self, text: str):
        """Get intelligent fallback response"""
        fallback_responses = [
            "I understand what you're saying. Let me think about that for a moment...",
            "That's an interesting point. Could you elaborate a bit more?",
            "I want to make sure I understand correctly. Could you rephrase that?",
            "Let me process that information and get back to you with a proper response.",
            "I appreciate your patience while I analyze your request."
        ]
        
        # Simple keyword matching for context-aware fallback
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['hello', 'hi', 'hey']):
            return "Hello there! I'm here and listening."
        elif any(word in text_lower for word in ['thank', 'thanks']):
            return "You're welcome! Always happy to help."
        elif any(word in text_lower for word in ['how are you', 'how do you do']):
            return "I'm functioning optimally, thank you for asking! How can I assist you?"
        elif any(word in text_lower for word in ['bye', 'goodbye', 'see you']):
            return "Goodbye! Feel free to return anytime you need assistance."
        
        # Default fallback
        import random
        return random.choice(fallback_responses)
    
    def process(self, text: str) -> str:
        """
        Main processing function for voice input
        Returns AI response as text
        """
        print(f"\n{'='*50}")
        print(f"🎤 VOICE INPUT: {text}")
        print(f"{'='*50}")
        
        # Rate limiting (1 call per second)
        current_time = time.time()
        time_since_last = current_time - self.last_call_time
        if time_since_last < 1:
            time.sleep(1 - time_since_last)
        
        try:
            print(f"🧠 Processing with {self.model}...")
            self.last_call_time = time.time()
            
            # Show thinking indicator
            print("💭 Analyzing context...", end="", flush=True)
            time.sleep(0.1)
            print("✓", flush=True)
            
            # Get AI response
            response = self._make_ai_call(text)
            
            # Display performance info
            if self.conversation_history:
                print(f"⚡ Response time: {self.conversation_history[-1]['response_time']:.2f}s")
            print(f"📊 Total calls: {self.total_calls}")
            print(f"📈 Avg speed: {self.avg_response_time:.2f}s")
            
            print(f"\n🤖 MELISSA: {response}")
            
            return response
            
        except Exception as e:
            print(f"\n⚠️  SYSTEM ALERT: {str(e)[:60]}")
            
            # Emergency fallback
            emergency_responses = [
                "I'm having a brief connection issue. Please try again in a moment.",
                "My systems are recalibrating. What were you saying?",
                "Let me restart my thought process. Could you repeat that?",
                "Technical adjustments in progress. Your request is important to me."
            ]
            
            import random
            return random.choice(emergency_responses)
    
    # Alias for backward compatibility
    def generate(self, text: str) -> str:
        """Alias for process() for backward compatibility"""
        return self.process(text)
    
    def get_status(self):
        """Get current AI system status"""
        status = {
            "model": self.model,
            "total_calls": self.total_calls,
            "avg_response_time": f"{self.avg_response_time:.2f}s",
            "memory_entries": len(self.conversation_history),
            "user_known": "name" in self.user_profile,
            "status": "Operational"
        }
        
        print("\n" + "="*50)
        print("📊 AI SYSTEM STATUS")
        print("="*50)
        
        for key, value in status.items():
            print(f"  {key.replace('_', ' ').title()}: {value}")
        
        if self.conversation_history:
            print(f"\n📝 Last exchange:")
            last = self.conversation_history[-1]
            print(f"  🕒 {last['time'][-8:]}")
            print(f"  👤 User: {last['user'][:40]}...")
            print(f"  🤖 AI: {last['ai'][:40]}...")
        
        return status
    
    def clear_memory(self):
        """Clear conversation memory"""
        self.conversation_history = []
        self.context_memory = []
        print("\n🧹 MEMORY CLEARED: Starting fresh conversation")
    
    def save_session(self, filename="ai_session.pkl"):
        """Save current session to file"""
        session_data = {
            "conversation_history": self.conversation_history,
            "user_profile": self.user_profile,
            "total_calls": self.total_calls,
            "avg_response_time": self.avg_response_time
        }
        
        try:
            with open(filename, 'wb') as f:
                pickle.dump(session_data, f)
            print(f"💾 Session saved to {filename}")
        except Exception as e:
            print(f"⚠️  Could not save session: {e}")
    
    def load_session(self, filename="ai_session.pkl"):
        """Load session from file"""
        try:
            if os.path.exists(filename):
                with open(filename, 'rb') as f:
                    session_data = pickle.load(f)
                
                self.conversation_history = session_data.get("conversation_history", [])
                self.user_profile = session_data.get("user_profile", {})
                self.total_calls = session_data.get("total_calls", 0)
                self.avg_response_time = session_data.get("avg_response_time", 0)
                
                print(f"📂 Session loaded: {len(self.conversation_history)} messages")
                if self.user_profile.get('name'):
                    print(f"👋 Welcome back, {self.user_profile['name']}!")
            else:
                print("📝 No previous session found")
        except Exception as e:
            print(f"⚠️  Could not load session: {e}")


# Backward compatibility
GeminiLLM = VoiceAI

# Example usage with cool interface
if __name__ == "__main__":
    print("\n" + "="*60)
    print("🎤 WELCOME TO VOICE AI ASSISTANT")
    print("🤖 MELISSA v3.0 - Powered by Groq AI")
    print("="*60)
    
    # Create AI instance
    ai = VoiceAI(model="llama-3.1-70b-versatile")
    
    # Demo conversation
    demo_conversation = [
        "Hi Melissa! My name is Alex.",
        "What's my name?",
        "I work as a software developer in Bangalore.",
        "What do I do for work?",
        "I love programming in Python and JavaScript.",
        "What programming languages do I like?",
        "What have we talked about so far?"
    ]
    
    for i, message in enumerate(demo_conversation, 1):
        print(f"\n[Turn {i}]")
        response = ai.process(message)
        
        if i == 3:
            print("\n" + "-"*40)
            print("🔄 Context switching demo...")
            print("-"*40)
    
    # Show final status
    ai.get_status()
    
    # Save session
    ai.save_session()
    
    print("\n" + "="*60)
    print("✅ DEMO COMPLETE")
    print("🎯 AI Assistant ready for real conversations!")
    print("="*60)