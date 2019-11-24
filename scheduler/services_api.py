from .scheduler import get_scheduler
from services.models import Service
from ping.models import PingConfiguration
from snmp_v3.models import SnmpConfiguration
from django_health_check.models import DjangoHealthCheckConfiguration

scheduler = get_scheduler()


def delete_service_jobs(service_id):
    service = Service.objects.get(pk=service_id)
    ping_configurations = PingConfiguration.objects.filter(service=service)
    snmp_configurations = SnmpConfiguration.objects.filter(service=service)
    django_health_check_configurations = DjangoHealthCheckConfiguration.objects.filter(service=service)

    for ping_configuration in ping_configurations:
        job_id = "ping_" + str(ping_configuration.id)
        if scheduler.job_exists(job_id=job_id):
            scheduler.remove_job(job_id=job_id)

    for snmp_configuration in snmp_configurations:
        job_id = "snmp_" + str(snmp_configuration.id)
        if scheduler.job_exists(job_id=job_id):
            scheduler.remove_job(job_id=job_id)

    for django_health_check_configuration in django_health_check_configurations:
        job_id = "django_health_check_" + str(django_health_check_configuration.id)
        if scheduler.job_exists(job_id=job_id):
            scheduler.remove_job(job_id=job_id)
