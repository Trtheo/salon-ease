import express from 'express';
import { getBookings, createBooking, cancelBooking, rescheduleBooking } from '../controllers/bookings';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - salon
 *         - service
 *         - date
 *         - time
 *       properties:
 *         salon:
 *           type: string
 *           description: Salon ID
 *         service:
 *           type: string
 *           description: Service ID
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled]
 *         totalAmount:
 *           type: number
 *         notes:
 *           type: string
 */

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get user bookings (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       403:
 *         description: Not authorized - Customer access required
 *   post:
 *     summary: Create new booking (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         description: Invalid booking data
 *       403:
 *         description: Not authorized - Customer access required
 */
router.route('/')
  .get(protect, authorize('customer'), getBookings)
  .post(protect, authorize('customer'), createBooking);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Cancel booking (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled successfully
 *       404:
 *         description: Booking not found
 *       403:
 *         description: Not authorized - Customer access required
 */
router.route('/:id/cancel')
  .put(protect, authorize('customer'), cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/reschedule:
 *   put:
 *     summary: Reschedule booking (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Booking rescheduled successfully
 *       404:
 *         description: Booking not found
 *       403:
 *         description: Not authorized - Customer access required
 */
router.route('/:id/reschedule')
  .put(protect, authorize('customer'), rescheduleBooking);

export default router;