# Blizbi Admin Panel

Admin dashboard for managing providers and events on the Blizbi platform.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Firebase Authentication
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend API
VITE_API_BASE_URL=http://localhost:8000

# App Version (optional)
VITE_APP_VERSION=1.0.0
```

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google Sign-In providers
3. Copy your Firebase configuration values to the `.env` file

### Backend API

The application communicates with a Django backend API. Ensure the backend is running and accessible at the URL specified in `VITE_API_BASE_URL`.

## Authentication

The application uses **Firebase Authentication** with support for:
- Email & Password login
- Google Sign-In
- Protected routes with automatic token refresh
- Session management

All API requests to protected endpoints automatically include Firebase authentication tokens in the `Authorization` header.

## User Roles

### Admin
- Full access to all features
- Can manage providers (create, edit, delete, activate/deactivate)
- Can view all events and dashboard data
- Access to all administrative functions

### Provider
- Can only see their own events
- Can create/edit/delete events for their organization
- Can edit their own organization info
- Limited access to provider management features

## Key Features

| Feature | Description |
|---------|-------------|
| Dashboard | Overview stats, provider metrics, recent events |
| Events | Full CRUD operations for event management |
| Providers | CRUD operations with active/inactive status |
| Authentication | Firebase-based auth with email/password and Google Sign-In |
| API Integration | Clean abstraction layer for backend API communication |

## Project Structure

```
src/
├── components/       # Reusable UI components
├── contexts/        # React contexts (Auth, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Core libraries (Firebase, API client)
├── pages/           # Page components
├── routes/          # Route definitions
├── services/        # API service layer
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## API Integration

The application uses a centralized API client (`src/lib/api-client.ts`) that:
- Automatically adds Firebase auth tokens to protected endpoints
- Handles token refresh on 401 errors
- Provides consistent error handling
- Supports public endpoints that don't require authentication

Service layer files in `src/services/` provide clean abstractions for:
- Dashboard data
- Events management
- Providers management
- Locations
- Health checks

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Firebase** - Authentication
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Router** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation

## Development

### Running Locally

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required variables
4. Start dev server: `npm run dev`
5. Open `http://localhost:5173` in your browser

### Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory.

## Deployment

The application can be deployed to any static hosting service or VPS. Ensure:
- Environment variables are properly configured
- Backend API is accessible from the deployment environment
- Firebase project allows requests from the deployment domain

## Route Protection

Protected routes require Firebase authentication. Unauthenticated users are redirected to the login page.

Provider management routes are restricted based on user roles, with providers having limited access to their own organization data.
