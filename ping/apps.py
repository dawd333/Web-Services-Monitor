from django.apps import AppConfig


class PingConfig(AppConfig):
    name = 'ping'

    def ready(self):
        from scheduler import ping_api
        ping_api.start()
