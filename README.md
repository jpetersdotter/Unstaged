# Unstaged

Unstaged is a concert review web app. Users can browse concert reviews, create an account, sign in, and write reviews with a rating from 1 to 5 stars.

The project has two parts:

backend — an Express API backed by SQLite.
frontend — a React, TypeScript, and Vite application.

## Requirements

Install [Node.js](https://nodejs.org/) and npm. Use a recent Node.js version that supports the versions of Vite and TypeScript specified in the project’s package files.

## Project structure

Unstaged/
├── backend/
│   ├── index.ts
│   ├── schema.sql
│   └── package.json
└── frontend/
    ├── src/
    ├── views/
    ├── components/
    └── package.json

## Setup

Open a terminal in the project folder, then install the dependencies for both parts:
cd backend
npm install
cd ../frontend
npm install

## Start the application

Run the backend and frontend in separate terminals.

Terminal 1: Backend
cd backend
npm run dev

The API starts at http://localhost:3001.

Terminal 2: Frontend
cd frontend
npm run dev

Vite prints the local frontend URL in the terminal, usually http://localhost:5173. Open that URL in a browser.

## Available frontend commands

Run these from the frontend directory:
npm run dev       # Start the Vite development server
npm run build     # Type-check and build the frontend
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint

## Notes
- Start the backend before using features that need the API.
- The backend opens database.sqlite from its current working directory, so run command "npm run dev" from backend.
- The backend currently checks usernames and passwords against the database directly. Do not use real or reused passwords with this app.
- The backend package does not currently define a test suite.
