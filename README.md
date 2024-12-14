# 5S---Driven-IT-Helpdesk-Management-Tool

## Overview

The 5S-Driven IT Helpdesk Management Tool is a web-based application designed to streamline IT helpdesk operations by incorporating the principles of 5S methodology: Sort, Set in Order, Shine, Standardize, and Sustain. It provides an intuitive interface for managing tickets, assigning priorities, tracking statuses, and ensuring efficient problem resolution.
This tool is aimed at improving productivity, minimizing clutter, and standardizing IT support processes.

## Features

- **Role-Based Dashboards:**

  - **Admin Dashboard:** Manage users, priorities, statuses, and monitor overall system performance.
  - **Agent Dashboard:** View assigned tickets, update ticket statuses, and manage workloads effectively.
  - **User Dashboard:** Create tickets, track ticket progress, and view ticket resolutions.

- **Ticket Management:**

  - Create, view, update, and delete tickets.
  - Assign tickets to agents.
  - Reopen resolved tickets when necessary.

- **Priorities and Status Management:**

  - Set priorities (High, Medium, Low) and statuses (Open, Assigned, In Progress, Resolved, Closed).
  - Sort tickets by priority and status for efficient tracking.

- **User Authentication and Authorization:**

  - Role-based access control with separate interfaces for admins, agents, and users.

- **Interactive Charts and Visualizations:**

  - Track ticket metrics with pie charts and bar graphs for better data insights.

- **5S Integration:**

  - Incorporates 5S principles to keep the system clean, organized, and standardized.

- **Settings:**
  - Users can update profiles, change passwords, and customize their accounts.

## Technologies Used

**Frontend**

- **React.js:** Component-based UI framework.
- **Vite:** Build tool for faster development.
- **CSS Modules:** For modular and reusable styles.
- **Recharts:** Interactive charts and visualizations.

**Backend**

- **Node.js:** Backend runtime.
- **Express.js:** Fast and lightweight web framework.
- **MongoDB:** NoSQL database for scalable data storage.
- **Mongoose:** ODM for MongoDB.

**Additional Tools**

- **JWT:** Secure user authentication.
- **Bcrypt.js:** Secure password hashing.

## Installation

## Prerequisites

- Node.js (v14 or above)
- MongoDB (local or cloud instance)

## Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Riyaz-021/5S---Driven-IT-Helpdesk-Management-Tool.git

   ```

2. Navigate to project directory:

   ```bash
   cd 5S---Driven-IT-Helpdesk-Management-Tool

   ```

3. Install dependencies for backend and frontend:

   ````bash
   cd backend
   npm install

   ```bash
   cd ../frontend
   npm install

   ````

4. Start the development servers

- Frontend:

  ```bash
  cd frontend
  npm run dev

  ```

- Backend:
  ```bash
  cd backend
  node server.js
  ```

5. Open the application:

- Visit http://localhost:5173/helpdesk in your browser.

## Usage

**Admin**

- Access the admin interface to manage users, tickets, priorities, and statuses.
- View overall ticket metrics and system health.

**Agent**

- View tickets assigned to you.
- Update ticket statuses (e.g., In Progress, Resolved).
- Manage ticket priorities.

**User**

- Create new tickets with priority and description.
- Track ticket progress in real-time.
- Reopen closed tickets if unresolved.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch for your feature/fix.
3. Commit and push your changes.
4. Open a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For queries or feedback, contact:

**Email:** the5sithelpdesk@outlook.com
**GitHub:** Riyaz-021
