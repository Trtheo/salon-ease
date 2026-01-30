import express from 'express';
import {
  createPortfolio,
  getSalonPortfolio,
  updatePortfolio,
  addStaff,
  getSalonStaff,
  updateStaff,
  getStaffAvailability
} from '../controllers/portfolioStaff';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         salon:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               before:
 *                 type: string
 *                 description: Before image URL
 *               after:
 *                 type: string
 *                 description: After image URL (required)
 *               caption:
 *                 type: string
 *                 description: Image caption
 *         services:
 *           type: array
 *           items:
 *             type: string
 *           description: Related service IDs
 *         isPublic:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Staff:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         salon:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         avatar:
 *           type: string
 *         position:
 *           type: string
 *         specialties:
 *           type: array
 *           items:
 *             type: string
 *         workingHours:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               start:
 *                 type: string
 *               end:
 *                 type: string
 *               isWorking:
 *                 type: boolean
 *         services:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *         hireDate:
 *           type: string
 *           format: date
 */

/**
 * @swagger
 * /api/portfolio/{salonId}:
 *   get:
 *     summary: Get salon portfolio
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the salon
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by portfolio category
 *     responses:
 *       200:
 *         description: Portfolio retrieved successfully
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
 *                     $ref: '#/components/schemas/Portfolio'
 *   post:
 *     summary: Create portfolio item (Salon Owner only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the salon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 description: Portfolio item title
 *               description:
 *                 type: string
 *                 description: Detailed description
 *               category:
 *                 type: string
 *                 description: Portfolio category (e.g., 'Hair', 'Nails')
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - after
 *                   properties:
 *                     before:
 *                       type: string
 *                       description: Before image URL
 *                     after:
 *                       type: string
 *                       description: After image URL
 *                     caption:
 *                       type: string
 *                       description: Image caption
 *                 description: Before/after images
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Related service IDs
 *     responses:
 *       201:
 *         description: Portfolio item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       403:
 *         description: Salon owner access required
 */
router.route('/portfolio/:salonId')
  .get(getSalonPortfolio)
  .post(protect, authorize('salon_owner'), createPortfolio);

/**
 * @swagger
 * /api/portfolio/item/{portfolioId}:
 *   put:
 *     summary: Update portfolio item (Salon Owner only)
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *         description: Portfolio item ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Portfolio'
 *     responses:
 *       200:
 *         description: Portfolio item updated successfully
 *       403:
 *         description: Not authorized
 */
router.put('/portfolio/item/:portfolioId', protect, authorize('salon_owner'), updatePortfolio);

/**
 * @swagger
 * /api/staff/{salonId}:
 *   get:
 *     summary: Get salon staff
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Staff list retrieved successfully
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
 *                     $ref: '#/components/schemas/Staff'
 *   post:
 *     summary: Add staff member (Salon Owner only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
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
 *               - name
 *               - email
 *               - phone
 *               - position
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               position:
 *                 type: string
 *               specialties:
 *                 type: array
 *                 items:
 *                   type: string
 *               workingHours:
 *                 type: object
 *               services:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Staff member added successfully
 *       403:
 *         description: Not authorized
 */
router.route('/staff/:salonId')
  .get(getSalonStaff)
  .post(protect, authorize('salon_owner'), addStaff);

/**
 * @swagger
 * /api/staff/member/{staffId}:
 *   put:
 *     summary: Update staff member (Salon Owner only)
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *       403:
 *         description: Not authorized
 */
router.put('/staff/member/:staffId', protect, authorize('salon_owner'), updateStaff);

/**
 * @swagger
 * /api/staff/{staffId}/availability:
 *   get:
 *     summary: Get staff availability
 *     tags: [Staff]
 *     parameters:
 *       - in: path
 *         name: staffId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Staff availability retrieved successfully
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
 *                     staffId:
 *                       type: string
 *                     date:
 *                       type: string
 *                     isWorking:
 *                       type: boolean
 *                     hours:
 *                       type: object
 *                       properties:
 *                         start:
 *                           type: string
 *                         end:
 *                           type: string
 */