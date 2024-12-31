# Create your models here.
from django.db import models
from django.apps import apps
from django.utils import timezone
from django.contrib.auth.models import User  # Assuming Users model is in apps.users
from apps.customer.models import Customer  # Assuming Customer model is in apps.customer
from django.core.validators import MinValueValidator
import logging

# Create a logger for this module
logger = logging.getLogger(__name__)

class Invoice(models.Model):
    id = models.AutoField(primary_key=True,blank=False,unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Customer
    sale_date_time = models.DateTimeField(default=timezone.now,blank=False)  # Sets current time as default
    # invoiceItemsTotal Variable holds the value of total of sold items
    invoiceItemsTotal = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Default discount
    # returnItemsTotal Variable holds the value of scrap or returned items
    returnItemsTotal = models.FloatField(validators=[MinValueValidator(0)], blank=False , default=0)  # Default discount
    discount = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Default discount
    # invoiceTotal holed the value of the invoiceItemsTotal - returnItemsTotal - discount
    invoiceTotal = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Default discount
    # amount paid by Customer during current invoice
    customerPaid = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Default discount
    # amount returned to Customer during current invoice
    customerReturn = models.FloatField(validators=[MinValueValidator(0)], blank=False, default=0)  # Default discount
    # during current invoice what is the balance
    currentTransactionBalance = models.FloatField(validators=[MinValueValidator(0)],blank=False, default=0)  # Default discount
    last_updated_by = models.ForeignKey(User,to_field='username', on_delete=models.DO_NOTHING,blank=False)  # Foreign key to Users
    
    # def __str__(self):
    #   return self.id  # Display Sale ID and Customer Name

    def save(self, *args, **kwargs):
        logger.info(f"Saving invoice for customer {self.customer.id} with items total: {self.invoiceItemsTotal}")
        
        # Calculate the final invoice total by subtracting return items and discount from sold items
        self.invoiceTotal = self.invoiceItemsTotal - (self.returnItemsTotal + (self.discount if self.discount else 0))
        logger.debug(f"Calculated invoice total: {self.invoiceTotal}")

        # Calculate the remaining balance for this transaction by subtracting customer payments and returns
        self.currentTransactionBalance = self.invoiceTotal - ((self.customerPaid if self.customerPaid else 0) + (self.customerReturn if self.customerReturn else 0))
        logger.debug(f"Calculated transaction balance: {self.currentTransactionBalance}")

        # Handle updates to existing invoices
        if kwargs.get("is_update"):
            try:
                # Get the original invoice from database
                old_invoice = Invoice.objects.get(id=self.id)
                logger.info(f"Updating existing invoice {self.id}. Old balance: {old_invoice.currentTransactionBalance}")
                # Remove the old transaction balance from customer's total balance
                self.customer.balance = self.customer.balance - old_invoice.currentTransactionBalance
                self.customer.save()
            except Invoice.DoesNotExist:
                logger.error(f"Failed to find existing invoice with ID {self.id} for update")
                raise

        # Add the new/updated transaction balance to customer's total balance
        self.customer.balance = self.customer.balance + self.currentTransactionBalance
        logger.info(f"Updated customer {self.customer.id} balance to: {self.customer.balance}")
        self.customer.save()

        super(Invoice, self).save(*args)
        logger.info(f"Successfully saved invoice {self.id}")
        return True
    
    def delete(self, *args, **kwargs):
        # Add remaining amount to the customers balance 
        self.customer.balance = self.customer.balance - self.currentTransactionBalance
        self.customer.save()
        
        model_class = apps.get_model("invoiceItem", "InvoiceItem")
        invoiceItems = model_class.objects.filter(invoice_id=self.id)
        invoiceItems.delete()
                
        super(Invoice, self).delete()        
        
        return True