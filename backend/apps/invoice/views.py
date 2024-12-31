# from django.http import JsonResponse
# from rest_framework import status
# from rest_framework.views import APIView
# from .models import Sale
# from .serializers import SalesSerializer
from django.http import JsonResponse
# from .serializers import SalesSerializer
import traceback
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from urllib3 import request
from apps.customer.models import Customer
from apps.customer.serializers import CustomerSerializer
from apps.invoice.models import Invoice
from apps.invoice.serializers import InvoiceSerializer
from apps.settings.serializers import SettingsSerializer
from apps.invoiceItem.models import InvoiceItem
from apps.settings.models import Settings
from apps.invoiceItem.serializers import InvoiceItemSerializer
from apps.item.models import Item
from django.contrib.auth.models import User  # Assuming Users model is in apps.users
from rest_framework.permissions import IsAuthenticated

import logging

from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
import os
from slugify import slugify
from datetime import datetime
logger = logging.getLogger(__name__)

class CreateInvoiceView(APIView):
    # permission_classes = [IsAuthenticated]
    
    
    def get(self, request, pk=None):
        if pk:  # If a primary key is provided, retrieve that Customer
            try:
                data = {}
                invoice = Invoice.objects.get(id=pk)
                serializer = InvoiceSerializer(invoice)
                data['invoice'] = serializer.data
                invoice_items_list = InvoiceItem.objects.filter(transaction_type="Sale", invoice_id=pk).order_by("id")
                return_items_list = InvoiceItem.objects.filter(transaction_type="Buy", invoice_id=pk).order_by("id")
                sale_items_serializer = InvoiceItemSerializer(invoice_items_list, many=True)
                return_items_serializer = InvoiceItemSerializer(return_items_list, many=True)                
                data['invoice']['invoiceItems'] = sale_items_serializer.data
                data['invoice']['returnItems'] = return_items_serializer.data
                
                
                return JsonResponse(data, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return JsonResponse({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        else:  # Retrieve all Customers
            invoice = Invoice.objects.all().order_by("-id")
            serializer = InvoiceSerializer(invoice, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    
    def post(self, request):
        try:
            data = request.data
            invoice_id = data.get('id')
            invoice_items_list = data.get('invoiceItems')
            return_items_list = data.get('returnItems')

            customer_id = data.get("customer","")
            user = User.objects.all()[0]

            customer = None
            errors = {}
            response_data = {}
            try:
                customer = Customer.objects.get(id=customer_id)
            except Exception as exception:
                errors["customer_info"] = {"id": "Customer Not found"}

            invoice = None
            if len(errors.keys()) > 0:
                return JsonResponse({"errors":errors},status=status.HTTP_400_BAD_REQUEST)
            try:
                if invoice_id:
                    invoice = Invoice.objects.get(id=invoice_id) 
                    InvoiceItem.objects.filter(invoice_id=invoice_id).delete()
            except:
                return JsonResponse({"errors":{"invoice_id":"Invoice id not found"}}, status=status.HTTP_400_BAD_REQUEST)

        
            if invoice:
                # update the invoice
                logger.info(f"Updating invoice {invoice_id}")
                invoice.customer = customer   
                invoice.discount = data.get("discount")
                invoice.invoiceItemsTotal = data.get("invoiceItemsTotal",0)
                invoice.returnItemsTotal = data.get("returnItemsTotal",0)
                invoice.invoiceTotal = data.get("invoiceTotal",0)
                invoice.customerPaid = data.get("customerPaid",0)
                invoice.customerReturn = data.get("customerReturn",0)
                invoice.last_updated_by = user
                invoice.save(is_update=True)
                logger.info(f"Invoice updated successfully")
            else:
                logger.info(f"Creating invoice")
                values  = {
                    'customer':customer,
                    'discount':data.get("discount"),
                    'invoiceItemsTotal':data.get("invoiceItemsTotal",0),
                    'returnItemsTotal':data.get("returnItemsTotal",0),
                    'invoiceTotal':data.get("invoiceTotal",0),
                    'customerPaid':data.get("customerPaid",0),
                    "customerReturn":data.get("customerReturn"),
                    "last_updated_by":user,
                }
                # Create the invoice instance
                invoice = Invoice.objects.create(**values)
                logger.info(f"Invoice created successfully")

            
            # Add invoice.id to invoice items
            for item_data in invoice_items_list:
                item_data["invoice_id"] = invoice.id
                item_data["transaction_type"] = "Sale"
                logger.info(f"Adding invoice items to invoice {invoice.id}")

            # Add invoice.id to return items
            for item_data in return_items_list:
                item_data["invoice_id"] = invoice.id
                item_data["transaction_type"] = "Buy"
                logger.info(f"Adding return items to invoice {invoice.id}")

            sale_items_serializer = InvoiceItemSerializer(data=invoice_items_list, many=True)
            return_items_serializer = InvoiceItemSerializer(data=return_items_list, many=True)
            if sale_items_serializer.is_valid() and return_items_serializer.is_valid() :
                sale_items_serializer.save()
                return_items_serializer.save()
                logger.info(f"Invoice items added successfully")
                
                
                response_data['invoice_items_list'] = InvoiceSerializer(invoice).data
                return JsonResponse(response_data, status=status.HTTP_201_CREATED)
            else:
                invoice.delete()
                logger.info(f"Invoice deleted due to errors")
                errors['invoiceItems'] = sale_items_serializer.errors
                errors['returnItems'] = return_items_serializer.errors
                return JsonResponse({"errors":errors},status=status.HTTP_400_BAD_REQUEST)

            return JsonResponse({'message': 'Sale and sale items created successfully!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            traceback.print_exc()
            return JsonResponse({'error': str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def delete(self, request, pk):
        try:
            invoice = Invoice.objects.get(pk=pk)
            invoice.delete()
            logger.info(f"Invoice deleted successfully")
            return JsonResponse({'message': 'Invoice deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return JsonResponse({'error': 'Invoice not found'}, status=status.HTTP_404_NOT_FOUND)



def downloadPDF(request, pk):
    # Data for the template
    data = {}
    invoice = Invoice.objects.get(id=pk)
    serializer = InvoiceSerializer(invoice)
    data['invoice'] = serializer.data

    settings = Settings.objects.all()
    for setting in settings:
        data[setting.name] = setting.value
        
    # Convert to a datetime object
    dt_object = datetime.fromisoformat(data['invoice']['sale_date_time'])

    data['invoice']['sale_date_time'] = dt_object.strftime('%d-%b-%Y %H:%M')
    data['customer'] = invoice.customer
    invoice_items_list = InvoiceItem.objects.filter(transaction_type="Sale", invoice_id=pk).order_by("id")
    return_items_list = InvoiceItem.objects.filter(transaction_type="Buy", invoice_id=pk).order_by("id")
    sale_items_serializer = InvoiceItemSerializer(invoice_items_list, many=True)
    return_items_serializer = InvoiceItemSerializer(return_items_list, many=True)                
    data['invoiceItems'] = sale_items_serializer.data
    data['returnItems'] = return_items_serializer.data

    file_name = f"{invoice.id}_{invoice.customer.customer_name}_{invoice.sale_date_time}"
    
    # Slugify the string
    file_name = slugify(file_name)
    # Render HTML template with data
    html_string = render_to_string('invoice_template.html', data)

    # Generate PDF
    html = HTML(string=html_string)
    pdf_file = html.write_pdf()

    # Return PDF as response
    response = HttpResponse(pdf_file, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{file_name}.pdf"'
    return response