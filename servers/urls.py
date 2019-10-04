from rest_framework import routers
from .api import ServerViewSet

router = routers.DefaultRouter()
router.register('api/servers', ServerViewSet, 'servers')

urlpatterns = router.urls
