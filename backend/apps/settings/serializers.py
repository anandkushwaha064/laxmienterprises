from rest_framework import serializers
from .models import Settings


class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Settings
        fields = '__all__'  # You can specify the fields you want to include explicitly