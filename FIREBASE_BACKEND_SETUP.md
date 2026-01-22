# Firebase Authentication Setup for Django Backend

## Problem
The backend is returning 401 Unauthorized with the error:
```
Authentication failed: A project ID is required to verify a Firebase ID token 
via the GOOGLE_CLOUD_PROJECT environment variable.
```

## Solution

The Django backend needs to be configured to verify Firebase ID tokens.

### Steps to Fix (in the Django Backend):

#### 1. Install Firebase Admin SDK

```bash
pip install firebase-admin
```

#### 2. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `blizbi-dev`
3. Go to **Project Settings** (gear icon) → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file (e.g., `firebase-service-account.json`)
6. Place it in your Django project root (and add to `.gitignore`!)

#### 3. Configure Django Settings

Add to your Django `settings.py`:

```python
import firebase_admin
from firebase_admin import credentials
import os

# Firebase Admin SDK Configuration
FIREBASE_SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, 'firebase-service-account.json')

# Initialize Firebase Admin
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred, {
        'projectId': 'blizbi-dev',
    })

# Set environment variable for Firebase
os.environ['GOOGLE_CLOUD_PROJECT'] = 'blizbi-dev'
```

#### 4. Alternative: Use Environment Variable Only

If you don't want to use a service account file, you can just set the project ID:

```python
import os

# Set Firebase project ID
os.environ['GOOGLE_CLOUD_PROJECT'] = 'blizbi-dev'
```

But this requires that the backend has access to Google Cloud credentials through other means (like Application Default Credentials).

#### 5. Restart Django Server

```bash
python manage.py runserver
```

## Verification

After configuring Firebase in the backend:

1. Log in to the frontend with Google
2. The frontend will send the Firebase ID token in the `Authorization: Bearer <token>` header
3. The backend should verify the token and authenticate the user
4. API requests should return 200 OK instead of 401 Unauthorized

## Security Notes

- **Never commit** the `firebase-service-account.json` file to version control
- Add it to `.gitignore`:
  ```
  firebase-service-account.json
  ```
- For production, use environment variables or secret management services
