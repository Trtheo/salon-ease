import express from 'express';
import { getSalons, getSalon, createSalon, updateSalon, deleteSalon } from '../controllers/salons';
import { searchSalons, getSalonServices } from '../controllers/search';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Salon:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         address:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         workingHours:
 *           type: object
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         rating:
 *           type: number
 *         isVerified:
 *           type: boolean
 */

/**
 * @swagger
 * /api/salons:
 *   get:
 *     summary: Get all salons
 *     tags: [2. Customer - Salon Discovery]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of salons retrieved successfully
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
 *                     $ref: '#/components/schemas/Salon'
 *   post:
 *     summary: Create a new salon (Salon Owner/Admin only)
 *     tags: [11. Salon Owner - Salon Setup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       201:
 *         description: Salon created successfully
 *       403:
 *         description: Not authorized
 */
router.route('/')
  .get(getSalons)
  .post(protect, authorize('salon_owner', 'admin'), createSalon);

/**
 * @swagger
 * /api/salons/search:
 *   get:
 *     summary: Search salons
 *     tags: [2. Customer - Salon Discovery]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *     responses:
 *       200:
 *         description: Search results
 */
router.route('/search')
  .get(searchSalons);

/**
 * @swagger
 * /api/salons/{id}:
 *   get:
 *     summary: Get salon by ID
 *     tags: [2. Customer - Salon Discovery]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Salon details
 *       404:
 *         description: Salon not found
 *   put:
 *     summary: Update salon (Salon Owner/Admin only)
 *     tags: [11. Salon Owner - Salon Setup]
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
 *             $ref: '#/components/schemas/Salon'
 *     responses:
 *       200:
 *         description: Salon updated successfully
 *       403:
 *         description: Not authorized
 *   delete:
 *     summary: Delete salon (Salon Owner/Admin only)
 *     tags: [11. Salon Owner - Salon Setup]
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
 *         description: Salon deleted successfully
 *       403:
 *         description: Not authorized
 */
router.route('/:id')
  .get(getSalon)
  .put(protect, authorize('salon_owner', 'admin'), updateSalon)
  .delete(protect, authorize('salon_owner', 'admin'), deleteSalon);

/**
 * @swagger
 * /api/salons/{id}/services:
 *   get:
 *     summary: Get salon services
 *     tags: [3. Customer - Services & Availability]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Salon services list
 */
router.route('/:id/services')
  .get(getSalonServices);

export default router;