let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let events = []; // Initialize empty, will load from correct storage
let selectedEventIndex = -1;

// ===== INITIALIZE CALENDAR =====
document.addEventListener('DOMContentLoaded', function() {
  loadEventsFromStorage(); // Load events first
  renderCalendar();
});

// ===== LOAD EVENTS FROM CORRECT STORAGE =====
function loadEventsFromStorage() {
  // Use the same storage key as the main app
  const storedEvents = localStorage.getItem("eventDashboardEvents");
  events = storedEvents ? JSON.parse(storedEvents) : [];
  console.log('Loaded events for calendar:', events.length);
}

// ===== RENDER CALENDAR =====
function renderCalendar() {
  const calendarDays = document.getElementById('calendarDays');
  const monthYearDisplay = document.getElementById('monthYearDisplay');
  
  if (!calendarDays || !monthYearDisplay) return;
  
  // Reload events to get latest data
  loadEventsFromStorage();
  
  // Clear calendar
  calendarDays.innerHTML = '';
  
  // Update month/year display
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;
  
  // Get first day of month and total days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const totalDays = lastDay.getDate();
  const startingDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get today's date for highlighting
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  
  // Add empty cells for days before first day of month
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day empty';
    calendarDays.appendChild(emptyDay);
  }
  
  // Add days of the month
  for (let day = 1; day <= totalDays; day++) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    
    // Check if this is today
    const isToday = isCurrentMonth && day === today.getDate();
    
    // Create day number
    const dayNumber = document.createElement('div');
    dayNumber.className = `day-number ${isToday ? 'today' : ''}`;
    dayNumber.textContent = day;
    
    dayElement.appendChild(dayNumber);
    
    // Get events for this day
    const dayEvents = getEventsForDay(day);
    
    // Add events to day
    if (dayEvents.length > 0) {
      dayEvents.forEach((event, index) => {
        const eventElement = document.createElement('div');
        eventElement.className = `event-item ${event.status.toLowerCase()}`;
        eventElement.title = `${event.name}\n${event.location}\n${event.status}`;
        eventElement.setAttribute('data-index', event.originalIndex);
        
        // Truncate event name if too long
        let eventName = event.name;
        if (eventName.length > 15) {
          eventName = eventName.substring(0, 15) + '...';
        }
        
        eventElement.innerHTML = `
          <span class="event-title">${eventName}</span>
          <span class="event-time">${formatTime(event.date)}</span>
        `;
        
        // Add click event
        eventElement.addEventListener('click', function(e) {
          e.stopPropagation();
          showEventDetails(parseInt(this.getAttribute('data-index')));
        });
        
        dayElement.appendChild(eventElement);
      });
    }
    
    // Add click event to day
    dayElement.addEventListener('click', function() {
      if (dayEvents.length === 0) {
        // If no events, show message
        showToast(`No events on ${monthNames[currentMonth]} ${day}, ${currentYear}`, 'info');
      }
    });
    
    calendarDays.appendChild(dayElement);
  }
}

// ===== GET EVENTS FOR SPECIFIC DAY =====
function getEventsForDay(day) {
  const dayEvents = [];
  
  events.forEach((event, index) => {
    const eventDate = new Date(event.date);
    
    // Check if event is in current month/year and on this day
    if (eventDate.getDate() === day && 
        eventDate.getMonth() === currentMonth && 
        eventDate.getFullYear() === currentYear) {
      
      dayEvents.push({
        ...event,
        originalIndex: index
      });
    }
  });
  
  // Sort events by time (if available) or by name
  return dayEvents.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

// ===== NAVIGATE TO PREVIOUS MONTH =====
function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
  showToast(`Viewing ${getMonthName(currentMonth)} ${currentYear}`, 'info');
}

// ===== NAVIGATE TO NEXT MONTH =====
function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar();
  showToast(`Viewing ${getMonthName(currentMonth)} ${currentYear}`, 'info');
}

// ===== GO TO TODAY =====
function goToToday() {
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();
  renderCalendar();
  showToast('Back to current month', 'success');
}

// ===== SHOW EVENT DETAILS IN MODAL =====
function showEventDetails(index) {
  loadEventsFromStorage(); // Reload to get latest data
  
  if (index < 0 || index >= events.length) return;
  
  const event = events[index];
  selectedEventIndex = index;
  
  // Update modal content
  document.getElementById('modalEventTitle').textContent = event.name;
  document.getElementById('modalEventDate').textContent = formatFullDate(event.date);
  document.getElementById('modalEventLocation').textContent = event.location;
  
  const statusBadge = document.getElementById('modalEventStatus');
  statusBadge.textContent = event.status;
  statusBadge.className = `badge ${event.status === 'Upcoming' ? 'bg-success' : 
                                    event.status === 'Completed' ? 'bg-secondary' : 
                                    event.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'}`;
  
  // Show modal
  const eventModal = new bootstrap.Modal(document.getElementById('eventModal'));
  eventModal.show();
}

// ===== VIEW FULL EVENT DETAILS =====
function viewEventDetails() {
  if (selectedEventIndex >= 0) {
    const event = events[selectedEventIndex];
    localStorage.setItem('currentEventId', event.id);
    window.location.href = 'event-details.html';
  }
}

// ===== HELPER FUNCTIONS =====
function getMonthName(monthIndex) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return monthNames[monthIndex];
}

function formatFullDate(dateString) {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

function formatTime(dateString) {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    // If date has time component, show time
    if (dateString.includes('T')) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return ""; // Return empty string instead of "All Day"
  } catch (e) {
    return "";
  }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = "info") {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-container');
  existingToasts.forEach(toast => toast.remove());
  
  // Create toast container
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  toastContainer.style.position = 'fixed';
  toastContainer.style.top = '20px';
  toastContainer.style.right = '20px';
  toastContainer.style.zIndex = '9999';
  
  // Type colors mapping
  const typeColors = {
    success: '#06d6a0',
    warning: '#ff9e00',
    danger: '#ef476f',
    info: '#4361ee'
  };
  
  // Create toast
  const toast = document.createElement('div');
  toast.className = 'toast show';
  toast.style.backgroundColor = typeColors[type] || typeColors.info;
  toast.style.color = 'white';
  toast.style.borderRadius = '10px';
  toast.style.minWidth = '250px';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  
  toast.innerHTML = `
    <div class="d-flex align-items-center">
      <div class="toast-body" style="flex: 1; padding: 15px 20px;">
        <strong>${type.charAt(0).toUpperCase() + type.slice(1)}!</strong> ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-3" style="background: transparent; border: none; font-size: 1.2rem; cursor: pointer;"></button>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  document.body.appendChild(toastContainer);
  
  // Auto-remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toastContainer.parentNode) {
        toastContainer.remove();
      }
    }, 300);
  }, 3000);
  
  // Add close functionality
  toast.querySelector('.btn-close').addEventListener('click', () => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(() => {
      if (toastContainer.parentNode) {
        toastContainer.remove();
      }
    }, 300);
  });
}

// ===== LISTEN FOR STORAGE CHANGES =====
window.addEventListener('storage', function(e) {
  if (e.key === 'eventDashboardEvents') {
    console.log('Events updated in another tab, reloading calendar...');
    loadEventsFromStorage();
    renderCalendar();
  }
});

// Listen for custom storage change events
window.addEventListener('storageChange', function() {
  console.log('Events updated, reloading calendar...');
  loadEventsFromStorage();
  renderCalendar();
});