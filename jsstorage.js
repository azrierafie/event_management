/**
 * Event Storage Class - FIXED VERSION
 * Handles all localStorage operations for events
 */

class EventStorage {
    constructor() {
        this.STORAGE_KEY = 'eventDashboardEvents';
        console.log('EventStorage initialized');
        this.initStorage();
    }

    // Initialize storage with sample data if empty
    initStorage() {
        try {
            const existingEvents = localStorage.getItem(this.STORAGE_KEY);
            
            if (!existingEvents) {
                console.log('No existing events found, creating sample data');
                const sampleEvents = [
                    {
                        id: 1,
                        name: 'Convocation Ceremony',
                        date: '2026-02-26',
                        location: 'DATC UiTM,Shah Alam',
                        status: 'Upcoming',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 2,
                        name: 'Final Test',
                        date: '2025-02-24',
                        location: 'Dewan Seminar',
                        status: 'Upcoming',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 3,
                        name: 'Family Dinner',
                        date: '2026-01-28',
                        location: 'UiTM Hotel',
                        status: 'Completed',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 4,
                        name: 'Charity Run',
                        date: '2025-11-20',
                        location: 'Eco Grandeur',
                        status: 'Completed',
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 5,
                        name: 'Gym Session',
                        date: '2026-01-25',
                        location: 'Training Hall',
                        status: 'Upcoming',
                        createdAt: new Date().toISOString()
                    }
                ];
                this.saveEvents(sampleEvents);
                console.log('Sample events created successfully');
            } else {
                console.log('Existing events found:', JSON.parse(existingEvents).length, 'events');
            }
        } catch (error) {
            console.error('Error initializing storage:', error);
        }
    }

    // Get all events
    getAllEvents() {
        try {
            const events = localStorage.getItem(this.STORAGE_KEY);
            const parsed = events ? JSON.parse(events) : [];
            console.log('Retrieved events:', parsed.length);
            return parsed;
        } catch (error) {
            console.error('Error getting all events:', error);
            return [];
        }
    }

    // Save all events
    saveEvents(events) {
        try {
            console.log('Saving events:', events.length);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
            this.dispatchStorageChange();
            console.log('Events saved successfully');
            return true;
        } catch (error) {
            console.error('Error saving events:', error);
            throw error;
        }
    }

    // Add a new event
    addEvent(eventData) {
        try {
            console.log('Adding event:', eventData);
            
            // Validate input
            if (!eventData || typeof eventData !== 'object') {
                throw new Error('Invalid event data');
            }
            
            if (!eventData.name || !eventData.date || !eventData.location) {
                throw new Error('Missing required fields');
            }
            
            const events = this.getAllEvents();
            console.log('Current events count:', events.length);
            
            // Generate new ID
            const newId = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
            console.log('New event ID:', newId);
            
            const newEvent = {
                id: newId,
                name: String(eventData.name).trim(),
                date: String(eventData.date),
                location: String(eventData.location).trim(),
                status: eventData.status || 'Upcoming',
                createdAt: new Date().toISOString()
            };
            
            console.log('New event object:', newEvent);
            
            events.push(newEvent);
            this.saveEvents(events);
            
            console.log('Event added successfully:', newEvent);
            return newEvent;
        } catch (error) {
            console.error('Error in addEvent:', error);
            throw error;
        }
    }

    // Get event by ID
    getEventById(id) {
        try {
            const events = this.getAllEvents();
            const event = events.find(event => event.id === parseInt(id));
            console.log('Found event by ID', id, ':', event);
            return event;
        } catch (error) {
            console.error('Error getting event by ID:', error);
            return null;
        }
    }

    // Update an event
    updateEvent(id, updatedData) {
        try {
            console.log('Updating event', id, 'with:', updatedData);
            
            const events = this.getAllEvents();
            const index = events.findIndex(event => event.id === parseInt(id));
            
            if (index !== -1) {
                events[index] = {
                    ...events[index],
                    name: updatedData.name,
                    date: updatedData.date,
                    location: updatedData.location,
                    status: updatedData.status,
                    updatedAt: new Date().toISOString()
                };
                this.saveEvents(events);
                console.log('Event updated successfully');
                return events[index];
            } else {
                console.error('Event not found for update:', id);
                return null;
            }
        } catch (error) {
            console.error('Error updating event:', error);
            throw error;
        }
    }

    // Delete an event
    deleteEvent(id) {
        try {
            console.log('Deleting event:', id);
            
            const events = this.getAllEvents();
            const filteredEvents = events.filter(event => event.id !== parseInt(id));
            
            if (filteredEvents.length === events.length) {
                console.warn('Event not found for deletion:', id);
                return false;
            }
            
            this.saveEvents(filteredEvents);
            console.log('Event deleted successfully');
            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            throw error;
        }
    }

    // Get events by status
    getEventsByStatus(status) {
        try {
            const events = this.getAllEvents();
            return events.filter(event => event.status === status);
        } catch (error) {
            console.error('Error getting events by status:', error);
            return [];
        }
    }

    // Get upcoming events (future dates)
    getUpcomingEvents() {
    try {
        const events = this.getAllEvents();

        // Only events with status "Upcoming"
        const upcomingEvents = events.filter(e => e.status === "Upcoming");

        // If you ALSO want only future dates, use this instead:
        // const today = new Date().toISOString().split("T")[0];
        // const upcomingEvents = events.filter(e =>
        //     e.status === "Upcoming" && e.date >= today
        // );

        return upcomingEvents;
    } catch (error) {
        console.error("Error getting upcoming events:", error);
        return [];
    }
}

    // Get completed events (past dates or status completed)
    getCompletedEvents() {
    try {
        const events = this.getAllEvents();

        // STRICT: only events with status "Completed"
        const completedEvents = events.filter(e => e.status === "Completed");

        return completedEvents;
    } catch (error) {
        console.error("Error getting completed events:", error);
        return [];
    }
}

    // Get events count by status
    getEventCounts() {
         try {
        const events = this.getAllEvents();

        const total = events.length;
        const upcoming = events.filter(e => e.status === "Upcoming").length;
        const completed = events.filter(e => e.status === "Completed").length;

        console.log("Event counts (by status only):", { total, upcoming, completed });

        return { total, upcoming, completed };
    } catch (error) {
        console.error("Error getting event counts:", error);
        return { total: 0, upcoming: 0, completed: 0 };
    }
}

    // Get events for specific month
    getEventsByMonth(year, month) {
        try {
            const events = this.getAllEvents();
            return events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getFullYear() === year && eventDate.getMonth() === month;
            });
        } catch (error) {
            console.error('Error getting events by month:', error);
            return [];
        }
    }

    // Dispatch custom event when storage changes
    dispatchStorageChange() {
        try {
            window.dispatchEvent(new CustomEvent('storageChange', {
                detail: { timestamp: new Date().toISOString() }
            }));
            console.log('Storage change event dispatched');
        } catch (error) {
            console.error('Error dispatching storage change:', error);
        }
    }

    // Clear all events (for testing)
    clearAllEvents() {
        try {
            console.log('Clearing all events');
            localStorage.removeItem(this.STORAGE_KEY);
            this.dispatchStorageChange();
            console.log('All events cleared');
        } catch (error) {
            console.error('Error clearing events:', error);
        }
    }

    // Test localStorage availability
    testLocalStorage() {
        try {
            const testKey = '__test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            console.log('localStorage is available');
            return true;
        } catch (error) {
            console.error('localStorage is NOT available:', error);
            return false;
        }
    }
}

// Create global instance
console.log('Creating EventStorage instance...');
const eventStorage = new EventStorage();
console.log('EventStorage instance created:', eventStorage);

// Test localStorage on load
if (eventStorage.testLocalStorage()) {
    console.log('✓ localStorage test passed');
} else {
    console.error('✗ localStorage test failed - the application may not work properly');
    alert('Warning: localStorage is not available. Events may not be saved.');
}
