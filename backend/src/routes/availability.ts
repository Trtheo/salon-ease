import express from 'express';
import { getAvailableSlots } from '../controllers/availability';

const router = express.Router();

/**
 * @swagger
 * /api/availability/slots:
 *   get:
 *     summary: Get available time slots
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: salon
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *       - in: query
 *         name: service
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date to check availability
 *     responses:
 *       200:
 *         description: Available time slots
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
 *                     type: object
 *                     properties:
 *                       time:
 *                         type: string
 *                       available:
 *                         type: boolean
 *       400:
 *         description: Missing required parameters
 */
router.route('/slots')
  .get(getAvailableSlots);

export default router;