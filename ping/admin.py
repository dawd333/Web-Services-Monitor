from django.contrib import admin
from .models import PingConfiguration, PingResults


class PingConfigurationAdmin(admin.ModelAdmin):
    list_display = ('ip', 'interval', 'is_active', 'number_of_requests', 'timeout', 'created_at', 'updated_at')
    list_filter = ('service', 'created_at', 'updated_at')


class PingResultsAdmin(admin.ModelAdmin):
    list_display = ('ping_configuration', 'number_of_requests', 'rtt_avg_ms', 'created_at')
    list_filter = ('ping_configuration', 'created_at')


admin.site.register(PingConfiguration, PingConfigurationAdmin)
admin.site.register(PingResults, PingResultsAdmin)
