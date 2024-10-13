from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import Item  # Import your Items model

class ItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'item_name', 'item_quantity', 'quantity_type', 'item_prize', 'item_sale_prize', 'creation_datetime', 'last_update', 'is_active')
    search_fields = ('item_name',)  # Enable search functionality by item name
    list_filter = ('is_active', 'quantity_type')  # Enable filtering by active status and quantity type
    ordering = ('-creation_datetime',)  # Order by creation date descending

admin.site.register(Item, ItemsAdmin)  # Register the Items model with the admin site
