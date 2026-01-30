import express from 'express';
import { requestAppointment, getAppointmentStatus, getUpcomingAppointments } from '../controllers/appointments';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/appointments/request:
 *   post:
 *     summary: Request new appointment (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salon
 *               - service
 *               - date
 *               - time
 *             properties:
 *               salon:
 *                 type: string
 *                 description: Salon ID
 *               service:
 *                 type: string
 *                 description: Service ID
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment requested successfully
 *       400:
 *         description: Invalid appointment data
 *       403:
 *         description: Not authorized - Customer access required
 */
router.post('/request', protect, authorize('customer'), requestAppointment);

/**
 * @swagger
 * /api/appointments/upcoming:
 *   get:
 *     summary: Get upcoming appointments (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming appointments
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
 */
router.get('/upcoming', protect, authorize('customer'), getUpcomingAppointments);

/**
 * @swagger
 * /api/appointments/{id}/status:
 *   get:
 *     summary: Get appointment status (Customer only)
 *     tags: [4. Customer - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *     responses:
 *       200:
 *         description: Appointment status
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
 *                     status:
 *                       type: string
 *                       enum: [pending, confirmed, completed, cancelled]
 *                     appointment:
 *                       $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Appointment not found
 *       403:
 *         description: Not authorized - Customer access required
 */
router.get('/:id/status', protect, authorize('customer'), getAppointmentStatus);

export default router;