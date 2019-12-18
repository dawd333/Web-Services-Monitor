import os

from django.apps import AppConfig


class PingConfig(AppConfig):
    name = 'ping'

    def ready(self):
        from scheduler import ping_api
        if os.environ.get('RUN_MAIN', None) != 'true':
            ping_api.start()
