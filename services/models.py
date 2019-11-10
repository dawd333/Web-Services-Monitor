from django.db import models
from django.contrib.auth.models import User


class Service(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, related_name="services", on_delete=models.SET_NULL, null=True)
    allowed_users = models.ForeignKey(User, related_name="allowed_services", on_delete=models.SET_NULL, null=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ErrorPercentage(object):
    def __init__(self, hour, day, week):
        self.hour = hour
        self.day = day
        self.week = week
