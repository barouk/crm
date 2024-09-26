from django.shortcuts import render
from rest_framework import viewsets
from . import serializers
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.core.cache import cache



class Ticket(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        serializer = serializers.DeleteTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cache.delete(serializer.validated_data['email'])
        return Response("با موفقیت حذف شد")