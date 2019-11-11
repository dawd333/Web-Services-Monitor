from rest_framework import viewsets, permissions
from .serializers import ServiceSerializer, ServiceSerializerConfigurations


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
