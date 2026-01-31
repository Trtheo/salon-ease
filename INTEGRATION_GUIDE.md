# Backend-Frontend Authentication Integration Guide

## 🚀 Integration Status

### ✅ **Completed Features:**
- User Registration with Email OTP
- Login/Logout with JWT tokens
- Forgot Password via Email
- Password Reset with OTP verification
- Token storage and session management
- Error handling and user feedback

### 📁 **Project Structure:**
```
mobile/
├── backend/
│   ├── src/
│   │   ├── controllers/auth.ts    # Authentication logic
│   │   ├── controllers/otp.ts     # OTP management
│   │   ├── routes/auth.ts         # Auth endpoints
│   │   ├── models/User.ts         # User model
│   │   ├── models/OTP.ts          # OTP model
│   │   └── utils/email.ts         # Email service
│   └── .env                       # Environment variables
└── frontend/SalonEase/
    ├── src/
    │   ├── screens/auth/           # Authentication screens
    │   ├── services/api.ts         # API service
    │   ├── services/storage.ts     # Local storage
    │   ├── contexts/AuthContext.tsx # Global auth state
    │   └── navigation/             # Navigation setup
    └── package.json
```

## 🔧 **Setup Instructions:**

### 1. Backend Configuration:
```bash
cd backend
npm install
```

Update `.env` file:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/salonease

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Development
NODE_ENV=development
PORT=3002
```

Start backend:
```bash
npm run dev
```

### 2. Frontend Configuration:
```bash
cd frontend/SalonEase
npm install
```

Update API base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3002/api'; // Replace with your IP
```

For Android emulator, use: `http://10.0.2.2:3002/api`
For iOS simulator, use: `http://localhost:3002/api`
For physical device, use your computer's IP: `http://192.168.1.XXX:3002/api`

## 🔗 **API Endpoints:**

### Authentication:
- `POST /api/auth/register` - Register user (sends OTP)
- `POST /api/auth/verify-registration` - Verify OTP and complete registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Send password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user profile

### Development Helper:
- `GET /api/auth/test-otp?email=user@example.com` - Get OTP for testing

## 📱 **Frontend Integration:**

### 1. Wrap App with AuthProvider:
```typescript
// App.tsx
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
```

### 2. Use Auth Context in Components:
```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use authentication state and methods
};
```

## 🧪 **Testing the Integration:**

### 1. Registration Flow:
1. Open app → Navigate to Sign Up
2. Fill form: name, email, password
3. Submit → OTP sent to email
4. Enter OTP → Account created → Auto login

### 2. Login Flow:
1. Navigate to Sign In
2. Enter email/password
3. Submit → Logged in → Navigate to main app

### 3. Forgot Password Flow:
1. Sign In → "Forgot Password"
2. Enter email → OTP sent
3. Enter OTP + new password → Password reset
4. Return to login with new password

### 4. Development Testing:
```bash
# Get OTP for testing (development only)
curl "http://localhost:3002/api/auth/test-otp?email=test@example.com"
```

## 🔒 **Security Features:**

- JWT tokens with 7-day expiration
- Password hashing with bcrypt
- OTP expiration (10 minutes)
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- Secure token storage in AsyncStorage

## 🚨 **Common Issues & Solutions:**

### Network Connection:
- Ensure backend is running on correct port
- Update API_BASE_URL with correct IP address
- Check firewall settings

### OTP Not Received:
- Verify email configuration in backend `.env`
- Check spam folder
- Use test OTP endpoint for development

### Token Issues:
- Clear app storage if tokens are corrupted
- Verify JWT_SECRET is consistent
- Check token expiration

## 📋 **Next Steps:**

1. **Social Login Integration** (Google, Facebook)
2. **Phone Number Verification** (SMS OTP)
3. **Biometric Authentication** (Face ID, Fingerprint)
4. **Push Notifications** for security alerts
5. **Account Verification** email templates
6. **Password Strength Validation**
7. **Two-Factor Authentication** (2FA)

## 🔄 **API Response Format:**

All endpoints return consistent format:
```json
{
  "success": true|false,
  "data": { ... },           // On success
  "error": "Error message",  // On failure
  "message": "Info message"  // Additional info
}
```

## 🎯 **Ready to Use:**

Your authentication system is fully integrated and ready for production use. The backend provides secure JWT-based authentication with email OTP verification, while the frontend offers a smooth user experience with proper error handling and state management.

Test the complete flow and customize the UI/UX as needed for your salon booking app!