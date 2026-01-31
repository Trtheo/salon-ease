import express from 'express';
import { getSalons, getSalon, createSalon, updateSalon, deleteSalon } from '../controllers/salons';
import { searchSalons, getSalonServices } from '../controllers/search';
import { protect, authorize } from '../middleware/auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Multer configuration for salon images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/salons/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'salon-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Salon name
 *               description:
 *                 type: string
 *                 description: Salon description
 *               address:
 *                 type: string
 *                 description: Salon address
 *               phone:
 *                 type: string
 *                 description: Contact phone number
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Contact email
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Salon images (max 5 files, 5MB each)
 *               workingHours:
 *                 type: string
 *                 description: JSON string of working hours
 *               services:
 *                 type: string
 *                 description: JSON array of service IDs
 *     responses:
 *       201:
 *         description: Salon created successfully
 *       403:
 *         description: Not authorized
 */
router.route('/')
  .get(getSalons)
  .post(protect, authorize('salon_owner', 'admin'), upload.array('images', 5), createSalon);

/**
 * @swagger
 * /api/salons/search:
 *   get:
 *     summary: Search salons with enhanced multi-field search
 *     tags: [2. Customer - Salon Discovery]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Universal search query (searches name, description, address, email, phone)
 *         example: "Paradise"
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by salon name only
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Search by location/address only
 *       - in: query
 *         name: service
 *         schema:
 *           type: string
 *         description: Search by service type
 *     responses:
 *       200:
 *         description: Search results sorted by rating and review count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Salon'
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               workingHours:
 *                 type: string
 *               services:
 *                 type: string
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
  .put(protect, authorize('salon_owner', 'admin'), upload.array('images', 5), updateSalon)
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