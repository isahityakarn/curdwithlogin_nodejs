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

---

## 🔐 **Password Reset Options**

### **Option 1: Secure OTP-based Reset (Recommended)**

#### 3a. **Send OTP** 
- **Method:** `POST`
- **URL:** `/users/send-otp`
- **Body:**
```json
{
  "email": "john@example.com"
}
```
- **Response:**
```json
{
  "message": "OTP sent to your email successfully",
  "email": "john@example.com",
  "expiresIn": "10 minutes"
}
```
- **Notes:** Sends 6-digit OTP to user's email

#### 3b. **Verify OTP & Get Reset Link**
- **Method:** `POST`
- **URL:** `/users/verify-otp`
- **Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```
- **Response:**
```json
{
  "message": "OTP verified successfully. Password reset link sent to your email.",
  "email": "john@example.com"
}
```
- **Notes:** After OTP verification, sends password reset link via email

#### 3c. **Reset Password with Token**
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

### **Option 2: Direct Token Reset**

#### 4. **Forgot Password (Token-based)**
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
- **Notes:** Directly sends email with reset link

### **Option 3: Instant Reset**

#### 5. **Reset Password Direct (No Token)**
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

## 🔐 **Recommended Password Reset Flow**

### **Step-by-Step Secure Process:**

1. **📧 Request OTP**
   - POST `/users/send-otp` with email
   - User receives 6-digit OTP in email
   - OTP expires in 10 minutes

2. **🔍 Verify OTP**
   - POST `/users/verify-otp` with email + OTP
   - System verifies OTP
   - User receives password reset link in email

3. **🔑 Reset Password**
   - POST `/users/reset-password` with token + new password
   - Password updated successfully

### **Quick Reset Options:**
- **Token-based:** Direct reset link via email
- **Instant:** Immediate random password generation

---

## 🚀 **Testing Flow in Postman**

### **OTP Flow Test:**
1. POST `/users/send-otp` → Check email for OTP
2. POST `/users/verify-otp` → Check email for reset link
3. POST `/users/reset-password` → Password reset complete

### **Environment Variables:**
- `baseUrl`: `http://localhost:5050/api`
- `token`: (set after login)
- `userEmail`: (your test email)

---

## 📧 **Email Templates**

### **OTP Email Features:**
- 🔐 Large, bold 6-digit OTP display
- ⏰ 10-minute expiration notice
- 🔒 Security tips and warnings
- 📱 Mobile-friendly design

### **Reset Link Email Features:**
- 🔗 Direct password reset button
- ⏰ 1-hour expiration
- 🎨 Professional HTML styling
- 📱 Responsive design

---

## 🛠 **Error Responses**
- `200`: Success
- `201`: Created  
- `400`: Bad Request / Validation Error / Invalid OTP
- `401`: Unauthorized
- `404`: User Not Found
- `500`: Internal Server Error

---

## 🔧 **Security Features**
- ✅ OTP expires in 10 minutes
- ✅ Reset tokens expire in 1 hour
- ✅ Email verification required
- ✅ Secure random token generation
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
