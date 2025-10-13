# Next Models Nepal

A full-stack web application built with Next.js frontend and Express.js backend.

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- MongoDB instance

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
└── package.json       # Root workspace configuration
```

## Environment Configuration

### Backend Environment Variables

Create `backend/.env` file with the following variables:

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DATABASE_URI=mongodb://localhost:27017/nextModelsNepal

# Authentication
JWT_SECRET=your_jwt_secret_key

# Application
APP_BASE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
PRODUCTION=FALSE

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Email Configuration
COMPANY_EMAIL=your_email@example.com
COMPANY_PASSWORD=your_email_password

# Fonepay Payment Gateway
FONEPAY_MODE=dev
FONEPAY_DEV_PID=NBQM
FONEPAY_DEV_SECRET_KEY=a7e3512f5032480a83137793cb2021dc
FONEPAY_LIVE_PID=
FONEPAY_LIVE_SECRET_KEY=
FONEPAY_REDIRECT_BASE_URL=
FONEPAY_API_USER=
FONEPAY_API_PASS=
FONEPAY_API_SECRET=
FONEPAY_API_BASE_URL=

# Monitoring (Optional)
PROMETHEUS_ENABLED=false
```

### Frontend Environment Variables

Create `frontend/.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Installation

Install dependencies for all workspaces:

```bash
pnpm install
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:

```bash
# Terminal 1 - Backend
cd backend
pnpm dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Production Build

Build both applications:

```bash
# Build backend
cd backend
pnpm run build:prod

# Build frontend
cd frontend
pnpm build
```

Run production servers:

```bash
# Start backend
cd backend
pnpm start

# Start frontend
cd frontend
pnpm start
```

## Available Scripts

### Backend Scripts

```bash
pnpm dev              # Start development server with hot reload
pnpm build            # Compile TypeScript to JavaScript
pnpm start            # Run production build
pnpm build:prod       # Clean and build for production
```

### Frontend Scripts

```bash
pnpm dev              # Start Next.js development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
```

## Technology Stack

### Frontend
- Next.js 15.4.4
- React 19.1.0
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Express.js 5.1.0
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer
- Multer (File uploads)
- Helmet & CORS (Security)

## Database Setup

Ensure MongoDB is running locally or provide a remote MongoDB URI in the `DATABASE_URI` environment variable.
