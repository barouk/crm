from django.urls import path
from . import views

from . import views
# from .views import CoustomTokenObtainPairView

urlpatterns = [
    path('delete/ticket/', views.Ticket.as_view({"post":"create"}), name='ticket'),
    path('info/', views.Info.as_view({"get":"list"}), name='info'),

    path('completed/ticket/', views.SavedTicket.as_view({"get":"list"}), name='info'),
    path('completed/ticket/<int:pk>/', views.SavedTicket.as_view({"get": "retrieve", }), name='info'),

]