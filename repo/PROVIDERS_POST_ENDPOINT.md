# POST /providers/ - Create Provider Endpoint

## Endpoint Details

- **URL**: `/providers/`
- **Method**: `POST`
- **Authentication**: Not required (uses `AllowAny` permission)
- **Content-Type**: `application/json`

## Request Body

### Required Fields

```json
{
  "provider_id": "string (unique, max 255 chars)",
  "name": "string (max 255 chars)",
  "website": "string (valid URL, unique, max 255 chars)",
  "location_id": integer
}
```

### Optional Fields

```json
{
  "short_description": "string (max 255 chars)",
  "description": "string (text)",
  "cover_url": "string (valid URL, max 255 chars)",
  "address": "string (max 255 chars)",
  "municipality_id": integer (nullable),
  "socials": {
    "facebook": "url",
    "twitter": "url",
    "instagram": "url",
    // ... any other social media links
  },
  "is_featured": boolean (default: false)
}
```

## Complete Example Request Body

```json
{
  "provider_id": "provider-123",
  "name": "Amazing Restaurant",
  "website": "https://amazing-restaurant.com",
  "location_id": 1,
  "short_description": "Best food in town",
  "description": "We serve the most delicious meals with fresh ingredients and excellent service.",
  "cover_url": "https://example.com/images/restaurant-cover.jpg",
  "address": "123 Main Street, City, Country",
  "municipality_id": 2,
  "socials": {
    "facebook": "https://facebook.com/amazingrestaurant",
    "instagram": "https://instagram.com/amazingrestaurant",
    "twitter": "https://twitter.com/amazingrestaurant"
  },
  "is_featured": true
}
```

## Field Details

### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `provider_id` | string | Unique identifier for the provider | Max 255 characters, must be unique |
| `name` | string | Provider name | Max 255 characters |
| `website` | string (URL) | Provider website URL | Must be valid URL, max 255 characters, must be unique |
| `location_id` | integer | ID of the location (from `/core/locations/`) | Must exist in Location table |

### Optional Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `short_description` | string | Brief description | Max 255 characters |
| `description` | string | Full description | No length limit (text field) |
| `cover_url` | string (URL) | Cover image URL | Must be valid URL, max 255 characters |
| `address` | string | Physical address | Max 255 characters |
| `municipality_id` | integer | ID of the municipality (from `/providers/municipalities/`) | Must exist in Municipality table, can be null |
| `socials` | object (JSON) | Social media links | JSON object with any structure |
| `is_featured` | boolean | Whether provider is featured | Default: `false` |

## Validation Rules

1. **`provider_id`** must be unique across all providers
2. **`website`** must be unique and a valid URL
3. **`location_id`** must reference an existing Location
4. **`municipality_id`** (if provided) must reference an existing Municipality
5. If **`municipality_id`** is provided, **`location_id`** must also be provided (enforced by model validation)

## Response

### Success Response (201 Created)

```json
{
  "id": 1,
  "provider_id": "provider-123",
  "name": "Amazing Restaurant",
  "short_description": "Best food in town",
  "description": "We serve the most delicious meals...",
  "website": "https://amazing-restaurant.com",
  "cover_url": "https://example.com/images/restaurant-cover.jpg",
  "address": "123 Main Street, City, Country",
  "location": {
    "id": 1,
    "name": "Downtown Location",
    "latitude": 40.7128,
    "longitude": -74.0060,
    // ... other location fields
  },
  "municipality": {
    "id": 2,
    "name": "New York",
    "code": "NYC",
    // ... other municipality fields
  },
  "is_featured": true,
  "event_count": 0,
  "follower_count": 0,
  "is_following": false,
  "created_at": "2026-01-22T10:00:00Z",
  "updated_at": "2026-01-22T10:00:00Z"
}
```

### Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "provider_id": ["This field is required."],
  "location_id": ["Invalid pk \"999\" - object does not exist."]
}
```

#### 400 Bad Request - Duplicate Entry

```json
{
  "provider_id": ["provider with this provider id already exists."],
  "website": ["provider with this website already exists."]
}
```

## Example cURL Request

```bash
curl -X POST http://127.0.0.1:8000/providers/ \
  -H "Content-Type: application/json" \
  -d '{
    "provider_id": "provider-123",
    "name": "Amazing Restaurant",
    "website": "https://amazing-restaurant.com",
    "location_id": 1,
    "short_description": "Best food in town",
    "description": "We serve the most delicious meals with fresh ingredients.",
    "cover_url": "https://example.com/images/restaurant-cover.jpg",
    "address": "123 Main Street",
    "municipality_id": 2,
    "socials": {
      "facebook": "https://facebook.com/amazingrestaurant",
      "instagram": "https://instagram.com/amazingrestaurant"
    },
    "is_featured": true
  }'
```

## Example JavaScript/Fetch Request

```javascript
const createProvider = async (providerData) => {
  const response = await fetch('http://127.0.0.1:8000/providers/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider_id: 'provider-123',
      name: 'Amazing Restaurant',
      website: 'https://amazing-restaurant.com',
      location_id: 1,
      short_description: 'Best food in town',
      description: 'We serve the most delicious meals...',
      cover_url: 'https://example.com/images/restaurant-cover.jpg',
      address: '123 Main Street',
      municipality_id: 2,
      socials: {
        facebook: 'https://facebook.com/amazingrestaurant',
        instagram: 'https://instagram.com/amazingrestaurant'
      },
      is_featured: true
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

const createProvider = async (providerData) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/providers/', {
      provider_id: 'provider-123',
      name: 'Amazing Restaurant',
      website: 'https://amazing-restaurant.com',
      location_id: 1,
      short_description: 'Best food in town',
      description: 'We serve the most delicious meals...',
      cover_url: 'https://example.com/images/restaurant-cover.jpg',
      address: '123 Main Street',
      municipality_id: 2,
      socials: {
        facebook: 'https://facebook.com/amazingrestaurant',
        instagram: 'https://instagram.com/amazingrestaurant'
      },
      is_featured: true
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle validation errors
      console.error('Validation errors:', error.response.data);
    }
    throw error;
  }
};
```

## Notes

1. **No Authentication Required**: This endpoint uses `AllowAny` permission, so you don't need to send an Authorization header.

2. **Location Must Exist**: Before creating a provider, make sure the location exists. You can:
   - List locations: `GET /core/locations/`
   - Create a location first: `POST /core/locations/`

3. **Municipality Must Exist**: If you provide `municipality_id`, the municipality must exist. You can:
   - List municipalities: `GET /providers/municipalities/`
   - Create a municipality first: `POST /providers/municipalities/`

4. **Unique Constraints**: Both `provider_id` and `website` must be unique. If you try to create a provider with an existing `provider_id` or `website`, you'll get a 400 error.

5. **Socials Field**: The `socials` field accepts any JSON structure. Common structure:
   ```json
   {
     "facebook": "url",
     "twitter": "url",
     "instagram": "url",
     "linkedin": "url",
     "youtube": "url"
   }
   ```

6. **Read-Only Fields**: The following fields are returned in the response but cannot be set in the request:
   - `id` (auto-generated)
   - `created_at` (auto-generated)
   - `updated_at` (auto-generated)
   - `event_count` (calculated)
   - `follower_count` (calculated)
   - `is_following` (calculated based on authenticated user)

---

**Last Updated**: January 22, 2026
