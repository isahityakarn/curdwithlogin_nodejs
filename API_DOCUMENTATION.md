# CRUD with Login - API Documentation

Base URL: `http://localhost:5050/api`

## Authentication
- Use JWT tokens in the Authorization header: `Bearer <token>`
- Tokens expire in 24 hours

---

## 📋 **API Endpoints**

### 1. **User Registration**
- **Method:** `POST`
- **URL:** `/users/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Response:**
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

### 2. **User Login**
- **Method:** `POST`
- **URL:** `/users/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```
- **Response:**
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

### 3. **Forgot Password (Token-based)**
- **Method:** `POST`
- **URL:** `/users/forgot-password`
- **Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "message": "Password reset email sent successfully",
  "email": "john@example.com"
}
```
- **Notes:** Sends email with reset link containing token

### 4. **Reset Password (With Token)**
- **Method:** `POST`
- **URL:** `/users/reset-password`
- **Body:**
```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword123"
}
```
- **Response:**
```json
{
  "message": "Password reset successfully"
}
```

### 5. **🆕 Reset Password Direct (No Token)**
- **Method:** `POST`
- **URL:** `/users/reset-password-direct`
- **Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "message": "Password reset successfully. New password sent to your email.",
  "email": "john@example.com"
}
```
- **Notes:** Generates random password and sends via email immediately

---

## 🔒 **Protected Endpoints** (Require Authentication)

### 6. **Get User Profile**
- **Method:** `GET`
- **URL:** `/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-07-29T10:00:00.000Z",
    "updated_at": "2025-07-29T10:00:00.000Z"
  }
}
```

### 7. **Get All Users**
- **Method:** `GET`
- **URL:** `/users/`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2025-07-29T10:00:00.000Z",
      "updated_at": "2025-07-29T10:00:00.000Z"
    }
  ]
}
```

### 8. **Get User by ID**
- **Method:** `GET`
- **URL:** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2025-07-29T10:00:00.000Z",
    "updated_at": "2025-07-29T10:00:00.000Z"
  }
}
```

### 9. **Update User**
- **Method:** `PUT`
- **URL:** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```
- **Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "created_at": "2025-07-29T10:00:00.000Z",
    "updated_at": "2025-07-29T10:00:00.000Z"
  }
}
```

### 10. **Update Password**
- **Method:** `PUT`
- **URL:** `/users/password`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```
- **Response:**
```json
{
  "message": "Password updated successfully"
}
```

### 11. **Delete User**
- **Method:** `DELETE`
- **URL:** `/users/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 🔑 **Password Reset Options**

### Option 1: Token-based Reset (More Secure)
1. POST `/users/forgot-password` with email
2. Check email for reset link
3. POST `/users/reset-password` with token and new password

### Option 2: Direct Reset (Quick & Simple)
1. POST `/users/reset-password-direct` with email
2. Check email for new password
3. Login with new password and change it immediately

---

## 🚀 **Testing in Postman**

1. **Create Environment Variables:**
   - `baseUrl`: `http://localhost:5050/api`
   - `token`: (will be set after login)

2. **Login Flow:**
   - Register or login to get token
   - Set token in environment variable
   - Use `{{token}}` in Authorization header for protected routes

3. **Password Reset Testing:**
   - Use your real email address for testing
   - Check your email inbox for reset emails

---

## 📧 **Email Configuration**
Make sure your `.env` file has proper email settings:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

---

## 🛠 **Error Responses**
All endpoints return appropriate HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error
