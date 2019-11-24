from enum import Enum

from django.db import models
from django.contrib.auth.models import User


def status_page_type_switch(status_page_type):
    return {
        'OFF': StatusPageType.OFF,
        'ERROR_PERCENTAGE': StatusPageType.ERROR_PERCENTAGE,
        'NO_ERRORS_CHART': StatusPageType.NO_ERRORS_CHART,
        'FULL_CHART': StatusPageType.FULL_CHART,
    }.get(status_page_type, StatusPageType.OFF)


class StatusPageType(Enum):
    OFF = ("OFF", "OFF")
    ERROR_PERCENTAGE = ("ERROR_PERCENTAGE", "ERROR_PERCENTAGE")
    NO_ERRORS_CHART = ("NO_ERRORS_CHART", "NO_ERRORS_CHART")
    FULL_CHART = ("FULL_CHART", "FULL_CHART")

    @classmethod
    def get_value(cls, member):
        return cls[member].value[0]


class Service(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, related_name="services", on_delete=models.SET_NULL, null=True)
    allowed_users = models.ForeignKey(User, related_name="allowed_services", on_delete=models.SET_NULL, null=True,
                                      default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
