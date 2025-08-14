# NOC (No Objection Certificate) API Documentation

## Overview
The NOC API provides comprehensive management for No Objection Certificates issued by State/UT Directorates for ITI (Industrial Training Institute) establishments, additions, relocations, and shifts. This API includes full CRUD operations, search functionality, filtering, and detailed statistics.

## Base URL
```
http://localhost:5050/api/noc
```

## Authentication
- **GET** operations (read) are **public** - no authentication required
- **POST, PUT, DELETE** operations require **JWT authentication**
- Include JWT token in Authorization header: `Bearer <your_jwt_token>`

## NOC Certificate Model
```json
{
  "id": 1,
  "institute_name": "Delhi Technical Institute",
  "complete_address": "123 Nehru Place, New Delhi, Delhi - 110019",
  "application_number": "NOC/2025/DTI/001",
  "mis_code": "DTI001",
  "category": "New ITI",
  "state_name": "Delhi",
  "issue_date": "2025-01-15T00:00:00.000Z",
  "expiry_date": "2026-01-14T00:00:00.000Z",
  "status": "active",
  "remarks": "Certificate issued for new ITI establishment",
  "created_at": "2025-08-08T11:34:33.000Z",
  "updated_at": "2025-08-08T11:34:33.000Z",
  "trades": [
    {
      "id": 1,
      "trade_name": "Electrician",
      "shift_1_units": 24,
      "shift_2_units": 0
    },
    {
      "id": 2,
      "trade_name": "Fitter",
      "shift_1_units": 20,
      "shift_2_units": 20
    }
  ]
}
```

## API Endpoints

### 1. Get All NOC Certificates
**GET** `/api/noc`

**Authentication:** Not required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:**
```json
{
  "message": "NOC certificates retrieved successfully",
  "certificates": [
    {
      "id": 1,
      "institute_name": "Delhi Technical Institute",
      "complete_address": "123 Nehru Place, New Delhi, Delhi - 110019",
      "application_number": "NOC/2025/DTI/001",
      "mis_code": "DTI001",
      "category": "New ITI",
      "state_name": "Delhi",
      "issue_date": "2025-01-15T00:00:00.000Z",
      "expiry_date": "2026-01-14T00:00:00.000Z",
      "status": "active",
      "remarks": "Certificate issued for new ITI establishment",
      "created_at": "2025-08-08T11:34:33.000Z",
      "updated_at": "2025-08-08T11:34:33.000Z",
      "trades": "Electrician (S1:24, S2:0), Fitter (S1:20, S2:20), Turner (S1:16, S2:0)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

### 2. Get NOC Certificate by ID
**GET** `/api/noc/:id`

**Authentication:** Not required

**Parameters:**
- `id` (required): NOC Certificate ID

**Response:**
```json
{
  "message": "NOC certificate retrieved successfully",
  "certificate": {
    "id": 1,
    "institute_name": "Delhi Technical Institute",
    "complete_address": "123 Nehru Place, New Delhi, Delhi - 110019",
    "application_number": "NOC/2025/DTI/001",
    "mis_code": "DTI001",
    "category": "New ITI",
    "state_name": "Delhi",
    "issue_date": "2025-01-15T00:00:00.000Z",
    "expiry_date": "2026-01-14T00:00:00.000Z",
    "status": "active",
    "remarks": "Certificate issued for new ITI establishment",
    "created_at": "2025-08-08T11:34:33.000Z",
    "updated_at": "2025-08-08T11:34:33.000Z",
    "trades": [
      {
        "id": 1,
        "noc_id": 1,
        "trade_name": "Electrician",
        "shift_1_units": 24,
        "shift_2_units": 0,
        "created_at": "2025-08-08T11:34:33.000Z"
      }
    ]
  }
}
```

### 3. Get NOC Certificate by Application Number
**GET** `/api/noc/application/:applicationNumber`

**Authentication:** Not required

**Parameters:**
- `applicationNumber` (required): Application Number (URL encoded)

**Example:**
```bash
curl -X GET "http://localhost:5050/api/noc/application/NOC%2F2025%2FDTI%2F001"
```

### 4. Create NOC Certificate
**POST** `/api/noc`

**Authentication:** Required (JWT Token)

**Request Body:**
```json
{
  "institute_name": "New Technical Institute",
  "complete_address": "123 Main Street, City, State - 123456",
  "application_number": "NOC/2025/NTI/016",
  "mis_code": "NTI016",
  "category": "New ITI",
  "state_name": "Delhi",
  "issue_date": "2025-08-08",
  "expiry_date": "2026-08-07",
  "status": "active",
  "remarks": "New ITI establishment",
  "trades": [
    {
      "trade_name": "Electrician",
      "shift_1_units": 24,
      "shift_2_units": 0
    },
    {
      "trade_name": "Fitter",
      "shift_1_units": 20,
      "shift_2_units": 20
    }
  ]
}
```

### 5. Update NOC Certificate
**PUT** `/api/noc/:id`

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (required): NOC Certificate ID

**Request Body:** (All fields optional)
```json
{
  "institute_name": "Updated Institute Name",
  "status": "expired",
  "remarks": "Updated remarks"
}
```

### 6. Delete NOC Certificate
**DELETE** `/api/noc/:id`

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (required): NOC Certificate ID

### 7. Search NOC Certificates
**GET** `/api/noc/search`

**Authentication:** Not required

**Query Parameters:**
- `q` (required): Search term
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Search Fields:**
- Institute name
- Application number
- State name
- Category

**Example:**
```bash
curl -X GET "http://localhost:5050/api/noc/search?q=Mumbai&page=1&limit=5"
```

### 8. Get NOC Certificates by State
**GET** `/api/noc/state/:state`

**Authentication:** Not required

**Parameters:**
- `state` (required): State name

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

### 9. Get NOC Certificates by Status
**GET** `/api/noc/status/:status`

**Authentication:** Not required

**Parameters:**
- `status` (required): Status (active, expired, revoked)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

### 10. Get NOC Statistics
**GET** `/api/noc/stats`

**Authentication:** Not required

**Response:**
```json
{
  "message": "NOC statistics retrieved successfully",
  "statistics": {
    "total": 15,
    "statusBreakdown": [
      {"status": "active", "count": 13},
      {"status": "expired", "count": 2}
    ],
    "stateBreakdown": [
      {"state_name": "Maharashtra", "count": 2},
      {"state_name": "Delhi", "count": 1}
    ],
    "categoryBreakdown": [
      {"category": "New ITI", "count": 6},
      {"category": "Addition of Trade Unit", "count": 4}
    ],
    "expiringSoon": 0
  }
}
```

## Trade Management Endpoints

### 11. Add Trade to NOC Certificate
**POST** `/api/noc/:id/trades`

**Authentication:** Required (JWT Token)

**Parameters:**
- `id` (required): NOC Certificate ID

**Request Body:**
```json
{
  "trade_name": "Welder",
  "shift_1_units": 24,
  "shift_2_units": 24
}
```

### 12. Update Trade in NOC Certificate
**PUT** `/api/noc/trades/:tradeId`

**Authentication:** Required (JWT Token)

**Parameters:**
- `tradeId` (required): Trade ID

**Request Body:**
```json
{
  "trade_name": "Advanced Welder",
  "shift_1_units": 20,
  "shift_2_units": 20
}
```

### 13. Remove Trade from NOC Certificate
**DELETE** `/api/noc/trades/:tradeId`

**Authentication:** Required (JWT Token)

**Parameters:**
- `tradeId` (required): Trade ID

## Categories
- **New ITI**: New Industrial Training Institute establishment
- **Addition of Trade Unit**: Adding new trade courses to existing ITI
- **Shifting**: Relocating ITI to a new address within the state
- **Relocation of Existing ITI**: Moving ITI to a different location

## Status Values
- **active**: Certificate is currently valid
- **expired**: Certificate has expired
- **revoked**: Certificate has been revoked/cancelled

## Error Responses

### 400 Bad Request
```json
{
  "error": "Institute name, address, application number, category, state, issue date, and expiry date are required"
}
```

### 404 Not Found
```json
{
  "error": "NOC certificate not found"
}
```

### 409 Conflict
```json
{
  "error": "Application number already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Sample Data
The database comes pre-populated with 15 NOC certificates from various states including:
- Delhi Technical Institute (New ITI)
- Mumbai Industrial Training Center (Addition of Trade Unit)
- Bangalore Skill Development Institute (Shifting)
- Chennai Technical Academy (New ITI)
- And 11 more certificates across different states and categories

## Validation Rules
- **institute_name**: Required, string, 2-255 characters
- **complete_address**: Required, text field
- **application_number**: Required, unique, string, 2-100 characters
- **mis_code**: Optional, string, max 50 characters
- **category**: Required, string, max 100 characters
- **state_name**: Required, string, max 100 characters
- **issue_date**: Required, valid date
- **expiry_date**: Required, valid date
- **status**: Optional, enum (active, expired, revoked), default: active
- **remarks**: Optional, text field

## Trade Validation Rules
- **trade_name**: Required, string, 2-255 characters
- **shift_1_units**: Optional, integer, default: 0
- **shift_2_units**: Optional, integer, default: 0

## Notes
- All timestamps are in UTC format
- Application numbers must be unique across all certificates
- Search functionality is case-insensitive
- Date fields accept ISO date format (YYYY-MM-DD)
- Pagination follows standard REST patterns
- When a NOC certificate is deleted, all associated trades are automatically removed
- Expiry tracking: The system can identify certificates expiring within 30 days
