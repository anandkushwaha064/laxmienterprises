from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User  # Assuming Users model is in apps.users
from django.core.validators import MinValueValidator

class Customer(models.Model):
    id = models.AutoField(primary_key=True,unique=True,blank=False)
    customer_name = models.CharField(max_length=255,blank=False)
    customer_address = models.CharField(max_length=255,blank=False)
    mobile_number = models.CharField(max_length=15, blank=False, unique=True)  # For BIGINT type
    # balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance = models.FloatField(validators=[MinValueValidator(0)],blank=False)  # Consider hashing passwords for security
    last_updated_by  = models.ForeignKey(User, to_field='username',on_delete=models.DO_NOTHING,blank=False)
    creation_datetime = models.DateTimeField(default=timezone.now,blank=False)

    def __str__(self):
        return str(self.id)
