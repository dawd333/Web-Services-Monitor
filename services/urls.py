from rest_framework import routers
from .api import ServiceViewSet, ServiceStatusPageViewSet

router = routers.DefaultRouter()
router.register('api/services', ServiceViewSet, 'services')
router.register('api/status-page', ServiceStatusPageViewSet, 'status-page')

urlpatterns = router.urls
