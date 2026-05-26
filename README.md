# DeskFlow — Support Ticket Triage Board 📋

A full-stack MERN application for managing support tickets with a Kanban-style triage board.

## Features
- 4-column board: Open → In Progress → Resolved → Closed
- Priority badges (urgent/high/medium/low) with color coding
- SLA breach detection and visual warnings
- Ticket age tracking
- Status transition enforcement
- Filterable by priority and SLA breach status
- Stats dashboard with counts per status
- Create ticket modal with inline validation

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Express.js + MongoDB (Mongoose)
- **Database**: MongoDB Atlas
- **Hosting**: Netlify (frontend) + Render (backend)

## Setup

### Backend
```bash
cd backend
npm install
# Set MONGODB_URI environment variable
npm start
```

### Frontend
```bash
cd frontend
npm install
# Set VITE_API_URL to your backend URL
npm run dev
```

## Environment Variables
- `MONGODB_URI` — MongoDB connection string (backend)
- `VITE_API_URL` — Backend API URL (frontend)

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /tickets | Create a ticket |
| GET | /tickets | Get all tickets (filterable) |
| PATCH | /tickets/:id | Update ticket status |
| DELETE | /tickets/:id | Delete a ticket |
| GET | /tickets/stats | Get ticket statistics |

## Live URLs
- **Frontend**: https://deskflow-shreya-2026.netlify.app
- **Backend**: Deploy on Render manually
