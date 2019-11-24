from enum import Enum

from django.db import models
from django.contrib.postgres.fields import ArrayField
from services.models import Service
from services.error_percentage import ErrorPercentage, calculate_error_percentage, \
    DATETIME_WEEK, DATETIME_DAY, DATETIME_HOUR


class StatusPageType(Enum):
    OFF = ("OFF", "OFF")
    ERROR_PERCENTAGE = ("ERROR_PERCENTAGE", "ERROR_PERCENTAGE")
    NO_ERRORS_CHART = ("NO_ERRORS_CHART", "NO_ERRORS_CHART")
    FULL_CHART = ("FULL_CHART", "FULL_CHART")


class PingConfiguration(models.Model):
    ip = models.GenericIPAddressField()
    interval = models.PositiveIntegerField()
    is_active = models.BooleanField()
    number_of_requests = models.PositiveIntegerField()
    timeout = models.PositiveIntegerField()
    service = models.ForeignKey(Service, related_name="ping_configurations", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    display_type = models.CharField(max_length=100, choices=[x.value for x in StatusPageType],
                                    default="OFF")

    @property
    def error_percentage(self):
        ping_results_week = PingResults.objects.filter(ping_configuration=self, created_at__gte=DATETIME_WEEK)
        ping_results_day = ping_results_week.filter(created_at__gte=DATETIME_DAY)
        ping_results_hour = ping_results_week.filter(created_at__gte=DATETIME_HOUR)

        return ErrorPercentage(week=calculate_error_percentage(ping_results_week),
                               day=calculate_error_percentage(ping_results_day),
                               hour=calculate_error_percentage(ping_results_hour))

    def __str__(self):
        return "{0} {1}".format(self.service.__str__(), self.ip)


class PingResults(models.Model):
    ping_configuration = models.ForeignKey(PingConfiguration, related_name="ping_results", on_delete=models.CASCADE)
    number_of_requests = models.PositiveIntegerField()
    rtt_avg_ms = models.DecimalField(max_digits=10, decimal_places=3)
    created_at = models.DateTimeField(auto_now_add=True)
    error_messages = ArrayField(models.CharField(max_length=100))

    def __str__(self):
        return "{0} {1}".format(self.ping_configuration.__str__(), self.rtt_avg_ms)
