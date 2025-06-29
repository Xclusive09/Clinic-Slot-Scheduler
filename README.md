# Clinic-Slot-Scheduler

A responsive, professional web application for managing clinic appointment slots, tailored for university or institutional health centers.

## Features

- **Staff Dashboard:**  
  View appointment statistics, summary charts, and paginated student schedules. Filter by date and export data as CSV.

- **Manage Slots:**  
  View, update, and manage student screening appointments. Mark appointments as completed or cancelled. Includes date filtering and pagination.

- **Authentication:**  
  Secure staff login/logout with JWT (mocked for demo).

- **Responsive Design:**  
  Fully responsive UI for mobile, tablet, and desktop. Sidebar navigation adapts for small screens.

- **Data Synchronization:**  
  Slot status changes in "Manage Slots" are reflected in the dashboard in real time (using browser localStorage).

## Tech Stack

- **Frontend:**  
  - HTML5, CSS3 (TailwindCSS)
  - JavaScript (ES6+)
  - Chart.js (for summary charts)
  - Material Icons

- **Backend:**  
  - *Not included in this demo; data is mocked and stored in browser localStorage.*

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd CMS-Integration-FUD
   ```

2. **Open the Frontend:**
   - Open `Frontend/staff-dashboard/dashboard.html` in your browser.
   - Use the sidebar to navigate between Dashboard and Manage Slots.

3. **Login:**
   - Use any username/password to access the dashboard (demo mode).

4. **Usage:**
   - Filter appointments by date using the calendar input.
   - Mark slots as completed or cancelled in "Manage Slots".
   - Export schedules as CSV from the dashboard.
   - Use pagination controls to navigate through student lists.

## Folder Structure

```
CMS-Integration-FUD/
├── Frontend/
│   └── staff-dashboard/
│       ├── dashboard.html
│       ├── dashboard.js
│       ├── manage-slots.html
│       ├── manage-slots.js
│       ├── staff-login.html
│       ├── logout.html
│       └── ...
├── .gitignore
└── README.md
```

## Customization

- **Backend Integration:**  
  Replace the mock data and localStorage logic in JS files with real API calls as needed.

- **Styling:**  
  Modify TailwindCSS classes or add custom CSS for further branding.

## License

This project is for demonstration and educational purposes.

&copy; 2025 Clinic Slot Scheduler
