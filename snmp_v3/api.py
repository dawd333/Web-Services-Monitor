from rest_framework import viewsets, permissions
from .serializers import SnmpConfigurationSerializer, SnmpResultsSerializer
from .models import SnmpConfiguration, SnmpResults
from services.models import Service
from django.shortcuts import get_object_or_404
from scheduler import snmp_v3_api
from django.db.models import Q
from rest_framework.exceptions import ValidationError, MethodNotAllowed


# SnmpConfiguration ViewSet
class SnmpConfigurationViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SnmpConfigurationSerializer

    def get_queryset(self):
        service = self.kwargs['service']
        return SnmpConfiguration.objects.filter(Q(service__owner=self.request.user) |
                                                Q(service__allowed_users=self.request.user),
                                                service=service)

    def get_object(self):
        queryset = self.get_queryset()
        custom_filter = {self.lookup_field: self.kwargs[self.lookup_field]}
        return get_object_or_404(queryset, **custom_filter)

    def perform_create(self, serializer):
        service = self.kwargs['service']
        instance = serializer.save(service=get_object_or_404(Service, pk=service))
        snmp_v3_api.add_or_update(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        snmp_v3_api.add_or_update(instance)

    def perform_destroy(self, instance):
        snmp_v3_api.remove(instance.id)
        instance.delete()


# SnmpResults ViewSet
class SnmpResultsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = SnmpResultsSerializer

    def get_queryset(self):
        snmp_configuration = self.kwargs['snmp_configuration']
        from_date = self.request.query_params.get('from-date', None)
        to_date = self.request.query_params.get('to-date', None)

        if from_date is not None and to_date is not None:
            return SnmpResults.objects.filter(Q(snmp_configuration__service__owner=self.request.user) |
                                              Q(snmp_configuration__service__allowed_users=self.request.user),
                                              snmp_configuration=snmp_configuration,
                                              created_at__range=(from_date, to_date))
        else:
            raise ValidationError({"detail": "Date not valid,"})

    def get_object(self):
        raise MethodNotAllowed(method="GET")

    def perform_create(self, serializer):
        raise MethodNotAllowed(method="POST")
