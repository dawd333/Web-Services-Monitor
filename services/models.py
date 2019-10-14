from django.db import models
from django.contrib.auth.models import User


class Service(models.Model):
    name = models.CharField(max_length=100)
    value = models.IntegerField()
    owner = models.ForeignKey(User, related_name="services", on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
