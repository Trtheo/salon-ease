import express from 'express';
import { getNearestSalons, updateUserLocation } from '../controllers/location';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/location/nearest:
 *   get:
 *     summary: Get nearest salons
 *     tags: [Location]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         description: Latitude
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         description: Longitude
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 10
 *         description: Search radius in kilometers
 *     responses:
 *       200:
 *         description: List of nearest salons
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
 *                     allOf:
 *                       - $ref: '#/components/schemas/Salon'
 *                       - type: object
 *                         properties:
 *                           distance:
 *                             type: number
 *                             description: Distance in kilometers
 */
router.get('/nearest', getNearestSalons);

/**
 * @swagger
 * /api/location/update:
 *   put:
 *     summary: Update user location (Customer only)
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lng
 *             properties:
 *               lat:
 *                 type: number
 *                 description: Latitude
 *               lng:
 *                 type: number
 *                 description: Longitude
 *               address:
 *                 type: string
 *                 description: Human readable address
 *     responses:
 *       200:
 *         description: Location updated successfully
 *       403:
 *         description: Not authorized - Customer access required
 */
router.put('/update', protect, authorize('customer'), updateUserLocation);

export default router;