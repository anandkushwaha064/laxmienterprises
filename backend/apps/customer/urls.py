# urls.py

from django.urls import path

from .models import Customer
from .views import CustomersView

urlpatterns = [
    path('customers/', CustomersView.as_view(), name='customers-list-create'),  # List all Customers or create a new one
    path('customers/<int:pk>/', CustomersView.as_view(), name='customers-detail'),  # Retrieve, update or delete a Customer by ID
    path('customers/create/', CustomersView.as_view(), name='create_customer'),  # POST to create a user
    path('customers/update/<int:pk>/', CustomersView.as_view(), name='update_customer'),  # PUT to update a user
    path('customers/delete/<int:pk>/', CustomersView.as_view(), name='delete_customer'),  # DELETE to remove a user

]
