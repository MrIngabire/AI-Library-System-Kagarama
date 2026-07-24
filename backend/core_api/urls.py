from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

# NEW: Import your custom view from the library app!
from library.views import CustomTokenObtainPairView 

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('library.urls')),
    
    # UPDATE THIS LINE: Use CustomTokenObtainPairView instead of the default one
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)