from django.db import transaction

from django_health_check.models import DjangoHealthCheckConfiguration, DjangoHealthCheckResults
from .scheduler import get_scheduler
import requests
from datetime import datetime, timedelta
import pytz

scheduler = get_scheduler()


@transaction.atomic
def django_health_check_job(django_health_check_configuration):
    if django_health_check_configuration.ip == '127.0.0.1':  # todo just for dev env
        response = requests.get("http://127.0.0.1:8000/ht/?format=json")
    else:
        response = requests.get("http://{0}/ht/?format=json".format(django_health_check_configuration.ip))

    was_success = response.status_code == 200

    if len(DjangoHealthCheckResults.objects.filter(
            django_health_check_configuration=django_health_check_configuration,
            created_at__gte=datetime.now(pytz.utc) - timedelta(
                seconds=django_health_check_configuration.interval * 0.8))) == 0:
        DjangoHealthCheckResults.objects.create(django_health_check_configuration=django_health_check_configuration,
                                                was_success=was_success)


def start():
    django_health_check_configurations = DjangoHealthCheckConfiguration.objects.all()
    for django_health_check_configuration in django_health_check_configurations:
        job_id = "django_health_check_" + str(django_health_check_configuration.id)
        if django_health_check_configuration.is_active:
            scheduler.add_job(job=django_health_check_job, interval=django_health_check_configuration.interval,
                              args=(django_health_check_configuration,), job_id=job_id)
        else:
            if scheduler.job_exists(job_id=job_id):
                scheduler.remove_job(job_id=job_id)


def add_or_update(django_health_check_configuration):
    job_id = "django_health_check_" + str(django_health_check_configuration.id)
    if django_health_check_configuration.is_active:
        scheduler.add_job(job=django_health_check_job, interval=django_health_check_configuration.interval,
                          args=(django_health_check_configuration,), job_id=job_id)
    else:
        if scheduler.job_exists(job_id=job_id):
            scheduler.remove_job(job_id=job_id)


def remove(django_health_check_configuration_id):
    job_id = "django_health_check_" + str(django_health_check_configuration_id)
    if scheduler.job_exists(job_id=job_id):
        scheduler.remove_job(job_id=job_id)
