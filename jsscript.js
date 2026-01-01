function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Hardcoded credentials
    const validEmail = 'admin@example.com';
    const validPassword = 'admin123';
    
    // Simple validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return false;
    }
    
    // Check if credentials match
    if (email === validEmail && password === validPassword) {
        // Store login status
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password!\n\nUse:\nEmail: admin@example.com\nPassword: admin123');
    }
    
    return false; // Prevent form submission
}

// Check if user is logged in (call this on protected pages)
function checkLogin() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname;
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !currentPage.includes('index.html') && currentPage !== '/') {
        window.location.href = 'index.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// ===== EVENT MANAGEMENT FUNCTIONS =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check login status on protected pages
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('index.html') || currentPath === '/' || currentPath.endsWith('/');
    
    if (!isLoginPage) {
        checkLogin();
    }
    
    // Only initialize events if we're on the events page
    if (document.getElementById('eventTable')) {
        console.log('Event table found, initializing...');
        
        // Initialize storage if not already done
        if (typeof eventStorage === 'undefined') {
            console.error('Event storage not loaded. Make sure jsstorage.js is included first.');
            return;
        }

        loadEvents();
        setupEventListeners();
    }
});

// Load all events into the table
function loadEvents() {
    console.log('Loading events...');
    const events = eventStorage.getAllEvents();
    const eventTable = document.getElementById('eventTable');
    
    if (!eventTable) {
        console.error('Event table not found');
        return;
    }
    
    eventTable.innerHTML = '';
    
    if (events.length === 0) {
        eventTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No events found. Add your first event above!
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort events by date (newest first)
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
                <button class="btn btn-sm btn-warning me-1" onclick="editEvent(${event.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger me-1" onclick="deleteEvent(${event.id})">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="btn btn-sm btn-info" onclick="viewEvent(${event.id})">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        `;
        eventTable.appendChild(row);
    });
    
    console.log(`Loaded ${events.length} events`);
}

// FIXED: Add new event function
function addEvent() {
    console.log('Add Event function called');
    
    const name = document.getElementById('eventName').value.trim();
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value.trim();
    const status = document.getElementById('eventStatus').value;
    
    console.log('Form values:', { name, date, location, status });
    
    // Validation
    if (!name) {
        alert('Please enter event name');
        document.getElementById('eventName').focus();
        return;
    }
    
    if (!date) {
        alert('Please select event date');
        document.getElementById('eventDate').focus();
        return;
    }
    
    if (!location) {
        alert('Please enter event location');
        document.getElementById('eventLocation').focus();
        return;
    }
    
    const newEvent = {
        name: name,
        date: date,
        location: location,
        status: status
    };
    
    console.log('Adding event:', newEvent);
    
    try {
        // Check if eventStorage is available
        if (typeof eventStorage === 'undefined') {
            throw new Error('Event storage system not loaded');
        }
        
        const addedEvent = eventStorage.addEvent(newEvent);
        console.log('Event added successfully:', addedEvent);
        
        clearForm();
        loadEvents();
        showNotification('✓ Event added successfully!', 'success');
    } catch (error) {
        console.error('Error adding event:', error);
        alert('Error adding event: ' + error.message + '\n\nPlease check the console (F12) for more details.');
    }
}

// Edit event
function editEvent(id) {
    console.log('Editing event:', id);
    const event = eventStorage.getEventById(id);
    if (!event) {
        console.error('Event not found:', id);
        return;
    }
    
    // Fill form with event data
    document.getElementById('eventName').value = event.name;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('eventLocation').value = event.location;
    document.getElementById('eventStatus').value = event.status;
    
    // Change add button to update button
    const addBtn = document.getElementById('addEventBtn');
    addBtn.textContent = 'Update Event';
    addBtn.className = 'btn btn-warning w-100';
    addBtn.onclick = function() { updateEvent(id); };
    
    // Add cancel button if not already present
    let cancelBtn = document.querySelector('.cancel-edit-btn');
    if (!cancelBtn) {
        const formCard = document.querySelector('.card.p-3.shadow.mb-4');
        cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-secondary mt-2 cancel-edit-btn';
        cancelBtn.textContent = 'Cancel Edit';
        cancelBtn.onclick = clearForm;
        formCard.appendChild(cancelBtn);
    }
    
    // Scroll to form
    document.getElementById('eventName').scrollIntoView({ behavior: 'smooth' });
}

// Update event
function updateEvent(id) {
    console.log('Updating event:', id);
    
    const name = document.getElementById('eventName').value.trim();
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value.trim();
    const status = document.getElementById('eventStatus').value;
    
    if (!name || !date || !location) {
        alert('Please fill in all required fields');
        return;
    }
    
    const updatedEvent = {
        name: name,
        date: date,
        location: location,
        status: status
    };
    
    try {
        eventStorage.updateEvent(id, updatedEvent);
        console.log('Event updated successfully');
        
        clearForm();
        loadEvents();
        showNotification('Event updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Error updating event. Please try again.');
    }
}

// Delete event
function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        console.log('Deleting event:', id);
        
        try {
            eventStorage.deleteEvent(id);
            loadEvents();
            showNotification('Event deleted successfully!', 'danger');
        } catch (error) {
            console.error('Error deleting event:', error);
            alert('Error deleting event. Please try again.');
        }
    }
}

// View event details
function viewEvent(id) {
    console.log('Viewing event:', id);
    // Store the event ID in localStorage to access it on details page
    localStorage.setItem('currentEventId', id);
    window.location.href = 'event-details.html';
}

// Clear form
function clearForm() {
    console.log('Clearing form');
    
    document.getElementById('eventName').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventLocation').value = '';
    document.getElementById('eventStatus').value = 'Upcoming';
    
    // Reset button
    const addBtn = document.getElementById('addEventBtn');
    addBtn.textContent = 'Add Event';
    addBtn.className = 'btn btn-primary w-100';
    addBtn.onclick = addEvent;
    
    // Remove cancel button if exists
    const cancelBtn = document.querySelector('.cancel-edit-btn');
    if (cancelBtn) {
        cancelBtn.remove();
    }
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get CSS class for status badge
function getStatusClass(status) {
    const classes = {
        'Upcoming': 'bg-success',
        'Completed': 'bg-secondary',
        'Cancelled': 'bg-danger',
        'Postponed': 'bg-warning text-dark'
    };
    return classes[status] || 'bg-info';
}

// Show notification
function showNotification(message, type = 'info') {
    console.log('Showing notification:', message, type);
    
    // Remove existing notifications
    const existingAlert = document.querySelector('.alert-notification');
    if (existingAlert) existingAlert.remove();
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show alert-notification position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'eventDashboardEvents') {
            console.log('Storage changed externally');
            loadEvents();
        }
    });
    
    // Listen for custom storage change events
    window.addEventListener('storageChange', function() {
        console.log('Custom storage change event received');
        loadEvents();
    });
    
    // Allow pressing Enter in form fields to add event
    const eventNameField = document.getElementById('eventName');
    const eventLocationField = document.getElementById('eventLocation');
    
    if (eventNameField) {
        eventNameField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEvent();
            }
        });
    }
    
    if (eventLocationField) {
        eventLocationField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEvent();
            }
        });
    }
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