<<<<<<< HEAD
# frontend-trello
This project is a task management application similar to Trello. The application allows users to create, update, and manage tasks within different columns. It supports drag-and-drop functionality for moving tasks between columns. Additionally, users can sign up and log in, including the option to log in via Google.
=======
# task-manager-app
This project is a task management application similar to Trello. The application allows users to create, update, and manage tasks within different columns. It supports drag-and-drop functionality for moving tasks between columns. Additionally, users can sign up and log in, including the option to log in via Google.
Features

Task Management:

Create, update, and delete tasks.

Drag-and-drop functionality to move tasks between columns.

Retrieve all tasks.

User Authentication:
User registration and login.
Google login authentication.
RESTful API:
CRUD (Create, Read, Update, Delete) operations for tasks.
Authentication routes for user registration, login, and Google login.
Technologies Used
Frontend:
React
Tailwind CSS
Axios
Backend:
Node.js

Express.js

Prisma ORM

PostgreSQL

Zod for validation

Google Auth

JWT for authentication

Getting Started

Prerequisites

Node.js

PostgreSQL

A Google Cloud Platform account for Google Auth setup

Setup Project
Frontend
cd /frontend

npm i

Create a .env file in the root directory and add the following variables: VITE_GOOGLE_CLIENT_ID

npm run dev

Backend
-cd /backend

npm i

Set up environment variables:

Create a .env file in the root directory and add the following variables: DATABASE_URL=your_database_url JWT_SECRET=your_jwt_secret GOOGLE_CLIENT_ID=your_google_client_id GOOGLE_CLIENT_SECRET=your_google_client_secret

npx prisma migrate dev

node index.js
>>>>>>> 84cc43a (adding the frontend files)
