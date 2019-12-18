from django.core.mail import send_mail
from os import linesep


def ping_send_email(ping_configuration, error_messages):
    service_name = ping_configuration.service.name
    user_email = ping_configuration.service.owner.email

    errors = set()
    for error in error_messages:
        errors.add(error.error_message)

    message = 'Service name: ' + service_name + linesep
    message += 'Execution for ping method failed, IP address: ' + ping_configuration.ip + linesep
    message += 'Errors: ' + ', '.join(errors)

    send_mail(subject='Ping method failure', message=message, from_email='Web Services Monitor',
              recipient_list=[user_email])


def snmp_send_email(snmp_configuration, error_messages):
    service_name = snmp_configuration.service.name
    user_email = snmp_configuration.service.owner.email

    errors = set()
    for error in error_messages:
        errors.add(str(error))

    message = 'Service name: ' + service_name + linesep
    message += 'Execution for SNMP method failed, IP address: ' + snmp_configuration.ip + linesep
    message += 'Errors: ' + ', '.join(errors)

    send_mail(subject='SNMP method failure', message=message, from_email='Web Services Monitor',
              recipient_list=[user_email])


def django_health_check_send_email(django_health_check_configuration):
    service_name = django_health_check_configuration.service.name
    user_email = django_health_check_configuration.service.owner.email

    message = 'Service name: ' + service_name + linesep
    message += 'Execution for Django Health Check method failed, URL: ' + django_health_check_configuration.url

    send_mail(subject='Django Health Check method failure', message=message, from_email='Web Services Monitor',
              recipient_list=[user_email])
