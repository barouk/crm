from rest_framework import serializers
from . import models



class DeleteTicketSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)

