from django.db import transaction
from ping.models import PingConfiguration, PingResults
from .scheduler import get_scheduler
from pythonping import ping
from datetime import datetime, timedelta
import pytz

scheduler = get_scheduler()


@transaction.atomic
def ping_job(ping_configuration):
    response_list = ping(target=ping_configuration.ip, count=ping_configuration.number_of_requests,
                         timeout=ping_configuration.timeout)

    error_messages = []
    for response in response_list:
        if not response.success:
            error_messages.append(response)

    if len(PingResults.objects.filter(
            ping_configuration=ping_configuration,
            created_at__gte=datetime.now(pytz.utc) - timedelta(seconds=ping_configuration.interval * 0.8))) == 0:
        PingResults.objects.create(ping_configuration=ping_configuration,
                                   number_of_requests=ping_configuration.number_of_requests,
                                   rtt_avg_ms=response_list.rtt_avg_ms,
                                   error_messages=error_messages)


def start():
    ping_configurations = PingConfiguration.objects.all()
    for ping_configuration in ping_configurations:
        job_id = "ping_" + str(ping_configuration.id)
        if ping_configuration.is_active:
            scheduler.add_job(job=ping_job, interval=ping_configuration.interval, args=(ping_configuration,),
                              job_id=job_id)
        else:
            if scheduler.job_exists(job_id=job_id):
                scheduler.remove_job(job_id=job_id)


def add_or_update(ping_configuration):
    job_id = "ping_" + str(ping_configuration.id)
    if ping_configuration.is_active:
        scheduler.add_job(job=ping_job, interval=ping_configuration.interval, args=(ping_configuration,), job_id=job_id)
    else:
        if scheduler.job_exists(job_id=job_id):
            scheduler.remove_job(job_id=job_id)


def remove(ping_configuration_id):
    job_id = "ping_" + str(ping_configuration_id)
    if scheduler.job_exists(job_id=job_id):
        scheduler.remove_job(job_id=job_id)
