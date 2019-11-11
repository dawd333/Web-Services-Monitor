from rest_framework import serializers
from .models import SnmpConfiguration, SnmpResults
from scheduler import snmp_v3_api
from services.error_percentage import ErrorPercentageSerializer


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
