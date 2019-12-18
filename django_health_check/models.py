from django.db import models
from services.models import Service, StatusPageType
from services.error_percentage import ErrorPercentage, calculate_error_percentage_django_health_check, \
    DATETIME_WEEK, DATETIME_DAY, DATETIME_HOUR


class DjangoHealthCheckConfiguration(models.Model):
    url = models.CharField(max_length=200)
    interval = models.PositiveIntegerField()
    is_active = models.BooleanField()
    email_notifications = models.BooleanField()
    service = models.ForeignKey(Service, related_name="django_health_check_configurations", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    display_type = models.CharField(max_length=100, choices=[x.value for x in StatusPageType], default="OFF")

    @property
    def error_percentage(self):
        django_health_check_results_week = DjangoHealthCheckResults.objects.filter(
            django_health_check_configuration=self,
            created_at__gte=DATETIME_WEEK)
        django_health_check_results_day = django_health_check_results_week.filter(created_at__gte=DATETIME_DAY)
        django_health_check_results_hour = django_health_check_results_week.filter(created_at__gte=DATETIME_HOUR)

        return ErrorPercentage(week=calculate_error_percentage_django_health_check(django_health_check_results_week),
                               day=calculate_error_percentage_django_health_check(django_health_check_results_day),
                               hour=calculate_error_percentage_django_health_check(django_health_check_results_hour))

    def __str__(self):
        return "{0} {1}".format(self.service.__str__(), self.url)


class DjangoHealthCheckResults(models.Model):
    django_health_check_configuration = models.ForeignKey(DjangoHealthCheckConfiguration,
                                                          related_name="django_health_check_results",
                                                          on_delete=models.CASCADE)
    was_success = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{0} {1}".format(self.django_health_check_configuration.__str__(), self.was_success)
