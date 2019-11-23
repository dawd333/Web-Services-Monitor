from rest_framework import routers
from .api import DjangoHealthCheckConfigurationViewSet, DjangoHealthCheckResultsViewSet

router = routers.DefaultRouter()
router.register('api/django-health-check/(?P<service>[^/]+)', DjangoHealthCheckConfigurationViewSet,
                'django_health_check_configuration')
router.register('api/django-health-check-results/(?P<django_health_check_configuration>[^/]+)',
                DjangoHealthCheckResultsViewSet, 'django_health_check_results')

urlpatterns = router.urls
