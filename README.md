# InternTrack Pro 

**Internship Application & Task Tracker Platform**

A production-quality full-stack MERN application for students and administrators to manage internship applications, tasks, and submissions.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (httpOnly cookies) + bcrypt |
| File Upload | Multer |

## Quick Start

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit the `.env` file in the root directory:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.vrn8bkq.mongodb.net/interntrack
JWT_SECRET=your_jwt_secret
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

### 4. Run the Application

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@interntrack.com | admin123 |
| Student 1 | rahul@test.com | password123 |
| Student 2 | priya@test.com | password123 |
| Student 3 | amit@test.com | password123 |
| Student 4 | sneha@test.com | password123 |
| Student 5 | vikram@test.com | password123 |

## Features

### Student Dashboard
-  Stats overview with charts
-  Internship application tracker with status pipeline
-  Task management with progress tracking
-  Profile management with resume upload
-  Search & filter applications

### Admin Dashboard
-  Student management
-  Internship posting & management
-  Task assignment & tracking
-  Submission review with grading
-  Analytics dashboard

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── .env             # Environment variables
└── README.md        # This file
```

## License

MIT © 2026 InternTrack Pro
