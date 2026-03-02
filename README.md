# React CRUD Application

A full-stack CRUD (Create, Read, Update, Delete) application built with React and Node.js.

## Tech Stack

- **Frontend**: React 18, Vite, Axios
- **Backend**: Express.js
- **Data Storage**: JSON file

## Features

- Add new users
- View all users
- Edit existing users
- Delete users
- Search users by name or city
- Form validation
- Error handling with user feedback
- Loading states

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm

### Installation

1. Clone the repository
2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd server
   npm start
   ```
   Server runs on http://localhost:2000

2. Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

### Environment Variables

**Backend** (optional):
- `PORT`: Server port (default: 2000)
- `FRONTEND_URL`: Allowed CORS origin (default: http://localhost:5173)

**Frontend** (optional):
- `VITE_API_URL`: Backend API URL (default: http://localhost:2000)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create new user |
| PATCH | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

## Project Structure

```
crud/
├── client/          # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── server/          # Express backend
│   ├── index.js
│   ├── sample.json
│   └── package.json
└── README.md
```
