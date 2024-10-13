# urls.py

from django.urls import path
from .views import SaleItemsView
from ..sale.views import CreateSaleView

urlpatterns = [
    path('sale-items/', SaleItemsView.as_view(), name='sale-items-list-create'),  # List all SaleItems or create a new one
    path('sale-items/<int:pk>/', SaleItemsView.as_view(), name='sale-items-detail'),  # Retrieve, update or delete a SaleItem by ID
    path('sale-items/create/', SaleItemsView.as_view(), name='sale_items'),  # POST to create a user
    path('sale-items/update/<int:pk>/', SaleItemsView.as_view(), name='sale_items'),  # PUT to update a user
    path('sale-items/delete/<int:pk>/', SaleItemsView.as_view(), name='sale_items'),  # DELETE to remove a user

]
