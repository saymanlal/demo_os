from django.db import models
from django.utils import timezone
from datetime import timedelta
import uuid


class PhoneOTP(models.Model):
    """OTP verification for user authentication"""
    
    phone = models.CharField(max_length=15, db_index=True)
    otp_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.PositiveIntegerField(default=0)

    def is_expired(self):
        """Check if OTP is older than 5 minutes"""
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"OTP for {self.phone}"


class Complaint(models.Model):
    """
    Complaint model with verified consumer information
    ✅ UPDATED: Added meter_no, consumer_name, area_code for verification
    """
    
    STATUS_CHOICES = [
        ("REGISTERED", "Registered"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED", "Resolved"),
    ]

    # ═══════════════════════════════════════════════════════
    # CORE FIELDS (Existing)
    # ═══════════════════════════════════════════════════════
    complaint_id = models.CharField(
        max_length=20,
        unique=True,
        editable=False,
        null=True,
        blank=True
    )

    caller_number = models.CharField(
        max_length=20,
        null=True,
        blank=True
    )

    call_sid = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        db_index=True
    )

    category = models.CharField(max_length=100)
    description = models.TextField()

    location = models.CharField(
        max_length=255,
        null=True,
        blank=True
    )

    # ═══════════════════════════════════════════════════════
    # PHASE 3 FIELDS (Existing)
    # ═══════════════════════════════════════════════════════
    complaint_json = models.JSONField(null=True, blank=True)
    language = models.CharField(max_length=10, default="hi-IN")
    confirmed = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="REGISTERED"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # ═══════════════════════════════════════════════════════
    # 🆕 VERIFICATION FIELDS (NEW - For Meter + Name Flow)
    # ═══════════════════════════════════════════════════════
    meter_no = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        db_index=True,
        help_text="Verified meter/consumer ID"
    )

    consumer_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Verified consumer name from registry"
    )

    area_code = models.CharField(
        max_length=10,
        null=True,
        blank=True,
        db_index=True,
        help_text="Area code (e.g., MM001, GJ001)"
    )

    area_name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text="Area name (e.g., Madan Mahal)"
    )

    verified = models.BooleanField(
        default=False,
        help_text="True if both meter and name were verified"
    )

    # ═══════════════════════════════════════════════════════
    # METHODS
    # ═══════════════════════════════════════════════════════
    def save(self, *args, **kwargs):
        """Auto-generate complaint_id if not present"""
        if not self.complaint_id:
            self.complaint_id = f"MPV-{uuid.uuid4().hex[:7].upper()}"
        
        # Auto-set verified flag if meter and consumer name exist
        if self.meter_no and self.consumer_name:
            self.verified = True
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.complaint_id or "Complaint"

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['meter_no', 'area_code']),
            models.Index(fields=['verified', 'status']),
        ]