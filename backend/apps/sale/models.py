# Create your models here.
from django.db import models
from django.utils import timezone
from apps.users.models import User  # Assuming Users model is in apps.users
from apps.customer.models import Customer  # Assuming Customer model is in apps.customer

class Sale(models.Model):
    id = models.AutoField(primary_key=True,blank=False,unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Customer
    sale_date_time = models.DateTimeField(default=timezone.now,blank=False)  # Sets current time as default
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Default discount
    last_updated_by = models.ForeignKey(User,to_field='user_id', on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Users
    creation_datetime = models.DateTimeField(default=timezone.now,blank=False)  # Sets creation time as default

    def __str__(self):
        return self.id  # Display Sale ID and Customer Name
