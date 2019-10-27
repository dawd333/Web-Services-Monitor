from rest_framework import routers
from .api import PingConfigurationViewSet, PingResultsViewSet

router = routers.DefaultRouter()
router.register('api/ping/(?P<service>[^/]+)', PingConfigurationViewSet, 'ping_configuration')
router.register('api/ping-results/(?P<ping_configuration>[^/]+)', PingResultsViewSet, 'ping_results')

urlpatterns = router.urls
