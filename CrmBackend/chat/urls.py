from django.urls import path
from . import views

from . import views
# from .views import CoustomTokenObtainPairView

urlpatterns = [
    path('delete/ticket/', views.Ticket.as_view({"post":"create"}), name='login'),
]