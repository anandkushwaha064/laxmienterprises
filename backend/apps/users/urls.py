from django.urls import path, include
from . import views



urlpatterns = [
    path('user/', views.get_users, name='get_users'),               # GET all users
    path('user/<str:user_id>/', views.get_users, name='get_users'),   # GET a single user
    path('user/create/', views.create_user, name='create_user'),     # POST to create a user
    path('user/update/<int:user_id>/', views.update_user, name='update_user'),  # PUT to update a user
    path('user/delete/<int:user_id>/', views.delete_user, name='delete_user'),  # DELETE to remove a user
]
