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
