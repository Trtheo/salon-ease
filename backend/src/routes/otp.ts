import express from 'express';
import { sendOTP, verifyOTP } from '../controllers/otp';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     OTPRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: string
 *           description: Phone number to send OTP
 *     OTPVerify:
 *       type: object
 *       required:
 *         - phone
 *         - code
 *       properties:
 *         phone:
 *           type: string
 *         code:
 *           type: string
 *           description: OTP code received
 */

/**
 * @swagger
 * /api/otp/send:
 *   post:
 *     summary: Send OTP to phone number
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid phone number
 */
router.post('/send', sendOTP);

/**
 * @swagger
 * /api/otp/verify:
 *   post:
 *     summary: Verify OTP code
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OTPVerify'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify', verifyOTP);

export default router;