/**
 * Dashboard JavaScript
 * Handles dashboard statistics and event display
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
    updateDashboardStats();
    setupDashboardListeners();
});

// Update all dashboard statistics
function updateDashboardStats() {
    if (typeof eventStorage === 'undefined') {
        console.error('Event storage not loaded. Make sure jsstorage.js is included first.');
        return;
    }
    
    const counts = eventStorage.getEventCounts();
    
    document.getElementById('totalEvents').textContent = counts.total;
    document.getElementById('upcomingEvents').textContent = counts.upcoming;
    document.getElementById('completedEvents').textContent = counts.completed;
}

// Show all events
function showAllEvents() {
    showEventSection('All Events', eventStorage.getAllEvents());
}

// Show upcoming events
function showUpcomingEvents() {
    showEventSection('Upcoming Events', eventStorage.getUpcomingEvents());
}

// Show completed events
function showCompletedEvents() {
    showEventSection('Completed Events', eventStorage.getCompletedEvents());
}

// Show event section with specific events
function showEventSection(title, events) {
    const section = document.getElementById('eventDetailsSection');
    const sectionTitle = document.getElementById('sectionTitle');
    const tableBody = document.getElementById('dashboardEventTable');
    
    sectionTitle.textContent = title;
    section.style.display = 'block';
    
    tableBody.innerHTML = '';
    
    if (events.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-3">
                    No events found in this category.
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort events by date
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    events.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.location}</td>
            <td>
                <span class="badge ${getStatusClass(event.status)}">
                    ${event.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="viewEventFromDashboard(${event.id})">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-sm btn-warning" onclick="editEventFromDashboard(${event.id})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Scroll to section
    section.scrollIntoView({ behavior: 'smooth' });
}

// Hide event details section
function hideEventDetails() {
    document.getElementById('eventDetailsSection').style.display = 'none';
}

// View event from dashboard
function viewEventFromDashboard(id) {
    localStorage.setItem('currentEventId', id);
    window.location.href = 'event-details.html';
}

// Edit event from dashboard
function editEventFromDashboard(id) {
    localStorage.setItem('currentEventId', id);
    window.location.href = 'events.html';
    
    // We'll handle the actual edit on the events page load
    localStorage.setItem('editEventId', id);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get status class
function getStatusClass(status) {
    const classes = {
        'Upcoming': 'bg-success',
        'Completed': 'bg-secondary',
        'Cancelled': 'bg-danger',
        'Postponed': 'bg-warning text-dark'
    };
    return classes[status] || 'bg-info';
}

// Setup dashboard listeners
function setupDashboardListeners() {
    // Update stats when storage changes
    window.addEventListener('storageChange', function() {
        updateDashboardStats();
    });
    
    window.addEventListener('storage', function(e) {
        if (e.key === 'eventDashboardEvents') {
            updateDashboardStats();
        }
    });
}

// Auto edit event if redirected from dashboard
window.addEventListener('load', function() {
    const editEventId = localStorage.getItem('editEventId');
    if (editEventId && window.location.pathname.includes('events.html')) {
        setTimeout(() => {
            editEvent(parseInt(editEventId));
            localStorage.removeItem('editEventId');
        }, 100);
    }
});