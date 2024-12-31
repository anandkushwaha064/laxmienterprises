

# Create your models here.
from django.db import models
from django.core.validators import MinValueValidator
from django.contrib.auth.models import User
from django.utils import timezone

quantity_type_choices = (
    ("piece", "Piece(s)"),
    ("kilogram", "Kilogram(s)"),
    ("gram", "Gram(s)"),
    ("liter", "Liter(s)"),
    ("milliliter", "Milliliter(s)"),
    ("meter", "Meter(s)"),
    ("centimeter", "Centimeter(s)"),
    ("inch", "Inch(es)"),
    ("foot", "Foot/Feet"),
    ("square meter", "Square Meter(s)"),
    ("cubic meter", "Cubic Meter(s)"),
    ("dozen", "Dozen(s)"),
    ("pack", "Pack(s)"),
    ("box", "Box(es)")
)

class Item(models.Model):
    id= models.AutoField(primary_key=True,blank=False,unique=True)
    item_name = models.CharField(max_length=20,blank=False)
    item_quantity = models.FloatField(blank=False, validators=[MinValueValidator(0)])
    quantity_type = models.CharField(choices=quantity_type_choices, max_length=50,blank=False)
    category = models.CharField(max_length=50, blank=False, default="Electronics")
    item_prize = models.FloatField(validators=[MinValueValidator(0)],blank=False)  # Consider hashing passwords for security
    item_sale_prize = models.FloatField( blank=False,validators=[MinValueValidator(0)])
    deduction_on_return = models.FloatField( blank=False,validators=[MinValueValidator(0)], default=0)
    description = models.CharField(max_length=250,blank=True)
    creation_datetime = models.DateTimeField(default=timezone.now)
    last_update = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    last_updated_by = models.ForeignKey(User,to_field='username',blank=False,on_delete=models.DO_NOTHING)
    
    def __str__(self):
        
        return self.item_name