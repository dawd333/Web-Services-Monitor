from rest_framework import serializers
from .models import Service


# Service Serializer
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['created_at']
