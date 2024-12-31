from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import Settings  # Import your Customers model

class SettingsAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'value', 'last_updated_by', 'last_updated_by', 'creation_datetime')
    search_fields = ('name', 'value')  # Enable search functionality

admin.site.register(Settings, SettingsAdmin)  # Register the Customers model with the admin site
