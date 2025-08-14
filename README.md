# Node.js CRUD Application with User Management

A complete Node.js REST API application with CRUD operations for user management, states management, and trades management, including authentication, authorization, and database migrations.

## Features

- 🔐 User authentication (Register/Login) with JWT
- 📝 Complete CRUD operations for users, states, and trades
- 🗄️ MySQL database with migrations
- 🔒 Password hashing with bcrypt
- ✅ Input validation
- 🛡️ JWT-based authorization
- 📊 RESTful API design
- 🔍 Search functionality for all entities
- 📈 Statistics and analytics endpoints
- 📄 Pagination support
- 📧 Email services for password reset
- 🔐 OTP verification system
- 🖼️ Captcha verification
- 📋 Comprehensive Postman collection
- 📚 Detailed API documentation

## Project Structure

```
curdwithlogin/
├── config/
│   └── database.js                 # Database configuration
├── controllers/
│   ├── userController.js           # User controller logic
│   ├── stateController.js          # State controller logic
│   ├── tradeController.js          # Trade controller logic
│   └── CaptchaController.js        # Captcha controller logic
├── middleware/
│   ├── auth.js                     # Authentication middleware
│   └── validation.js               # Input validation middleware
├── migrations/
│   ├── database-setup.js           # Database setup utilities
│   ├── 001_create_users_table.js   # Users table migration
│   ├── 002_add_password_reset_fields.js # Password reset fields
│   ├── 003_create_captchas_table.js # Captcha table migration
│   ├── 004_create_states_table.js  # States table migration
│   ├── 005_create_trades_table.js  # Trades table migration
│   ├── migrate.js                  # Migration runner
│   └── rollback.js                 # Migration rollback
├── models/
│   ├── User.js                     # User model
│   ├── State.js                    # State model
│   ├── Trade.js                    # Trade model
│   └── Captcha.js                  # Captcha model
├── routes/
│   ├── userRoutes.js               # User routes
│   ├── stateRoutes.js              # State routes
│   └── tradeRoutes.js              # Trade routes
├── services/
│   └── emailService.js             # Email service utilities
├── public/
│   ├── login.html                  # Login page
│   └── reset-password.html         # Password reset page
├── docs/
│   ├── API_DOCUMENTATION.md        # User API documentation
│   ├── OTP_API_DOCUMENTATION.md    # OTP API documentation
│   ├── STATES_API_DOCUMENTATION.md # States API documentation
│   ├── TRADES_API_DOCUMENTATION.md # Trades API documentation
│   └── NOC_API_DOCUMENTATION.md    # NOC API documentation
├── postman-collection.json         # Complete Postman collection
├── POSTMAN_ROUTES.md               # Postman usage guide
├── .env                            # Environment variables
├── .gitignore                      # Git ignore file
├── package.json                    # Project dependencies
└── server.js                       # Main server file
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

### States API

#### Get All States
```http
GET /api/states
```

#### Get State by ID
```http
GET /api/states/:id
```

#### Create State (Protected)
```http
POST /api/states
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "state_name": "California",
  "logo": "https://example.com/california-flag.svg"
}
```

#### Search States
```http
GET /api/states/search?q=california
```

### NOC (No Objection Certificate) API

#### Get All NOC Certificates
```http
GET /api/noc
```

#### Get NOC Certificate by ID
```http
GET /api/noc/:id
```

#### Get NOC by Application Number
```http
GET /api/noc/application/:applicationNumber
```

#### Create NOC Certificate (Protected)
```http
POST /api/noc
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "institute_name": "Test Technical Institute",
  "complete_address": "123 Test Street, Test City, Test State - 123456",
  "application_number": "NOC/2025/TTI/999",
  "mis_code": "TTI999",
  "category": "New ITI",
  "state_name": "Test State",
  "issue_date": "2025-08-08",
  "expiry_date": "2026-08-07",
  "status": "active",
  "remarks": "Test NOC certificate",
  "trades": [
    {
      "trade_name": "Electrician",
      "shift_1_units": 24,
      "shift_2_units": 0
    }
  ]
}
```

#### Search NOC Certificates
```http
GET /api/noc/search?q=Delhi
```

#### Get NOC Statistics
```http
GET /api/noc/stats
```

#### Get NOC by State
```http
GET /api/noc/state/Maharashtra
```

#### Get NOC by Status
```http
GET /api/noc/status/active
```

### Trades API

#### Get All Trades
```http
GET /api/trades
```

#### Get Trade by ID
```http
GET /api/trades/:id
```

#### Create Trade (Protected)
```http
POST /api/trades
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "trade_name": "Software Developer"
}
```

#### Search Trades
```http
GET /api/trades/search?q=mechanic
```

#### Get Trades Statistics
```http
GET /api/trades/stats
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

## API Documentation

Comprehensive API documentation is available for all endpoints:

- **User Management API**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **OTP & Email Services**: [OTP_API_DOCUMENTATION.md](OTP_API_DOCUMENTATION.md)  
- **States Management API**: [STATES_API_DOCUMENTATION.md](STATES_API_DOCUMENTATION.md)
- **Trades Management API**: [TRADES_API_DOCUMENTATION.md](TRADES_API_DOCUMENTATION.md)
- **NOC Management API**: [NOC_API_DOCUMENTATION.md](NOC_API_DOCUMENTATION.md)

## Postman Collection

A complete Postman collection is provided with **25+ endpoints** covering all API functionality:

### Import the Collection
1. Open Postman
2. Click "Import"
3. Select the `postman-collection.json` file
4. The collection includes all endpoints with:
   - Pre-configured request examples
   - Automatic token management
   - Response validation tests
   - Environment variables

### Collection Features
- ✅ **User Management**: Register, login, profile, CRUD operations
- ✅ **Password Reset**: Email-based and URL token-based reset
- ✅ **OTP Verification**: Send and verify OTP codes
- ✅ **Captcha System**: Generate and verify captchas
- ✅ **States Management**: Full CRUD with search and pagination
- ✅ **Trades Management**: Full CRUD with search, statistics, and pagination
- ✅ **NOC Management**: Complete certificate lifecycle with trade management
- ✅ **Authentication**: Automatic JWT token handling
- ✅ **Error Testing**: Invalid scenarios and edge cases

### Usage Guide
See [POSTMAN_ROUTES.md](POSTMAN_ROUTES.md) for detailed instructions on using the Postman collection.

## Demo Data

The application comes with pre-populated demo data:

### States (20 US States)
- California, Texas, Florida, New York, Pennsylvania, Illinois, Ohio, Georgia, North Carolina, Michigan, and more
- Each state includes name and flag logo URL

### Trades (40 Professional Trades)
- Electrician, Plumber, Carpenter, Welder, HVAC Technician, Automotive Mechanic, and many more
- Covers construction, mechanical, technical, and specialized trades

### NOC Certificates (15 Certificates)
- Covers various ITI establishments across multiple states
- Categories include: New ITI, Addition of Trade Unit, Shifting, Relocation of Existing ITI
- States covered: Delhi, Maharashtra, Karnataka, Tamil Nadu, West Bengal, Telangana, Gujarat, Rajasthan, Uttar Pradesh, and more
- Each certificate includes associated trades with shift information
- Status tracking: Active, Expired, Revoked certificates

## Testing the API

### Using curl

1. **Register a new user:**
   ```bash
   curl -X POST http://localhost:5050/api/users/register \
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
