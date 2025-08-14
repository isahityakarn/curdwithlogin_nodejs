# Trades API Documentation

## Overview
The Trades API provides full CRUD (Create, Read, Update, Delete) operations for managing professional trades data. This API allows you to manage trade information with features like search, pagination, and statistics.

## Base URL
```
http://localhost:5050/api/trades
```

## Authentication
- **GET** operations (read) are **public** - no authentication required
- **POST, PUT, DELETE** operations require **JWT authentication**
- Include JWT token in Authorization header: `Bearer <your_jwt_token>`

## Trade Model
```json
{
  "id": 1,
  "trade_name": "Electrician",
  "created_at": "2025-08-08T10:15:12.000Z",
  "updated_at": "2025-08-08T10:15:12.000Z"
}
```

## API Endpoints

### 1. Get All Trades
**GET** `/api/trades`

**Authentication:** Not required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "message": "Trades retrieved successfully",
  "trades": [
    {
      "id": 1,
      "trade_name": "Electrician",
      "created_at": "2025-08-08T10:15:12.000Z",
      "updated_at": "2025-08-08T10:15:12.000Z"
    }
  ],
  "total": 40,
  "page": 1,
  "totalPages": 4
}
```

**Example:**
```bash
curl -X GET "http://localhost:5050/api/trades?page=1&limit=5"
```

### 2. Get Trade by ID
**GET** `/api/trades/:id`

**Authentication:** Not required

**Parameters:**
- `id` (required): Trade ID

**Response:**
```json
{
  "message": "Trade retrieved successfully",
  "trade": {
    "id": 1,
    "trade_name": "Electrician",
    "created_at": "2025-08-08T10:15:12.000Z",
    "updated_at": "2025-08-08T10:15:12.000Z"
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:5050/api/trades/1"
```

### 3. Create Trade
**POST** `/api/trades`

**Authentication:** Required (JWT Token)

**Request Body:**
```json
{
  "trade_name": "Software Developer"
}
```

**Response:**
```json
{
  "message": "Trade created successfully",
  "trade": {
    "id": 41,
    "trade_name": "Software Developer",
    "created_at": "2025-08-08T11:30:45.000Z",
    "updated_at": "2025-08-08T11:30:45.000Z"
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:5050/api/trades" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"trade_name": "Software Developer"}'
```

### 4. Update Trade
**PUT** `/api/trades/:id`

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (required): Trade ID

**Request Body:**
```json
{
  "trade_name": "Senior Software Developer"
}
```

**Response:**
```json
{
  "message": "Trade updated successfully",
  "trade": {
    "id": 41,
    "trade_name": "Senior Software Developer",
    "created_at": "2025-08-08T11:30:45.000Z",
    "updated_at": "2025-08-08T11:45:22.000Z"
  }
}
```

**Example:**
```bash
curl -X PUT "http://localhost:5050/api/trades/41" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"trade_name": "Senior Software Developer"}'
```

### 5. Delete Trade
**DELETE** `/api/trades/:id`

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (required): Trade ID

**Response:**
```json
{
  "message": "Trade deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:5050/api/trades/41" \
  -H "Authorization: Bearer your_jwt_token"
```

### 6. Search Trades
**GET** `/api/trades/search`

**Authentication:** Not required

**Query Parameters:**
- `q` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "message": "Search completed successfully",
  "trades": [
    {
      "id": 1,
      "trade_name": "Electrician",
      "created_at": "2025-08-08T10:15:12.000Z",
      "updated_at": "2025-08-08T10:15:12.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "searchTerm": "electrician"
}
```

**Example:**
```bash
curl -X GET "http://localhost:5050/api/trades/search?q=electrician&page=1&limit=5"
```

### 7. Get Trades Statistics
**GET** `/api/trades/stats`

**Authentication:** Not required

**Response:**
```json
{
  "message": "Statistics retrieved successfully",
  "total_trades": 40
}
```

**Example:**
```bash
curl -X GET "http://localhost:5050/api/trades/stats"
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Trade name is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Access denied. No token provided."
}
```

### 404 Not Found
```json
{
  "error": "Trade not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Sample Data
The database comes pre-populated with 40 professional trades including:
- Electrician
- Plumber
- Carpenter
- Welder
- HVAC Technician
- Automotive Mechanic
- CNC Operator
- Solar Panel Installer
- Wind Turbine Technician
- And many more...

## Validation Rules
- **trade_name**: Required, string, minimum 2 characters, maximum 100 characters
- Trade names are automatically trimmed of whitespace
- Duplicate trade names are not allowed

## Pagination
- Default page size: 10 items
- Maximum page size: 100 items
- Page numbers start from 1
- Response includes total count and pagination metadata

## Notes
- All timestamps are in UTC format
- Trade names are case-sensitive
- Search functionality is case-insensitive
- All successful responses return HTTP status codes 200 or 201
- Error responses return appropriate HTTP status codes with descriptive messages
