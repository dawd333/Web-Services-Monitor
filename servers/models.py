from django.db import models
from django.contrib.auth.models import User


class Server(models.Model):
    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField(unique=True)
    isActive = models.BooleanField(default=True)
    recurringTime = models.TimeField(null=True)  # todo fix later null
    owner = models.ForeignKey(User, related_name="servers", on_delete=models.CASCADE, null=True)  # todo fix later null
    created_at = models.DateTimeField(auto_now_add=True)
