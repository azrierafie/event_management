/**
 * Event Details Page JavaScript
 */

// Check login status
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadEventDetails();
});

function loadEventDetails() {
    const eventId = localStorage.getItem('currentEventId');
    
    if (!eventId) {
        window.location.href = 'events.html';
        return;
    }
    
    const event = eventStorage.getEventById(eventId);
    
    if (!event) {
        document.getElementById('eventTitle').textContent = 'Event not found';
        return;
    }
    
    // Display event details
    document.getElementById('eventTitle').textContent = event.name;
    document.getElementById('eventDate').textContent = formatDate(event.date);
    document.getElementById('eventLocation').textContent = event.location;
    
    const statusBadge = document.getElementById('eventStatus');
    statusBadge.textContent = event.status;
    statusBadge.className = `badge ${getStatusClass(event.status)}`;
}

function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function getStatusClass(status) {
    const classes = {
        'Upcoming': 'bg-success',
        'Completed': 'bg-secondary',
        'Cancelled': 'bg-danger',
        'Postponed': 'bg-warning text-dark'
    };
    return classes[status] || 'bg-info';
}