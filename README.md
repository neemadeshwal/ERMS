# ERMS - Engineering Resource Management System

A simple web app to manage engineering team assignments and track who's working on what projects.

## What It Does

- **Track Engineers**: View team members, their skills, and availability
- **Manage Projects**: Create projects with required skills and timelines
- **Assign Tasks**: Allocate engineers to projects with percentage capacity
- **Monitor Capacity**: See who's overloaded or available for new work

## User Types

- **Managers**: Create projects, assign engineers, view team capacity
- **Engineers**: View their assignments and update their profiles

## Tech Stack

**Frontend**: React, TypeScript, Tailwind CSS, ShadCN UI
**Backend**: Node.js, Express, MongoDB
**Auth**: JWT tokens

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

### 3. Access

- Backend:https://erms-backend-56s8.onrender.com
- Frontend: https://erms-virid.vercel.app/

## Default Login

**Manager**: manager@erms.com / manager123
**Engineer**: engineer@erms.com / engineer123

## Key Features

### Dashboard

- Visual capacity bars showing workload
- Color-coded status indicators
- Team overview with availability

### Assignment System

- Flexible percentage allocation (e.g., 60% on Project A, 40% on Project B)
- Skill-based matching
- Timeline tracking

### Project Management

- Create projects with skill requirements
- Set timelines and team size
- Track status (Planning, Active, Completed)

## Database Structure

**Users**: Email, name, role, skills, capacity (full-time: 100%, part-time: 50%)
**Projects**: Name, description, dates, required skills, team size
**Assignments**: Engineer + Project + allocation percentage + dates

## API Endpoints

```
POST /api/auth/login          # Login
GET  /api/engineers           # List engineers
GET  /api/engineers/:id       # Engineer details
GET  /api/projects            # List projects
POST /api/projects            # Create project
GET  /api/assignments         # List assignments
POST /api/assignments         # Create assignment
```

## Production Build

```bash
# Frontend
cd frontend && npm run build

# Backend
cd backend && npm run build
npm start
```

## What's Included

- 4 sample engineers with different skills
- 4 sample projects in various stages
- 8 sample assignments showing different scenarios
- Responsive design for desktop and mobile

## Future Plans

- Drag-and-drop assignment scheduling
- Email notifications for assignment changes
- Mobile app
- Integration with project management tools

## Contributing

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

---

**Simple resource management for engineering teams**
