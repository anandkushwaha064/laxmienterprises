from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import User


# Register your models here.
@admin.register(User)
class ResponseHeadersAdmin(admin.ModelAdmin):
    list_display = ('id','email', 'user_id','name','mobile_number','last_update','is_active',
                   'creation_date_time','last_update_date_time')
    # By adding this you will a filter field added in right of admin panel
    list_filter = ('id','email', 'user_id','name','mobile_number','last_update','is_active',
                   'creation_date_time','last_update_date_time')