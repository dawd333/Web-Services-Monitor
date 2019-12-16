import os

from django.apps import AppConfig


class DjangoHealthCheckConfig(AppConfig):
    name = 'django_health_check'

    def ready(self):
        from scheduler import django_health_check_api
        if os.environ.get('RUN_MAIN', None) != 'true':
            django_health_check_api.start()
