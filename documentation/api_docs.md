# API Documentation

## Auth Module

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "username": "user",
  "password": "password"
}
```

### POST /auth/login
Login and retrieve JWT token.

**Body:**
```json
{
  "username": "user",
  "password": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1Ni..."
}
```

## Setup & Configuration
To be updated as features are added.
