from rest_framework import serializers
from .models import Item

class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'  # You can specify the fields you want to include explicitly
