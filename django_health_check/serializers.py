from rest_framework import serializers
from .models import DjangoHealthCheckConfiguration, DjangoHealthCheckResults
from services.error_percentage import ErrorPercentageSerializer


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
