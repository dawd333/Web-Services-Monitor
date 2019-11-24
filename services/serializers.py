from rest_framework import serializers
from .models import Service
from snmp_v3.serializers import SnmpConfigurationSerializer
from ping.serializers import PingConfigurationSerializer
from django_health_check.serializers import DjangoHealthCheckConfigurationSerializer


# Service Serializer
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


# Service Serializer with configurations
class ServiceSerializerConfigurations(serializers.ModelSerializer):
    ping_configurations = PingConfigurationSerializer(read_only=True, many=True)
    snmp_configurations = SnmpConfigurationSerializer(read_only=True, many=True)
    django_health_check_configurations = DjangoHealthCheckConfigurationSerializer(read_only=True, many=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at', 'ping_configurations', 'snmp_configurations',
                  'django_health_check_configurations']
        read_only_fields = ['id', 'name', 'created_at', 'ping_configurations', 'snmp_configurations',
                            'django_health_check_configurations']
        depth = 1
