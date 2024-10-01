from django.shortcuts import render
from rest_framework import viewsets
from . import serializers
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.core.cache import cache
from . import models
from . import r
from django.contrib.auth import get_user_model
from datetime import datetime,timedelta
import jdatetime
from django.db.models import Count
from django.shortcuts import get_object_or_404
import json
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

User =  get_user_model()

class Ticket(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def create(self, request, *args, **kwargs):
        serializer = serializers.DeleteTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = json.loads(r.get(serializer.validated_data['email']).decode('utf-8'))

        models.Ticket.objects.create(name = serializer.validated_data['email'] , chat_id = data['chat_id'] ,messages =data['messages']  )
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
           data['chat_id'],
            {
                'type': 'defer',
               'message': 'defer'
            }
        )
        r.delete(serializer.validated_data['email'])
        return Response("با موفقیت حذف شد")

def date_to_jalali(date):
    dt = None
    if date:
        dt = str(jdatetime.datetime.fromgregorian(date=date)).split()[0]
    return dt

class Info(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
       pendding_count = r.dbsize()
       completed_count = models.Ticket.objects.count()
       admin_count = User.objects.count()
       dates = []
       nums=[]
       seven_days_ago = datetime.now() - timedelta(days=7)
       for i in  range(12):

           nums.append( models.Ticket.objects.filter(input_date= seven_days_ago.strftime("%Y-%m-%d")).count() )
           dates.append( date_to_jalali(seven_days_ago))
           seven_days_ago =seven_days_ago+timedelta(days=1)

       return Response({"pendding_count" : pendding_count ,"completed_count":completed_count , "admin_count":admin_count,"dates":dates,"nums":nums})



class SavedTicket(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    def list(self, request, *args, **kwargs):
       res = models.Ticket.objects.filter().all()
       serializer = serializers.TicketSerializer(res,many = True)
       return Response(serializer.data)

    def retrieve(self, request,pk =None, *args, **kwargs):

       res =get_object_or_404(  models.Ticket , pk=pk)
       serializer = serializers.TicketSerializerDetail(res,many = False)
       return Response(serializer.data)