from django.db import models
from django.utils import timezone
from datetime import timedelta
import uuid


# ==========================================================
# OTP MODEL
# ==========================================================
class PhoneOTP(models.Model):
    """OTP verification for user authentication"""

    phone = models.CharField(max_length=15, db_index=True)
    otp_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    attempts = models.PositiveIntegerField(default=0)

    def is_expired(self):
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"OTP for {self.phone}"


# ==========================================================
# COMPLAINT MODEL
# ==========================================================
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

    caller_number = models.CharField(max_length=20, null=True, blank=True)

    call_sid = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        db_index=True
    )

    category = models.CharField(max_length=100)
    description = models.TextField()

    location = models.CharField(max_length=255, null=True, blank=True)

    complaint_json = models.JSONField(null=True, blank=True)
    language = models.CharField(max_length=10, default="hi-IN")
    confirmed = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="REGISTERED"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    meter_no = models.CharField(max_length=20, null=True, blank=True, db_index=True)
    consumer_name = models.CharField(max_length=100, null=True, blank=True)
    area_code = models.CharField(max_length=10, null=True, blank=True, db_index=True)
    area_name = models.CharField(max_length=100, null=True, blank=True)

    verified = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.complaint_id:
            self.complaint_id = f"MPV-{uuid.uuid4().hex[:7].upper()}"

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


# ==========================================================
# CALL LOG MODEL (FINAL CLEAN VERSION)
# ==========================================================
class CallLog(models.Model):

    CALL_TYPE_CHOICES = [
        ('inbound', 'Inbound'),
        ('outbound', 'Outbound'),
    ]

    STATUS_CHOICES = [
        ('completed', 'Completed'),
        ('busy', 'Busy'),
        ('failed', 'Failed'),
        ('no-answer', 'No Answer'),
        ('cancelled', 'Cancelled'),
        ('in-progress', 'In Progress'),
    ]

    call_sid = models.CharField(
        max_length=255,
        unique=True,
        db_index=True
    )

    phone_number = models.CharField(
        max_length=20,
        db_index=True
    )

    call_type = models.CharField(
        max_length=10,
        choices=CALL_TYPE_CHOICES,
        db_index=True
    )

    duration = models.IntegerField(default=0)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='in-progress',
        db_index=True
    )

    recording_url = models.URLField(
        max_length=500,
        blank=True,
        null=True
    )

    # ✅ Only Complaint FK (Consumer removed completely)
    complaint = models.ForeignKey(
        Complaint,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='call_logs'
    )

    from_number = models.CharField(max_length=20, blank=True)
    to_number = models.CharField(max_length=20, blank=True)

    error_message = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['call_type', 'status']),
            models.Index(fields=['phone_number', '-created_at']),
        ]

    def __str__(self):
        return f"{self.call_type} - {self.phone_number} - {self.status}"

    @property
    def duration_formatted(self):
        minutes = self.duration // 60
        seconds = self.duration % 60
        return f"{minutes:02d}:{seconds:02d}"
