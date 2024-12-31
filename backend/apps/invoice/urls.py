# urls.py

from django.urls import path
from .views import CreateInvoiceView, downloadPDF

urlpatterns = [

   path('', CreateInvoiceView.as_view(), name='list_invoice'),  # List all Customers or create a new one
   path('<int:pk>/', CreateInvoiceView.as_view(), name='get_invoice'),  # Retrieve, update or delete a Sale by ID
   path('create/',CreateInvoiceView.as_view(), name='create_invoice'),     # POST to create a user
   # path('sales/update/<int:id>/', CreateSaleView.as_view(), name='update_sales'),  # PUT to update a user
   path('delete/<int:pk>/', CreateInvoiceView.as_view(), name='delete_invoice'),  # DELETE to remove a user
   path('getPDF/<int:pk>/', downloadPDF, name='download_invoice_pdf'),  
 
]
