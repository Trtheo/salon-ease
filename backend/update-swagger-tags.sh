#!/bin/bash

echo "🔄 Updating Swagger tags to follow user workflow order..."

# Services routes
sed -i 's/tags: \[Services\]/tags: [3. Customer - Services \& Availability]/g' src/routes/services.ts

# Bookings routes  
sed -i 's/tags: \[Bookings\]/tags: [4. Customer - Bookings]/g' src/routes/bookings.ts

# Appointments routes
sed -i 's/tags: \[Appointments\]/tags: [4. Customer - Bookings]/g' src/routes/appointments.ts

# Availability routes
sed -i 's/tags: \[Availability\]/tags: [3. Customer - Services \& Availability]/g' src/routes/availability.ts

# Advanced Booking routes
sed -i 's/tags: \[Advanced Booking\]/tags: [5. Customer - Advanced Booking]/g' src/routes/advancedBooking.ts

# Payments routes
sed -i 's/tags: \[Payments\]/tags: [6. Customer - Payments]/g' src/routes/payments.ts

# Reviews routes
sed -i 's/tags: \[Reviews\]/tags: [7. Customer - Reviews \& Social]/g' src/routes/reviews.ts

# Social routes
sed -i 's/tags: \[Social\]/tags: [7. Customer - Reviews \& Social]/g' src/routes/social.ts

# Messages routes
sed -i 's/tags: \[Messages\]/tags: [8. Customer - Communication]/g' src/routes/messages.ts

# Video Calls routes
sed -i 's/tags: \[Video Calls\]/tags: [8. Customer - Communication]/g' src/routes/videoCalls.ts

# Notifications routes
sed -i 's/tags: \[Notifications\]/tags: [8. Customer - Communication]/g' src/routes/notifications.ts

# Upload routes
sed -i 's/tags: \[Upload\]/tags: [9. Customer - File Upload]/g' src/routes/upload.ts

# Salon Owner routes
sed -i 's/tags: \[Salon Owner\]/tags: [14. Salon Owner - Booking Management]/g' src/routes/salonOwner.ts

# Portfolio routes
sed -i 's/tags: \[Portfolio\]/tags: [13. Salon Owner - Staff \& Portfolio]/g' src/routes/portfolioStaff.ts
sed -i 's/tags: \[Staff\]/tags: [13. Salon Owner - Staff \& Portfolio]/g' src/routes/portfolioStaff.ts

# Analytics routes
sed -i 's/tags: \[Analytics\]/tags: [16. Salon Owner - Analytics]/g' src/routes/analytics.ts

# Admin routes
sed -i 's/tags: \[Admin\]/tags: [19. Admin - User Management]/g' src/routes/admin.ts

# Location routes
sed -i 's/tags: \[Location\]/tags: [2. Customer - Salon Discovery]/g' src/routes/location.ts

# OTP routes
sed -i 's/tags: \[OTP\]/tags: [22. OTP Services]/g' src/routes/otp.ts

# Search routes
sed -i 's/tags: \[Search\]/tags: [23. Search \& Filters]/g' src/routes/advancedSearch.ts

echo "✅ All Swagger tags updated to follow user workflow order!"
echo "📚 New tag structure:"
echo "   1-9: Customer workflow (Authentication → Discovery → Booking → Communication)"
echo "   10-17: Salon Owner workflow (Setup → Management → Analytics)"
echo "   18-21: Admin workflow (User/Salon Management → Analytics)"
echo "   22-23: Shared utilities (OTP, Search)"