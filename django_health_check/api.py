from rest_framework import viewsets, permissions
from .serializers import DjangoHealthCheckConfigurationSerializer, DjangoHealthCheckResultsSerializer
from .models import DjangoHealthCheckConfiguration, DjangoHealthCheckResults
from services.models import Service
from django.shortcuts import get_object_or_404
from scheduler import django_health_check_api
from django.db.models import Q
from rest_framework.exceptions import ValidationError, MethodNotAllowed


# DjangoHealthCheckConfiguration ViewSet
class DjangoHealthCheckConfigurationViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = DjangoHealthCheckConfigurationSerializer

    def get_queryset(self):
        service = self.kwargs['service']
        return DjangoHealthCheckConfiguration.objects.filter(Q(service__owner=self.request.user) |
                                                             Q(service__allowed_users=self.request.user),
                                                             service=service)

    def get_object(self):
        queryset = self.get_queryset()
        custom_filter = {self.lookup_field: self.kwargs[self.lookup_field]}
        return get_object_or_404(queryset, **custom_filter)

    def perform_create(self, serializer):
        service = self.kwargs['service']
        instance = serializer.save(service=get_object_or_404(Service, pk=service))
        django_health_check_api.add_or_update(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        django_health_check_api.add_or_update(instance)

    def perform_destroy(self, instance):
        django_health_check_api.remove(instance.id)
        instance.delete()


# DjangoHealthCheckResults ViewSet
class DjangoHealthCheckResultsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = DjangoHealthCheckResultsSerializer

    def get_queryset(self):
        django_health_check_configuration = self.kwargs['django_health_check_configuration']
        from_date = self.request.query_params.get('from-date', None)
        to_date = self.request.query_params.get('to-date', None)

        if from_date is not None and to_date is not None:
            return DjangoHealthCheckResults.objects.filter(
                Q(django_health_check_configuration__service__owner=self.request.user) |
                Q(django_health_check_configuration__service__allowed_users=self.request.user),
                django_health_check_configuration=django_health_check_configuration,
                created_at__range=(from_date, to_date))
        else:
            raise ValidationError({"detail": "Date not valid."})

    def get_object(self):
        raise MethodNotAllowed(method="GET")

    def perform_create(self, serializer):
        raise MethodNotAllowed(method="POST")
