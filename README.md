# TaskFlow API

Full-Stack Web Development Internship Project (Week 1)

## Overview

TaskFlow is a mini Project & Task Management Platform. This repository currently contains the backend REST API, built with Node.js, Express, and MongoDB.

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB (via Mongoose)
- Authentication: JWT (JSON Web Tokens) and bcrypt
- Tools: Git, Postman, VS Code

## How to Run Locally

1. Clone the repository:

   ```bash
   git clone https://github.com/nellyuiop/taskflow.git
   cd taskflow/server
   ```

   2. Install dependencies:

   ```bash
   npm install
   ```

   3. Create a `.env` file in the `server` folder and add the following variables:

   ```text
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

   ```

2. Start the development server:
   ```bash
   npm run dev
   ```
   ## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive a JWT token

### Projects (Protected - Requires JWT)

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks (Protected - Requires JWT)

- `GET /api/projects/:projectId/tasks` - Get tasks for a specific project
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Postman Collection

A complete Postman collection containing all API requests (with authentication setup) can be found in the `docs` folder: `TaskFlow_Week1_Postman.json`.

## Database Schema

The database schema diagram for this project is available in the `docs` folder.

## 🖥️ Week 2 - Admin CMS (React)

A React-based admin panel to manage the TaskFlow backend.

- Location: `/admin` folder
- Features: JWT Login, Protected Routes, Dashboard stats, Full CRUD for Projects & Tasks.
- Tech Stack: React (Vite), React Router, Axios, Custom CSS.
- How to Run:
  ```bash
  cd admin
  npm install
  npm run dev
  ```
