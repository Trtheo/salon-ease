import express from 'express';
import { getProfile, updateProfile } from '../controllers/users';
import { uploadAvatar } from '../utils/upload';
import { protect } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         avatar:
 *           type: string
 *         role:
 *           type: string
 *           enum: [customer, salon_owner, admin]
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [1. Customer - Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *   put:
 *     summary: Update user profile (partial updates allowed)
 *     tags: [1. Customer - Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name (optional)
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: User's phone number (optional)
 *                 example: "+1234567890"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (optional) - JPEG, PNG, GIF, WebP - Max 5MB
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name (optional)
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 description: User's phone number (optional)
 *                 example: "+1234567890"
 *               avatar:
 *                 type: string
 *                 description: Avatar URL (optional)
 *                 example: "/uploads/avatars/avatar-123.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Invalid data or file too large
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Only image files are allowed"
 *       401:
 *         description: Unauthorized - No token provided or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Access denied. No token provided."
 */
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, uploadAvatar, updateProfile);

export default router;