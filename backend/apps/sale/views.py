# from django.http import JsonResponse
# from rest_framework import status
# from rest_framework.views import APIView
# from .models import Sale
# from .serializers import SalesSerializer
from django.http import JsonResponse
# class SalesView(APIView):
#     """
#     View to handle CRUD operations for Sales.
#     """

#     def get(self, request, pk=None):
#         if pk:  # If a primary key is provided, retrieve that Sale
#             try:
#                 sale = Sale.objects.get(pk=pk)
#                 serializer = SalesSerializer(sale)
#                 return JsonResponse(serializer.data, status=status.HTTP_200_OK)
#             except Sale.DoesNotExist:
#                 return JsonResponse({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)
#         else:  # Retrieve all Sales
#             sales = Sale.objects.all()
#             serializer = SalesSerializer(sales, many=True)
#             return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

#     def post(self, request):
#         data = request.data
#         print(data['customer_info'])
#         print(data['saleinfo'])
#         print(data['sale_items_list'])
#         serializer = SalesSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
#         return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request, pk):

#         try:
#             sale = Sale.objects.get(pk=pk)
#             print(pk)
#         except Sale.DoesNotExist:
#             return JsonResponse({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

#         serializer = SalesSerializer(sale, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return JsonResponse(serializer.data, status=status.HTTP_200_OK)
#         return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def delete(self, request, pk):
#         try:
#             sale = Sale.objects.get(pk=pk)
#             sale.delete()
#             return JsonResponse({'message': 'Sale deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
#         except Sale.DoesNotExist:
#             return JsonResponse({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)

# from .serializers import SalesSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from urllib3 import request

from apps.customer.models import Customer
from apps.customer.serializers import CustomerSerializer

from apps.sale.models import Sale
from apps.sale.serializers import SaleSerializer
from apps.saleItem.models import SaleItem
from apps.saleItem.serializers import SaleItemSerializer

from apps.item.models import Item
from apps.users.models import User
from rest_framework.permissions import IsAuthenticated

from apps.users.serializers import UserSerializer# To set the `last_updated_by`



class CreateSaleView(APIView):
    # permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            # Extract the data from the request
            customer_data = request.data.get('customer_info')
            sale_info = request.data.get('saleinfo')
            sale_items_list = request.data.get('sale_items_list')

            customer_id = customer_data.get("id","")
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
            sale = Sale.objects.create(
                customer=customer,
                discount=sale_info.get('discount'),
                last_updated_by=User.objects.get(user_id=request.user.id)  # Assuming the user is authenticated
            )
            response_data['saleinfo'] = SaleSerializer(data=sale,user_id=user_id).data

            for item_data in sale_items_list:
                item_data["sale"] = sale.id



            sale_items_serializer = SaleItemSerializer(data=sale_items_list, many=True)
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
