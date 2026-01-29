# SalonEase API Documentation

## Base URL
```
http://localhost:3002/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "customer"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Salons

#### Get All Salons
```http
GET /salons
```

#### Get Salon by ID
```http
GET /salons/:id
```

#### Create Salon (Salon Owner/Admin only)
```http
POST /salons
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Beauty Salon",
  "description": "Professional beauty services",
  "address": "123 Main St",
  "phone": "+1234567890",
  "email": "salon@example.com",
  "workingHours": {
    "monday": { "open": "09:00", "close": "18:00", "isOpen": true },
    "tuesday": { "open": "09:00", "close": "18:00", "isOpen": true }
  }
}
```

### Services

#### Get All Services
```http
GET /services
```

#### Create Service
```http
POST /services
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Haircut",
  "description": "Professional haircut service",
  "price": 25.00,
  "duration": 60,
  "category": "Hair",
  "salon": "salon_id_here"
}
```

### Bookings

#### Get User Bookings
```http
GET /bookings
Authorization: Bearer <token>
```

#### Create Booking
```http
POST /bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "salon": "salon_id_here",
  "service": "service_id_here",
  "date": "2024-01-30",
  "time": "10:00",
  "totalAmount": 25.00
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```