let eventPieChart = null;

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
    createPieChart();
    setupDashboardListeners();
});

// Create pie chart with data labels
function createPieChart() {
    const ctx = document.getElementById('eventPieChart');
    if (!ctx) return;
    
    const events = eventStorage.getAllEvents();
    
    // Count events by status
    const statusCounts = {
        'Upcoming': 0,
        'Completed': 0,
        'Cancelled': 0,
        'Postponed': 0
    };
    
    events.forEach(event => {
        if (statusCounts.hasOwnProperty(event.status)) {
            statusCounts[event.status]++;
        }
    });
    
    const chartData = [
        statusCounts['Upcoming'],
        statusCounts['Completed'],
        statusCounts['Cancelled'],
        statusCounts['Postponed']
    ];
    
    const chartColors = [
        '#06d6a0',  // Upcoming - Green
        '#6c757d',  // Completed - Gray
        '#ef476f',  // Cancelled - Red
        '#ffd166'   // Postponed - Yellow
    ];
    
    const chartLabels = ['Upcoming', 'Completed', 'Cancelled', 'Postponed'];
    
    // Create chart with datalabels plugin
    eventPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: chartColors,
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false  // Hide default legend
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                datalabels: {
                    color: '#ffffff',
                    font: {
                        weight: 'bold',
                        size: 16
                    },
                    formatter: function(value, context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        // Only show label if value is greater than 0
                        if (value > 0) {
                            return value + '\n(' + percentage + '%)';
                        }
                        return '';
                    },
                    textAlign: 'center'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
    
    // Create custom legend
    createCustomLegend(chartLabels, chartColors, chartData);
}

// Create custom legend on the right side
function createCustomLegend(labels, colors, data) {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    legendContainer.innerHTML = '';
    
    const total = data.reduce((a, b) => a + b, 0);
    
    labels.forEach((label, index) => {
        const count = data[index];
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.style.cursor = 'pointer';
        legendItem.innerHTML = `
            <div class="legend-color" style="background-color: ${colors[index]};"></div>
            <div class="legend-text">
                <div class="legend-label">${label}</div>
                <div class="legend-count">${count} events (${percentage}%)</div>
            </div>
        `;
        
        // Add click event to filter events by status
        legendItem.addEventListener('click', () => {
            if (label === 'Upcoming') {
                showUpcomingEvents();
            } else if (label === 'Completed') {
                showCompletedEvents();
            } else if (label === 'Cancelled') {
                showCancelledEvents();
            } else if (label === 'Postponed') {
                showPostponedEvents();
            }
        });
        
        legendContainer.appendChild(legendItem);
    });
}

// Update pie chart
function updatePieChart() {
    if (!eventPieChart) return;
    
    const events = eventStorage.getAllEvents();
    
    // Count events by status
    const statusCounts = {
        'Upcoming': 0,
        'Completed': 0,
        'Cancelled': 0,
        'Postponed': 0
    };
    
    events.forEach(event => {
        if (statusCounts.hasOwnProperty(event.status)) {
            statusCounts[event.status]++;
        }
    });
    
    const chartData = [
        statusCounts['Upcoming'],
        statusCounts['Completed'],
        statusCounts['Cancelled'],
        statusCounts['Postponed']
    ];
    
    // Update chart data
    eventPieChart.data.datasets[0].data = chartData;
    eventPieChart.update();
    
    // Update custom legend
    const chartLabels = ['Upcoming', 'Completed', 'Cancelled', 'Postponed'];
    const chartColors = ['#06d6a0', '#6c757d', '#ef476f', '#ffd166'];
    createCustomLegend(chartLabels, chartColors, chartData);
}

// Update all dashboard statistics
function updateDashboardStats() {
    if (typeof eventStorage === 'undefined') {
        console.error('Event storage not loaded. Make sure jsstorage.js is included first.');
        return;
    }
    
    const events = eventStorage.getAllEvents();
    
    // Count events by status
    const counts = {
        total: events.length,
        upcoming: events.filter(e => e.status === 'Upcoming').length,
        completed: events.filter(e => e.status === 'Completed').length,
        cancelled: events.filter(e => e.status === 'Cancelled').length,
        postponed: events.filter(e => e.status === 'Postponed').length
    };
    
    document.getElementById('totalEvents').textContent = counts.total;
    document.getElementById('upcomingEvents').textContent = counts.upcoming;
    document.getElementById('completedEvents').textContent = counts.completed;
    
    // Update cancelled and postponed if elements exist
    const cancelledEl = document.getElementById('cancelledEvents');
    const postponedEl = document.getElementById('postponedEvents');
    
    if (cancelledEl) cancelledEl.textContent = counts.cancelled;
    if (postponedEl) postponedEl.textContent = counts.postponed;
    
    // Update pie chart
    updatePieChart();
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

// Show cancelled events
function showCancelledEvents() {
    showEventSection('Cancelled Events', eventStorage.getEventsByStatus('Cancelled'));
}

// Show postponed events
function showPostponedEvents() {
    showEventSection('Postponed Events', eventStorage.getEventsByStatus('Postponed'));
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
