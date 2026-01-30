import express from 'express';
import {
  getCustomerAnalytics,
  getRevenueReports,
  getBookingTrends
} from '../controllers/analytics';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);
router.use(authorize('salon_owner', 'admin'));

/**
 * @swagger
 * /api/analytics/{salonId}/customers:
 *   get:
 *     summary: Get customer analytics (Salon Owner/Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID for analytics
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           default: "30"
 *         description: Number of days to analyze
 *     responses:
 *       200:
 *         description: Customer analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     topCustomers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           customerName:
 *                             type: string
 *                           customerEmail:
 *                             type: string
 *                           totalBookings:
 *                             type: number
 *                           totalSpent:
 *                             type: number
 *                           avgBookingValue:
 *                             type: number
 *                           lastBooking:
 *                             type: string
 *                             format: date-time
 *                     customerTypes:
 *                       type: object
 *                       properties:
 *                         newCustomers:
 *                           type: number
 *                           description: Number of first-time customers
 *                         returningCustomers:
 *                           type: number
 *                           description: Number of repeat customers
 *       403:
 *         description: Salon owner or admin access required
 */
router.get('/:salonId/customers', getCustomerAnalytics);

/**
 * @swagger
 * /api/analytics/{salonId}/revenue:
 *   get:
 *     summary: Get revenue reports (Salon Owner/Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Time period for grouping data
 *     responses:
 *       200:
 *         description: Revenue reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     revenueOverTime:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           totalRevenue:
 *                             type: number
 *                           transactionCount:
 *                             type: number
 *                     servicePerformance:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           serviceName:
 *                             type: string
 *                           bookingCount:
 *                             type: number
 *                           totalRevenue:
 *                             type: number
 *                           avgPrice:
 *                             type: number
 */
router.get('/:salonId/revenue', getRevenueReports);

/**
 * @swagger
 * /api/analytics/{salonId}/booking-trends:
 *   get:
 *     summary: Get booking trends analysis (Salon Owner/Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking trends retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     peakHours:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           bookingCount:
 *                             type: number
 *                     dayOfWeekTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: number
 *                           bookingCount:
 *                             type: number
 *                           avgRevenue:
 *                             type: number
 *                     monthlyTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           bookingCount:
 *                             type: number
 *                           totalRevenue:
 *                             type: number
 *                     cancellationAnalysis:
 *                       type: object
 *                       properties:
 *                         totalBookings:
 *                           type: number
 *                         cancelledBookings:
 *                           type: number
 *                         cancellationRate:
 *                           type: number
 */
router.get('/:salonId/booking-trends', getBookingTrends);

export default router;