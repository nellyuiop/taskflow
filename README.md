# TaskFlow - Full-Stack Project Management Platform

A full-stack application built during the Compu-Vision Internship. It consists of a backend REST API, a React Admin CMS, and a Next.js Public Frontend.

## 🏗️ Project Structure

This is a monorepo containing three distinct applications:

- `/server` — Backend REST API (Node.js, Express, MongoDB/Mongoose)
- `/admin` — Admin CMS (React, Vite, Tailwind CSS, Axios)
- `/frontend` — Public-facing Website (Next.js, Tailwind CSS)

## 🚀 Getting Started

### Prerequisites

- Node.js installed
- A MongoDB Atlas account (or local MongoDB instance)

### 1. Backend (`/server`)

1. `cd server`
2. `npm install`
3. Create a `.env` file in the `/server` directory with:
   ```text
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
