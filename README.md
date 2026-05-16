# Smart Leads Dashboard

A production-quality Lead Management Dashboard built with the MERN stack and TypeScript. This application features secure JWT authentication, Role-Based Access Control (RBAC), advanced lead management with filtering and search, and a modern, responsive UI.

## 🚀 Features

- **Full-Stack TypeScript**: Strict typing across frontend and backend.
- **Secure Authentication**: JWT-based login and registration with bcrypt password hashing.
- **Role-Based Access Control (RBAC)**: Admin and Sales roles with specific permissions.
- **Leads Management**: Complete CRUD operations for customer leads.
- **Advanced Filtering & Search**: Combined status/source filters with debounced real-time search.
- **Backend Pagination**: Efficient data fetching with skip/limit.
- **CSV Export**: Export filtered lead data to CSV.
- **Modern UI/UX**: Premium design using TailwindCSS, Lucide icons, and Framer-like micro-animations.
- **Dark Mode Support**: Persistent dark/light theme toggle.
- **Dockerized**: Easy setup using Docker and Docker Compose.

## 🛠 Technology Stack

### Frontend
- **React 19**
- **TypeScript**
- **TailwindCSS**
- **Redux Toolkit** (State Management)
- **React Hook Form + Zod** (Validation)
- **Axios** (API Client)
- **Lucide React** (Icons)

### Backend
- **Node.js + Express**
- **TypeScript**
- **MongoDB + Mongoose** (Database)
- **JWT** (Authentication)
- **Bcrypt.js** (Hashing)
- **Zod** (Request Validation)
- **CSV Writer** (Export)

## 📁 Project Structure

### Backend
```
src/
├── controllers/    # Request handlers
├── services/       # Business logic
├── repositories/   # Database layer
├── models/         # Mongoose schemas
├── middlewares/    # Auth, Role, Error handling
├── routes/         # API endpoints
├── types/          # TS definitions
└── utils/          # Helpers (JWT, CSV)
```

### Frontend
```
src/
├── components/     # UI components
├── pages/          # View components
├── store/          # Redux slices
├── hooks/          # Custom hooks
├── services/       # API services
├── layouts/        # Page wrappers
├── types/          # TS definitions
└── utils/          # Formatting & helpers
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Docker)
- Docker & Docker Compose (Optional but recommended)

### Local Development Setup

1. **Clone the repository**
2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env # Update MONGODB_URI and JWT_SECRET
   npm run dev
   ```
3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Docker Setup
Simply run:
```bash
docker-compose up --build
```
This will start MongoDB, the Backend (port 5000), and the Frontend (port 80).

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Leads
- `GET /api/leads` - Get all leads (Supports filtering, search, pagination)
- `POST /api/leads` - Create a new lead
- `GET /api/leads/:id` - Get single lead details
- `PUT /api/leads/:id` - Update lead details
- `DELETE /api/leads/:id` - Delete lead (Admin only)
- `GET /api/leads/export` - Export filtered leads to CSV

## 📝 Environment Variables

### Backend (`.env`)
- `PORT`: Port number (default 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `NODE_ENV`: development / production

### Frontend (`.env`)
- `VITE_API_URL`: Backend API URL

## 🎨 Design Principles
The UI is designed to feel like a modern SaaS dashboard (HubSpot/Salesforce style). It uses a clean sidebar layout, glassmorphism effects for the navbar, and a curated color palette of deep blues and slates.
