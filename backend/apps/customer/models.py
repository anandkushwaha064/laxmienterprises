from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from apps.users.models import User  # Assuming Users model is in apps.users

class Customer(models.Model):
    id = models.AutoField(primary_key=True,unique=True,blank=False)
    customer_name = models.CharField(max_length=255,blank=False)
    customer_address = models.CharField(max_length=255,blank=False)
    mobile_number = models.BigIntegerField(blank=False)  # For BIGINT type
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    last_updated_by  = models.ForeignKey(User, to_field='user_id',on_delete=models.DO_NOTHING,blank=False)
    creation_datetime = models.DateTimeField(default=timezone.now,blank=False)

    def __str__(self):
        return self.id
