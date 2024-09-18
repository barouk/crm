from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
   TokenObtainPairView
)
from . import views
# from .views import CoustomTokenObtainPairView

urlpatterns = [
    path('login/', views.Login.as_view({"post":"create"}), name='login'),
    path('profile/', views.UserDetail.as_view({"get": "list"}), name='user'),
]