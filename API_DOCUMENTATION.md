# Blizbi API Documentation

**Base URL**: `http://localhost:8000`  
**API Version**: 1.0.0  
**Documentation**: Swagger UI available at `/docs/` or `/schema/`

## Table of Contents

1. [Authentication](#authentication)
2. [Health Check](#health-check)
3. [Users](#users)
4. [Events](#events)
5. [Providers](#providers)
6. [Agenda](#agenda)
7. [Chat](#chat)
8. [Feed](#feed)
9. [Analytics](#analytics)
10. [Core/Locations](#corelocations)

---

## Authentication

The API uses **JWT (JSON Web Tokens)** for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-access-token>
```

**Primary Authentication**: Firebase ID tokens  
**Fallback Authentication**: JWT tokens

### Token Refresh

**Endpoint**: `POST /token/refresh/`

Refresh an expired access token using a refresh token.

**Request Body**:
```json
{
  "refresh": "your-refresh-token"
}
```

**Response**:
```json
{
  "access": "new-access-token"
}
```

---

## Health Check

### Health Check

**Endpoint**: `GET /health/`

Check API health status.

**Authentication**: Not required

**Response**:
```json
{
  "status": "ok",
  "timezone": "UTC",
  "current_time": "2026-01-22T14:07:08.777227+00:00",
  "message": "Everything is ok"
}
```

---

## Users

### Get User Profile

**Endpoint**: `GET /profile/`

Get the current authenticated user's profile.

**Authentication**: Required

**Response**:
```json
{
  "id": 1,
  "username": "user123",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "avatar_url": "https://...",
  ...
}
```

### Update User Profile

**Endpoint**: `PATCH /profile/`

Update the current user's profile.

**Authentication**: Required

**Request Body** (all fields optional):
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "username": "newusername",
  "phone_number": "+1234567890",
  "avatar_url": "https://..."
}
```

### Follow Provider

**Endpoint**: `POST /providers/{provider_id}/follow/`

Follow a provider.

**Authentication**: Required

**Response**:
```json
{
  "message": "Successfully followed provider",
  "provider_id": 1
}
```

### Unfollow Provider

**Endpoint**: `DELETE /providers/{provider_id}/follow/`

Unfollow a provider.

**Authentication**: Required

**Response**: `204 No Content`

### Check Following Status

**Endpoint**: `GET /providers/{provider_id}/following/`

Check if the current user is following a provider.

**Authentication**: Required

**Response**:
```json
{
  "is_following": true,
  "provider_id": 1
}
```

### Get Followed Providers

**Endpoint**: `GET /providers/following/`

Get all providers the current user is following.

**Authentication**: Required

**Response**:
```json
[
  {
    "id": 1,
    "name": "Provider Name",
    "description": "...",
    ...
  }
]
```

---

## Events

### List Events

**Endpoint**: `GET /events/`

Get a paginated list of all events.

**Authentication**: Not required

**Query Parameters**:
- `page` (integer, default: 1) - Page number
- `page_size` (integer, default: 25) - Items per page

**Response**:
```json
{
  "results": [
    {
      "id": 1,
      "title": "Event Title",
      "description": "...",
      "start_date": "2026-01-25T10:00:00Z",
      "end_date": "2026-01-25T18:00:00Z",
      "location": {...},
      "provider": {...},
      ...
    }
  ],
  "pagination": {
    "total": 100,
    "count": 25,
    "page": 1,
    "page_size": 25,
    "total_pages": 4,
    "next": "http://localhost:8000/events/?page=2&page_size=25",
    "previous": null
  }
}
```

### Get Event Details

**Endpoint**: `GET /events/{id}/`

Get detailed information about a specific event.

**Authentication**: Not required

**Response**:
```json
{
  "id": 1,
  "title": "Event Title",
  "description": "...",
  "start_date": "2026-01-25T10:00:00Z",
  "end_date": "2026-01-25T18:00:00Z",
  "location": {...},
  "provider": {...},
  "image_url": "...",
  ...
}
```

### Create Event

**Endpoint**: `POST /events/`

Create a new event.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "Event Title",
  "description": "Event description",
  "start_date": "2026-01-25T10:00:00Z",
  "end_date": "2026-01-25T18:00:00Z",
  "location_id": 1,
  "provider_id": 1,
  ...
}
```

### Special Offers

#### List All Special Offers

**Endpoint**: `GET /events/special-offers/`

Get all special offers (admin/global view).

**Authentication**: Required

#### Get Special Offer Details

**Endpoint**: `GET /events/special-offers/{id}/`

Get details of a specific special offer.

**Authentication**: Required

#### List Provider's Special Offers

**Endpoint**: `GET /events/providers/{provider_id}/special-offers/`

Get all special offers for a specific provider.

**Authentication**: Required

#### Get Provider's Special Offer

**Endpoint**: `GET /events/providers/{provider_id}/special-offers/{id}/`

Get a specific special offer from a provider.

**Authentication**: Required

---

## Providers

### List Providers

**Endpoint**: `GET /providers/`

Get a paginated list of all providers.

**Authentication**: Not required

**Query Parameters**:
- `page` (integer, default: 1) - Page number
- `page_size` (integer, default: 25) - Items per page

**Response**:
```json
{
  "results": [
    {
      "id": 1,
      "name": "Provider Name",
      "description": "...",
      "logo_url": "...",
      "website": "...",
      ...
    }
  ],
  "pagination": {
    "total": 50,
    "count": 25,
    "page": 1,
    "page_size": 25,
    "total_pages": 2,
    "next": "http://localhost:8000/providers/?page=2&page_size=25",
    "previous": null
  }
}
```

### Get Provider Details

**Endpoint**: `GET /providers/{id}/`

Get detailed information about a specific provider.

**Authentication**: Not required

**Response**:
```json
{
  "id": 1,
  "name": "Provider Name",
  "description": "...",
  "logo_url": "...",
  "website": "...",
  "email": "...",
  "phone": "...",
  "locations": [...],
  "events": [...],
  ...
}
```

### Municipalities

#### List Municipalities

**Endpoint**: `GET /providers/municipalities/`

Get a list of all municipalities.

**Authentication**: Not required

#### Get Municipality Details

**Endpoint**: `GET /providers/municipalities/{id}/`

Get details of a specific municipality.

**Authentication**: Not required

---

## Agenda

### Get My Agenda

**Endpoint**: `GET /agenda/`

Get all agenda entries for the current user.

**Authentication**: Required

**Response**:
```json
[
  {
    "id": 1,
    "event": {...},
    "user": {...},
    "notes": "...",
    "reminder_time": "2026-01-25T09:00:00Z",
    "created_at": "2026-01-22T10:00:00Z",
    ...
  }
]
```

### Create Agenda Entry

**Endpoint**: `POST /agenda/`

Add an event to the user's agenda.

**Authentication**: Required

**Request Body**:
```json
{
  "event_id": 1,
  "notes": "Optional notes",
  "reminder_time": "2026-01-25T09:00:00Z"
}
```

### Get Agenda Entry

**Endpoint**: `GET /agenda/{id}/`

Get a specific agenda entry.

**Authentication**: Required

### Update Agenda Entry

**Endpoint**: `PATCH /agenda/{id}/`

Update an agenda entry.

**Authentication**: Required

**Request Body** (all fields optional):
```json
{
  "notes": "Updated notes",
  "reminder_time": "2026-01-25T09:30:00Z"
}
```

### Delete Agenda Entry

**Endpoint**: `DELETE /agenda/{id}/`

Remove an event from the agenda.

**Authentication**: Required

**Response**: `204 No Content`

### Get Event-Specific Agenda

**Endpoint**: `GET /agenda/events/{event_id}/`

Get agenda entry for a specific event (if it exists in user's agenda).

**Authentication**: Required

---

## Chat

### Send Chat Message

**Endpoint**: `POST /chat/`

Send a message to the AI chat.

**Authentication**: Required

**Request Body**:
```json
{
  "message": "Your message here",
  "conversation_id": "optional-uuid" // Optional: continue existing conversation
}
```

**Response**:
```json
{
  "response": "AI response text",
  "conversation_id": "uuid",
  "message_id": "uuid"
}
```

### Get Conversation

**Endpoint**: `GET /chat/{conversation_id}/`

Get all messages in a conversation.

**Authentication**: Required

**Response**:
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "User message",
      "timestamp": "2026-01-22T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "AI response",
      "timestamp": "2026-01-22T10:00:01Z"
    }
  ]
}
```

### Update Conversation Title

**Endpoint**: `PATCH /chat/{conversation_id}/`

Update the title of a conversation.

**Authentication**: Required

**Request Body**:
```json
{
  "title": "New conversation title"
}
```

### Delete Conversation

**Endpoint**: `DELETE /chat/{conversation_id}/`

Delete a conversation.

**Authentication**: Required

**Response**: `204 No Content`

### List Conversations

**Endpoint**: `GET /chat/conversations/`

Get all conversations for the current user.

**Authentication**: Required

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "Conversation Title",
    "created_at": "2026-01-22T10:00:00Z",
    "updated_at": "2026-01-22T10:05:00Z",
    "is_archived": false,
    "message_count": 10
  }
]
```

### List Archived Conversations

**Endpoint**: `GET /chat/conversations/archived/`

Get all archived conversations.

**Authentication**: Required

### Archive Conversation

**Endpoint**: `POST /chat/conversations/{conversation_id}/archive/`

Archive a conversation.

**Authentication**: Required

### Unarchive Conversation

**Endpoint**: `POST /chat/conversations/{conversation_id}/unarchive/`

Unarchive a conversation.

**Authentication**: Required

### Clear Conversation History

**Endpoint**: `DELETE /chat/conversations/{conversation_id}/clear/`

Clear all messages from a conversation (keeps the conversation).

**Authentication**: Required

### Clear All Conversations

**Endpoint**: `DELETE /chat/conversations/clear-all/`

Clear all conversations for the current user.

**Authentication**: Required

---

## Feed

### Get Feed

**Endpoint**: `GET /feed/feed/`

Get personalized feed with events and providers.

**Authentication**: Not required (but personalized if authenticated)

**Response**:
```json
{
  "recommended_events": [...],
  "happening_soon": [...],
  "near_you": [...],
  "from_followed_partners": [...],
  "new_providers": [...],
  "recommended_providers": [...]
}
```

### Get Popular Events

**Endpoint**: `GET /feed/popular-events/`

Get popular/trending events.

**Authentication**: Not required

**Query Parameters**:
- `limit` (integer, optional) - Number of events to return

### Search

**Endpoint**: `GET /feed/search/`

Search for events, providers, or locations.

**Authentication**: Not required

**Query Parameters**:
- `q` (string, required) - Search query
- `type` (string, optional) - Filter by type: "events", "providers", "locations", or "all"

**Response**:
```json
{
  "events": [...],
  "providers": [...],
  "locations": [...]
}
```

### Map Events

**Endpoint**: `GET /feed/map/events/`

Get events for map display.

**Authentication**: Not required

**Query Parameters**:
- `lat` (float, optional) - Latitude
- `lng` (float, optional) - Longitude
- `radius` (float, optional) - Search radius in km

### Map Providers

**Endpoint**: `GET /feed/map/providers/`

Get providers for map display.

**Authentication**: Not required

**Query Parameters**:
- `lat` (float, optional) - Latitude
- `lng` (float, optional) - Longitude
- `radius` (float, optional) - Search radius in km

---

## Analytics

### Interests

#### List Interests

**Endpoint**: `GET /analytics/interests/`

Get all available interests.

**Authentication**: Required

#### Create Interest

**Endpoint**: `POST /analytics/interests/`

Create a new interest.

**Authentication**: Required

#### Get Interest

**Endpoint**: `GET /analytics/interests/{id}/`

Get a specific interest.

**Authentication**: Required

#### Update Interest

**Endpoint**: `PUT /analytics/interests/{id}/` or `PATCH /analytics/interests/{id}/`

Update an interest.

**Authentication**: Required

#### Delete Interest

**Endpoint**: `DELETE /analytics/interests/{id}/`

Delete an interest.

**Authentication**: Required

### Interest Categories

#### List Interest Categories

**Endpoint**: `GET /analytics/interest-categories/`

Get all interest categories.

**Authentication**: Required

#### Create Interest Category

**Endpoint**: `POST /analytics/interest-categories/`

Create a new interest category.

**Authentication**: Required

#### Get Interest Category

**Endpoint**: `GET /analytics/interest-categories/{id}/`

Get a specific interest category.

**Authentication**: Required

#### Update Interest Category

**Endpoint**: `PUT /analytics/interest-categories/{id}/` or `PATCH /analytics/interest-categories/{id}/`

Update an interest category.

**Authentication**: Required

#### Delete Interest Category

**Endpoint**: `DELETE /analytics/interest-categories/{id}/`

Delete an interest category.

**Authentication**: Required

### User Interests

#### List User Interests

**Endpoint**: `GET /analytics/user-interests/`

Get all user interests.

**Authentication**: Required

#### Create User Interest

**Endpoint**: `POST /analytics/user-interests/`

Associate an interest with a user.

**Authentication**: Required

**Request Body**:
```json
{
  "user": 1,
  "interest": 1
}
```

#### Get User Interest

**Endpoint**: `GET /analytics/user-interests/{id}/`

Get a specific user interest.

**Authentication**: Required

#### Delete User Interest

**Endpoint**: `DELETE /analytics/user-interests/{id}/`

Remove an interest from a user.

**Authentication**: Required

---

## Core/Locations

### List Locations

**Endpoint**: `GET /core/locations/`

Get all locations.

**Authentication**: Required

**Response**:
```json
[
  {
    "id": 1,
    "name": "Location Name",
    "address": "...",
    "city": "...",
    "latitude": 40.7128,
    "longitude": -74.0060,
    ...
  }
]
```

### Get Location Details

**Endpoint**: `GET /core/locations/{id}/`

Get detailed information about a specific location.

**Authentication**: Required

### Create Location

**Endpoint**: `POST /core/locations/`

Create a new location.

**Authentication**: Required

**Request Body**:
```json
{
  "name": "Location Name",
  "address": "123 Main St",
  "city": "City Name",
  "latitude": 40.7128,
  "longitude": -74.0060,
  ...
}
```

### Update Location

**Endpoint**: `PUT /core/locations/{id}/` or `PATCH /core/locations/{id}/`

Update a location.

**Authentication**: Required

### Delete Location

**Endpoint**: `DELETE /core/locations/{id}/`

Delete a location.

**Authentication**: Required

**Response**: `204 No Content`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "An internal server error occurred"
}
```

---

## Pagination

Many list endpoints support pagination with the following query parameters:

- `page` (integer, default: 1) - Page number (1-indexed)
- `page_size` (integer, default: 25) - Number of items per page

Pagination responses include:
- `total` - Total number of items
- `count` - Number of items in current page
- `page` - Current page number
- `page_size` - Items per page
- `total_pages` - Total number of pages
- `next` - URL to next page (null if last page)
- `previous` - URL to previous page (null if first page)

---

## Interactive Documentation

For interactive API documentation and testing, visit:

- **Swagger UI**: http://localhost:8000/docs/
- **OpenAPI Schema**: http://localhost:8000/schema/

---

## Notes

1. **Base URL**: All endpoints are relative to `http://localhost:8000` in development
2. **Content-Type**: Most POST/PATCH/PUT requests require `Content-Type: application/json`
3. **Authentication**: Most endpoints require JWT authentication unless specified otherwise
4. **Date Format**: All dates are in ISO 8601 format (e.g., `2026-01-22T10:00:00Z`)
5. **UUIDs**: Conversation IDs in the chat API are UUIDs (e.g., `550e8400-e29b-41d4-a716-446655440000`)

---

**Last Updated**: January 22, 2026  
**API Version**: 1.0.0
