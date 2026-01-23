# CORS Configuration Required for Django Backend

## Problem
The frontend (`http://localhost:5173`) cannot communicate with the backend (`http://127.0.0.1:8000`) due to CORS (Cross-Origin Resource Sharing) restrictions.

## Error
```
Access to XMLHttpRequest at 'http://127.0.0.1:8000/events/' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Solution

The Django backend needs to be configured to allow requests from the frontend origin.

### Steps to Fix (in the Django Backend):

1. **Install django-cors-headers** (if not already installed):
   ```bash
   pip install django-cors-headers
   ```

2. **Update `settings.py`**:

   Add to `INSTALLED_APPS`:
   ```python
   INSTALLED_APPS = [
       ...
       'corsheaders',
       ...
   ]
   ```

   Add to `MIDDLEWARE` (near the top, before CommonMiddleware):
   ```python
   MIDDLEWARE = [
       'corsheaders.middleware.CorsMiddleware',
       'django.middleware.common.CommonMiddleware',
       ...
   ]
   ```

   Add CORS configuration:
   ```python
   # CORS Settings
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
       "http://127.0.0.1:5173",
   ]
   
   # Or for development, allow all origins (NOT recommended for production):
   # CORS_ALLOW_ALL_ORIGINS = True
   
   CORS_ALLOW_CREDENTIALS = True
   
   CORS_ALLOW_HEADERS = [
       'accept',
       'accept-encoding',
       'authorization',
       'content-type',
       'dnt',
       'origin',
       'user-agent',
       'x-csrftoken',
       'x-requested-with',
   ]
   ```

3. **Restart the Django server**:
   ```bash
   python manage.py runserver
   ```

## Alternative Quick Fix (Development Only)

If you just want to test quickly, you can temporarily allow all origins in Django settings:

```python
CORS_ALLOW_ALL_ORIGINS = True
```

**⚠️ WARNING**: Never use `CORS_ALLOW_ALL_ORIGINS = True` in production!

## After Fixing

Once CORS is configured in the backend, the frontend should be able to make API requests successfully.
