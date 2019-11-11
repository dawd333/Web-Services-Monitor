from django.db import models
from django.contrib.postgres.fields import ArrayField
from services.models import Service
from services.error_percentage import ErrorPercentage


class PingConfiguration(models.Model):
    ip = models.GenericIPAddressField()
    interval = models.PositiveIntegerField()
    is_active = models.BooleanField()
    number_of_requests = models.PositiveIntegerField()
    timeout = models.PositiveIntegerField()
    service = models.ForeignKey(Service, related_name="ping_configuration", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def error_percentage(self):
        return ErrorPercentage(hour=1, day=1, week=1)

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
