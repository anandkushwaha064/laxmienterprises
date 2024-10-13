from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone

class User(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.CharField(max_length=20, unique=True,blank=False)
    email = models.EmailField(max_length=50, unique=True,blank=False)
    name = models.CharField(max_length=50,blank=False)
    password = models.CharField(max_length=255,blank=False)  # Consider hashing passwords for security
    mobile_number = models.BigIntegerField(blank=False)
    last_update = models.DateTimeField(default=timezone.now,blank=False)
    is_active = models.BooleanField(default=True,blank=False)
    creation_date_time = models.DateTimeField(default=timezone.now,blank=False)
    last_update_date_time = models.DateTimeField(default=timezone.now,blank=False)

    def __str__(self):
        return self.user_id