from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'  # You can specify the fields you want to include explicitly
        
    # def __init__(self, *args, **kwargs):
    #     self.user_id = kwargs.pop('user_id',None)
    #     super().__init__(*args,**kwargs)
    #
    # def create(self, validated_data):
    #     if self.user_id:
    #         validated_data['user_id'] = self.user_id
    #     return super().create(validated_data)