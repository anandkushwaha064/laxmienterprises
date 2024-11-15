# from django.http import JsonResponse
# from rest_framework import status
# from rest_framework.views import APIView
# from .models import Sale
# from .serializers import SalesSerializer
from django.http import JsonResponse
# from .serializers import SalesSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from urllib3 import request
from apps.customer.models import Customer
from apps.customer.serializers import CustomerSerializer
from apps.invoice.models import Invoice
from apps.invoice.serializers import InvoiceSerializer
from apps.invoiceItem.models import InvoiceItem
from apps.invoiceItem.serializers import InvoiceItemSerializer
from apps.item.models import Item
from apps.users.models import User
from rest_framework.permissions import IsAuthenticated
from apps.users.serializers import UserSerializer# To set the `last_updated_by`


class CreateInvoiceView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            data = request.data
            # Extract the data from the request
            # customer_data = request.data.get('customer_info')
            sale_info = data.get('saleinfo')
            sale_items_list = data.get('saleItems')
            sale_items_list = data.get('returnItems')

            customer_id = data.get("customer","")
            user = User.objects.get(user_id='user_123')
            user_id = user.id

            customer = None
            errors = {}
            response_data = {}
            if customer_id =="":
                customer_serializer = CustomerSerializer(data=customer_data,user_id=user_id)

                if customer_serializer.is_valid():
                    customer_serializer.save()
                    customer = customer_serializer.instance
                    response_data["customer_info"] = customer_serializer.data
                else:
                    errors['customer_info'] = customer_serializer.errors
            else:
                try:
                    customer = Customer.objects.get(id=customer_id)
                    response_data["customer_info"] = CustomerSerializer(data=customer,user_id=user_id).data
                except Exception as exception:
                    errors["customer_info"] = {"id": "Not found"}

            if len(errors.keys()) > 0:
                return JsonResponse({"errors":errors},status=status.HTTP_400_BAD_REQUEST)


            # Create the Sale instance
            sale = Invoice.objects.create(
                customer=customer,
                discount=sale_info.get('discount'),
                last_updated_by=User.objects.get(user_id=request.user.id)  # Assuming the user is authenticated
            )
            response_data['saleinfo'] = InvoiceItem(data=sale,user_id=user_id).data

            for item_data in sale_items_list:
                item_data["sale"] = sale.id



            sale_items_serializer = InvoiceItemSerializer(data=sale_items_list, many=True)
            if sale_items_serializer.is_valid():
                sale_items_serializer.save()
                response_data['sale_items_list'] = sale_items_serializer.data
                return JsonResponse(response_data, status=status.HTTP_201_CREATED)
            else:
                sale.delete()
                errors['sale_items_list'] = sale_items_serializer.errors
                return JsonResponse({"errors":errors},status=status.HTTP_400_BAD_REQUEST)



            return JsonResponse({'message': 'Sale and sale items created successfully!'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return JsonResponse({'error': str(e)},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
