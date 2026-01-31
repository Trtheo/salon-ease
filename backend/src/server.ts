import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { specs, swaggerUi } from './config/swagger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import salonRoutes from './routes/salons';
import serviceRoutes from './routes/services';
import bookingRoutes from './routes/bookings';
import availabilityRoutes from './routes/availability';
import paymentRoutes from './routes/payments';
import otpRoutes from './routes/otp';
import locationRoutes from './routes/location';
import appointmentRoutes from './routes/appointments';
import adminRoutes from './routes/admin';
import salonOwnerRoutes from './routes/salonOwner';
import uploadRoutes from './routes/upload';
import messageRoutes from './routes/messages';
import reviewRoutes from './routes/reviews';
import notificationRoutes from './routes/notifications';
import advancedSearchRoutes from './routes/advancedSearch';
import socialRoutes from './routes/social';
import videoCallRoutes from './routes/videoCalls';
import advancedBookingRoutes from './routes/advancedBooking';
import portfolioStaffRoutes from './routes/portfolioStaff';
import analyticsRoutes from './routes/analytics';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3002'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));
app.use('/uploads/avatars', express.static('uploads/avatars'));
app.use('/uploads/salons', express.static('uploads/salons'));
app.use('/uploads/messages', express.static('uploads/messages'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/salons', salonRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/salon-owner', salonOwnerRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', advancedSearchRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/video-calls', videoCallRoutes);
app.use('/api/advanced-booking', advancedBookingRoutes);
app.use('/api', portfolioStaffRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'OK', message: 'SalonEase API is running' });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(` SalonEase API server running on port ${PORT}`);
});