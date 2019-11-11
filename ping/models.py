from django.db import models
from django.contrib.postgres.fields import ArrayField
from services.models import Service
from services.error_percentage import ErrorPercentage, calculate_error_percentage
from datetime import datetime, timedelta
import pytz


class PingConfiguration(models.Model):
    ip = models.GenericIPAddressField()
    interval = models.PositiveIntegerField()
    is_active = models.BooleanField()
    number_of_requests = models.PositiveIntegerField()
    timeout = models.PositiveIntegerField()
    service = models.ForeignKey(Service, related_name="ping_configurations", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def error_percentage(self):
        datetime_month = datetime.now(pytz.utc) - timedelta(days=30)  # let's not talk about it :D
        datetime_week = datetime.now(pytz.utc) - timedelta(days=7)
        datetime_day = datetime.now(pytz.utc) - timedelta(days=1)

        ping_results_month = PingResults.objects.filter(ping_configuration=self, created_at__gte=datetime_month)
        ping_results_week = ping_results_month.filter(created_at__gte=datetime_week)
        ping_results_day = ping_results_month.filter(created_at__gte=datetime_day)

        return ErrorPercentage(day=calculate_error_percentage(ping_results_day),
                               week=calculate_error_percentage(ping_results_week),
                               month=calculate_error_percentage(ping_results_month))

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
