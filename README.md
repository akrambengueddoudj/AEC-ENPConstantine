# FOD Detection System
### Real-time Foreign Object Debris Detection for Aviation Safety
## Key Features

- AI-Powered Detection

  - YOLOv8 model trained on runway debris

  - Real-time processing at 30 FPS
  
  - 95%+ accuracy on metal/plastic objects

- Smart Camera System

  - Rail-mounted industrial camera

  - 4km runway coverage

  - Low-light and fog compensation

- Instant Alerting

  - WebSocket push notifications
  
  - Visual/audible alarms in control room
  
  - Mobile alerts for ground crews

- Centralized Dashboard

  - Live runway map with debris locations
  
  - Detection history timeline
  
  - Risk heatmap analytics

## Technical Solution

  ### Backend (Django)

  - WebSocket consumer handles real-time detections
  
  - Redis channel layer for group broadcasts
  
  - REST API for historical data

  ### Frontend

  - Real-time WebSocket connection
  
  - Interactive runway map
  
  - Auto-updating detection table

  ### Edge Device
  
  - Camera feed processing
  
  - On-device TensorRT acceleration
  
  - Wireless data transmission
  
  ### Communication
  
  - Point-to-Point radio link (5GHz)
  
  - JSON payload format:
    json
  
        {
          "object_type": "Bolt",
          "location": "RUNWAY_09L", 
          "confidence": 92.4,
          "timestamp": "2023-11-20T14:30:00Z"
        }

## How It Works
  
  - Camera captures runway images
  
  - Edge device runs detection model
  
  - Alerts sent via WebSocket to dashboard
  
  - Control room acknowledges detections
  
  - System logs all events for analysis
  
  - Designed for seamless integration with existing airport systems
