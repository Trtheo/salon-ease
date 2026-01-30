import express from 'express';
import {
  getMySalons,
  getSalonBookings,
  updateBookingStatus,
  getSalonStats
} from '../controllers/salonOwner';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Protect all routes and restrict to salon owners
router.use(protect);
router.use(authorize('salon_owner'));

/**
 * @swagger
 * /api/salon-owner/salons:
 *   get:
 *     summary: Get my salons (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of owner's salons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Salon'
 *       403:
 *         description: Salon owner access required
 */
router.get('/salons', getMySalons);

/**
 * @swagger
 * /api/salon-owner/salons/{salonId}/bookings:
 *   get:
 *     summary: Get salon bookings (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: List of salon bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Salon not found or not authorized
 */
router.get('/salons/:salonId/bookings', getSalonBookings);

/**
 * @swagger
 * /api/salon-owner/salons/{salonId}/stats:
 *   get:
 *     summary: Get salon statistics (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Salon statistics
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
 *                     totalBookings:
 *                       type: number
 *                     pendingBookings:
 *                       type: number
 *                     completedBookings:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     salonStatus:
 *                       type: string
 */
router.get('/salons/:salonId/stats', getSalonStats);

/**
 * @swagger
 * /api/salon-owner/bookings/{bookingId}/status:
 *   put:
 *     summary: Update booking status (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       403:
 *         description: Not authorized to update this booking
 *       404:
 *         description: Booking not found
 */
router.put('/bookings/:bookingId/status', updateBookingStatus);

export default router;