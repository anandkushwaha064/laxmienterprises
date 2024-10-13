from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from .models import Item
from .serializers import ItemsSerializer


class ItemsView(APIView):
    """
    View to handle CRUD operations for Items.
    """

    def get(self, request, pk=None):
        if pk:  # If a primary key is provided, retrieve that Item
            try:
                item = Item.objects.get(pk=pk)
                serializer = ItemsSerializer(item)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)
            except Item.DoesNotExist:
                return JsonResponse({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
        else:  # Retrieve all Items
            items = Item.objects.all()
            serializer = ItemsSerializer(items, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ItemsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            item = Item.objects.get(pk=pk)
        except Item.DoesNotExist:
            return JsonResponse({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ItemsSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            item = Item.objects.get(pk=pk)
            item.delete()
            return JsonResponse({'message': 'Item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Item.DoesNotExist:
            return JsonResponse({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)
