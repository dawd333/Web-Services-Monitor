from django.contrib import admin
from .models import SnmpConfiguration, SnmpResults


class SnmpConfigurationAdmin(admin.ModelAdmin):
    list_display = ('ip', 'interval', 'is_active', 'username', 'authentication_password', 'privacy_password',
                    'created_at', 'updated_at')
    list_filter = ('service', 'created_at', 'updated_at')


class SnmpResultsAdmin(admin.ModelAdmin):
    list_display = ('snmp_configuration', 'results', 'created_at')
    list_filter = ('snmp_configuration', 'created_at')


admin.site.register(SnmpConfiguration, SnmpConfigurationAdmin)
admin.site.register(SnmpResults, SnmpResultsAdmin)
