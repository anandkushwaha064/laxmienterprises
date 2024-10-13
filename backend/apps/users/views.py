from django.shortcuts import render

# Create your views here.
# views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializers import UserSerializer
from django.http import JsonResponse


# GET all users or a specific user
@api_view(['GET'])
def get_users(request, user_id=None):
    if user_id:
        try:
            user = User.objects.get(user_id=user_id)
            serializer = UserSerializer(user)
            return JsonResponse(serializer.data, status=status.HTTP_200_OK,safe=False)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND,safe=False)
    else:
        users = User.objects.all()
        print(users)
        serializer = UserSerializer(users, many=True)
        return JsonResponse(serializer.data, status=status.HTTP_200_OK,safe=False)

# POST to create a new user
@api_view(['POST'])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# PUT to update an existing user
@api_view(['PUT'])
def update_user(request, user_id):
    try:
        user = User.objects.get(userID=user_id)
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

# DELETE a user
@api_view(['DELETE'])
def delete_user(request, user_id):
    try:
        user = User.objects.get(userID=user_id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)





