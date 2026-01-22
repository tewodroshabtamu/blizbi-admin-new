# Frontend Configuration Guide

## Overview

This document explains what the frontend needs to do to work with the deployed Blizbi backend API.

## Backend API Information

- **Deployed Backend URL**: (Update with your actual deployed URL)
- **Local Development Backend**: `http://localhost:8000` or `http://127.0.0.1:8000`
- **API Base Path**: All endpoints are at the root (e.g., `/events/`, `/providers/`)

## Authentication

The backend uses **Firebase Authentication** as the primary authentication method.

### How It Works

1. User logs in via Firebase (Google, Apple, etc.) on the frontend
2. Frontend receives a Firebase ID token
3. Frontend sends this token in API requests using the `Authorization` header
4. Backend verifies the token and authenticates the user

### Frontend Implementation

#### 1. Send Firebase ID Token in Requests

For authenticated requests, include the Firebase ID token:

```javascript
// Example using fetch
const firebaseIdToken = await user.getIdToken(); // Get token from Firebase Auth

fetch('https://your-deployed-backend.com/events/', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${firebaseIdToken}`,
    'Content-Type': 'application/json',
  },
});
```

#### 2. Handle Token Refresh

Firebase ID tokens expire after 1 hour. The frontend should refresh tokens automatically:

```javascript
// Firebase automatically refreshes tokens, but you can force refresh:
const refreshedToken = await user.getIdToken(true);
```

#### 3. Public Endpoints (No Authentication Required)

Some endpoints don't require authentication:
- `GET /events/` - List events
- `GET /providers/` - List providers
- `GET /feed/feed/` - Get feed
- `GET /health/` - Health check

For these endpoints, you can make requests without the Authorization header.

#### 4. Protected Endpoints (Authentication Required)

These endpoints require a valid Firebase ID token:
- `GET /profile/` - User profile
- `POST /agenda/` - Create agenda entry
- `POST /chat/` - Send chat message
- `GET /users/providers/following/` - Get followed providers
- And other user-specific endpoints

## CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:5173` (Vite default port)
- `http://127.0.0.1:5173`

For production, update `CORS_ALLOWED_ORIGINS` in the backend `.env` to include your frontend domain.

## API Base URL Configuration

### Development

```javascript
// In your frontend config (e.g., .env, config.js)
const API_BASE_URL = 'http://localhost:8000';
// or
const API_BASE_URL = 'http://127.0.0.1:8000';
```

### Production

```javascript
const API_BASE_URL = 'https://your-deployed-backend.com';
```

## Example Frontend Code

### Using Axios

```javascript
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

// Add Firebase token to requests
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Use the API
const fetchEvents = async () => {
  const response = await api.get('/events/');
  return response.data;
};
```

### Using Fetch

```javascript
import { getAuth } from 'firebase/auth';

const getAuthHeaders = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
  };
};

const fetchEvents = async () => {
  const headers = await getAuthHeaders();
  const response = await fetch('http://localhost:8000/events/', {
    headers,
  });
  return response.json();
};
```

## Error Handling

### 401 Unauthorized

This means:
- Token is missing
- Token is expired
- Token is invalid

**Solution**: Refresh the token or re-authenticate the user.

```javascript
try {
  const response = await api.get('/profile/');
} catch (error) {
  if (error.response?.status === 401) {
    // Token expired or invalid
    // Force refresh token
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const newToken = await user.getIdToken(true);
      // Retry request with new token
    } else {
      // User not logged in, redirect to login
    }
  }
}
```

### 403 Forbidden

User doesn't have permission for the requested action.

### 404 Not Found

Resource doesn't exist.

## Testing

### Test Public Endpoints (No Auth)

```bash
curl http://localhost:8000/events/?page_size=1
curl http://localhost:8000/providers/?page_size=1
```

### Test Authenticated Endpoints

You'll need a valid Firebase ID token:

```bash
# Get token from your frontend (in browser console after login)
TOKEN="your-firebase-id-token"

curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/profile/
```

## Important Notes

1. **Token Expiration**: Firebase ID tokens expire after 1 hour. Implement automatic token refresh.

2. **Token Format**: Always use `Bearer <token>` format in the Authorization header.

3. **CORS**: Make sure your frontend origin is allowed in the backend CORS settings.

4. **Base URL**: Use environment variables for API base URL to easily switch between dev and production.

5. **Error Handling**: Always handle 401 errors by refreshing the token or re-authenticating.

## Environment Variables for Frontend

Create a `.env` file in your frontend project:

```env
# Development
REACT_APP_API_URL=http://localhost:8000
# or
VITE_API_URL=http://localhost:8000

# Production
REACT_APP_API_URL=https://your-deployed-backend.com
# or
VITE_API_URL=https://your-deployed-backend.com
```

## Summary

1. ✅ Get Firebase ID token after user login
2. ✅ Include token in `Authorization: Bearer <token>` header for authenticated requests
3. ✅ Handle token refresh when tokens expire (401 errors)
4. ✅ Use correct API base URL (dev vs production)
5. ✅ Ensure CORS is configured correctly
6. ✅ Public endpoints work without authentication
7. ✅ Protected endpoints require valid Firebase token

---

**Last Updated**: January 22, 2026
