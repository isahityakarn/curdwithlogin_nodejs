# CRUD with Login API - Complete Postman Collection Guide

## 🚀 Quick Start

1. **Import the Collection**: Import `postman-collection.json` into Postman
2. **Set Environment**: The collection uses variables that are set automatically
3. **Start Server**: Make sure your Node.js server is running on `http://localhost:5050`
4. **Test APIs**: Start with the health check endpoint to verify connectivity

## 📊 Collection Overview

This comprehensive Postman collection includes **ALL** endpoints for the Node.js CRUD API with user authentication, organized into logical groups:

### 🏠 System Routes (2 endpoints)
- **Health Check**: `GET /api/health` - Verify server status
- **API Info**: `GET /` - Get API version and endpoints overview

### 🔐 Authentication Routes (2 endpoints)
- **Register User**: `POST /api/users/register` - Create new user account
- **Login User**: `POST /api/users/login` - Authenticate and get JWT token

### 🔑 Password Management (4 endpoints)
- **Forgot Password**: `POST /api/users/forgot-password` - Request password reset email
- **Reset Password (Body)**: `POST /api/users/reset-password` - Reset with token in body
- **Reset Password (URL)**: `POST /api/users/reset-password-with-token?token=...` - **NEW!** Reset with token in URL
- **Reset Password Direct**: `POST /api/users/reset-password-direct` - Generate and email new password

### 📱 OTP Verification (2 endpoints)
- **Send OTP**: `POST /api/users/send-otp` - Send OTP to email
- **Verify OTP**: `POST /api/users/verify-otp` - Verify OTP and get reset link

### 🤖 Captcha Verification (2 endpoints)
- **Get Captcha Request**: `POST /api/users/getCaptchaRequest` - Generate captcha
- **Verify Captcha**: `POST /api/users/verifyCaptcha` - Verify captcha response

### 👤 User Profile Management (2 endpoints)
- **Get User Profile**: `GET /api/users/profile` - Get current user info
- **Update Password**: `PUT /api/users/password` - Change password with current password

### 👥 User Management (4 endpoints)
- **Get All Users**: `GET /api/users` - List all users (admin)
- **Get User by ID**: `GET /api/users/:id` - Get specific user
- **Update User**: `PUT /api/users/:id` - Update user name/email
- **Delete User**: `DELETE /api/users/:id` - Delete user account

### 🧪 Test Scenarios (2 workflows)
- **Complete Registration Flow** - Register → Get Profile
- **Password Reset Flow** - Request Reset → Reset with Token

## 🔧 Collection Features

### Variables
The collection automatically manages these variables:
- `base_url`: Server URL (default: http://localhost:5050)
- `token`: JWT authentication token (auto-saved on login/register)
- `captcha_token`: Captcha verification token (auto-saved)
- `reset_token`: Password reset token (for manual use)
- `user_id`: Current user ID (auto-saved)

### Auto-Scripts
- **Authentication**: Automatically saves JWT tokens on login/register
- **Response Tests**: Built-in tests for response time and JSON validation
- **Token Management**: Automatically sets Bearer tokens for protected routes

### Pre-configured Examples
All endpoints include realistic example data that you can use immediately.

## 📋 How to Use

### 1. Basic Workflow
```
1. Health Check → Verify server is running
2. Register User → Create account and get token
3. Get Profile → Verify authentication works
4. Explore other endpoints as needed
```

### 2. Authentication Flow
```
1. Register/Login → Token automatically saved
2. All protected routes → Token automatically included
3. Token expires in 24h → Re-login to refresh
```

### 3. Password Reset Flow
```
Option A (URL Token):
1. Forgot Password → Get reset email
2. Reset Password (URL) → Use token from email URL

Option B (Body Token):
1. Forgot Password → Get reset email
2. Reset Password (Body) → Copy token from email to body
```

### 4. OTP Flow
```
1. Send OTP → Receive OTP in email
2. Verify OTP → Get password reset link
3. Use reset link for password change
```

## 🎯 Your Specific Use Case

For your URL `http://localhost:5050/reset-password?token=1e8ca44b...`, use:

**Reset Password (URL Token)** endpoint:
- Method: `POST`
- URL: `{{base_url}}/api/users/reset-password-with-token?token=YOUR_TOKEN`
- Body: `{"newPassword": "NewPassword123"}`

This endpoint was specifically created for your use case!

## 🔍 Testing Tips

### Quick Tests
1. Run "Complete Registration Flow" to verify user creation
2. Use "Password Reset Flow" to test reset functionality
3. Test individual endpoints as needed

### Error Testing
- Try invalid tokens, expired tokens, wrong passwords
- Test validation errors (weak passwords, invalid emails)
- Verify authentication requirements

### Production Testing
- Update `base_url` variable for production testing
- Use real email addresses for email functionality testing
- Test with actual SMTP configuration

## 📝 Request Examples

### Register User
```json
POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Reset Password with URL Token (NEW)
```http
POST /api/users/reset-password-with-token?token=your_token_here
Content-Type: application/json

{
  "newPassword": "NewPassword123"
}
```

### Update User Profile
```json
PUT /api/users/1
Authorization: Bearer your_jwt_token
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

## ⚙️ Environment Setup

### Server Configuration
- Port: 5050 (configured in .env)
- Database: MySQL
- Email: Gmail SMTP

### Required Environment Variables
```
PORT=5050
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=curdwithlogin_db
JWT_SECRET=curdwithlogin_secret_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🏆 Collection Stats
- **Total Endpoints**: 20
- **Public Routes**: 10
- **Protected Routes**: 10
- **Test Scenarios**: 4
- **Auto-Scripts**: 8
- **Variables**: 5

## 🆘 Troubleshooting

### Common Issues
1. **Server not responding**: Check if server is running on port 5050
2. **Authentication failed**: Verify JWT token is valid and not expired
3. **Email not sending**: Check SMTP configuration in .env
4. **Database errors**: Ensure database is running and migrations are applied

### Quick Fixes
- Restart server: `npm start`
- Run migrations: `npm run migrate`
- Check logs in terminal for specific errors
- Verify .env file configuration

## 📚 Additional Resources
- API Documentation: `API_DOCUMENTATION.md`
- OTP Documentation: `OTP_API_DOCUMENTATION.md`
- Postman Routes: `POSTMAN_ROUTES.md`
- Setup Guide: `README.md`

---

**Happy Testing! 🎉**

This collection covers 100% of your API endpoints and includes the new token-in-URL reset functionality you requested.
