from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from home.models import Complaint, CallLog


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


@admin.register(CallLog)
class CallLogAdmin(admin.ModelAdmin):
    """
    Django Admin interface for CallLog with Audio Recording Playback
    """
    list_display = [
        'call_sid_short',
        'phone_number', 
        'call_type', 
        'status_badge', 
        'duration_formatted', 
        'play_recording',
        'created_at',
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
        'to_number',
        'recording_sid'
    ]
    
    readonly_fields = [
        'call_sid', 
        'created_at', 
        'updated_at',
        'duration_formatted',
        'recording_duration_formatted',
        'audio_player',
        'download_recording'
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
        ('Duration & Times', {
            'fields': (
                'duration',
                'duration_formatted',
                'created_at',
                'updated_at',
            )
        }),
        ('🎙️ Recording', {
            'fields': (
                'recording_sid',
                'recording_url',
                'recording_duration',
                'recording_duration_formatted',
                'audio_player',
                'download_recording',
            ),
            'classes': ('wide',)
        }),
        ('Linked Records', {
            'fields': (
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
    )
    
    # ========================================
    # CUSTOM DISPLAY METHODS
    # ========================================
    
    def call_sid_short(self, obj):
        """Show shortened call SID"""
        return f"{obj.call_sid[:20]}..." if len(obj.call_sid) > 20 else obj.call_sid
    call_sid_short.short_description = "Call SID"
    
    def status_badge(self, obj):
        """Display call status with color coding"""
        colors = {
            'completed': '#28a745',
            'in-progress': '#007bff',
            'busy': '#ffc107',
            'failed': '#dc3545',
            'no-answer': '#6c757d',
            'cancelled': '#6c757d',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold; font-size: 11px;">{}</span>',
            color,
            obj.status.upper()
        )
    status_badge.short_description = 'Status'
    
    def complaint_link(self, obj):
        """Show linked complaint with clickable link"""
        if obj.complaint:
            url = reverse('admin:home_complaint_change', args=[obj.complaint.id])
            return format_html(
                '<a href="{}" style="color: #007bff; font-weight: bold;">{}</a>',
                url,
                obj.complaint.complaint_id
            )
        return format_html('<span style="color: #999;">-</span>')
    complaint_link.short_description = "Complaint"
    
    # ========================================
    # 🎙️ AUDIO PLAYER METHODS
    # ========================================
    
    def play_recording(self, obj):
        """Inline compact audio player for list view"""
        if obj.recording_url:
            mp3_url = obj.recording_url + '.mp3'
            return format_html(
                '<audio controls preload="none" style="height: 30px; max-width: 250px;">'
                '<source src="{}" type="audio/mpeg">'
                'Your browser does not support audio.'
                '</audio>',
                mp3_url
            )
        return format_html(
            '<span style="color: #999; font-style: italic;">No recording</span>'
        )
    play_recording.short_description = '🎙️ Recording'
    
    def audio_player(self, obj):
        """Full-featured audio player in detail view"""
        if obj.recording_url:
            mp3_url = obj.recording_url + '.mp3'
            return format_html(
                '<div style="margin: 15px 0; padding: 20px; background: #f8f9fa; '
                'border-radius: 8px; border: 1px solid #dee2e6;">'
                '<h3 style="margin-top: 0; color: #495057;">🎙️ Call Recording</h3>'
                '<audio controls style="width: 100%; max-width: 600px; margin: 15px 0;">'
                '<source src="{}" type="audio/mpeg">'
                'Your browser does not support the audio element.'
                '</audio>'
                '<div style="margin-top: 15px; font-size: 13px; color: #6c757d;">'
                '<strong>Recording SID:</strong> {}<br>'
                '<strong>Duration:</strong> {} seconds ({})'
                '</div>'
                '</div>',
                mp3_url,
                obj.recording_sid or 'N/A',
                obj.recording_duration,
                obj.recording_duration_formatted
            )
        return format_html(
            '<div style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; '
            'border-radius: 8px; color: #856404;">'
            '<strong>⚠️ No recording available</strong><br>'
            '<small>This call was not recorded or the recording is not yet available.</small>'
            '</div>'
        )
    audio_player.short_description = 'Audio Player'
    
    def download_recording(self, obj):
        """Download button for the recording"""
        if obj.recording_url:
            mp3_url = obj.recording_url + '.mp3'
            return format_html(
                '<a href="{}" target="_blank" download style="'
                'display: inline-block; padding: 10px 20px; background: #007bff; '
                'color: white; text-decoration: none; border-radius: 5px; '
                'font-weight: bold; font-size: 14px;">'
                '⬇ Download MP3 Recording'
                '</a>',
                mp3_url
            )
        return format_html('<span style="color: #999;">-</span>')
    download_recording.short_description = 'Download'
    
    # ========================================
    # ADMIN ACTIONS
    # ========================================
    
    actions = ['export_selected_calls']
    
    def export_selected_calls(self, request, queryset):
        """Export selected calls (you can enhance this)"""
        count = queryset.count()
        self.message_user(
            request,
            f'{count} call(s) selected for export.'
        )
    export_selected_calls.short_description = "Export selected calls"


# ========================================
# OPTIONAL: Inline CallLogs in Complaint Admin
# ========================================
class CallLogInline(admin.TabularInline):
    """Show call logs inside Complaint detail page"""
    model = CallLog
    extra = 0
    readonly_fields = [
        'call_sid_short',
        'call_type',
        'status_badge',
        'duration_formatted',
        'play_recording_inline',
        'created_at'
    ]
    fields = [
        'call_sid_short',
        'call_type',
        'status_badge',
        'duration_formatted',
        'play_recording_inline',
        'created_at'
    ]
    can_delete = False
    show_change_link = True
    
    def call_sid_short(self, obj):
        return obj.call_sid[:15] + '...' if len(obj.call_sid) > 15 else obj.call_sid
    call_sid_short.short_description = 'Call SID'
    
    def status_badge(self, obj):
        colors = {
            'completed': '#28a745',
            'in-progress': '#007bff',
            'failed': '#dc3545',
        }
        color = colors.get(obj.status, '#6c757d')
        return format_html(
            '<span style="background-color: {}; color: white; '
            'padding: 2px 8px; border-radius: 3px; font-size: 10px;">{}</span>',
            color,
            obj.status.upper()
        )
    status_badge.short_description = 'Status'
    
    def play_recording_inline(self, obj):
        if obj.recording_url:
            mp3_url = obj.recording_url + '.mp3'
            return format_html(
                '<audio controls preload="none" style="height: 25px;">'
                '<source src="{}" type="audio/mpeg">'
                '</audio>',
                mp3_url
            )
        return format_html('<span style="color: #999;">-</span>')
    play_recording_inline.short_description = '🎙️ Recording'


# Uncomment to add CallLog inline to Complaint admin:
# ComplaintAdmin.inlines = [CallLogInline]