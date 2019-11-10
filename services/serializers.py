from rest_framework import serializers
from .models import Service, ErrorPercentage


# Service Serializer
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


# Service Serializer with configurations
class ServiceSerializerConfigurations(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at', 'ping_configuration', 'snmp_configuration']
        read_only_fields = ['id', 'name', 'created_at', 'ping_configuration', 'snmp_configuration']
        depth = 1


# Error Percentage Serializer
class ErrorPercentageSerializer(serializers.Serializer):
    hour = serializers.IntegerField()
    day = serializers.IntegerField()
    week = serializers.IntegerField()
