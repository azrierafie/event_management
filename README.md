Event Management Dashboard - README
📋 Project Overview
This Event Management Dashboard is a complete web application interface developed as an individual project for IMS566: Advanced Web Design Development and Content Management. The application meets all requirements specified in the project guidelines with a focus on event management functionality.
🎯 Project Objective
This project applies theories and technical exercises learned in lecture sessions to construct a professional web application interface for event management. The application demonstrates proficiency in front-end development, responsive design, and modern web technologies.
🛠️ Technical Implementation
index.html - Login Page

dashboard.html - Dashboard with Statistics

events.html - Data View 1: Events Management

calendar.html - Data View 2: Calendar View

event-details.html - Profile/Details Page
Front-End Framework: Bootstrap 5.3.2
The project extensively utilizes Bootstrap 5.3.2 for:

Grid System (Responsive Layout)
html
<div class="row">
  <div class="col-md-4">Card 1</div>
  <div class="col-md-4">Card 2</div>
  <div class="col-md-4">Card 3</div>
</div>
Bootstrap Components Used:
Navigation Bar: Consistent menu across all pages

Cards: Dashboard statistics and content containers

Buttons: Primary, secondary, success, danger variants

Tables: Event listings with responsive design

Forms: Login and event creation forms

Modal: Event details popup in calendar

Badges: Status indicators for events

Spacing Utilities: Consistent margins and padding

Flex Utilities: Layout alignment

Bootstrap Icons 1.10.0
Used for intuitive visual indicators throughout the interface.

Additional Technologies
HTML5: Semantic markup

CSS3: Custom styling and animations

JavaScript (ES6+): Dynamic functionality

LocalStorage: Client-side data persistence

Responsive Design: Mobile-first approach

📁 File Structure
text
IMS566-Event-Dashboard/
├── index.html              # Login Page (5%)
├── dashboard.html          # Dashboard Page
├── events.html            # Data View 1: Events List (15%)
├── calendar.html          # Data View 2: Calendar View
├── event-details.html     # Profile Page (25%)
├── css/
│   └── style.css         # Custom styles
├── js/
│   ├── jsstorage.js      # Data management
│   ├── jsscript.js       # Core functions & login
│   ├── jsdashboard.js    # Dashboard functions
│   ├── jscalendar.js     # Calendar functions
│   ├── jsevent-details.js # Details page functions
│   └── jsdarkmode.js     # Theme toggle
└── README.md             # Documentation
1. Login Page (index.html) - 
Features:

Clean, centered login form

Email and password validation

Hardcoded credentials for demonstration

Responsive design

Form validation with error messages

Login Credentials:

text
Email: admin@example.com
Password: admin123
2. Dashboard Page (dashboard.html)
Features:

Three interactive statistic cards (Total, Upcoming, Completed)

Clickable cards that filter event listings

Quick action buttons for common tasks

Event details section (hidden by default)

Responsive grid layout

3. Events List Page (events.html) - 
Features:

Add/Edit event form with validation

Table displaying all events (minimum 5)

Action buttons: Edit, Delete, View

Status selection (Upcoming, Completed, Cancelled, Postponed)

Real-time updates to localStorage

Responsive table design

4. Calendar View Page (calendar.html)
Features:

Interactive monthly calendar

Visual event indicators with color coding

Month navigation (Prev/Next/Today)

Event details modal on click

Legend for event statuses

Responsive calendar grid

5. Event Details Page (event-details.html) - 
Features:

Detailed view of selected event

Complete event information display

Status badge with appropriate colors

Consistent design with other pages

Navigation buttons to return to events or dashboard
