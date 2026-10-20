# TaskFlow — Full-Stack Project Management Platform

A project and task management application built during the Compu-Vision Internship. TaskFlow includes a backend REST API, a protected admin panel, and a public website.

## Live Applications

- [Public Website](https://taskflowfrontend-three.vercel.app)
- [Admin Panel](https://taskflow-jade-beta-13.vercel.app/login)

The website and admin panel are hosted on Vercel. The backend API is hosted on Render.

## Project Structure

- `server/` — REST API built with Node.js, Express, and MongoDB/Mongoose.
- `admin/` — Admin panel built with React, Vite, and Axios.
- `frontend/` — Public website built with Next.js and Tailwind CSS.

## Features

- Admin login with JWT authentication.
- Create, view, edit, and delete projects and tasks through the admin panel.
- Public project dashboard with task progress.
- Individual project pages with expandable task details.
- Responsive layouts with gradient backgrounds, Inter typography, and SVG icons.

## Local Setup

### Prerequisites

- Node.js and npm.
- A MongoDB Atlas connection or local MongoDB instance.

Run each application in a separate terminal. Start each set of commands from the project root.

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
```

Start the backend:

```bash
npm run dev
```

Local API URL: `http://localhost:5001`

### 2. Admin Panel

```bash
cd admin
npm install
```

Create `admin/.env`:

```env
VITE_API_URL=http://localhost:5001
```

Start the admin panel:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### 3. Public Website

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

Start the website:

```bash
npm run dev
```

Local website URL: `http://localhost:3000`

## Authentication and Access

The admin panel uses JWT authentication. Protected API requests include:

```http
Authorization: Bearer <token>
```

Creating, editing, and deleting projects or tasks requires authorization enforced by the backend. Public API routes provide read-only access for the website.

Never commit environment files, database credentials, JWT secrets, or account passwords. Frontend environment variables are publicly visible and must not contain secrets.

## API Overview

### Authentication

- `POST /api/auth/login` — Log in and receive a token.

### Public Access

- `GET /api/public/projects` — List projects.
- `GET /api/public/projects/:id` — View a project.
- `GET /api/public/tasks` — List tasks.

### Protected Project Management

- `GET /api/projects` — List projects.
- `POST /api/projects` — Create a project.
- `PUT /api/projects/:id` — Update a project.
- `DELETE /api/projects/:id` — Delete a project.

### Protected Task Management

- `GET /api/tasks` — List tasks.
- `POST /api/tasks` — Create a task.
- `PUT /api/tasks/:id` — Update a task.
- `DELETE /api/tasks/:id` — Delete a task.

## Development Progress

### Week 3 — Public Website

- Built the Next.js welcome page and public dashboard.
- Connected the dashboard to live API data and displayed project progress.
- Added dynamic project detail pages.
- Improved navigation and mobile responsiveness.

### Week 4 — Integration, Deployment, and Interface Refinement

- Completed end-to-end integration checks.
- Fixed cascading task deletion when deleting a project.
- Configured environment variables and production API connections.
- Deployed the website and admin panel on Vercel and the backend on Render.
- Fixed admin route refresh errors and backend startup behavior.
- Refined the welcome page, dashboards, navigation, and admin controls.
- Unified the design with blue gradients, Inter typography, and SVG icons.
- Improved the blurred login background and incorrect-credentials feedback.
- Added expandable task details to public project pages.

## Production Builds

From the project root:

```bash
npm --prefix admin run build
npm --prefix frontend run build
```

Production frontend environment variables must point to the deployed backend API rather than localhost.
