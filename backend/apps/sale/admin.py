from django.contrib import admin

# Register your models here.
# admin.py

from django.contrib import admin
from .models import Sale  # Import your Sales model

class SalesAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'sale_date_time', 'discount', 'last_updated_by', 'creation_datetime')  # Specify the fields to display in the list
    search_fields = ('customer__customer_name',)  # Enable search by customer's name
    list_filter = ('discount', 'sale_date_time')  # Enable filtering by discount and sale date
    ordering = ('-sale_date_time',)  # Order by sale date descending

admin.site.register(Sale, SalesAdmin)  # Register the Sales model with the admin site
