// WebSocket Connection
const socket = new WebSocket(`ws://${window.location.host}/ws/detections/`);

// Connection opened
socket.addEventListener('open', (event) => {
    console.log('WebSocket connected');
    document.querySelector('.system-status .alert').innerHTML = 
        '<i class="fas fa-circle-check me-2"></i>All systems operational';
});

// Listen for messages
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.type === 'new_detection') {
        console.log('New detection:', data.data);
        handleNewDetection(data.data);
    }
});

// Handle connection errors
socket.addEventListener('error', (event) => {
    document.querySelector('.system-status .alert').className = 'alert alert-danger';
    document.querySelector('.system-status .alert').innerHTML = 
        '<i class="fas fa-circle-exclamation me-2"></i>Connection lost - retrying...';
});

// Auto-reconnect every 5 seconds if disconnected
socket.addEventListener('close', () => {
    setTimeout(() => window.location.reload(), 5000);
});

async function handleNewDetection(detection) {
    // 1. Show alert banner
    const alertBanner = document.querySelector('.alert-banner');
    alertBanner.classList.remove('d-none');
    alertBanner.querySelector('.alert-details').textContent = 
        `${detection.object_type} detected in ${detection.location} (${detection.confidence}% confidence)`;
    // Set detection ID as a data attribute on the alert banner
    alertBanner.querySelector('button').setAttribute('data-id', detection.id);

    // 2. Add to detection table
    const row = document.createElement('tr');
    row.className = detection.confidence > 80 ? 'table-danger' : 
                    detection.confidence > 60 ? 'table-warning' : '';
    
    row.innerHTML = `
        <td>${new Date(detection.timestamp).toLocaleTimeString()}</td>
        <td>${detection.object_type}</td>
        <td>${detection.location}</td>
        <td>${detection.confidence}%</td>
        <td>
            <button class="btn btn-sm btn-outline-primary view-btn" data-id="${detection.id}">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-success acknowledge-btn" data-id="${detection.id}">
                <i class="fas fa-check"></i>
            </button>
        </td>
    `;
    
    document.querySelector('#detectionTableBody').prepend(row);
    
    // 3. Add to runway map
    addDetectionToMap(detection);
    
    // 4. Play alert sound
    new Audio('/static/alert.mp3').play().catch(e => console.log('Audio error:', e));
}

function settings() {
    handleNewDetection({
        "id": "7",
        "timestamp": "2025-05-17T13:20:52.143577+00:00",
        "object_type": "Metal Bolt",
        "location": "Runway 09L/27R",
        "confidence": 92.5,
        "risk_level": "High Risk"
    })
}

// previous code
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
    marker.dataset.id = detection.id;
    
    
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
// document.addEventListener('DOMContentLoaded', function() {
//     sampleDetections.forEach(detection => {
//         addDetectionToTable(detection);
//         addDetectionToMap(detection);
//     });
    
//     // Acknowledge button
//     document.querySelector('.acknowledge-btn').addEventListener('click', function() {
//         alertBanner.classList.add('d-none');
//     });
// });


// new code
// Add this new function for acknowledgment
document.addEventListener('click', async (e) => {
    if (e.target.closest('.acknowledge-btn')) {
        console.log(e.target.closest('button'));
        
        const detectionId = e.target.closest('button').dataset.id;
        try {
            const response = await fetch(`/api/detections/${detectionId}/acknowledge/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ acknowledged: true })
            });
            
            if (response.ok) {
                console.log(e);
                e.target.closest('tr').classList.remove('table-danger');
                e.target.closest('tr').classList.add('table-success');
                e.target.closest('button').innerHTML = '<i class="fas fa-check-double"></i>';
                // 1. Hide the alert banner
                document.querySelector('.alert-banner').classList.add('d-none');
                
                // 2. Remove marker from map
                const marker = document.querySelector(`.detection-marker[data-id="${detectionId}"]`);
                if (marker) marker.remove();
            }
        } catch (error) {
            console.error('Acknowledgment failed:', error);
        }
    }
});