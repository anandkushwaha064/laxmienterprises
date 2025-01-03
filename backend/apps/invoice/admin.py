from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import Invoice  # Import your Sales model

class SalesAdmin(admin.ModelAdmin):
    # Specify the fields to display in the list
    list_display = ('id', 'customer__customer_name', 'sale_date_time','invoiceItemsTotal','returnItemsTotal','invoiceTotal', 'customerPaid','customerReturn','discount', 'last_updated_by')  
    search_fields = ('customer__customer_name',)  # Enable search by customer's name
    list_filter = ('discount', 'sale_date_time')  # Enable filtering by discount and sale date
    ordering = ('-sale_date_time',)  # Order by sale date descending

admin.site.register(Invoice, SalesAdmin)  # Register the Sales model with the admin site
