from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('', include('accounts.urls')),
    path('', include('services.urls')),
    path('', include('ping.urls')),
    path('', include('snmp_v3.urls'))
]
