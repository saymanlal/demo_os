import time
from asgiref.sync import sync_to_async
from home.models import Complaint
from home.services.complaint_states import ComplaintState
from asgiref.sync import sync_to_async
import logging
import re

logger = logging.getLogger(__name__)

# Enhanced word lists with more variations
YES_WORDS = [
    "haan", "han", "ha", "haa", "huh", "huhh", "hmm", "hnn", "hn", 
    "yes", "yeah", "हाँ", "हा", "हां", "हूँ", "हुह"
]
NO_WORDS = [
    "nahi", "nahin", "na", "nah", "nhi", "ni", "no",
    "नहीं", "नही", "नह", "ना"
]

NEW_WORDS = [
    "nayi", "nai", "naya", "new", "नई", "नया", "नयी", "नए"
]
OLD_WORDS = [
    "purani", "purana", "old", "existing", "पुरानी", "पुराना"
]


class ComplaintSession:
    def __init__(self, caller_number):
        self.caller_number = caller_number
        self.state = ComplaintState.ASK_INTENT
        self.data = {}
        self.current_complaint = None


    def _clean(self, text: str) -> str:
        """Clean and normalize input text"""
        return text.lower().strip()


    def _contains_any(self, text: str, word_list: list) -> bool:
        """Check if text contains any word from the list (flexible matching)"""
        text_clean = text.replace(" ", "").lower()
        text_lower = text.lower()
        
        for word in word_list:
            word_clean = word.replace(" ", "").lower()
            word_lower = word.lower()
            
            # Check exact match, no-space match, and partial match
            if (word_lower in text_lower or 
                word_clean in text_clean or
                word_lower == text_lower or
                word_clean == text_clean):
                return True
            
            # For very short words (like "na", "ha"), require exact match
            if len(word) <= 2:
                if word_lower == text_lower or word_clean == text_clean:
                    return True
            else:
                # For longer words, allow partial matches
                if word_clean in text_clean:
                    return True
        
        return False


    def _normalize_spoken_complaint_id(self, text: str) -> str:
        """
        Normalize spoken complaint ID to match database format.
        Handles Hindi-English mixed speech from Azure STT.
        
        Examples:
        'MP V फाइव A सिक्स CC BA' -> 'MPV-5A6CCBA'
        'एम पी वी फाइव ए सिक्स सी सी बी ए' -> 'MPV-5A6CCBA'
        'mpv 5636 ca 9' -> 'MPV-5636CA9'
        """
        # Hindi number words to digits
        hindi_numbers = {
            'फाइव': '5', 'सिक्स': '6', 'सेवन': '7', 'एट': '8', 'नाइन': '9',
            'वन': '1', 'टू': '2', 'थ्री': '3', 'फोर': '4', 'जीरो': '0',
            'डबल': '', 'ट्रिपल': '',
            # English spoken numbers
            'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
            'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
        }
        
        # Convert to uppercase and remove spaces
        text_upper = text.upper()
        
        # Replace Hindi number words with digits
        for hindi, digit in hindi_numbers.items():
            text_upper = text_upper.replace(hindi.upper(), digit)
        
        # Remove all spaces and special characters except alphanumeric and hyphen
        text_clean = re.sub(r'[^A-Z0-9-]', '', text_upper)
        
        # If it already starts with MPV- format, return as is
        if text_clean.startswith('MPV-'):
            return text_clean
        
        # If it starts with MPV but no hyphen, add it after MPV
        if text_clean.startswith('MPV'):
            # Extract prefix (MPV), then rest
            rest = text_clean[3:]
            if rest:
                return f'MPV-{rest}'
        
        # If doesn't start with MPV, try to construct it
        # Remove any existing hyphens first
        text_clean = text_clean.replace('-', '')
        
        # Extract all parts
        parts = re.findall(r'[A-Z0-9]+', text_clean)
        if parts:
            # Reconstruct as MPV-XXXXX
            joined = ''.join(parts)
            if joined.startswith('MPV'):
                return f'MPV-{joined[3:]}'
            else:
                return f'MPV-{joined}'
        
        return text_clean


    def _find_complaint_fuzzy(self, spoken_id: str):
        """
        Find complaint using fuzzy matching to handle STT variations.
        Tries multiple strategies to match the spoken ID.
        """
        # Normalize the spoken input
        normalized_input = self._normalize_spoken_complaint_id(spoken_id)
        logger.info(f"🔍 Normalized complaint ID: '{normalized_input}' from spoken: '{spoken_id}'")
        
        # Strategy 1: Exact match
        try:
            complaint = Complaint.objects.get(complaint_id=normalized_input)
            logger.info(f"✅ Found exact match: {complaint.complaint_id}")
            return complaint
        except Complaint.DoesNotExist:
            pass
        
        # Strategy 2: Case-insensitive match
        try:
            complaint = Complaint.objects.get(complaint_id__iexact=normalized_input)
            logger.info(f"✅ Found case-insensitive match: {complaint.complaint_id}")
            return complaint
        except Complaint.DoesNotExist:
            pass
        
        # Strategy 3: Match without hyphens
        normalized_no_hyphen = normalized_input.replace('-', '')
        try:
            # Find all complaints and compare without hyphens
            all_complaints = Complaint.objects.filter(
                caller_number=self.caller_number
            ).order_by('-created_at')
            
            for complaint in all_complaints:
                db_id_no_hyphen = complaint.complaint_id.replace('-', '')
                if db_id_no_hyphen.upper() == normalized_no_hyphen.upper():
                    logger.info(f"✅ Found match without hyphen: {complaint.complaint_id}")
                    return complaint
        except Exception as e:
            logger.error(f"Error in hyphen-less matching: {e}")
        
        # Strategy 4: Partial match (if normalized input is contained in DB ID)
        try:
            all_complaints = Complaint.objects.filter(
                caller_number=self.caller_number
            ).order_by('-created_at')
            
            for complaint in all_complaints:
                db_id_clean = complaint.complaint_id.replace('-', '').upper()
                normalized_clean = normalized_no_hyphen.upper()
                
                # If the normalized input is a substring of the DB ID
                if normalized_clean in db_id_clean or db_id_clean in normalized_clean:
                    # Check if it's at least 60% similar
                    similarity = len(set(normalized_clean) & set(db_id_clean)) / max(len(normalized_clean), len(db_id_clean))
                    if similarity > 0.6:
                        logger.info(f"✅ Found partial match: {complaint.complaint_id} (similarity: {similarity:.2f})")
                        return complaint
        except Exception as e:
            logger.error(f"Error in partial matching: {e}")
        
        # Strategy 5: Last resort - get the most recent complaint for this caller
        try:
            recent_complaint = Complaint.objects.filter(
                caller_number=self.caller_number
            ).order_by('-created_at').first()
            
            if recent_complaint:
                logger.warning(f"⚠️ No exact match found. Suggesting most recent: {recent_complaint.complaint_id}")
                # Don't auto-return this - let the flow handle it
        except Exception as e:
            logger.error(f"Error fetching recent complaint: {e}")
        
        return None


    def _extract_complaint_number(self, text: str) -> str:
        """
        Extract and normalize complaint number from text.
        This is now a wrapper around _normalize_spoken_complaint_id.
        """
        return self._normalize_spoken_complaint_id(text)


    async def handle_input_async(self, text):
        return await sync_to_async(self.handle_input)(text)


    def handle_input(self, text):
        text = self._clean(text)
        text_nospace = text.replace(" ", "")

        logger.info(f"STATE={self.state.name} INPUT='{text}'")

        # ---------------- ASK INTENT ----------------
        if self.state == ComplaintState.ASK_INTENT:
            self.state = ComplaintState.ASK_TYPE
            return ("Nayi complaint hai ya purani complaint?", False)


        # ---------------- ASK TYPE ----------------
        if self.state == ComplaintState.ASK_TYPE:
            # Check for NEW complaint indicators
            has_new = self._contains_any(text, NEW_WORDS)
            has_old = self._contains_any(text, OLD_WORDS)
            
            logger.info(f"🔍 Intent detection: has_new={has_new}, has_old={has_old}")
            
            # If user says "purani" (old), go to existing complaint flow
            if has_old and not has_new:
                self.state = ComplaintState.ASK_EXISTING_ID
                return ("Apna complaint number batayein.", False)
            
            # If user says "nayi" (new), go to new complaint flow
            if has_new and not has_old:
                self.state = ComplaintState.ASK_DESCRIPTION
                return ("Apni samasya batayein.", False)
            
            # If both detected or neither detected, ask for clarification
            return ("Kripya sirf 'nayi' ya 'purani' boliye.", False)


        # ---------------- NEW COMPLAINT ----------------
        if self.state == ComplaintState.ASK_DESCRIPTION:
            if len(text) < 3:  # Too short to be a valid description
                return ("Kripya apni samasya detail mein batayein.", False)
            
            self.data["description"] = text
            self.state = ComplaintState.ASK_LOCATION
            return ("Jagah ya area ka naam batayein.", False)


        if self.state == ComplaintState.ASK_LOCATION:
            if len(text) < 2:  # Too short to be a valid location
                return ("Kripya location dobara batayein.", False)
            
            self.data["location"] = text
            self.state = ComplaintState.CONFIRM_NEW
            return (
                f"Samasya: {self.data['description']}. "
                f"Jagah: {self.data['location']}. "
                "Kya main complaint darj kar doon? Haan ya nahi?",
                False
            )


        if self.state == ComplaintState.CONFIRM_NEW:
            if self._contains_any(text, YES_WORDS):
                try:
                    c = Complaint.objects.create(
                        caller_number=self.caller_number,
                        category="Electricity",
                        description=self.data["description"],
                        location=self.data["location"],
                        status="PENDING"
                    )

                    self.current_complaint = c
                    self.data = {}
                    self.state = ComplaintState.ASK_MORE_PROBLEMS

                    # Say the ID letter by letter for better recognition
                    return (
                        f"Complaint darj ho gayi hai. "
                        f"Aapka complaint number {c.complaint_id} hai. "
                        "Kya aapko koi aur samasya hai?",
                        False
                    )
                except Exception as e:
                    logger.error(f"Error creating complaint: {e}")
                    return ("Complaint darj karne mein samasya aayi. Kripya dobara koshish karein.", False)

            if self._contains_any(text, NO_WORDS):
                self.state = ComplaintState.ASK_DESCRIPTION
                return ("Theek hai, apni samasya dobara batayein.", False)
            
            return ("Kripya 'haan' ya 'nahi' boliye.", False)


        # ---------------- EXISTING COMPLAINT ----------------
        if self.state == ComplaintState.ASK_EXISTING_ID:
            # Use fuzzy matching to find complaint
            complaint = self._find_complaint_fuzzy(text)
            
            if complaint:
                self.current_complaint = complaint
                self.state = ComplaintState.ASK_CLOSE

                # Natural, conversational response with full details
                status_hindi = "pending" if complaint.status == "PENDING" else "closed" if complaint.status == "CLOSED" else complaint.status.lower()
                
                return (
                    f"Ji haan, aapki complaint number {complaint.complaint_id} mil gayi. "
                    f"Yeh complaint {complaint.location} area ki hai. "
                    f"Samasya thi: {complaint.description}. "
                    f"Is waqt complaint ka status {status_hindi} hai. "
                    f"Kya aap ise band karna chahte hain? Haan ya nahi boliye.",
                    False
                )
            else:
                # Give user a hint about their recent complaints
                try:
                    recent = Complaint.objects.filter(
                        caller_number=self.caller_number
                    ).order_by('-created_at').first()
                    
                    if recent:
                        return (
                            f"Complaint number nahi mila. "
                            f"Kya aap {recent.complaint_id} ke baare mein pooch rahe hain? "
                            "Agar haan, toh 'haan' boliye, nahi toh complaint number dobara batayein.",
                            False
                        )
                except:
                    pass
                
                return (
                    "Complaint number nahi mila. "
                    "Kripya dobara dhyan se complaint number boliye.",
                    False
                )


        if self.state == ComplaintState.ASK_CLOSE:
            if self._contains_any(text, YES_WORDS):
                try:
                    self.current_complaint.status = "CLOSED"
                    self.current_complaint.save()
                    message = "Theek hai. Aapki complaint band kar di gayi hai. "
                except Exception as e:
                    logger.error(f"Error closing complaint: {e}")
                    message = "Complaint band karne mein samasya aayi, lekin aage badh rahe hain. "
            else:
                message = "Theek hai, complaint khuli rahegi. "

            self.state = ComplaintState.ASK_MORE_PROBLEMS
            return (message + "Kya aapko koi aur samasya hai?", False)


        # ---------------- MORE PROBLEMS ----------------
        if self.state == ComplaintState.ASK_MORE_PROBLEMS:
            if self._contains_any(text, YES_WORDS):
                self.state = ComplaintState.ASK_TYPE
                return ("Theek hai. Nayi complaint hai ya purani complaint?", False)

            if self._contains_any(text, NO_WORDS):
                self.state = ComplaintState.DONE
                return ("Dhanyavaad. Humse sampark karne ke liye bahut bahut shukriya. Aapka din shubh rahe.", True)
            
            return ("Kripya 'haan' ya 'nahi' boliye.", False)


        # Fallback
        return ("Dhanyavaad. Aapka din shubh ho.", True)