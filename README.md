# Node.js CRUD Application with User Management

A complete Node.js REST API application with CRUD operations for user management, including authentication, authorization, and database migrations.

## Features

- 🔐 User authentication (Register/Login) with JWT
- 📝 Complete CRUD operations for users
- 🗄️ MySQL database with migrations
- 🔒 Password hashing with bcrypt
- ✅ Input validation
- 🛡️ JWT-based authorization
- 📊 RESTful API design

## Project Structure

```
curdwithlogin/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   └── userController.js    # User controller logic
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── validation.js       # Input validation middleware
├── migrations/
│   ├── database-setup.js   # Database setup utilities
│   ├── 001_create_users_table.js  # Users table migration
│   ├── migrate.js          # Migration runner
│   └── rollback.js         # Migration rollback
├── models/
│   └── User.js             # User model
├── routes/
│   └── userRoutes.js       # User routes
├── .env                    # Environment variables
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
└── server.js              # Main server file
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Clone/Navigate to the project directory**
   ```bash
   cd /Users/sahityakarn/Documents/nodejs/curdwithlogin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Edit the `.env` file with your database credentials:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=crud_app
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Run database migrations**
   ```bash
   npm run migrate
   ```

5. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Protected Routes (Require JWT Token)

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <your_jwt_token>
```

#### Get All Users
```http
GET /api/users
Authorization: Bearer <your_jwt_token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <your_jwt_token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

#### Update Password
```http
PUT /api/users/password
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword123"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <your_jwt_token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Migrations

### Run Migrations
```bash
npm run migrate
```

### Rollback Migrations
```bash
npm run migrate:rollback
```

## Validation Rules

### Registration
- Name: Required, 2-100 characters
- Email: Valid email format
- Password: Minimum 6 characters, must contain lowercase, uppercase, and number

### Login
- Email: Valid email format
- Password: Required

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Security Features

- 🔐 JWT token-based authentication
- 🔒 Password hashing with bcrypt (salt rounds: 12)
- ✅ Input validation and sanitization
- 🛡️ SQL injection prevention with parameterized queries
- 🚫 Email uniqueness validation

## Testing the API

### Using curl

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:3000/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"John Doe","email":"john@example.com","password":"Password123"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3000/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"john@example.com","password":"Password123"}'
   ```

3. **Get all users (with token):**
   ```bash
   curl -X GET http://localhost:3000/api/users \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables for base URL and JWT token
3. Test each endpoint with proper authentication headers

## Development

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run migrate:rollback` - Rollback database migrations

### Adding New Migrations

1. Create a new migration file in the `migrations/` directory
2. Follow the naming convention: `002_migration_name.js`
3. Export an object with `name`, `up`, and `down` properties
4. Add the migration to the migrations array in `migrate.js`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | Database host | localhost |
| DB_USER | Database username | root |
| DB_PASSWORD | Database password | - |
| DB_NAME | Database name | crud_app |
| JWT_SECRET | JWT signing secret | - |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
