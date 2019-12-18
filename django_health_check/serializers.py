from abc import ABC

from rest_framework import serializers

from services.models import StatusPageType, status_page_type_switch
from .models import DjangoHealthCheckConfiguration, DjangoHealthCheckResults
from services.error_percentage import ErrorPercentageSerializer, DATETIME_WEEK


# DjangoHealthCheckConfiguration Serializer
class DjangoHealthCheckConfigurationSerializer(serializers.ModelSerializer):
    error_percentage = ErrorPercentageSerializer(read_only=True)

    class Meta:
        model = DjangoHealthCheckConfiguration
        fields = '__all__'
        read_only_fields = ['id', 'service', 'created_at', 'updated_at', 'error_percentage']


# DjangoHealthCheckResults Serializer
class DjangoHealthCheckResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DjangoHealthCheckResults
        fields = '__all__'
        read_only_fields = ['id', 'django_health_check_configuration', 'was_success', 'created_at']


# DjangoHealthCheckResults for Status Page Serializer
class DjangoHealthCheckResultsStatusPageSerializer(serializers.BaseSerializer, ABC):
    def to_representation(self, instance):
        display_type = status_page_type_switch(instance.django_health_check_configuration.display_type)

        if display_type == StatusPageType.OFF or display_type == StatusPageType.ERROR_PERCENTAGE:
            return None  # we don't return this result

        elif display_type == StatusPageType.NO_ERRORS_CHART or display_type == StatusPageType.FULL_CHART:
            return {
                'id': instance.id,
                'was_success': instance.was_success,
                'created_at': instance.created_at,
                'django_health_check_configuration': instance.django_health_check_configuration.id
            }


# DjangoHealthCheckConfiguration for Status Page Serializer
class DjangoHealthCheckConfigurationStatusPageSerializer(serializers.BaseSerializer, ABC):
    def to_representation(self, instance):
        display_type = status_page_type_switch(instance.display_type)

        if display_type == StatusPageType.OFF:
            return None  # we don't return this configuration

        elif display_type == StatusPageType.ERROR_PERCENTAGE:
            return {
                'id': instance.id,
                'url': instance.url,
                'interval': instance.interval,
                'is_active': instance.is_active,
                'email_notifications': instance.email_notifications,
                'service': instance.service.id,
                'created_at': instance.created_at,
                'updated_at': instance.updated_at,
                'display_type': instance.display_type,
                'error_percentage': ErrorPercentageSerializer(instance.error_percentage).data
            }

        django_health_check_results = DjangoHealthCheckResults.objects.filter(
            django_health_check_configuration=instance.id, created_at__gte=DATETIME_WEEK)
        django_health_check_results_serialized = []
        for django_health_check_result in django_health_check_results:
            django_health_check_results_serialized.append(
                DjangoHealthCheckResultsStatusPageSerializer(django_health_check_result).data)

        if display_type == StatusPageType.NO_ERRORS_CHART or display_type == StatusPageType.FULL_CHART:
            return {
                'id': instance.id,
                'url': instance.url,
                'interval': instance.interval,
                'is_active': instance.is_active,
                'email_notifications': instance.email_notifications,
                'service': instance.service.id,
                'created_at': instance.created_at,
                'updated_at': instance.updated_at,
                'display_type': instance.display_type,
                'error_percentage': ErrorPercentageSerializer(instance.error_percentage).data,
                'django_health_check_results': django_health_check_results_serialized
            }
