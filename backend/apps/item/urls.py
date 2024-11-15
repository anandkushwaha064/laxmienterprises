# urls.py

from django.urls import path
from .views import ItemsView

urlpatterns = [
    path('', ItemsView.as_view(), name='get'),  # List all Items or create a new one
    path('<int:pk>/', ItemsView.as_view(), name='get'),  # Retrieve, update or delete an Item by ID
    path('create/', ItemsView.as_view(), name='post'),     # POST to create a user
    path('update/<int:pk>/', ItemsView.as_view(), name='put'),  # PUT to update a user
    path('delete/<int:pk>/', ItemsView.as_view(), name='delete'),  # DELETE to remove a user

]
