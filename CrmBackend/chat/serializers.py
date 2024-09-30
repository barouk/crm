from rest_framework import serializers
from . import models
from . import models
import jdatetime

class DeleteTicketSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)



def date_to_jalali(date):
    dt = None
    if date:
        dt = str(jdatetime.datetime.fromgregorian(date=date)).split()[0]
    return dt

class TicketSerializer(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField(read_only=True)
    input_date = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = models.Ticket
        exclude = ('messages',)

    def get_message_count(self, obj):
        return len(obj.messages)

    def get_input_date(self, obj):
        return date_to_jalali(obj.input_date)


class TicketSerializerDetail(serializers.ModelSerializer):
    message_count = serializers.SerializerMethodField(read_only=True)
    input_date = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = models.Ticket
        fields = '__all__'

    def get_message_count(self, obj):
        return len(obj.messages)

    def get_input_date(self, obj):
        return date_to_jalali(obj.input_date)


