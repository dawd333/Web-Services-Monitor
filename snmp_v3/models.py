from django.db import models
from django.contrib.postgres.fields import ArrayField
from services.models import Service
from services.error_percentage import ErrorPercentage, calculate_error_percentage
from enum import Enum
from datetime import datetime, timedelta
import pytz


class StatusPageType(Enum):
    OFF = ("OFF", "OFF")
    ERROR_PERCENTAGE = ("ERROR_PERCENTAGE", "ERROR_PERCENTAGE")
    NO_ERRORS_CHART = ("NO_ERRORS_CHART", "NO_ERRORS_CHART")
    FULL_CHART = ("FULL_CHART", "FULL_CHART")


class PlatformChoices(Enum):
    Linux = ('Linux', 'Linux')

    @classmethod
    def get_value(cls, member):
        return cls[member].value[0]


class SnmpConfiguration(models.Model):
    ip = models.GenericIPAddressField()
    interval = models.PositiveIntegerField()
    is_active = models.BooleanField()
    platform = models.CharField(max_length=100, choices=[x.value for x in PlatformChoices])
    username = models.CharField(max_length=100)
    authentication_password = models.CharField(max_length=100)
    privacy_password = models.CharField(max_length=100)
    service = models.ForeignKey(Service, related_name="snmp_configurations", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    display_type = models.CharField(max_length=100, choices=[x.value for x in StatusPageType],
                                    default="OFF")

    @property
    def error_percentage(self):
        datetime_week = datetime.now(pytz.utc) - timedelta(days=7)
        datetime_day = datetime.now(pytz.utc) - timedelta(days=1)
        datetime_hour = datetime.now(pytz.utc) - timedelta(hours=1)

        snmp_results_week = SnmpResults.objects.filter(snmp_configuration=self, created_at__gte=datetime_week)
        snmp_results_day = snmp_results_week.filter(created_at__gte=datetime_day)
        snmp_results_hour = snmp_results_week.filter(created_at__gte=datetime_hour)

        return ErrorPercentage(week=calculate_error_percentage(snmp_results_week),
                               day=calculate_error_percentage(snmp_results_day),
                               hour=calculate_error_percentage(snmp_results_hour))

    def __str__(self):
        return "{0} {1}".format(self.service.__str__(), self.ip)


class SnmpResults(models.Model):
    snmp_configuration = models.ForeignKey(SnmpConfiguration, related_name="snmp_results", on_delete=models.CASCADE)
    results = ArrayField(models.CharField(max_length=100))
    created_at = models.DateTimeField(auto_now_add=True)
    error_messages = ArrayField(models.CharField(max_length=100))

    def __str__(self):
        return "{0}".format(self.snmp_configuration.__str__())
