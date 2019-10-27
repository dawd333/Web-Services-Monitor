from rest_framework import serializers
from .models import PingConfiguration, PingResults


# PingConfiguration Serializer
class PingConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PingConfiguration
        fields = '__all__'
        read_only_fields = ['id', 'service', 'created_at', 'updated_at']


# PingResults Serializer
class PingResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PingResults
        fields = '__all__'
        read_only_fields = ['id', 'ping_configuration', 'number_of_requests', 'rtt_avg_ms', 'created_at',
                            'error_messages']
