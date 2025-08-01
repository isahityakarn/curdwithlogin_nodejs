# CRUD API with Login - Complete Postman Routes Documentation

## 📋 Quick Reference

**Base URL:** `http://localhost:5050`  
**API Base:** `http://localhost:5050/api`  
**Server Status:** Running on port 5050  

## 📦 Postman Collection Files

- **Collection**: `postman-collection.json` - Complete API collection
- **Environment**: `postman-environment.json` - Pre-configured variables
- **Guide**: `POSTMAN_COLLECTION_GUIDE.md` - Detailed usage guide

## 🔗 Complete Endpoint List

### 🏠 System Routes

#### 1. Health Check
**GET** `/api/health`
- **Purpose**: Check server status
- **Auth**: None required
- **Response**: Server status and timestamp

#### 2. API Information
**GET** `/`
- **Purpose**: Get API version and endpoints overview
- **Auth**: None required
- **Response**: API metadata and endpoint summary

---

### 🔐 Authentication Routes

#### 3. Register User
**POST** `/api/users/register`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (201):**
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

#### 4. Login User
**POST** `/api/users/login`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Success Response (200):**
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

### 🔑 Password Management Routes

#### 5. Forgot Password
**POST** `/api/users/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset email sent successfully",
  "email": "john@example.com"
}
```

#### 6. Reset Password (Token in Body)
**POST** `/api/users/reset-password`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword123"
}
```

#### 7. Reset Password (Token in URL) - **NEW!**
**POST** `/api/users/reset-password-with-token?token=YOUR_TOKEN`

**Headers:**
```
Content-Type: application/json
```

**Query Parameters:**
```
token: reset_token_from_email_url
```

**Body:**
```json
{
  "newPassword": "NewPassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully",
  "success": true
}
```

**Example URL:**
```
POST http://localhost:5050/api/users/reset-password-with-token?token=1e8ca44b232a8504fd255ca01f67c039cbf6eaa7340896ffe4317999c2185e1c
```

#### 8. Reset Password Direct
**POST** `/api/users/reset-password-direct`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully. New password sent to your email.",
  "email": "john@example.com"
}
```

---

### 📱 OTP Verification Routes

#### 9. Send OTP
**POST** `/api/users/send-otp`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent to your email successfully",
  "email": "john@example.com",
  "expiresIn": "10 minutes"
}
```

#### 10. Verify OTP
**POST** `/api/users/verify-otp`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "message": "OTP verified successfully. Password reset link sent to your email.",
  "email": "john@example.com"
}
```

---

### 🤖 Captcha Verification Routes

#### 11. Get Captcha Request
**POST** `/api/users/getCaptchaRequest`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "captcha": "123456",
  "browserInfo": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "language": "en-US",
    "platform": "MacIntel",
    "screenResolution": "1920x1080",
    "timezone": "America/New_York"
  }
}
```

#### 12. Verify Captcha
**POST** `/api/users/verifyCaptcha`

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "token": "captcha_token_from_previous_request",
  "captcha": "123456",
  "browserInfo": {
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "language": "en-US",
    "platform": "MacIntel",
    "screenResolution": "1920x1080",
    "timezone": "America/New_York"
  }
}
```

---

### 👤 User Profile Management Routes (🔒 Protected)

#### 13. Get User Profile
**GET** `/api/users/profile`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

#### 14. Update Password
**PUT** `/api/users/password`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Body:**
```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

---

### 👥 User Management Routes (🔒 Protected)

#### 15. Get All Users
**GET** `/api/users`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### 16. Get User by ID
**GET** `/api/users/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Example:**
```
GET /api/users/1
```

#### 17. Update User
**PUT** `/api/users/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: application/json
```

**Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### 18. Delete User
**DELETE** `/api/users/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Example:**
```
DELETE /api/users/1
```

---

## 🔧 Authentication

### JWT Token Usage
- **Obtain Token**: Login or Register
- **Header Format**: `Authorization: Bearer YOUR_JWT_TOKEN`
- **Token Expiry**: 24 hours
- **Refresh**: Re-login when expired

### Protected Routes
All routes marked with 🔒 require JWT authentication in the Authorization header.

---

## 📊 HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT operations |
| 201 | Created | Successful POST operations (registration) |
| 400 | Bad Request | Validation errors, invalid data |
| 401 | Unauthorized | Invalid credentials, missing/expired token |
| 404 | Not Found | User not found, invalid endpoints |
| 500 | Internal Server Error | Server/database errors |

---

## 🎯 Quick Testing Guide

### 1. Basic Flow
```
1. POST /api/users/register (save token)
2. GET /api/users/profile (verify auth works)
3. GET /api/users (list all users)
```

### 2. Password Reset Flow (URL Token)
```
1. POST /api/users/forgot-password
2. Check email for reset link
3. POST /api/users/reset-password-with-token?token=TOKEN_FROM_EMAIL
```

### 3. OTP Flow
```
1. POST /api/users/send-otp
2. Check email for OTP code
3. POST /api/users/verify-otp
4. Use reset link from email
```

---

## ⚡ Postman Collection Features

### Automatic Token Management
- ✅ Auto-saves JWT tokens on login/register
- ✅ Auto-includes tokens in protected routes
- ✅ Auto-saves captcha tokens

### Built-in Tests
- ✅ Response time validation
- ✅ JSON format validation
- ✅ Status code checks

### Environment Variables
- `base_url`: http://localhost:5050
- `token`: JWT authentication token
- `captcha_token`: Captcha verification token
- `reset_token`: Password reset token
- `user_id`: Current user ID

---

## 🚀 Import Instructions

1. **Import Collection**: 
   - Open Postman → Import → `postman-collection.json`

2. **Import Environment**: 
   - Import → `postman-environment.json`

3. **Set Environment**: 
   - Select "CRUD with Login API - Environment" from dropdown

4. **Start Testing**: 
   - Begin with Health Check endpoint

---

## 🔍 Your Specific Use Case

For the URL `http://localhost:5050/reset-password?token=1e8ca44b...`:

**Use Endpoint #7**: "Reset Password (Token in URL)"
- Method: POST
- URL: `/api/users/reset-password-with-token?token=YOUR_TOKEN`
- Body: `{"newPassword": "NewPassword123"}`

This endpoint was specifically created for your token-in-URL requirement!

---

**Total Endpoints: 18** | **Protected Routes: 8** | **Public Routes: 10**
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
