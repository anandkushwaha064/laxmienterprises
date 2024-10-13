from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from .models import Customer
from .serializers import CustomerSerializer

class CustomersView(APIView):
    """
    View to handle CRUD operations for Customers.
    """

    def get(self, request, pk=None):
        if pk:  # If a primary key is provided, retrieve that Customer
            try:
                customer = Customer.objects.get(pk=pk)
                serializer = CustomerSerializer(customer)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return JsonResponse({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
        else:  # Retrieve all Customers
            customers = Customer.objects.all()
            serializer = CustomerSerializer(customers, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            return JsonResponse({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            customer = Customer.objects.get(pk=pk)
            customer.delete()
            return JsonResponse({'message': 'Customer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return JsonResponse({'error': 'Customer not found'}, status=status.HTTP_404_NOT_FOUND)
