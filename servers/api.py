from rest_framework import viewsets, permissions
from .models import Server
from .serializers import ServerSerializer


# Server ViewSet
class ServerViewSet(viewsets.ModelViewSet):
    queryset = Server.objects.all()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = ServerSerializer
