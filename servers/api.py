from rest_framework import viewsets, permissions
from .serializers import ServerSerializer


# Server ViewSet
class ServerViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = ServerSerializer

    def get_queryset(self):
        return self.request.user.servers.all()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

