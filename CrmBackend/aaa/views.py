from django.shortcuts import render
from rest_framework import viewsets
from . import serializers
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
import datetime
# Create your views here.

User=get_user_model()



class Login(viewsets.ViewSet):
    permission_classes = [AllowAny]
    #permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        serializer = serializers.AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_obj = User.objects.filter(username=serializer.validated_data['username']).first()
        if user_obj is None:
            return Response({"detail": "نام کاربری یا رمزعبور اشتباه است"}, 400)
        if not user_obj.check_password(serializer.validated_data['password']):
            return Response({"detaeeeil": "نام کاربری یا رمزعبور اشتباه است"}, 400)
        refresh = RefreshToken.for_user(user_obj)
        response =  Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role':'admin'
        })
        #response.set_cookie('refresh', str(refresh))
        #response.set_cookie('access', str(refresh.access_token), expires=datetime.datetime.strftime(datetime.datetime.utcnow() + datetime.timedelta(days = 20),"%a, %d-%b-%Y %H:%M:%S GMT",))
        return response

class UserDetail(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self,request,*args, **kwargs):
        return Response({"username":request.user.username })
