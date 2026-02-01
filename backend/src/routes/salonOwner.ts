import express from 'express';
import {
  getMySalons,
  getSalonBookings,
  updateBookingStatus,
  getSalonStats,
  getSalonAnalytics,
  getOwnerOverview,
  updateMySalon
} from '../controllers/salonOwner';
import { createSalon } from '../controllers/salons';
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Protect all routes and restrict to salon owners
router.use(protect);
router.use(authorize('salon_owner'));

/**
 * @swagger
 * /api/salon-owner/salons:
 *   get:
 *     summary: Get my salons with pagination (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated list of owner's salons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 pages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Salon'
 *       403:
 *         description: Salon owner access required
 */
router.get('/salons', getMySalons);

/**
 * @swagger
 * /api/salon-owner/salons:
 *   post:
 *     summary: Create a new salon (Salon Owner only)
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
 */
router.post('/salons', upload.array('images', 5), createSalon);

/**
 * @swagger
 * /api/salon-owner/salons/{salonId}/bookings:
 *   get:
 *     summary: Get salon bookings (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: List of salon bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Salon not found or not authorized
 */
router.get('/salons/:salonId/bookings', getSalonBookings);

/**
 * @swagger
 * /api/salon-owner/salons/{salonId}/stats:
 *   get:
 *     summary: Get salon statistics (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: Salon ID
 *     responses:
 *       200:
 *         description: Salon statistics
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
 *                     totalBookings:
 *                       type: number
 *                     pendingBookings:
 *                       type: number
 *                     completedBookings:
 *                       type: number
 *                     totalRevenue:
 *                       type: number
 *                     salonStatus:
 *                       type: string
 */
router.get('/salons/:salonId/stats', getSalonStats);

/**
 * @swagger
 * /api/salon-owner/bookings/{bookingId}/status:
 *   put:
 *     summary: Update booking status (Salon Owner only)
 *     tags: [14. Salon Owner - Booking Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookingId
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
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled]
 *     responses:
 *       200:
 *         description: Booking status updated successfully
 *       403:
 *         description: Not authorized to update this booking
 *       404:
 *         description: Booking not found
 */
/**
 * @swagger
 * /api/salon-owner/overview:
 *   get:
 *     summary: Get owner overview analytics (Salon Owner only)
 *     tags: [16. Salon Owner - Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner overview analytics
 */
router.get('/overview', getOwnerOverview);

/**
 * @swagger
 * /api/salon-owner/salons/{salonId}/analytics:
 *   get:
 *     summary: Get detailed salon analytics (Salon Owner only)
 *     tags: [16. Salon Owner - Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed salon analytics
 */
router.get('/salons/:salonId/analytics', getSalonAnalytics);

/**
 * @swagger
 * /api/salon-owner/salons/{salonId}:
 *   put:
 *     summary: Update my salon (Salon Owner only)
 *     tags: [11. Salon Owner - Salon Setup]
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
 *               workingHours:
 *                 type: object
 *     responses:
 *       200:
 *         description: Salon updated successfully
 */
router.put('/salons/:salonId', updateMySalon);

router.put('/bookings/:bookingId/status', updateBookingStatus);

export default router;