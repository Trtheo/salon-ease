# SalonEase API - Workflow-Ordered Swagger Documentation

##  User Workflow Organization

The Swagger documentation is now organized to follow the logical user workflow for each role:

###  **CUSTOMER WORKFLOW** (Tags 1-9)

#### 1. Customer - Authentication
- `POST /auth/register` - Register new customer
- `POST /auth/verify-registration` - Complete registration with OTP
- `POST /auth/login` - Customer login
- `GET /auth/me` - Get current user profile
- `POST /auth/forgot-password` - Send password reset OTP
- `POST /auth/reset-password` - Reset password with OTP
- `GET /users/profile` - Get detailed profile
- `PUT /users/profile` - Update profile

#### 2. Customer - Salon Discovery
- `GET /salons` - Browse all salons
- `GET /salons/{id}` - View salon details
- `GET /salons/search` - Search salons
- `GET /location/nearest` - Find nearby salons
- `PUT /location/update` - Update location

#### 3. Customer - Services & Availability
- `GET /services` - Browse services
- `GET /salons/{id}/services` - Get salon services
- `GET /availability/slots` - Check available time slots

#### 4. Customer - Bookings
- `POST /bookings` - Create booking
- `GET /bookings` - View booking history
- `PUT /bookings/{id}/cancel` - Cancel booking
- `PUT /bookings/{id}/reschedule` - Reschedule booking
- `POST /appointments/request` - Request appointment
- `GET /appointments/upcoming` - View upcoming appointments
- `GET /appointments/{id}/status` - Get appointment status

#### 5. Customer - Advanced Booking
- `POST /advanced-booking/recurring` - Create recurring booking
- `GET /advanced-booking/recurring` - View recurring bookings
- `PUT /advanced-booking/recurring/{id}/cancel` - Cancel recurring
- `POST /advanced-booking/group` - Create group booking
- `PUT /advanced-booking/group/{id}/respond` - Respond to group invitation
- `POST /advanced-booking/waitlist` - Join waitlist
- `GET /advanced-booking/waitlist` - View waitlist status

#### 6. Customer - Payments
- `POST /payments` - Process payment
- `GET /payments` - View payment history

#### 7. Customer - Reviews & Social
- `POST /reviews/submit` - Submit review
- `GET /reviews/my-reviews` - View my reviews
- `POST /social/favorites` - Add to favorites
- `GET /social/favorites` - View favorites
- `DELETE /social/favorites/{id}` - Remove from favorites
- `GET /social/favorites/{id}` - Check favorite status
- `POST /social/referral/generate` - Generate referral code
- `POST /social/referral/use` - Use referral code
- `GET /social/referral/my-referrals` - View referral stats
- `POST /social/share/{id}` - Share salon

#### 8. Customer - Communication
- `POST /messages/send` - Send message
- `GET /messages/conversations` - Get conversations
- `GET /messages/{userId}` - Get messages with user
- `PUT /messages/{userId}/read` - Mark as read
- `POST /messages/voice` - Send voice message
- `GET /messages/voice/{id}` - Get voice message
- `POST /video-calls/initiate` - Start video call
- `POST /video-calls/{id}/join` - Join video call
- `PUT /video-calls/{id}/end` - End video call
- `GET /video-calls/history` - View call history
- `GET /video-calls/active` - View active calls
- `GET /notifications` - View notifications
- `PUT /notifications/{id}/read` - Mark notification as read
- `PUT /notifications/read-all` - Mark all as read
- `DELETE /notifications/{id}` - Delete notification
- `GET /notifications/preferences` - Get notification preferences
- `PUT /notifications/preferences` - Update preferences

#### 9. Customer - File Upload
- `POST /upload/avatar` - Upload profile picture

---

###  **SALON OWNER WORKFLOW** (Tags 10-17)

#### 10. Salon Owner - Authentication
- Same authentication endpoints as customers but with `role: "salon_owner"`

#### 11. Salon Owner - Salon Setup
- `POST /salons` - Create new salon
- `PUT /salons/{id}` - Update salon information
- `DELETE /salons/{id}` - Delete salon
- `GET /salon-owner/salons` - View my salons

#### 12. Salon Owner - Services Management
- `POST /services` - Create new service
- `GET /salons/{id}/services` - View salon services

#### 13. Salon Owner - Staff & Portfolio
- `GET /portfolio/{salonId}` - View salon portfolio
- `POST /portfolio/{salonId}` - Add portfolio items
- `PUT /portfolio/item/{id}` - Update portfolio item
- `GET /staff/{salonId}` - View salon staff
- `POST /staff/{salonId}` - Add staff member
- `PUT /staff/member/{id}` - Update staff member
- `GET /staff/{id}/availability` - Get staff availability

#### 14. Salon Owner - Booking Management
- `GET /salon-owner/salons/{id}/bookings` - View salon bookings
- `PUT /salon-owner/bookings/{id}/status` - Update booking status
- `GET /salon-owner/salons/{id}/stats` - View salon statistics

#### 15. Salon Owner - Reviews Management
- `GET /reviews/salon/{id}` - View salon reviews
- `GET /reviews/salon/{id}/stats` - View rating statistics
- `PUT /reviews/{id}/respond` - Respond to review

#### 16. Salon Owner - Analytics
- `GET /analytics/{salonId}/customers` - Customer analytics
- `GET /analytics/{salonId}/revenue` - Revenue reports
- `GET /analytics/{salonId}/booking-trends` - Booking trends

#### 17. Salon Owner - File Upload
- `POST /upload/salon-images` - Upload salon images

---

###  **ADMIN WORKFLOW** (Tags 18-21)

#### 18. Admin - Authentication
- Same authentication endpoints with `role: "admin"`

#### 19. Admin - User Management
- `GET /admin/users` - View all users
- `GET /admin/salon-owners` - View salon owners
- `PUT /admin/users/{id}/role` - Update user role
- `DELETE /admin/users/{id}` - Delete user

#### 20. Admin - Salon Management
- `GET /admin/salons` - View all salons
- `PUT /admin/salons/{id}/status` - Update salon status

#### 21. Admin - System Analytics
- `GET /admin/analytics` - System-wide analytics

---

###  **SHARED UTILITIES** (Tags 22-23)

#### 22. OTP Services
- `POST /otp/send` - Send OTP
- `POST /otp/verify` - Verify OTP

#### 23. Search & Filters
- `GET /search/salons` - Advanced salon search
- `GET /search/services` - Search services
- `GET /search/filters` - Get search filters
- `GET /search/popular` - Get popular searches

---

##  Benefits of Workflow Organization

1. **Logical Flow**: Endpoints are grouped by user journey steps
2. **Role-Based**: Clear separation between customer, salon owner, and admin workflows
3. **Sequential**: Numbered tags show the natural progression of actions
4. **Quick Navigation**: Easy to find endpoints based on user workflow stage
5. **Better UX**: Developers can follow the same flow as end users

##  Access Documentation

Visit `http://localhost:3002/api-docs` to see the workflow-organized Swagger documentation.

The endpoints are now organized in the order users would naturally follow:
- **Customers**: Register → Discover → Book → Pay → Review → Communicate
- **Salon Owners**: Setup → Manage → Analyze
- **Admins**: Oversee → Manage → Monitor