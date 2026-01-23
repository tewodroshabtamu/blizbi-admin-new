# POST /events/ - Create Event Endpoint

## Endpoint Details

- **URL**: `/events/`
- **Method**: `POST`
- **Authentication**: Required (JWT token in Authorization header)
- **Content-Type**: `application/json`

## Request Body

### Required Fields

```json
{
  "type": "one_time",
  "title": "string",
  "description": "string",
  "provider_id": integer,
  "location_id": integer
}
```

### Optional Fields

```json
{
  "language": "en",
  "start_date": "2026-01-25T10:00:00Z",
  "end_date": "2026-01-25T18:00:00Z",
  "start_time": "10:00:00",
  "end_time": "18:00:00",
  "cover_url": "https://example.com/image.jpg",
  "is_free": true,
  "price": 75.00,
  "currency_id": integer,
  "details": {
    "address": "123 Main St",
    "organizer": "John Doe",
    "link": "https://event-site.com"
  }
}
```

## Field Details

### Required Fields

| Field | Type | Description | Validation |
|-------|------|-------------|------------|
| `type` | string | Event type: `"one_time"` or `"recurring"` | Must be valid choice |
| `title` | string | Event title | Max 255 characters |
| `description` | string | Event description | Cannot be empty |
| `provider_id` | integer | ID of the provider | Must exist in database |
| `location_id` | integer | ID of the location | Must exist in database |

### Optional Fields

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `language` | string | Language code (en, es, fr, etc.) | `"en"` |
| `start_date` | datetime | Event start date/time (ISO format) | null |
| `end_date` | datetime | Event end date/time (ISO format) | null |
| `start_time` | time | Event start time (HH:MM:SS) | null |
| `end_time` | time | Event end time (HH:MM:SS) | null |
| `cover_url` | string (URL) | Cover image URL | null |
| `is_free` | boolean | Whether event is free | true |
| `price` | decimal | Event price (if not free) | null |
| `currency_id` | integer | Currency ID (required if price > 0) | null |
| `details` | object | Additional details (JSON) | `{}` |

## Validation Rules

### For One-Time Events (`type: "one_time"`)
- `start_date` and `end_date` are **required**
- `end_date` must be after `start_date`

### For Recurring Events (`type: "recurring"`)
- Additional fields may be required (not fully implemented in current API)

### General Validation
- `provider_id` must reference an existing Provider
- `location_id` must reference an existing Location
- `currency_id` (if provided) must reference an existing Currency
- If `price` > 0, `currency_id` is required
- If `is_free` is false, `price` should be > 0

## Complete Example Request Body

### One-Time Event Example

```json
{
  "type": "one_time",
  "title": "AI Workshop",
  "description": "A hands-on workshop on artificial intelligence and machine learning.",
  "language": "en",
  "start_date": "2026-01-25T10:00:00Z",
  "end_date": "2026-01-25T16:00:00Z",
  "start_time": "10:00:00",
  "end_time": "16:00:00",
  "provider_id": 1,
  "location_id": 1,
  "cover_url": "https://events.com/ai-workshop.jpg",
  "is_free": false,
  "price": 75.00,
  "currency_id": 1,
  "details": {
    "address": "123 Tech Street",
    "organizer": "Jane Smith",
    "link": "https://events.com/ai-workshop",
    "requirements": "Laptop required"
  }
}
```

### Recurring Event Example (Basic)

```json
{
  "type": "recurring",
  "title": "Weekly Coding Bootcamp",
  "description": "Intensive weekly sessions to master Python and JavaScript.",
  "provider_id": 2,
  "location_id": 2,
  "is_free": false,
  "price": 200.00,
  "currency_id": 2,
  "details": {
    "organizer": "Mark Johnson"
  }
}
```

## Response

### Success Response (201 Created)

```json
{
  "id": 1,
  "type": "one_time",
  "title": "AI Workshop",
  "language": "en",
  "description": "A hands-on workshop on artificial intelligence and machine learning.",
  "start_date": "2026-01-25T10:00:00Z",
  "end_date": "2026-01-25T16:00:00Z",
  "start_time": "10:00:00",
  "end_time": "16:00:00",
  "provider": 1,
  "location": 1,
  "currency": 1,
  "cover_url": "https://events.com/ai-workshop.jpg",
  "is_free": false,
  "price": "75.00",
  "details": {
    "address": "123 Tech Street",
    "organizer": "Jane Smith",
    "link": "https://events.com/ai-workshop",
    "requirements": "Laptop required"
  },
  "recurring_type": null,
  "recurring_days": [],
  "recurring_start_date": null,
  "recurring_end_date": null,
  "recurring_start_time": null,
  "recurring_end_time": null,
  "created_at": "2026-01-22T15:30:00Z",
  "updated_at": "2026-01-22T15:30:00Z"
}
```

### Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "type": ["This field is required."],
  "title": ["This field is required."],
  "description": ["This field may not be blank."],
  "provider_id": ["This field is required."],
  "location_id": ["This field is required."]
}
```

#### 400 Bad Request - Invalid References

```json
{
  "provider_id": ["Invalid pk \"999\" - object does not exist."],
  "location_id": ["Invalid pk \"888\" - object does not exist."]
}
```

#### 400 Bad Request - Date Validation

```json
{
  "end_date": ["End date must be after start date."]
}
```

#### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

## Example cURL Request

```bash
curl -X POST http://127.0.0.1:8000/events/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "one_time",
    "title": "AI Workshop",
    "description": "A hands-on workshop on AI",
    "start_date": "2026-01-25T10:00:00Z",
    "end_date": "2026-01-25T16:00:00Z",
    "provider_id": 1,
    "location_id": 1,
    "is_free": false,
    "price": 75.00,
    "currency_id": 1
  }'
```

## Example JavaScript/Fetch Request

```javascript
const createEvent = async (eventData) => {
  const token = await getAuthToken(); // Get your JWT token

  const response = await fetch('http://127.0.0.1:8000/events/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: 'one_time',
      title: 'AI Workshop',
      description: 'A hands-on workshop on AI',
      start_date: '2026-01-25T10:00:00Z',
      end_date: '2026-01-25T16:00:00Z',
      provider_id: 1,
      location_id: 1,
      is_free: false,
      price: 75.00,
      currency_id: 1,
      details: {
        organizer: 'Jane Smith',
        address: '123 Tech Street'
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(JSON.stringify(error));
  }

  return await response.json();
};
```

## Example Axios Request

```javascript
import axios from 'axios';

const createEvent = async (eventData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/events/', {
      type: 'one_time',
      title: 'AI Workshop',
      description: 'A hands-on workshop on AI',
      start_date: '2026-01-25T10:00:00Z',
      end_date: '2026-01-25T16:00:00Z',
      provider_id: 1,
      location_id: 1,
      is_free: false,
      price: 75.00,
      currency_id: 1,
      details: {
        organizer: 'Jane Smith',
        address: '123 Tech Street'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Validation errors:', error.response.data);
    }
    throw error;
  }
};
```

## Notes

1. **Authentication Required**: Unlike GET requests to `/events/`, POST requests require authentication.

2. **Provider and Location IDs**: Before creating an event, ensure the provider and location exist. You can:
   - List providers: `GET /providers/`
   - List locations: `GET /core/locations/`

3. **Currency ID**: If the event has a price, you need a currency. Available currencies can be found in the database (typically USD, EUR, GBP).

4. **Date Format**: Use ISO 8601 format for dates (e.g., `2026-01-25T10:00:00Z`).

5. **Details Field**: The `details` field accepts any JSON structure for additional event information.

6. **Cover URL**: Maps to the `source_link` field in the database.

7. **Read-Only Fields**: The following fields are returned in the response but cannot be set in the request:
   - `id` (auto-generated)
   - `provider` (set via `provider_id`)
   - `location` (set via `location_id`)
   - `currency` (set via `currency_id`)
   - `created_at` (auto-generated)
   - `updated_at` (auto-generated)

---

**Last Updated**: January 22, 2026
