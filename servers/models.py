from django.db import models


class Server(models.Model):
    name = models.CharField(max_length=100)
    ip = models.GenericIPAddressField(unique=True)
    isActive = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
