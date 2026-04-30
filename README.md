# 🚀 Team Task Manager

A robust, full-stack collaborative project management platform designed to help teams organize, track, and complete their work efficiently. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and stylized with **Tailwind CSS v4** and a beautiful glassmorphism aesthetic.

---

## ✨ Key Features

- **🔐 Secure Authentication**: JWT-based role authentication (Admin vs. Member).
- **🌓 Dark/Light Mode**: Full system preference detection and persistent theme toggle.
- **📁 Workspace Management**: Create multiple project spaces, invite members via tokens, and manage team roles.
- **✅ Interactive Kanban Board**: Drag-and-drop tasks seamlessly across 'To Do', 'In Progress', and 'Done' columns.
- **📊 Real-Time Analytics**: Visual dashboard with interactive charts (Recharts) detailing priority distributions and 30-day activity trends.
- **⚡ Real-Time Collaboration**: Instant task updates pushed to all active project members using `Socket.io`.
- **📱 Responsive UI**: A fully mobile-responsive interface optimized for performance and aesthetics.

---

## 🛠️ Tech Stack

### Frontend
*   **React 19** (Vite)
*   **Tailwind CSS v4** (Utility-first styling with class-based Dark Mode)
*   **Recharts** (Data visualization)
*   **@hello-pangea/dnd** (Accessible drag-and-drop for Kanban boards)
*   **Lucide React** (Modern iconography)
*   **React Router v7** (Client-side routing)
*   **React Hot Toast** (Toast notifications)
*   **Socket.io-Client** (Real-time events)

### Backend
*   **Node.js & Express** (RESTful API framework)
*   **MongoDB & Mongoose** (NoSQL Database and ODM)
*   **Socket.io** (WebSocket server for real-time syncing)
*   **JWT & Bcryptjs** (Authentication & Security)
*   **Express Rate Limit & Helmet** (API Security)

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/team-task-manager.git
cd team-task-manager
```

### 2. Backend Setup
Navigate to the `server` directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# or for development with nodemon (if installed)
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the `client` directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory and configure the API URLs:
```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

Start the frontend development server:
```bash
npm run dev
```

The application will now be running at `http://localhost:5173` (or the port Vite provides).

---

## 📂 Project Structure

```text
Team Task Manager/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── api/                # Axios instances and API wrappers
│   │   ├── components/         # Reusable UI components (Navbar, ThemeToggle)
│   │   ├── context/            # React Context providers (Auth, Theme, Projects)
│   │   ├── pages/              # Main route views (Dashboard, Projects, Kanban)
│   │   ├── index.css           # Global Tailwind and base styles
│   │   └── main.jsx            # Application entry point
│   ├── tailwind.config.js      # Tailwind configurations
│   └── package.json            
│
├── server/                     # Node.js / Express Backend
│   ├── config/                 # Database configurations
│   ├── controllers/            # Route logic and request handlers
│   ├── middleware/             # Auth protection and global error handlers
│   ├── models/                 # Mongoose schemas (User, Project, Task)
│   ├── routes/                 # Express API routes
│   ├── server.js               # Main server entry & Socket.io setup
│   └── package.json            
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
*   `POST /api/auth/register` - Register a new user
*   `POST /api/auth/login` - Authenticate user & get token
*   `GET /api/auth/me` - Get current user profile

### Projects
*   `GET /api/projects` - Get all user projects
*   `POST /api/projects` - Create a new project
*   `GET /api/projects/:id` - Get specific project details
*   `PUT /api/projects/:id` - Update project settings/status
*   `DELETE /api/projects/:id` - Delete a project (Admin only)
*   `POST /api/projects/join/:token` - Join a project using an invite token

### Tasks
*   `GET /api/tasks/:projectId` - Get all tasks for a project
*   `POST /api/tasks/:projectId` - Create a new task
*   `PUT /api/tasks/:taskId/status` - Update task status (Drag & Drop)
*   `DELETE /api/tasks/:taskId` - Delete a task

### Dashboard
*   `GET /api/dashboard/stats` - Retrieve 30-day activity, status distributions, and user stats

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/your-username/team-task-manager/issues) if you want to contribute.

## 📝 License
This project is licensed under the [MIT License](LICENSE).
