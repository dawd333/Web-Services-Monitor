from rest_framework import viewsets, permissions
from .serializers import ServiceSerializer


# Service ViewSet
class ServiceViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = ServiceSerializer

    def get_queryset(self):
        return self.request.user.services.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
