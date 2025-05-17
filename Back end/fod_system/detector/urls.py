from django.urls import path
from . import views

urlpatterns = [
    path('api/detections/', views.DetectionListCreate.as_view()),
    path('api/detections/<int:pk>/acknowledge/', views.DetectionAcknowledge.as_view()),
    path('', views.dashboard, name='dashboard'),
]