

# Create your models here.
from django.db import models
from django.core.validators import MinValueValidator
from apps.users.models import User
from django.utils import timezone


class Item(models.Model):
    id= models.AutoField(primary_key=True,blank=False,unique=True)
    item_name = models.CharField(max_length=20,blank=False)
    item_quantity = models.IntegerField(validators=[MinValueValidator(0)],blank=False)
    quantity_type = models.CharField(max_length=50,blank=False)
    item_prize = models.IntegerField(validators=[MinValueValidator(0)],blank=False)  # Consider hashing passwords for security
    item_sale_prize = models.IntegerField(blank=False,validators=[MinValueValidator(0)])
    creation_datetime = models.DateTimeField(default=timezone.now)
    last_update = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    last_updated_by = models.ForeignKey(User,to_field='user_id',blank=False,on_delete=models.DO_NOTHING)


    def __str__(self):
        
        return self.item_name