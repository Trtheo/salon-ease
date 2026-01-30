# SalonEase API Endpoints - Complete Guide

## Base URL
```
http://localhost:3002/api
```

## Authentication Header
```
Authorization: Bearer <jwt-token>
```

---

##  CUSTOMER ENDPOINTS

### Authentication & Profile
#### `POST /auth/register`
**Purpose:** Customer registration with OTP verification
**Example Request:**
```json
{
  "name": "Customer User",
  "email": "nitheophile11@gmail.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer"
}
```
**Example Response:** `{ "message": "OTP sent to email and phone" }`

#### `POST /auth/verify-registration`
**Purpose:** Complete registration with OTP
**Example Request:**
```json
{
  "name": "Customer User",
  "email": "nitheophile11@gmail.com",
  "password": "password123",
  "phone": "+1234567890",
  "code": "123456"
}
```
**Example Response:** `{ "success": true, "token": "jwt_token", "user": {...} }`

#### `POST /auth/login`
**Purpose:** Customer login
**Example Request:**
```json
{
  "email": "nitheophile11@gmail.com",
  "password": "password123"
}
```
**Example Response:** `{ "success": true, "token": "jwt_token", "user": {...} }`

#### `GET /auth/me`
**Purpose:** Get current customer profile
**Example Response:** `{ "success": true, "user": {"name": "John", "email": "..."} }`

#### `GET /users/profile`
**Purpose:** Get detailed customer profile
**Example Response:** `{ "success": true, "profile": {...} }`

#### `PUT /users/profile`
**Purpose:** Update customer profile
**Example Request:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890"
}
```

### Salon Discovery
#### `GET /salons`
**Purpose:** Browse all available salons
**Example Response:** `{ "success": true, "data": [{"name": "Beauty Salon", "rating": 4.5}] }`

#### `GET /salons/:id`
**Purpose:** View detailed salon information
**Example Response:** `{ "success": true, "salon": {"name": "...", "services": [...]} }`

#### `GET /salons/search`
**Purpose:** Search salons by name/location
**Example Query:** `?q=haircut&location=downtown`

#### `GET /location/nearest`
**Purpose:** Find salons near customer location
**Example Query:** `?lat=40.7128&lng=-74.0060&radius=5`

#### `PUT /location/update`
**Purpose:** Update customer location for personalized results
**Example Request:**
```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "address": "123 Main St"
}
```

### Services & Availability
#### `GET /services`
**Purpose:** Browse all services or filter by salon/category
**Example Query:** `?salon=123&category=Hair`

#### `GET /availability/slots`
**Purpose:** Check available time slots for booking
**Example Query:** `?salon=123&service=456&date=2024-01-30`

### Bookings & Appointments
#### `POST /bookings`
**Purpose:** Create new booking
**Example Request:**
```json
{
  "salon": "salon_id",
  "service": "service_id",
  "date": "2024-01-30",
  "time": "10:00",
  "totalAmount": 25.00
}
```

#### `GET /bookings`
**Purpose:** View customer's booking history
**Example Response:** `{ "success": true, "data": [{"date": "...", "status": "confirmed"}] }`

#### `PUT /bookings/:id/cancel`
**Purpose:** Cancel a booking
**Example Response:** `{ "success": true, "message": "Booking cancelled" }`

#### `PUT /bookings/:id/reschedule`
**Purpose:** Reschedule a booking
**Example Request:**
```json
{
  "date": "2024-01-31",
  "time": "14:00"
}
```

#### `POST /appointments/request`
**Purpose:** Request appointment with preferences
**Example Request:**
```json
{
  "salon": "salon_id",
  "preferredDate": "2024-01-30",
  "preferredTime": "10:00",
  "flexibility": "2_hours"
}
```

#### `GET /appointments/upcoming`
**Purpose:** View upcoming appointments
**Example Response:** `{ "success": true, "appointments": [...] }`

### Advanced Booking Features
#### `POST /advanced-booking/recurring`
**Purpose:** Create recurring booking
**Example Request:**
```json
{
  "salon": "salon_id",
  "service": "service_id",
  "frequency": "weekly",
  "startDate": "2024-01-30",
  "time": "10:00"
}
```

#### `GET /advanced-booking/recurring`
**Purpose:** View recurring bookings
**Example Response:** `{ "success": true, "recurringBookings": [...] }`

#### `PUT /advanced-booking/recurring/:recurringId/cancel`
**Purpose:** Cancel recurring booking
**Example Response:** `{ "success": true, "message": "Recurring booking cancelled" }`

#### `POST /advanced-booking/group`
**Purpose:** Create group booking
**Example Request:**
```json
{
  "salon": "salon_id",
  "services": ["service_id1", "service_id2"],
  "participants": ["friend1@email.com", "friend2@email.com"],
  "date": "2024-01-30",
  "time": "10:00"
}
```

#### `PUT /advanced-booking/group/:groupBookingId/respond`
**Purpose:** Respond to group booking invitation
**Example Request:**
```json
{
  "response": "accepted",
  "preferredService": "service_id"
}
```

#### `POST /advanced-booking/waitlist`
**Purpose:** Join waitlist for fully booked slots
**Example Request:**
```json
{
  "salon": "salon_id",
  "service": "service_id",
  "preferredDate": "2024-01-30",
  "preferredTime": "10:00"
}
```

#### `GET /advanced-booking/waitlist`
**Purpose:** View waitlist status
**Example Response:** `{ "success": true, "waitlistEntries": [...] }`

### Payments
#### `POST /payments`
**Purpose:** Process payment for booking
**Example Request:**
```json
{
  "booking": "booking_id",
  "amount": 25.00,
  "paymentMethod": "credit_card"
}
```

#### `GET /payments`
**Purpose:** View payment history
**Example Response:** `{ "success": true, "payments": [{"amount": 25.00, "status": "completed"}] }`

### Reviews & Social
#### `POST /reviews/submit`
**Purpose:** Submit review for salon
**Example Request:**
```json
{
  "salon": "salon_id",
  "rating": 5,
  "comment": "Great service!",
  "service": "service_id"
}
```

#### `GET /reviews/my-reviews`
**Purpose:** View customer's reviews
**Example Response:** `{ "success": true, "reviews": [{"rating": 5, "comment": "..."}] }`

#### `POST /social/favorites`
**Purpose:** Add salon to favorites
**Example Request:**
```json
{
  "salon": "salon_id"
}
```

#### `GET /social/favorites`
**Purpose:** View favorite salons
**Example Response:** `{ "success": true, "favorites": [{"salon": {...}}] }`

#### `DELETE /social/favorites/:salonId`
**Purpose:** Remove salon from favorites
**Example Response:** `{ "success": true, "message": "Removed from favorites" }`

#### `GET /social/favorites/:salonId`
**Purpose:** Check if salon is in favorites
**Example Response:** `{ "success": true, "isFavorite": true }`

#### `POST /social/referral/generate`
**Purpose:** Generate referral code
**Example Response:** `{ "success": true, "referralCode": "JOHN123" }`

#### `POST /social/referral/use`
**Purpose:** Use referral code for discount
**Example Request:**
```json
{
  "referralCode": "JOHN123"
}
```

#### `GET /social/referral/my-referrals`
**Purpose:** View referral statistics
**Example Response:** `{ "success": true, "referrals": [{"code": "...", "used": true}] }`

#### `POST /social/share/:salonId`
**Purpose:** Share salon on social platforms
**Example Request:**
```json
{
  "platform": "whatsapp",
  "message": "Check out this amazing salon!"
}
```

### Communication
#### `GET /messages`
**Purpose:** View all conversations
**Example Response:** `{ "success": true, "conversations": [{"id": "...", "lastMessage": "..."}] }`

#### `POST /messages`
**Purpose:** Start new conversation
**Example Request:**
```json
{
  "recipient": "user_id",
  "message": "Hello, I have a question about your services"
}
```

#### `POST /messages/media`
**Purpose:** Send image or video message
**Example Request:** `multipart/form-data` with media file
**Form Data:**
- `receiverId`: "user_id"
- `media`: image/video file
- `messageType`: "image" or "video"
- `duration`: video duration (for videos)
**Example Response:** `{ "success": true, "data": {...} }`

#### `GET /messages/media/:messageId`
**Purpose:** Get image or video file
**Example Response:** Binary file data (image/video)

#### `GET /messages/:conversationId`
**Purpose:** View conversation messages
**Example Response:** `{ "success": true, "messages": [{"sender": "...", "content": "...", "messageType": "text|voice|image|video"}] }`

#### `POST /messages/:conversationId`
**Purpose:** Send message in conversation
**Example Request:**
```json
{
  "content": "When are you available?"
}
```

#### `PUT /messages/:conversationId/read`
**Purpose:** Mark conversation as read
**Example Response:** `{ "success": true, "message": "Conversation marked as read" }`

#### `DELETE /messages/:conversationId`
**Purpose:** Delete conversation
**Example Response:** `{ "success": true, "message": "Conversation deleted" }`

### Video Calls
#### `POST /video-calls/initiate`
**Purpose:** Start video call with salon
**Example Request:**
```json
{
  "recipient": "salon_owner_id",
  "bookingId": "booking_id"
}
```

#### `POST /video-calls/:callId/join`
**Purpose:** Join existing video call
**Example Response:** `{ "success": true, "callUrl": "https://call.url" }`

#### `PUT /video-calls/:callId/end`
**Purpose:** End video call
**Example Response:** `{ "success": true, "message": "Call ended" }`

#### `GET /video-calls/history`
**Purpose:** View call history
**Example Response:** `{ "success": true, "calls": [{"date": "...", "duration": "10:00"}] }`

#### `GET /video-calls/active`
**Purpose:** View active calls
**Example Response:** `{ "success": true, "activeCalls": [] }`

### Notifications
#### `GET /notifications`
**Purpose:** View notifications
**Example Response:** `{ "success": true, "notifications": [{"title": "...", "read": false}] }`

#### `PUT /notifications/:notificationId/read`
**Purpose:** Mark notification as read
**Example Response:** `{ "success": true, "message": "Marked as read" }`

#### `PUT /notifications/read-all`
**Purpose:** Mark all notifications as read
**Example Response:** `{ "success": true, "message": "All notifications marked as read" }`

#### `DELETE /notifications/:notificationId`
**Purpose:** Delete notification
**Example Response:** `{ "success": true, "message": "Notification deleted" }`

#### `GET /notifications/preferences`
**Purpose:** View notification preferences
**Example Response:** `{ "success": true, "preferences": {"email": true, "sms": false} }`

#### `PUT /notifications/preferences`
**Purpose:** Update notification preferences
**Example Request:**
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true
}
```

### File Upload
#### `POST /upload/avatar`
**Purpose:** Upload profile picture
**Example Request:** `multipart/form-data` with file
**Example Response:** `{ "success": true, "avatarUrl": "uploads/avatars/user123.jpg" }`

---

##  SALON OWNER ENDPOINTS

### Authentication
#### `POST /auth/register` (with role: "salon_owner")
#### `POST /auth/login`
#### `GET /auth/me`

### Salon Management
#### `GET /salon-owner/salons`
**Purpose:** View all salons owned by user
**Example Response:** `{ "success": true, "salons": [{"name": "My Salon", "id": "..."}] }`

#### `POST /salons`
**Purpose:** Create new salon
**Example Request:**
```json
{
  "name": "Beauty Paradise",
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

#### `PUT /salons/:id`
**Purpose:** Update salon information
**Example Request:**
```json
{
  "name": "Updated Salon Name",
  "phone": "+1234567890"
}
```

#### `DELETE /salons/:id`
**Purpose:** Delete salon
**Example Response:** `{ "success": true, "message": "Salon deleted" }`

#### `GET /salons/:id/services`
**Purpose:** View salon services
**Example Response:** `{ "success": true, "services": [{"name": "Haircut", "price": 25}] }`

### Services Management
#### `POST /services`
**Purpose:** Add new service to salon
**Example Request:**
```json
{
  "name": "Haircut",
  "description": "Professional haircut service",
  "price": 25.00,
  "duration": 60,
  "category": "Hair",
  "salon": "salon_id"
}
```

### Staff & Portfolio Management
#### `GET /portfolio/:salonId`
**Purpose:** View salon portfolio
**Example Response:** `{ "success": true, "portfolio": [{"images": [...], "description": "..."}] }`

#### `POST /portfolio/:salonId`
**Purpose:** Add portfolio items
**Example Request:**
```json
{
  "title": "Latest Hairstyles",
  "description": "Our latest work",
  "images": ["image1.jpg", "image2.jpg"]
}
```

#### `PUT /portfolio/item/:portfolioId`
**Purpose:** Update portfolio item
**Example Request:**
```json
{
  "title": "Updated Portfolio",
  "description": "Updated description"
}
```

#### `GET /staff/:salonId`
**Purpose:** View salon staff
**Example Response:** `{ "success": true, "staff": [{"name": "John", "role": "Stylist"}] }`

#### `POST /staff/:salonId`
**Purpose:** Add new staff member
**Example Request:**
```json
{
  "name": "Jane Smith",
  "role": "Senior Stylist",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "specializations": ["Haircut", "Coloring"]
}
```

#### `PUT /staff/member/:staffId`
**Purpose:** Update staff information
**Example Request:**
```json
{
  "name": "Jane Updated",
  "role": "Master Stylist"
}
```

### Bookings Management
#### `GET /salon-owner/salons/:salonId/bookings`
**Purpose:** View all bookings for salon
**Example Response:** `{ "success": true, "bookings": [{"customer": "...", "date": "..."}] }`

#### `PUT /salon-owner/bookings/:bookingId/status`
**Purpose:** Update booking status
**Example Request:**
```json
{
  "status": "confirmed",
  "notes": "Booking confirmed for 10:00 AM"
}
```

### Analytics & Statistics
#### `GET /salon-owner/salons/:salonId/stats`
**Purpose:** View salon statistics
**Example Response:** `{ "success": true, "stats": {"totalBookings": 100, "revenue": 2500} }`

#### `GET /analytics/overview`
**Purpose:** View analytics overview
**Example Response:** `{ "success": true, "overview": {"monthlyRevenue": 5000, "newCustomers": 25} }`

#### `GET /analytics/revenue`
**Purpose:** View revenue analytics
**Example Response:** `{ "success": true, "revenue": {"daily": 250, "weekly": 1750, "monthly": 7000} }`

#### `GET /analytics/customers`
**Purpose:** View customer analytics
**Example Response:** `{ "success": true, "customers": {"total": 500, "newThisMonth": 50, "retention": 85} }`

### Reviews Management
#### `GET /reviews/salon/:salonId`
**Purpose:** View salon reviews
**Example Response:** `{ "success": true, "reviews": [{"rating": 5, "comment": "..."}] }`

#### `GET /reviews/salon/:salonId/stats`
**Purpose:** View rating statistics
**Example Response:** `{ "success": true, "stats": {"averageRating": 4.5, "totalReviews": 100} }`

#### `PUT /reviews/:reviewId/respond`
**Purpose:** Respond to customer review
**Example Request:**
```json
{
  "response": "Thank you for your feedback! We're glad you enjoyed our service."
}
```

### File Upload
#### `POST /upload/salon-images`
**Purpose:** Upload salon images
**Example Request:** `multipart/form-data` with multiple files
**Example Response:** `{ "success": true, "imageUrls": ["uploads/salons/img1.jpg"] }`

---

##  ADMIN ENDPOINTS

### Authentication
#### `POST /auth/register` (with role: "admin")
#### `POST /auth/login`
#### `GET /auth/me`

### User Management
#### `GET /admin/users`
**Purpose:** View all users in system
**Example Response:** `{ "success": true, "users": [{"name": "...", "email": "...", "role": "..."}] }`

#### `PUT /admin/users/:id/status`
**Purpose:** Update user status (activate/deactivate)
**Example Request:**
```json
{
  "status": "active",
  "reason": "Account verified"
}
```

### Salon Management
#### `GET /admin/salons`
**Purpose:** View all salons in system
**Example Response:** `{ "success": true, "salons": [{"name": "...", "isVerified": true}] }`

#### `PUT /admin/salons/:id/verify`
**Purpose:** Verify salon
**Example Request:**
```json
{
  "isVerified": true,
  "verificationNotes": "Documents verified successfully"
}
```

### Booking Oversight
#### `GET /admin/bookings`
**Purpose:** View all bookings system-wide
**Example Response:** `{ "success": true, "bookings": [{"salon": "...", "customer": "..."}] }`

### System Analytics
#### `GET /admin/analytics`
**Purpose:** View system-wide analytics
**Example Response:** `{ "success": true, "analytics": {"totalUsers": 1000, "totalSalons": 100} }`

---

##  DEVELOPER TESTING GUIDE

### Test Users
- **Admin**: niyigabatheophile96@gmail.com
- **Salon Owner**: nitheophile10@gmail.com  
- **Customer**: nitheophile11@gmail.com
- **Password**: password123 (for all test users)

### Testing Authentication Flow
1. **Register Customer:**
   ```bash
   curl -X POST http://localhost:3002/api/auth/register \
   -H "Content-Type: application/json" \
   -d '{"name":"Customer User","email":"nitheophile11@gmail.com","password":"password123","phone":"+1234567890","role":"customer"}'
   ```

2. **Verify Registration (get OTP from test endpoint):**
   ```bash
   curl -X GET "http://localhost:3002/api/auth/test-otp?email=nitheophile11@gmail.com"
   ```

3. **Complete Registration:**
   ```bash
   curl -X POST http://localhost:3002/api/auth/verify-registration \
   -H "Content-Type: application/json" \
   -d '{"name":"Customer User","email":"nitheophile11@gmail.com","password":"password123","phone":"+1234567890","code":"123456"}'
   ```

4. **Login:**
   ```bash
   curl -X POST http://localhost:3002/api/auth/login \
   -H "Content-Type: application/json" \
   -d '{"email":"nitheophile11@gmail.com","password":"password123"}'
   ```

### Testing Salon Creation
```bash
curl -X POST http://localhost:3002/api/salons \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <salon_owner_token>" \
-d '{
  "name":"Test Salon",
  "description":"Test description",
  "address":"123 Test St",
  "phone":"+1234567890",
  "email":"test@salon.com"
}'
```

### Testing Service Creation
```bash
curl -X POST http://localhost:3002/api/services \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <salon_owner_token>" \
-d '{
  "name":"Haircut",
  "description":"Professional haircut",
  "price":25.00,
  "duration":60,
  "category":"Hair",
  "salon":"<salon_id>"
}'
```

### Testing Booking Flow
```bash
curl -X POST http://localhost:3002/api/bookings \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <customer_token>" \
-d '{
  "salon":"<salon_id>",
  "service":"<service_id>",
  "date":"2024-01-30",
  "time":"10:00",
  "totalAmount":25.00
}'
```

### Testing Reviews
```bash
curl -X POST http://localhost:3002/api/reviews/submit \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <customer_token>" \
-d '{
  "salon":"<salon_id>",
  "rating":5,
  "comment":"Excellent service!",
  "service":"<service_id>"
}'
```

### Health Check
```bash
curl http://localhost:3002/health
```

### API Documentation
Visit `http://localhost:3002/api-docs` for interactive Swagger documentation

---

##  Testing Checklist

###  Customer Flow Testing
- [ ] Register and verify account
- [ ] Login and access profile
- [ ] Browse salons and services
- [ ] Create, view, cancel, reschedule bookings
- [ ] Make payments
- [ ] Submit reviews
- [ ] Use favorites and referrals
- [ ] Send messages and make video calls
- [ ] Manage notifications

###  Salon Owner Flow Testing
- [ ] Register as salon owner
- [ ] Create and manage salons
- [ ] Add and manage services
- [ ] Manage staff and portfolio
- [ ] View and manage bookings
- [ ] Respond to reviews
- [ ] View analytics and statistics

###  Admin Flow Testing
- [ ] Register as admin
- [ ] Manage users (activate/deactivate)
- [ ] Verify salons
- [ ] View system analytics
- [ ] Monitor all bookings

###  Cross-Role Testing
- [ ] Permission validation (customers can't access owner endpoints)
- [ ] Token authentication and authorization
- [ ] Error handling for unauthorized access
- [ ] Data validation and sanitization

###  Integration Testing
- [ ] Email/SMS OTP functionality
- [ ] File upload for avatars and salon images
- [ ] Payment processing
- [ ] Video call initiation
- [ ] Push notifications
- [ ] Real-time messaging

---

##  Common Testing Scenarios

### Error Cases to Test
1. **Invalid credentials:** Login with wrong password
2. **Unauthorized access:** Customer trying to access admin endpoints
3. **Invalid data:** Submit booking with past date
4. **Duplicate resources:** Register with existing email
5. **Missing required fields:** Create salon without address
6. **Invalid file formats:** Upload non-image files
7. **Rate limiting:** Multiple OTP requests

### Success Cases to Verify
1. **Complete booking flow:** Browse → Book → Pay → Review
2. **Salon setup:** Register → Create salon → Add services → Get bookings
3. **Social features:** Favorite → Share → Refer
4. **Communication:** Message → Video call → Review

---

**Total Endpoints: ~85** across all user roles with comprehensive functionality for the SalonEase platform.
