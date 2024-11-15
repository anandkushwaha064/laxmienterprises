# urls.py

from django.urls import path
from .views import CreateInvoiceView

urlpatterns = [
   # path('sales/', CreateSaleView.as_view(), name='sales-list-create'),  # List all Sales or create a new one
   # path('sales/<int:pk>/', CreateSaleView.as_view(), name='sales-detail'),  # Retrieve, update or delete a Sale by ID
    path('create/',CreateInvoiceView.as_view(), name='create_sales'),     # POST to create a user
   # path('sales/update/<int:id>/', CreateSaleView.as_view(), name='update_sales'),  # PUT to update a user
   # path('sales/delete/<int:id>/', CreateSaleView.as_view(), name='delete_sales'),  # DELETE to remove a user
]
