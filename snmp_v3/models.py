from django.db import models
from django.contrib.postgres.fields import ArrayField
from services.models import Service
from enum import Enum


class PlatformChoices(Enum):
    Windows = ('Windows', 'Windows')
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
    service = models.ForeignKey(Service, related_name="snmp_configuration", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{0} {1}".format(self.service.__str__(), self.ip)


class SnmpResults(models.Model):
    snmp_configuration = models.ForeignKey(SnmpConfiguration, related_name="snmp_results", on_delete=models.CASCADE)
    results = ArrayField(models.CharField(max_length=100))
    created_at = models.DateTimeField(auto_now_add=True)
    error_messages = ArrayField(models.CharField(max_length=100))

    def __str__(self):
        return "{0}".format(self.snmp_configuration.__str__())
