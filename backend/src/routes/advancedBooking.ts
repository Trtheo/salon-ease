import express from 'express';
import {
  createRecurringBooking,
  getRecurringBookings,
  cancelRecurringBooking,
  createGroupBooking,
  respondToGroupBooking,
  joinWaitlist,
  getUserWaitlist
} from '../controllers/advancedBooking';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     RecurringBooking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/User'
 *         salon:
 *           $ref: '#/components/schemas/Salon'
 *         service:
 *           $ref: '#/components/schemas/Service'
 *         pattern:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               enum: [weekly, biweekly, monthly]
 *             dayOfWeek:
 *               type: number
 *               minimum: 0
 *               maximum: 6
 *             dayOfMonth:
 *               type: number
 *               minimum: 1
 *               maximum: 31
 *             time:
 *               type: string
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         totalAmount:
 *           type: number
 *         isActive:
 *           type: boolean
 *         bookings:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     GroupBooking:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         organizer:
 *           $ref: '#/components/schemas/User'
 *         salon:
 *           $ref: '#/components/schemas/Salon'
 *         service:
 *           $ref: '#/components/schemas/Service'
 *         date:
 *           type: string
 *           format: date
 *         time:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, declined]
 *               paymentStatus:
 *                 type: string
 *                 enum: [pending, paid, refunded]
 *               amount:
 *                 type: number
 *         maxParticipants:
 *           type: number
 *         totalAmount:
 *           type: number
 *         splitType:
 *           type: string
 *           enum: [equal, custom]
 *         status:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled]
 *     Waitlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/User'
 *         salon:
 *           $ref: '#/components/schemas/Salon'
 *         service:
 *           $ref: '#/components/schemas/Service'
 *         preferredDate:
 *           type: string
 *           format: date
 *         preferredTime:
 *           type: string
 *         flexibleTiming:
 *           type: boolean
 *         position:
 *           type: number
 *         status:
 *           type: string
 *           enum: [active, notified, booked, expired]
 *         expiresAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/advanced-booking/recurring:
 *   post:
 *     summary: Create recurring booking (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salonId
 *               - serviceId
 *               - pattern
 *               - startDate
 *               - totalAmount
 *             properties:
 *               salonId:
 *                 type: string
 *                 description: ID of the salon
 *               serviceId:
 *                 type: string
 *                 description: ID of the service
 *               pattern:
 *                 type: object
 *                 required:
 *                   - frequency
 *                   - time
 *                 properties:
 *                   frequency:
 *                     type: string
 *                     enum: [weekly, biweekly, monthly]
 *                     description: How often the booking repeats
 *                   dayOfWeek:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 6
 *                     description: Day of week (0=Sunday, 6=Saturday) for weekly/biweekly
 *                   dayOfMonth:
 *                     type: number
 *                     minimum: 1
 *                     maximum: 31
 *                     description: Day of month for monthly bookings
 *                   time:
 *                     type: string
 *                     description: Preferred time slot
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: When recurring bookings start
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Optional end date for recurring series
 *               totalAmount:
 *                 type: number
 *                 description: Amount per booking
 *     responses:
 *       201:
 *         description: Recurring booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/RecurringBooking'
 *       400:
 *         description: Invalid booking data
 *       403:
 *         description: Customer access required
 *   get:
 *     summary: Get user recurring bookings (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recurring bookings retrieved successfully
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
 *                     $ref: '#/components/schemas/RecurringBooking'
 *       403:
 *         description: Customer access required
 */
router.route('/recurring')
  .post(authorize('customer'), createRecurringBooking)
  .get(authorize('customer'), getRecurringBookings);

/**
 * @swagger
 * /api/advanced-booking/recurring/{recurringId}/cancel:
 *   put:
 *     summary: Cancel recurring booking (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: recurringId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Recurring booking cancelled successfully
 */
router.put('/recurring/:recurringId/cancel', authorize('customer'), cancelRecurringBooking);

/**
 * @swagger
 * /api/advanced-booking/group:
 *   post:
 *     summary: Create group booking (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salonId
 *               - serviceId
 *               - date
 *               - time
 *               - maxParticipants
 *               - totalAmount
 *               - participants
 *             properties:
 *               salonId:
 *                 type: string
 *                 description: ID of the salon
 *               serviceId:
 *                 type: string
 *                 description: ID of the service
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Booking date
 *               time:
 *                 type: string
 *                 description: Booking time
 *               maxParticipants:
 *                 type: number
 *                 minimum: 2
 *                 maximum: 10
 *                 description: Maximum number of participants
 *               totalAmount:
 *                 type: number
 *                 description: Total cost for the group
 *               participants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - userId
 *                     - amount
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: Participant user ID
 *                     amount:
 *                       type: number
 *                       description: Amount this participant pays
 *                 description: List of invited participants
 *     responses:
 *       201:
 *         description: Group booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/GroupBooking'
 *       400:
 *         description: Invalid booking data
 *       403:
 *         description: Customer access required
 */
router.post('/group', authorize('customer'), createGroupBooking);

/**
 * @swagger
 * /api/advanced-booking/group/{groupBookingId}/respond:
 *   put:
 *     summary: Respond to group booking invitation (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupBookingId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *                 enum: [confirmed, declined]
 *     responses:
 *       200:
 *         description: Response recorded successfully
 */
router.put('/group/:groupBookingId/respond', authorize('customer'), respondToGroupBooking);

/**
 * @swagger
 * /api/advanced-booking/waitlist:
 *   post:
 *     summary: Join waitlist (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salonId
 *               - serviceId
 *               - preferredDate
 *               - preferredTime
 *             properties:
 *               salonId:
 *                 type: string
 *                 description: ID of the salon
 *               serviceId:
 *                 type: string
 *                 description: ID of the service
 *               preferredDate:
 *                 type: string
 *                 format: date
 *                 description: Preferred booking date
 *               preferredTime:
 *                 type: string
 *                 description: Preferred time slot
 *               flexibleTiming:
 *                 type: boolean
 *                 default: false
 *                 description: Whether user accepts alternative times
 *     responses:
 *       201:
 *         description: Added to waitlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Waitlist'
 *       400:
 *         description: Already on waitlist or invalid data
 *       403:
 *         description: Customer access required
 *   get:
 *     summary: Get user waitlist (Customer only)
 *     tags: [5. Customer - Advanced Booking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Waitlist retrieved successfully
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
 *                     $ref: '#/components/schemas/Waitlist'
 *       403:
 *         description: Customer access required
 */
router.route('/waitlist')
  .post(authorize('customer'), joinWaitlist)
  .get(authorize('customer'), getUserWaitlist);

export default router;