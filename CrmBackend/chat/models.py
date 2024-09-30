from django.db import models
from datetime import datetime
# Create your models here.



class Ticket(models.Model):
    name = models.CharField(null=False, blank=False, max_length=364)
    chat_id =  models.CharField(null=False, blank=False, max_length=364)
    messages = models.JSONField(null=False, blank=False,)
    input_date = models.DateField(default=datetime.now )
    class Meta:
        db_table = "Tickets"




