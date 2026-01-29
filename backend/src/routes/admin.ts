import express from 'express';
import {
  getAllUsers,
  getSalonOwners,
  updateUserRole,
  deleteUser,
  getAllSalons,
  updateSalonStatus
} from '../controllers/admin';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Protect all routes and restrict to admin only
router.use(protect);
router.use(authorize('admin'));

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all salons
 */
router.get('/salons', getAllSalons);

/**
 * @swagger
 * /api/admin/salons/{salonId}/status:
 *   put:
 *     summary: Update salon status (Admin only)
 *     tags: [Admin]
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