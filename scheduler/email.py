from django.core.mail import send_mail


def ping_send_email(ping_configuration, error_messages):
    user_email = ping_configuration.service.owner.email
    message = ''
    for error in error_messages:
        message += error.error_message
    send_mail(subject='Ping method failure', message=message, from_email='Web Services Monitor',
              recipient_list=[user_email])


def snmp_send_email(snmp_configuration, error_messages):
    user_email = snmp_configuration.service.owner.email
    message = ''
    for error in error_messages:
        message += str(error)
    send_mail(subject='SNMP method failure', message=message, from_email='Web Services Monitor',
              recipient_list=[user_email])


def django_health_check_send_email(django_health_check_configuration):
    user_email = django_health_check_configuration.service.owner.email
    message = 'health check'
    send_mail(subject='Django Health Check method failure', message=message, from_email='Web Services Monitor',
              recipient_list=[user_email])
