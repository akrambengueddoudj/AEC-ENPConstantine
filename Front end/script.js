// Initialize WebSocket connection
const socket = new WebSocket('ws://your-server-ip:8000/ws/fod/');

// Sample data for demo (replace with real WebSocket data)
const sampleDetections = [
    {
        time: "10:23:45",
        type: "Metal Bolt",
        location: "Landing Zone (LZ-3)",
        confidence: "92%",
        risk: "high"
    },
    {
        time: "09:56:12",
        type: "Plastic Bag",
        location: "Taxiway B",
        confidence: "76%",
        risk: "medium"
    },
    {
        time: "08:34:22",
        type: "Pebbles",
        location: "Runway Threshold",
        confidence: "65%",
        risk: "low"
    }
];

// DOM Elements
const alertBanner = document.querySelector('.alert-banner');
const alertDetails = document.querySelector('.alert-details');
const detectionTableBody = document.getElementById('detectionTableBody');
const runwayMap = document.getElementById('runwayMap');

// WebSocket Event Handlers
socket.onopen = function(e) {
    console.log("WebSocket connection established");
    updateStatus('connection', 'success');
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    handleNewDetection(data);
};

socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`Connection closed cleanly, code=${event.code}`);
    } else {
        console.log('Connection died');
        updateStatus('connection', 'danger');
    }
};

// Functions
function handleNewDetection(detection) {
    // Show alert banner
    alertDetails.textContent = `${detection.type} detected in ${detection.location} (${detection.confidence} confidence)`;
    alertBanner.classList.remove('d-none');
    
    // Add to detection table
    addDetectionToTable(detection);
    
    // Add to runway map
    addDetectionToMap(detection);
}

function addDetectionToTable(detection) {
    const row = document.createElement('tr');
    
    // Determine row class based on risk
    let rowClass = '';
    if (detection.confidence > 80) rowClass = 'table-danger';
    else if (detection.confidence > 60) rowClass = 'table-warning';
    
    row.className = rowClass;
    
    row.innerHTML = `
        <td>${new Date().toLocaleTimeString()}</td>
        <td>${detection.type}</td>
        <td>${detection.location}</td>
        <td>${detection.confidence}%</td>
        <td>
            <button class="btn btn-sm btn-outline-primary view-btn">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    
    // Insert at the top of the table
    detectionTableBody.insertBefore(row, detectionTableBody.firstChild);
    
    // Keep only the last 10 detections
    if (detectionTableBody.children.length > 10) {
        detectionTableBody.removeChild(detectionTableBody.lastChild);
    }
}

function addDetectionToMap(detection) {
    // For demo purposes - in a real app, use actual coordinates
    const marker = document.createElement('div');
    marker.className = 'detection-marker';
    
    // Position randomly on map for demo
    const x = Math.random() * 80 + 10; // 10-90%
    const y = Math.random() * 80 + 10; // 10-90%
    
    marker.style.left = `${x}%`;
    marker.style.top = `${y}%`;
    
    // Color by risk
    if (detection.confidence > 80) {
        marker.style.backgroundColor = '#dc3545'; // Red
    } else if (detection.confidence > 60) {
        marker.style.backgroundColor = '#fd7e14'; // Orange
    } else {
        marker.style.backgroundColor = '#ffc107'; // Yellow
    }
    
    runwayMap.appendChild(marker);
    
    // Remove marker after 30 seconds
    setTimeout(() => {
        marker.remove();
    }, 30000);
}

function updateStatus(system, status) {
    // In a real app, update system status indicators
    console.log(`${system} status: ${status}`);
}

// Demo: Populate with sample data on load
document.addEventListener('DOMContentLoaded', function() {
    sampleDetections.forEach(detection => {
        addDetectionToTable(detection);
        addDetectionToMap(detection);
    });
    
    // Acknowledge button
    document.querySelector('.acknowledge-btn').addEventListener('click', function() {
        alertBanner.classList.add('d-none');
    });
});