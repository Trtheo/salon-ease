import express from 'express';
import { getServices, getService, createService, updateService, deleteService } from '../controllers/services';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - duration
 *         - category
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         duration:
 *           type: number
 *           description: Duration in minutes
 *         category:
 *           type: string
 *         salon:
 *           type: string
 *           description: Salon ID
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Get all services
 *     tags: [3. Customer - Services & Availability]
 *     parameters:
 *       - in: query
 *         name: salon
 *         schema:
 *           type: string
 *         description: Filter by salon ID
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: List of services
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
 *                     $ref: '#/components/schemas/Service'
 *   post:
 *     summary: Create new service (Salon Owner/Admin only)
 *     tags: [12. Salon Owner - Services Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Service created successfully
 *       403:
 *         description: Not authorized - Salon Owner or Admin required
 */
router.route('/')
  .get(getServices)
  .post(protect, authorize('salon_owner', 'admin'), createService);

/**
 * @swagger
 * /api/services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [3. Customer - Services & Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Service ID
 *     responses:
 *       200:
 *         description: Service details
 *       404:
 *         description: Service not found
 *   put:
 *     summary: Update service (Salon Owner/Admin only)
 *     tags: [12. Salon Owner - Services Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       403:
 *         description: Not authorized
 *   delete:
 *     summary: Delete service (Salon Owner/Admin only)
 *     tags: [12. Salon Owner - Services Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       403:
 *         description: Not authorized
 */
router.route('/:id')
  .get(getService)
  .put(protect, authorize('salon_owner', 'admin'), updateService)
  .delete(protect, authorize('salon_owner', 'admin'), deleteService);

export default router;