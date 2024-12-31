from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User  # Assuming Users model is in apps.users
from django.core.validators import MinValueValidator

class Settings(models.Model):
    id = models.AutoField(primary_key=True,unique=True,blank=False)
    name = models.CharField(max_length=255,blank=False)
    value = models.CharField(max_length=255,blank=False)
    last_updated_by  = models.ForeignKey(User, to_field='username',on_delete=models.DO_NOTHING,blank=False)
    creation_datetime = models.DateTimeField(default=timezone.now,blank=False)

    def __str__(self):
        return str(self.id)
