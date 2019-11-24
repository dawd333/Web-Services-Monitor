from collections import OrderedDict

from rest_framework import serializers
from rest_framework.fields import SkipField

from .models import Service
from snmp_v3.serializers import SnmpConfigurationSerializer, SnmpConfigurationStatusPageSerializer
from ping.serializers import PingConfigurationSerializer, PingConfigurationStatusPageSerializer
from django_health_check.serializers import DjangoHealthCheckConfigurationSerializer, \
    DjangoHealthCheckConfigurationStatusPageSerializer


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


class ServiceStatusPageSerializer(serializers.ModelSerializer):
    ping_configurations = PingConfigurationStatusPageSerializer(read_only=True, many=True)
    snmp_configurations = SnmpConfigurationStatusPageSerializer(read_only=True, many=True)
    django_health_check_configurations = DjangoHealthCheckConfigurationStatusPageSerializer(read_only=True, many=True)

    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at', 'ping_configurations', 'snmp_configurations',
                  'django_health_check_configurations']
        read_only_fields = ['id', 'name', 'created_at', 'ping_configurations', 'snmp_configurations',
                            'django_health_check_configurations']

    def to_representation(self, instance):
        """
        Object instance -> Dict of primitive datatypes.
        """
        ret = OrderedDict()
        fields = [field for field in self.fields.values() if not field.write_only]

        for field in fields:
            try:
                attribute = field.get_attribute(instance)
            except SkipField:
                continue

            if attribute is not None:
                representation = field.to_representation(attribute)
                if representation is None:
                    # Do not serialize empty objects
                    continue
                if isinstance(representation, list) and not representation:
                    # Do not serialize empty lists
                    continue
                if isinstance(representation, list):
                    # Remove None values from lists
                    representation = list(filter(None, representation))
                ret[field.field_name] = representation

        return ret
