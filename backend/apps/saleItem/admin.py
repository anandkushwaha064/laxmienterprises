from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import SaleItem  # Import your SaleItems model

class SaleItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'item', 'item_sale_price', 'item_quantity', 'quantity_type', 'discount', 'sale', 'last_updated_by', 'creation_datetime')  # Specify the fields to display in the list
    search_fields = ('item__item_name', 'sale__id')  # Enable search by item name and sale ID
    list_filter = ('sale', 'quantity_type', 'discount')  # Enable filtering by sale, quantity type, and discount
    ordering = ('-creation_datetime',)  # Order by creation date descending

admin.site.register(SaleItem, SaleItemsAdmin)  # Register the SaleItems model with the admin site
