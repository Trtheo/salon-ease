import express from 'express';
import { register, verifyRegistration, login, logout, getMe, forgotPassword, resetPassword, getTestOTP } from '../controllers/auth';
import { protect } from '../middleware/auth';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         password:
 *           type: string
 *           minLength: 6
 *           description: User's password
 *         phone:
 *           type: string
 *           description: User's phone number
 *         role:
 *           type: string
 *           enum: [customer, salon_owner, admin]
 *           default: customer
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (sends OTP to both email and SMS)
 *     tags: [1. Customer - Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: OTP sent to both email and SMS for verification
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', validateRegister, handleValidationErrors, register);

/**
 * @swagger
 * /api/auth/verify-registration:
 *   post:
 *     summary: Verify OTP and complete registration
 *     tags: [1. Customer - Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/User'
 *               - type: object
 *                 required:
 *                   - code
 *                 properties:
 *                   code:
 *                     type: string
 *                     description: OTP code
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid OTP or registration data
 */
router.post('/verify-registration', verifyRegistration);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [1. Customer - Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateLogin, handleValidationErrors, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [1. Customer - Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: Unauthorized - No token provided
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
router.post('/logout', protect, logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Send OTP for password reset (choose email or SMS)
 *     tags: [1. Customer - Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [email, phone]
 *                 description: Choose delivery method
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Required if method is email
 *               phone:
 *                 type: string
 *                 description: Required if method is phone
 *     responses:
 *       200:
 *         description: OTP sent for password reset
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [1. Customer - Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - newPassword
 *               - method
 *             properties:
 *               method:
 *                 type: string
 *                 enum: [email, phone]
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid OTP
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
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
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', protect, getMe);

export default router;
/**
 * @swagger
 * /api/auth/test-otp:
 *   get:
 *     summary: Get OTP for testing (Development only)
 *     tags: [1. Customer - Authentication]
 *     parameters:
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OTP code retrieved
 *       403:
 *         description: Only available in development
 */
router.get('/test-otp', getTestOTP);