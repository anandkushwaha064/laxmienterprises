# urls.py

from django.urls import path

from .models import Settings
from .views import SettingsView

urlpatterns = [
    path('', SettingsView.as_view(), name='settings-list-create'),  # List all Settings or create a new one
    path('<int:pk>/', SettingsView.as_view(), name='settings-detail'),  # Retrieve, update or delete a Settings by ID
    path('create/', SettingsView.as_view(), name='create_settings'),  # POST to create a user
    path('update/<int:pk>/', SettingsView.as_view(), name='update_settings'),  # PUT to update a user
    path('delete/<int:pk>/', SettingsView.as_view(), name='delete_settings'),  # DELETE to remove a user
]
