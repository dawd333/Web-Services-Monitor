from rest_framework import viewsets, permissions
from .serializers import PingConfigurationSerializer, PingResultsSerializer
from .models import PingConfiguration, PingResults
from services.models import Service
from django.shortcuts import get_object_or_404
from scheduler import ping_api
from django.db.models import Q
from rest_framework.exceptions import ValidationError, MethodNotAllowed
from .sql import get_ping_results_query_day_with_user, get_ping_results_query_20minutes_with_user
from dateutil.parser import parse


# PingConfiguration ViewSet
class PingConfigurationViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = PingConfigurationSerializer

    def get_queryset(self):
        service = self.kwargs['service']
        return PingConfiguration.objects.filter(Q(service__owner=self.request.user) |
                                                Q(service__allowed_users=self.request.user),
                                                service=service)

    def get_object(self):
        queryset = self.get_queryset()
        custom_filter = {self.lookup_field: self.kwargs[self.lookup_field]}
        return get_object_or_404(queryset, **custom_filter)

    def perform_create(self, serializer):
        service = self.kwargs['service']
        instance = serializer.save(service=get_object_or_404(Service, pk=service))
        ping_api.add_or_update(instance)

    def perform_update(self, serializer):
        instance = serializer.save()
        ping_api.add_or_update(instance)

    def perform_destroy(self, instance):
        ping_api.remove(instance.id)
        instance.delete()


# PingResults ViewSet
class PingResultsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated
    ]

    serializer_class = PingResultsSerializer

    def get_queryset(self):
        ping_configuration = self.kwargs['ping_configuration']
        from_date = self.request.query_params.get('from-date', None)
        to_date = self.request.query_params.get('to-date', None)

        if from_date is not None and to_date is not None:
            days_difference = (parse(to_date) - parse(from_date)).days
            if days_difference < 5:
                return PingResults.objects.filter(Q(ping_configuration__service__owner=self.request.user) |
                                                  Q(ping_configuration__service__allowed_users=self.request.user),
                                                  ping_configuration=ping_configuration,
                                                  created_at__range=(from_date, to_date)).order_by('created_at')
            elif days_difference < 31:
                return PingResults.objects.raw(
                    get_ping_results_query_20minutes_with_user(ping_configuration=ping_configuration,
                                                               user=self.request.user, from_date=from_date,
                                                               to_date=to_date))
            else:
                return PingResults.objects.raw(
                    get_ping_results_query_day_with_user(ping_configuration=ping_configuration, user=self.request.user,
                                                         from_date=from_date, to_date=to_date))
        else:
            raise ValidationError({"detail": "Date not valid."})

    def get_object(self):
        raise MethodNotAllowed(method="GET")

    def perform_create(self, serializer):
        raise MethodNotAllowed(method="POST")
