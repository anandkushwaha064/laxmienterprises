from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from .models import SaleItem
from .serializers import SaleItemSerializer


class SaleItemsView(APIView):
    """
    View to handle CRUD operations for SaleItems.
    """

    def get(self, request, pk=None):
        if pk:  # If a primary key is provided, retrieve that SaleItem
            try:
                sale_item = SaleItem.objects.get(pk=pk)
                serializer = SaleItemSerializer(sale_item)
                return JsonResponse(serializer.data, safe=False)
            except SaleItem.DoesNotExist:
                return JsonResponse({'error': 'SaleItem not found'}, status=status.HTTP_404_NOT_FOUND)
        else:  # Retrieve all SaleItems
            sale_items = SaleItem.objects.all()
            serializer = SaleItemSerializer(sale_items, many=True)
            return JsonResponse(serializer.data, safe=False)

    def post(self, request):

        serializer = SaleItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            sale_item = SaleItem.objects.get(pk=pk)
        except SaleItem.DoesNotExist:
            return JsonResponse({'error': 'SaleItem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SaleItemSerializer(sale_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            sale_item = SaleItem.objects.get(pk=pk)
            sale_item.delete()
            return JsonResponse({'message': 'SaleItem deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except SaleItem.DoesNotExist:
            return JsonResponse({'error': 'SaleItem not found'}, status=status.HTTP_404_NOT_FOUND)
