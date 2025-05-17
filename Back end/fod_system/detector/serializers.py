from rest_framework import serializers
from .models import FODDetection

class FODDetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FODDetection
        fields = '__all__'

class FODDetectionAcknowledgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = FODDetection
        fields = ['acknowledged']