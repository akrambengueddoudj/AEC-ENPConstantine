from rest_framework import generics
from .models import FODDetection
from .serializers import FODDetectionSerializer, FODDetectionAcknowledgeSerializer
from django.shortcuts import render
from rest_framework.response import Response

class DetectionListCreate(generics.ListCreateAPIView):
    queryset = FODDetection.objects.all().order_by('-timestamp')
    serializer_class = FODDetectionSerializer

class DetectionAcknowledge(generics.UpdateAPIView):
    queryset = FODDetection.objects.all()
    serializer_class = FODDetectionAcknowledgeSerializer  # Use the new serializer
    
    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.acknowledged = True
        instance.save()
        return Response({"status": "acknowledged"})

def dashboard(request):
    return render(request, 'pages/dashboard.html')