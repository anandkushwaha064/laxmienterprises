# urls.py

from django.urls import path
from .views import InvoiceItemsView
from ..invoice.views import CreateInvoiceView

urlpatterns = [
    path('', CreateInvoiceView.as_view(), name='invoice-items-list-create'),  # List all SaleItems or create a new one
    path('<int:pk>/', CreateInvoiceView.as_view(), name='invoice-items-detail'),  # Retrieve, update or delete a SaleItem by ID
    path('create/', CreateInvoiceView.as_view(), name='invoice_items'),  # POST to create a user
    path('update/<int:pk>/', CreateInvoiceView.as_view(), name='invoice_items'),  # PUT to update a user
    path('delete/<int:pk>/', CreateInvoiceView.as_view(), name='invoice_items'),  # DELETE to remove a user
]
