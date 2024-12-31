from django.http import JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from .models import Settings
from .serializers import SettingsSerializer

class SettingsView(APIView):
    """
    View to handle CRUD operations for Settings.
    """

    def get(self, request, pk=None):
        if pk:  # If a primary key is provided, retrieve that Settings
            try:
                customer = Settings.objects.get(pk=pk)
                serializer = SettingsSerializer(customer)
                return JsonResponse(serializer.data, status=status.HTTP_200_OK)
            except Settings.DoesNotExist:
                return JsonResponse({'error': 'Settings not found'}, status=status.HTTP_404_NOT_FOUND)
        else:  # Retrieve all Settingss
            customers = Settings.objects.all()
            serializer = SettingsSerializer(customers, many=True)
            return JsonResponse(serializer.data, safe=False, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = SettingsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            customer = Settings.objects.get(pk=pk)
        except Settings.DoesNotExist:
            return JsonResponse({'error': 'Settings not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SettingsSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=status.HTTP_200_OK)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            customer = Settings.objects.get(pk=pk)
            customer.delete()
            return JsonResponse({'message': 'Settings deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Settings.DoesNotExist:
            return JsonResponse({'error': 'Settings not found'}, status=status.HTTP_404_NOT_FOUND)
