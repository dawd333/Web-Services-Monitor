from abc import ABC

from rest_framework import serializers
from .models import PingConfiguration, PingResults
from services.error_percentage import ErrorPercentageSerializer, DATETIME_WEEK
from services.models import status_page_type_switch, StatusPageType


# PingConfiguration Serializer
class PingConfigurationSerializer(serializers.ModelSerializer):
    error_percentage = ErrorPercentageSerializer(read_only=True)

    class Meta:
        model = PingConfiguration
        fields = '__all__'
        read_only_fields = ['id', 'service', 'created_at', 'updated_at', 'error_percentage']


# PingResults Serializer
class PingResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PingResults
        fields = '__all__'
        read_only_fields = ['id', 'ping_configuration', 'number_of_requests', 'rtt_avg_ms', 'created_at',
                            'error_messages']


# PingResults for Status Page Serializer
class PingResultsStatusPageSerializer(serializers.BaseSerializer, ABC):
    def to_representation(self, instance):
        display_type = status_page_type_switch(instance.ping_configuration.display_type)

        if display_type == StatusPageType.OFF or display_type == StatusPageType.ERROR_PERCENTAGE:
            return None  # we don't return this result

        elif display_type == StatusPageType.NO_ERRORS_CHART:
            error_messages = []
            for _ in instance.error_messages:
                error_messages.append('placeholder')

            return {
                'id': instance.id,
                'number_of_requests': instance.number_of_requests,
                'rtt_avg_ms': instance.rtt_avg_ms,
                'created_at': instance.created_at,
                'error_messages': error_messages,
                'ping_configuration': instance.ping_configuration.id
            }

        elif display_type == StatusPageType.FULL_CHART:
            return {
                'id': instance.id,
                'number_of_requests': instance.number_of_requests,
                'rtt_avg_ms': instance.rtt_avg_ms,
                'created_at': instance.created_at,
                'error_messages': instance.error_messages,
                'ping_configuration': instance.ping_configuration.id
            }


# PingConfiguration for Status Page Serializer
class PingConfigurationStatusPageSerializer(serializers.BaseSerializer, ABC):
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
                'number_of_requests': instance.number_of_requests,
                'timeout': instance.timeout,
                'service': instance.service.id,
                'created_at': instance.created_at,
                'updated_at': instance.updated_at,
                'display_type': instance.display_type,
                'error_percentage': ErrorPercentageSerializer(instance.error_percentage).data
            }

        ping_results = PingResults.objects.filter(ping_configuration=instance.id, created_at__gte=DATETIME_WEEK)
        ping_results_serialized = []
        for ping_result in ping_results:
            ping_results_serialized.append(PingResultsStatusPageSerializer(ping_result).data)

        if display_type == StatusPageType.NO_ERRORS_CHART or display_type == StatusPageType.FULL_CHART:
            return {
                'id': instance.id,
                'ip': instance.ip,
                'interval': instance.interval,
                'is_active': instance.is_active,
                'number_of_requests': instance.number_of_requests,
                'timeout': instance.timeout,
                'service': instance.service.id,
                'created_at': instance.created_at,
                'updated_at': instance.updated_at,
                'display_type': instance.display_type,
                'error_percentage': ErrorPercentageSerializer(instance.error_percentage).data,
                'ping_results': ping_results_serialized
            }
