import express from 'express';
import { getSystemAnalytics, getUserAnalytics, getBookingAnalytics, getSalonAnalytics } from '../controllers/analytics';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/system:
 *   get:
 *     summary: Get system-wide analytics (Admin only)
 *     tags: [21. Admin - System Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System analytics retrieved successfully
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
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: number
 *                         totalSalons:
 *                           type: number
 *                         totalBookings:
 *                           type: number
 *                         totalServices:
 *                           type: number
 *                         verifiedSalons:
 *                           type: number
 *                         pendingBookings:
 *                           type: number
 *                         completedBookings:
 *                           type: number
 *                         monthlyBookings:
 *                           type: number
 *                         recentUsers:
 *                           type: number
 *                     usersByRole:
 *                       type: object
 *                     bookingsByStatus:
 *                       type: object
 *       403:
 *         description: Not authorized - Admin access required
 */
router.get('/system', protect, authorize('admin'), getSystemAnalytics);

/**
 * @swagger
 * /api/analytics/users:
 *   get:
 *     summary: Get user analytics (Admin only)
 *     tags: [21. Admin - System Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User analytics retrieved successfully
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
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           role:
 *                             type: string
 *                           isVerified:
 *                             type: boolean
 *                           createdAt:
 *                             type: string
 *                     userGrowth:
 *                       type: array
 *                       items:
 *                         type: object
 *       403:
 *         description: Not authorized - Admin access required
 */
router.get('/users', protect, authorize('admin'), getUserAnalytics);

/**
 * @swagger
 * /api/analytics/bookings:
 *   get:
 *     summary: Get booking analytics (Admin only)
 *     tags: [21. Admin - System Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Booking analytics retrieved successfully
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
 *                     recentBookings:
 *                       type: array
 *                       items:
 *                         type: object
 *                     bookingTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                     topSalons:
 *                       type: array
 *                       items:
 *                         type: object
 *       403:
 *         description: Not authorized - Admin access required
 */
router.get('/bookings', protect, authorize('admin'), getBookingAnalytics);

/**
 * @swagger
 * /api/analytics/salons:
 *   get:
 *     summary: Get salon analytics (Admin only)
 *     tags: [21. Admin - System Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Salon analytics retrieved successfully
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
 *                     salons:
 *                       type: array
 *                       items:
 *                         type: object
 *                     salonStats:
 *                       type: array
 *                       items:
 *                         type: object
 *       403:
 *         description: Not authorized - Admin access required
 */
router.get('/salons', protect, authorize('admin'), getSalonAnalytics);

export default router;