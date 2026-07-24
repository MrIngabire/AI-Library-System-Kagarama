from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, BookViewSet, BorrowingRecordViewSet, AIRecommendationView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'books', BookViewSet)
router.register(r'borrowing', BorrowingRecordViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('ai-recommendations/', AIRecommendationView.as_view(), name='ai-recommendations'),
]