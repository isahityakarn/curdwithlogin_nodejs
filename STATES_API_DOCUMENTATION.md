# States API Documentation

## Overview
The States API provides endpoints to manage US states data including state names and logos.

## Base URL
```
http://localhost:5050/api/states
```

## Endpoints

### 1. Get All States
**GET** `/api/states`
- **Description**: Retrieve all states
- **Auth**: None required
- **Query Parameters**: 
  - `page` (optional): Page number for pagination
  - `limit` (optional): Number of items per page
  - `search` (optional): Search term for state names

**Example Requests:**
```bash
# Get all states
curl -X GET http://localhost:5050/api/states

# Get paginated results
curl -X GET http://localhost:5050/api/states?page=1&limit=5

# Search states
curl -X GET http://localhost:5050/api/states?search=California
```

**Success Response (200):**
```json
{
  "message": "States retrieved successfully",
  "states": [
    {
      "id": 1,
      "state_name": "Arizona",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/9/9d/Flag_of_Arizona.svg",
      "created_at": "2025-08-08T...",
      "updated_at": "2025-08-08T..."
    }
  ],
  "total": 20
}
```

### 2. Get State by ID
**GET** `/api/states/:id`
- **Description**: Get a specific state by ID
- **Auth**: None required

**Example:**
```bash
curl -X GET http://localhost:5050/api/states/1
```

### 3. Create New State
**POST** `/api/states`
- **Description**: Create a new state
- **Auth**: Required (JWT token)

**Request Body:**
```json
{
  "state_name": "Alaska",
  "logo": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Flag_of_Alaska.svg"
}
```

**Example:**
```bash
curl -X POST http://localhost:5050/api/states \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"state_name": "Alaska", "logo": "https://example.com/alaska.svg"}'
```

### 4. Update State
**PUT** `/api/states/:id`
- **Description**: Update an existing state
- **Auth**: Required (JWT token)

**Example:**
```bash
curl -X PUT http://localhost:5050/api/states/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"state_name": "Arizona Updated", "logo": "https://new-url.com/arizona.svg"}'
```

### 5. Delete State
**DELETE** `/api/states/:id`
- **Description**: Delete a state
- **Auth**: Required (JWT token)

**Example:**
```bash
curl -X DELETE http://localhost:5050/api/states/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Search States
**GET** `/api/states/search?q=searchTerm`
- **Description**: Search states by name
- **Auth**: None required

**Example:**
```bash
curl -X GET "http://localhost:5050/api/states/search?q=New"
```

### 7. Get States Statistics
**GET** `/api/states/stats`
- **Description**: Get statistics about states
- **Auth**: None required

**Example:**
```bash
curl -X GET http://localhost:5050/api/states/stats
```

**Response:**
```json
{
  "message": "States statistics retrieved successfully",
  "stats": {
    "total": 20,
    "withLogo": 20,
    "withoutLogo": 0,
    "logoPercentage": "100.00"
  }
}
```

## Demo Data
The migration automatically inserts 20 US states with their flag images:

1. Arizona
2. California
3. Florida
4. Georgia
5. Illinois
6. Indiana
7. Maryland
8. Massachusetts
9. Michigan
10. Missouri
11. New Jersey
12. New York
13. North Carolina
14. Ohio
15. Pennsylvania
16. Tennessee
17. Texas
18. Virginia
19. Washington
20. Wisconsin

## Database Schema

```sql
CREATE TABLE states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state_name VARCHAR(100) NOT NULL UNIQUE,
  logo VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "State name is required"
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
  "error": "State not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Authentication
Protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

Get a token by logging in or registering through the user endpoints.
