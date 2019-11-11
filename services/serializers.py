from rest_framework import serializers
from .models import Service
from snmp_v3.serializers import SnmpConfigurationSerializer
from ping.serializers import PingConfigurationSerializer


# Service Serializer
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


# Service Serializer with configurations
class ServiceSerializerConfigurations(serializers.ModelSerializer):
    ping_configuration = PingConfigurationSerializer(read_only=True, many=True)
    snmp_configuration = SnmpConfigurationSerializer(read_only=True, many=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at', 'ping_configuration', 'snmp_configuration']
        read_only_fields = ['id', 'name', 'created_at', 'ping_configuration', 'snmp_configuration']
        depth = 1

