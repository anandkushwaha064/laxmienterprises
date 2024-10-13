from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import Customer  # Import your Customers model

class CustomersAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_address', 'mobile_number', 'balance', 'creation_datetime')
    search_fields = ('customer_name', 'customer_address')  # Enable search functionality
    list_filter = ('creation_datetime',)  # Enable filtering by creation date

admin.site.register(Customer, CustomersAdmin)  # Register the Customers model with the admin site
