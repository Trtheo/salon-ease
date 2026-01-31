import express from 'express';
import {
  getAllUsers,
  getSalonOwners,
  updateUserRole,
  deleteUser,
  getAllSalons,
  updateSalonStatus
} from '../controllers/admin';
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

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [19. Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
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
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Admin access required
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/admin/salon-owners:
 *   get:
 *     summary: Get all salon owners (Admin only)
 *     tags: [19. Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of salon owners
 */
router.get('/salon-owners', getSalonOwners);

/**
 * @swagger
 * /api/admin/users/{userId}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [19. Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
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
 *               role:
 *                 type: string
 *                 enum: [customer, salon_owner, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 */
router.put('/users/:userId/role', updateUserRole);

/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [19. Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/users/:userId', deleteUser);

/**
 * @swagger
 * /api/admin/salons:
 *   get:
 *     summary: Get all salons (Admin only)
 *     tags: [20. Admin - Salon Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all salons
 */
router.get('/salons', getAllSalons);

/**
 * @swagger
 * /api/admin/salons:
 *   post:
 *     summary: Create salon (Admin only)
 *     tags: [20. Admin - Salon Management]
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
 * /api/admin/salons/{salonId}/status:
 *   put:
 *     summary: Update salon status (Admin only)
 *     tags: [20. Admin - Salon Management]
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
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Salon status updated successfully
 */
router.put('/salons/:salonId/status', updateSalonStatus);

export default router;