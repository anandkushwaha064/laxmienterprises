from pickle import TUPLE

from django.db import models
from django.utils import timezone
from rest_framework.templatetags.rest_framework import items

from apps.users.models import User
from apps.item.models import Item
from apps.sale.models import Sale
from django.core.validators import MinValueValidator


class SaleItem(models.Model):
    id = models.IntegerField(blank=False,unique=True,primary_key=True)
    item = models.ForeignKey(Item,on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Item
    item_sale_price = models.DecimalField(max_digits=10, decimal_places=2,blank=False,validators=[MinValueValidator(0)])  # Item sale price (not null)
    item_quantity = models.IntegerField(blank=False,validators=[MinValueValidator(0)])  # Item quantity (not null)
    quantity_type = models.CharField(max_length=50,blank=False)  # Quantity type (not null)
    discount = models.IntegerField(default=0)  # Discount (default 0)
    sale = models.ForeignKey(Sale, on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Sale
    last_updated_by = models.ForeignKey(User,to_field='user_id', on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Users
    creation_datetime = models.DateTimeField(auto_now=True,blank=False)  # Set creation time as default

    def __str__(self):

        return self.id # Display Sale Item ID and Item Name
