import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import FODDetection

class DetectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Join the detection group
        await self.channel_layer.group_add(
            "detections",  # Group name
            self.channel_name
        )
        await self.accept()
        await self.send(json.dumps({"type": "connection_success"}))

    async def disconnect(self, close_code):
        # Leave the group
        await self.channel_layer.group_discard(
            "detections",
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        
        # Save detection to database
        detection = await FODDetection.objects.acreate(
            object_type=data['object_type'],
            location=data['location'],
            confidence=data['confidence'],
            risk_level=data.get('risk_level', 'H')
        )
        
        # Broadcast to all connected clients
        await self.channel_layer.group_send(
            "detections",
                {
                    "type": "new_detection",
                    "data": {
                        "id": str(detection.id),
                        "object_type": detection.object_type,
                        "location": detection.location,
                        "confidence": float(detection.confidence),
                        "risk_level": detection.risk_level,
                        "timestamp": detection.timestamp.isoformat()
                    }
                }
        )
    async def new_detection(self, event):
        """Handles 'detection.message' type messages"""
        await self.send(json.dumps({'type':'new_detection', 'data': event["data"]}))



# class DetectionConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         # Accept all connections without path verification
#         await self.accept()
#         await self.send(json.dumps({"status": "CONNECTED"}))
    
#     async def disconnect(self, close_code):
#         pass
    
#     async def receive(self, text_data):
#         try:
#             data = json.loads(text_data)
#             await self.send(json.dumps({"echo": data}))
#         except json.JSONDecodeError:
#             await self.send(json.dumps({"error": "Invalid JSON"}))