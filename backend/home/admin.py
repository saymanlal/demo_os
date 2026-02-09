from django.contrib import admin
from home.models import Complaint


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = (
        "complaint_id",
        "caller_number",
        "category",
        "location",
        "status",
        "created_at",
    )
    search_fields = ("complaint_id", "caller_number")
    list_filter = ("status", "created_at")


"""
Add this to your backend/home/admin.py file
This will give you a nice interface to view CallLogs in Django admin
"""

from django.contrib import admin
from home.models import CallLog


@admin.register(CallLog)
class CallLogAdmin(admin.ModelAdmin):
    """
    Django Admin interface for CallLog
    """
    list_display = [
        'call_sid_short',
        'phone_number', 
        'call_type', 
        'status', 
        'duration_formatted', 
        'created_at',
        'consumer_link',
        'complaint_link'
    ]
    
    list_filter = [
        'call_type', 
        'status', 
        'created_at'
    ]
    
    search_fields = [
        'call_sid', 
        'phone_number', 
        'from_number', 
        'to_number'
    ]
    
    readonly_fields = [
        'call_sid', 
        'created_at', 
        'updated_at',
        'duration_formatted'
    ]
    
    date_hierarchy = 'created_at'
    
    ordering = ['-created_at']
    
    fieldsets = (
        ('Call Information', {
            'fields': (
                'call_sid',
                'phone_number',
                'call_type',
                'status',
            )
        }),
        ('Duration & Recording', {
            'fields': (
                'duration',
                'duration_formatted',
                'recording_url',
            )
        }),
        ('Linked Records', {
            'fields': (
                'consumer',
                'complaint',
            )
        }),
        ('Twilio Metadata', {
            'fields': (
                'from_number',
                'to_number',
                'error_message',
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': (
                'created_at',
                'updated_at',
            ),
            'classes': ('collapse',)
        }),
    )
    
    def call_sid_short(self, obj):
        """Show shortened call SID"""
        return f"{obj.call_sid[:15]}..." if len(obj.call_sid) > 15 else obj.call_sid
    call_sid_short.short_description = "Call SID"
    
    def consumer_link(self, obj):
        """Show linked consumer"""
        if obj.consumer:
            return f"{obj.consumer.phone_number}"
        return "-"
    consumer_link.short_description = "Consumer"
    
    def complaint_link(self, obj):
        """Show linked complaint"""
        if obj.complaint:
            return f"#{obj.complaint.id}"
        return "-"
    complaint_link.short_description = "Complaint"