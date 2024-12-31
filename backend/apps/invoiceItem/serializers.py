from rest_framework import serializers
from .models import InvoiceItem

# class SaleItemsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SaleItem
#         fields = '__all__'  # You can specify the fields you want to include explicitly
#


class InvoiceItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.item_name', read_only=True)
    class Meta:
        model = InvoiceItem
        fields = '__all__'
        
