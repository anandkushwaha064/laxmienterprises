from pickle import TUPLE

from django.db import models
from django.utils import timezone
from rest_framework.templatetags.rest_framework import items
from django.contrib.auth.models import User
from apps.item.models import Item
from apps.invoice.models import Invoice
from django.core.validators import MinValueValidator


class InvoiceItem(models.Model):
    id = models.AutoField(blank=False,unique=True,primary_key=True)
    item = models.ForeignKey(Item,on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Item
    item_sale_price = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Item sale price (not null)
    item_quantity = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Item quantity (not null)
    item_quantity_type = models.CharField(max_length=50,blank=False)  # Quantity type (not null)
    discount = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Discount (default 0)
    total = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Discount (default 0)
    invoice_id = models.ForeignKey(Invoice, on_delete=models.CASCADE,blank=False)  # Foreign key to Sale
    creation_datetime = models.DateTimeField(auto_now=True,blank=False)  # Set creation time as default
    # transaction_type = sale or buy
    transaction_type = models.CharField(choices=(('Buy',"Buy"),("Sale","Sale"))
                                        ,max_length=5,blank=False, default="Sale")
    deduction_on_return = models.FloatField(validators=[MinValueValidator(0)], blank=True, default=0)  # Item quantity (not null)
    

    def save(self, *args, **kwargs):
        if self.transaction_type == "Sale":
            # When Item is sold then reduce the reduce the quantity
            self.item.item_quantity = self.item.item_quantity - self.item_quantity
            self.total = self.item_sale_price * self.item_quantity
            super(InvoiceItem, self).save(*args)
            self.item.save()

        elif self.transaction_type == "Buy":
            # When Item is bought then add the reduce the quantity
            self.item.item_quantity = self.item.item_quantity + self.item_quantity
            self.total = self.item_sale_price * self.item_quantity
            self.total = self.total - (self.total / 100 * (self.deduction_on_return if  self.deduction_on_return else  0))
            super(InvoiceItem, self).save(*args)
            self.item.save()
        return True
    
    def delete(self, *args, **kwargs):
        if self.transaction_type == "Sale":
            # When Item was sold so while deleting add the quantity back
            self.item.item_quantity = self.item.item_quantity + self.item_quantity
            super(InvoiceItem, self).delete()
            self.item.save()

        elif self.transaction_type == "Buy" :
            # When Item was bought then while deleting remove the quantity
            self.item.item_quantity = self.item.item_quantity - self.item_quantity
            super(InvoiceItem, self).delete()
            self.item.save()

        return True
