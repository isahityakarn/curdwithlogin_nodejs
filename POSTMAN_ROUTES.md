# CRUD API with Forgot Password - Postman Routes

## Base URL
```
http://localhost:5050/api
```

## 1. User Registration
**POST** `/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Test123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 2. User Login
**POST** `/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "Test123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## 3. Forgot Password (NEW!)
**POST** `/users/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent successfully",
  "email": "john@example.com"
}
```

**Note:** This will send an email to the user with a reset link. Check your email inbox.

---

## 4. Reset Password (NEW!)
**POST** `/users/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPass123"
}
```

**Response:**
```json
{
  "message": "Password reset successfully"
}
```

**Note:** Use the token you received in the email from forgot password.

---

## 5. Get User Profile (Protected)
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-XX",
    "updated_at": "2025-01-XX"
  }
}
```

---

## 6. Get All Users (Protected)
**GET** `/users`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-01-XX",
      "updated_at": "2025-01-XX"
    }
  ]
}
```

---

## 7. Get User by ID (Protected)
**GET** `/users/:id`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL:** `/users/1`

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-XX",
    "updated_at": "2025-01-XX"
  }
}
```

---

## 8. Update User (Protected)
**PUT** `/users/:id`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL:** `/users/1`

**Body (JSON):**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "created_at": "2025-01-XX",
    "updated_at": "2025-01-XX"
  }
}
```

---

## 9. Update Password (Protected)
**PUT** `/users/password`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "currentPassword": "Test123",
  "newPassword": "NewTest123"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

---

## 10. Delete User (Protected)
**DELETE** `/users/:id`

**Headers:**
```
Authorization: Bearer your_jwt_token_here
Content-Type: application/json
```

**URL:** `/users/1`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## Testing Workflow

### 1. First, register a new user:
- Use route #1 (User Registration)
- Save the returned JWT token

### 2. Test forgot password:
- Use route #3 (Forgot Password) with the registered email
- Check your email for the reset link
- Extract the token from the email

### 3. Reset password:
- Use route #4 (Reset Password) with the token from email
- Set a new password

### 4. Login with new password:
- Use route #2 (User Login) with the new password
- Save the new JWT token

### 5. Test protected routes:
- Use the JWT token in Authorization header for routes #5-10

---

## Error Responses

**Validation Error (400):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "msg": "Please provide a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

**Not Found Error (404):**
```json
{
  "error": "User not found"
}
```

**Server Error (500):**
```json
{
  "error": "Internal server error"
}
```

---

## Environment Setup

Make sure your `.env` file contains:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=curdwithlogin_db
JWT_SECRET=your_jwt_secret_key
PORT=5050
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com
```

## Notes

1. **Email Configuration**: Make sure to configure your email settings in `.env` file for forgot password to work
2. **JWT Token**: Save the JWT token from login/register and use it in the Authorization header for protected routes
3. **Password Requirements**: Passwords must be at least 6 characters long with at least one lowercase, one uppercase, and one number (for password updates and resets)
4. **Reset Token Expiry**: Password reset tokens expire in 1 hour
