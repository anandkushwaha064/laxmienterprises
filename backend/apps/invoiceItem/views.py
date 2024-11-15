from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from .models import InvoiceItem
from .serializers import InvoiceItemSerializer


class InvoiceItemsView(APIView):
    """
    View to handle CRUD operations for InvoiceItems.
    """

    def get(self, request, pk=None):
        if pk:  # If a primary key is provided, retrieve that InvoiceItem
            try:
                sale_item = InvoiceItem.objects.get(pk=pk)
                serializer = InvoiceItemSerializer(sale_item)
                return JsonResponse(serializer.data, safe=False)
            except InvoiceItem.DoesNotExist:
                return JsonResponse({'error': 'InvoiceItem not found'}, status=status.HTTP_404_NOT_FOUND)
        else:  # Retrieve all InvoiceItems
            sale_items = InvoiceItem.objects.all()
            serializer = InvoiceItemSerializer(sale_items, many=True)
            return JsonResponse(serializer.data, safe=False)

    def post(self, request):

        serializer = InvoiceItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            sale_item = InvoiceItem.objects.get(pk=pk)
        except InvoiceItem.DoesNotExist:
            return JsonResponse({'error': 'InvoiceItem not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InvoiceItemSerializer(sale_item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            sale_item = InvoiceItem.objects.get(pk=pk)
            sale_item.delete()
            return JsonResponse({'message': 'InvoiceItem deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except InvoiceItem.DoesNotExist:
            return JsonResponse({'error': 'InvoiceItem not found'}, status=status.HTTP_404_NOT_FOUND)
