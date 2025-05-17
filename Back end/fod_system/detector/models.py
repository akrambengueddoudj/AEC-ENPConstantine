from django.db import models

class FODDetection(models.Model):
    class RiskLevel(models.TextChoices):
        HIGH = 'H', 'High Risk'
        MEDIUM = 'M', 'Medium Risk'
        LOW = 'L', 'Low Risk'

    timestamp = models.DateTimeField(auto_now_add=True)
    object_type = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    confidence = models.FloatField()
    risk_level = models.CharField(max_length=1, choices=RiskLevel.choices)
    image = models.ImageField(upload_to='detections/', null=True, blank=True)
    acknowledged = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.object_type} at {self.location} ({self.timestamp})"