from django.db import models
from django.utils import timezone
from datetime import timedelta


class PhoneOTP(models.Model):
    phone = models.CharField(max_length=15, db_index=True)
    otp_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.PositiveIntegerField(default=0)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"OTP for {self.phone}"
    
from django.db import models
import uuid


class Complaint(models.Model):
    STATUS_CHOICES = [
        ("REGISTERED", "Registered"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED", "Resolved"),
    ]

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

    # 🔥 PHASE 3 ADDITIONS
    complaint_json = models.JSONField(null=True, blank=True)
    language = models.CharField(max_length=10, default="hi-IN")
    confirmed = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="REGISTERED"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.complaint_id:
            self.complaint_id = f"MPV-{uuid.uuid4().hex[:7].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.complaint_id or "Complaint"
