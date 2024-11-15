from rest_framework import serializers
from .models import InvoiceItem

# class SaleItemsSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = SaleItem
#         fields = '__all__'  # You can specify the fields you want to include explicitly
#


class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['item', 'item_sale_price', 'item_quantity', 'quantity_type', 'discount', 'sale']
