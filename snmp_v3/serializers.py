from abc import ABC

from rest_framework import serializers

from services.models import status_page_type_switch, StatusPageType
from .models import SnmpConfiguration, SnmpResults
from scheduler import snmp_v3_api
from services.error_percentage import ErrorPercentageSerializer, DATETIME_WEEK


# SnmpConfiguration Serializer
class SnmpConfigurationSerializer(serializers.ModelSerializer):
    error_percentage = ErrorPercentageSerializer(read_only=True)

    class Meta:
        model = SnmpConfiguration
        fields = '__all__'
        read_only_fields = ['id', 'service', 'created_at', 'updated_at', 'error_percentage']
        extra_kwargs = {'authentication_password': {'write_only': True}, 'privacy_password': {'write_only': True}}

    def validate(self, attrs):
        instance = SnmpConfiguration(**attrs)
        if not snmp_v3_api.is_test_request_valid(instance):
            raise serializers.ValidationError("Configuration was not successful, please verify it.")
        else:
            return attrs


# SnmpResults Serializer
class SnmpResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnmpResults
        fields = '__all__'
        read_only_fields = ['id', 'snmp_configuration', 'results', 'created_at', 'error_message']


# SnmpResults for Status Page Serializer
class SnmpResultsStatusPageSerializer(serializers.BaseSerializer, ABC):
    def to_representation(self, instance):
        display_type = status_page_type_switch(instance.snmp_configuration.display_type)

        if display_type == StatusPageType.OFF or display_type == StatusPageType.ERROR_PERCENTAGE:
            return None  # we don't return this result

        elif display_type == StatusPageType.NO_ERRORS_CHART:
            error_messages = []
            for _ in instance.error_messages:
                error_messages.append('placeholder')

            return {
                'id': instance.id,
                'results': instance.results,
                'created_at': instance.created_at,
                'error_messages': error_messages,
                'snmp_configuration': instance.snmp_configuration.id
            }

        elif display_type == StatusPageType.FULL_CHART:
            return {
                'id': instance.id,
                'results': instance.results,
                'created_at': instance.created_at,
                'error_messages': instance.error_messages,
                'snmp_configuration': instance.snmp_configuration.id
            }


# SnmpConfiguration for Status Page Serializer
class SnmpConfigurationStatusPageSerializer(serializers.BaseSerializer, ABC):
    def to_representation(self, instance):
        display_type = status_page_type_switch(instance.display_type)

        if display_type == StatusPageType.OFF:
            return None  # we don't return this configuration

        elif display_type == StatusPageType.ERROR_PERCENTAGE:
            return {
                'id': instance.id,
                'ip': instance.ip,
                'interval': instance.interval,
                'is_active': instance.is_active,
                'email_notifications': instance.email_notifications,
                'platform': instance.platform,
                'username': instance.username,
                'service': instance.service.id,
                'created_at': instance.created_at,
                'updated_at': instance.updated_at,
                'display_type': instance.display_type,
                'error_percentage': ErrorPercentageSerializer(instance.error_percentage).data
            }

        snmp_results = SnmpResults.objects.filter(snmp_configuration=instance.id, created_at__gte=DATETIME_WEEK)
        snmp_results_serialized = []
        for snmp_result in snmp_results:
            snmp_results_serialized.append(SnmpResultsStatusPageSerializer(snmp_result).data)

        if display_type == StatusPageType.NO_ERRORS_CHART or display_type == StatusPageType.FULL_CHART:
            return {
                'id': instance.id,
                'ip': instance.ip,
                'interval': instance.interval,
                'is_active': instance.is_active,
                'email_notifications': instance.email_notifications,
                'platform': instance.platform,
                'username': instance.username,
                'service': instance.service.id,
                'created_at': instance.created_at,
                'updated_at': instance.updated_at,
                'display_type': instance.display_type,
                'error_percentage': ErrorPercentageSerializer(instance.error_percentage).data,
                'snmp_results': snmp_results_serialized
            }
