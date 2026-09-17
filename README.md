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
