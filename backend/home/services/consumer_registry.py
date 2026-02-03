import json
import os
from typing import Optional, Dict


class ConsumerRegistry:
    """
    Handles area and consumer verification from JSON master data
    """

    def __init__(self):
        self.data = None
        self._load_data()

    def _load_data(self):
        """Load consumer registry from JSON file"""
        json_path = os.path.join(
            os.path.dirname(__file__),
            "../data/area_consumers.json"
        )
        
        try:
            with open(json_path, 'r', encoding='utf-8') as f:
                self.data = json.load(f)
            print(f"✅ Consumer registry loaded: {len(self.data['areas'])} areas")
        except Exception as e:
            print(f"❌ Failed to load consumer registry: {e}")
            self.data = {"areas": []}

    def get_area_by_ivr(self, ivr_number: str) -> Optional[Dict]:
        """Find area by IVR phone number"""
        for area in self.data.get("areas", []):
            if area.get("ivr_number") == ivr_number:
                return area
        return None

    def verify_meter(
        self,
        meter_no: str,
        ivr_number: str
    ) -> Optional[Dict]:
        """
        Verify meter belongs to the IVR area and return consumer details
        
        Returns:
            Consumer dict if valid, None otherwise
        """
        meter_no = meter_no.strip().upper()
        
        # Find area by IVR number
        area = self.get_area_by_ivr(ivr_number)
        if not area:
            print(f"⚠️ No area found for IVR: {ivr_number}")
            return None

        # Search for meter in area's consumers
        for consumer in area.get("consumers", []):
            if consumer.get("meter_no", "").upper() == meter_no:
                print(f"✅ Meter verified: {meter_no} → {consumer['consumer_name']}")
                return {
                    **consumer,
                    "area_code": area["area_code"],
                    "area_name": area["area_name"]
                }

        print(f"❌ Meter not found in area: {meter_no}")
        return None


# Global singleton instance
consumer_registry = ConsumerRegistry()