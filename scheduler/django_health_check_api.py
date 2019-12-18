from django_health_check.models import DjangoHealthCheckConfiguration, DjangoHealthCheckResults
from .scheduler import get_scheduler
from .email import django_health_check_send_email
import requests

scheduler = get_scheduler()


def django_health_check_job(django_health_check_configuration):
    try:
        response = requests.get("http://{0}/ht/?format=json".format(django_health_check_configuration.url))

        was_success = response.status_code == 200

        DjangoHealthCheckResults.objects.create(django_health_check_configuration=django_health_check_configuration,
                                                was_success=was_success)

        email_job_id = "django_health_check_email_" + str(django_health_check_configuration.id)
        if not was_success:
            if not scheduler.job_exists(email_job_id):
                django_health_check_send_email(django_health_check_configuration)
                scheduler.add_job(job=django_health_check_send_email, interval=3600,
                                  args=(django_health_check_configuration,), job_id=email_job_id)
        else:
            if scheduler.job_exists(email_job_id):
                scheduler.remove_job(job_id=email_job_id)
    except TypeError:
        print("Django Health Check job duplication was prevented.")


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
