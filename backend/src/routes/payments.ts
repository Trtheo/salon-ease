import express from 'express';
import { createPayment, getPaymentHistory } from '../controllers/payments';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - booking
 *         - amount
 *         - method
 *       properties:
 *         booking:
 *           type: string
 *           description: Booking ID
 *         amount:
 *           type: number
 *         method:
 *           type: string
 *           enum: [card, mobile_money, cash]
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *         transactionId:
 *           type: string
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create payment (Customer only)
 *     tags: [6. Customer - Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *       400:
 *         description: Invalid payment data
 *       403:
 *         description: Not authorized - Customer access required
 *   get:
 *     summary: Get payment history (Customer only)
 *     tags: [6. Customer - Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
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
 *                     $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Not authorized - Customer access required
 */
router.route('/')
  .post(protect, authorize('customer'), createPayment)
  .get(protect, authorize('customer'), getPaymentHistory);

export default router;