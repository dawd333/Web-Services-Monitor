from django.contrib import admin
from .models import DjangoHealthCheckConfiguration, DjangoHealthCheckResults


class DjangoHealthCheckConfigurationAdmin(admin.ModelAdmin):
    list_display = ('ip', 'interval', 'is_active', 'created_at', 'updated_at')
    list_filter = ('service', 'created_at', 'updated_at')


class DjangoHealthCheckResultsAdmin(admin.ModelAdmin):
    list_display = ('django_health_check_configuration', 'was_success', 'created_at')
    list_filter = ('django_health_check_configuration', 'created_at')


admin.site.register(DjangoHealthCheckConfiguration, DjangoHealthCheckConfigurationAdmin)
admin.site.register(DjangoHealthCheckResults, DjangoHealthCheckResultsAdmin)
