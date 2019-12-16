from rest_framework import viewsets, permissions

from services.models import Service
from .serializers import ServiceSerializer, ServiceSerializerConfigurations, ServiceStatusPageSerializer
from scheduler import services_api


# Service ViewSet
class ServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ServiceSerializerConfigurations
        else:
            return ServiceSerializer

    def get_queryset(self):
        return self.request.user.services.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        services_api.delete_service_jobs(instance.id)
        instance.delete()


# Service Status Page ViewSet
class ServiceStatusPageViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [
        permissions.AllowAny
    ]

    serializer_class = ServiceStatusPageSerializer

    def get_queryset(self):
        return Service.objects.all()
