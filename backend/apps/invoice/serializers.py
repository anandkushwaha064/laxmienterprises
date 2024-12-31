from rest_framework import serializers
from .models import Invoice

class InvoiceSerializer(serializers.ModelSerializer):
    customerName = serializers.CharField(source='customer.customer_name', read_only=True)

    class Meta:        
        model = Invoice
        fields = '__all__'
        extra_fields = ["customerName"]  # You can specify the fields you want to include explicitly



