# Civic Issue Reporting System

A full-stack web application for civic issue reporting with three user roles (Citizen, Officer, Admin) using React.js, Node.js/Express.js, and JSON file-based storage.

## Features

- Three user roles: Citizen, Officer, and Admin
- Issue reporting with image upload
- Status tracking and updates
- Role-based access control
- Dashboard with statistics
- Real-time status updates

## Tech Stack

- Frontend: React.js with Material-UI
- Backend: Node.js with Express.js
- Data Storage: JSON files
- Image Storage: Local file system
- Authentication: JWT

## Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/civic-issue-reporting.git
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

## Default Users

The system comes with three default users:

1. Citizen:
   - Username: citizen1
   - Password: citizen123

2. Officer:
   - Username: officer1
   - Password: officer123

3. Admin:
   - Username: admin1
   - Password: admin123

## Features by Role

### Citizen
- Submit new issues with images
- Track submitted issues
- View issue status updates

### Officer
- View all submitted issues
- Update issue status
- Access statistics dashboard

### Admin
- View all issues
- Delete resolved issues
- Monitor system statistics