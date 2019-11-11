from rest_framework import routers
from .api import SnmpConfigurationViewSet, SnmpResultsViewSet

router = routers.DefaultRouter()
router.register('api/snmp/(?P<service>[^/]+)', SnmpConfigurationViewSet, 'snmp_configuration')
router.register('api/snmp-results/(?P<snmp_configuration>[^/]+)', SnmpResultsViewSet, 'snmp_results')

urlpatterns = router.urls
