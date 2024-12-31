from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import InvoiceItem  # Import your SaleItems model

class SaleItemsAdmin(admin.ModelAdmin):
    list_display = ('id', 'item__item_name', 'item_sale_price', 'item_quantity', 'item_quantity_type', 'discount', 'transaction_type')  # Specify the fields to display in the list
    search_fields = ('item__item_name', 'invoice_id')  # Enable search by item name and sale ID
    list_filter = ('invoice_id', 'item_quantity_type', 'discount')  # Enable filtering by sale, quantity type, and discount
    ordering = ('-creation_datetime',)  # Order by creation date descending

admin.site.register(InvoiceItem, SaleItemsAdmin)  # Register the SaleItems model with the admin site
