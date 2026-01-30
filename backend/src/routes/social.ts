import express from 'express';
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
  generateReferralCode,
  useReferralCode,
  getUserReferrals,
  shareSalon
} from '../controllers/social';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Favorite:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         salon:
 *           $ref: '#/components/schemas/Salon'
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Referral:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         referrer:
 *           type: string
 *         referred:
 *           type: string
 *         code:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, completed, expired]
 *         reward:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *             type:
 *               type: string
 *               enum: [discount, credit]
 *             claimed:
 *               type: boolean
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/social/favorites:
 *   get:
 *     summary: Get user favorites
 *     tags: [7. Customer - Reviews & Social]
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
 *         description: Favorites per page
 *     responses:
 *       200:
 *         description: User favorites retrieved successfully
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
 *                     $ref: '#/components/schemas/Favorite'
 *                 pagination:
 *                   type: object
 *       403:
 *         description: Customer access required
 *   post:
 *     summary: Add salon to favorites
 *     tags: [7. Customer - Reviews & Social]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salonId
 *             properties:
 *               salonId:
 *                 type: string
 *                 description: ID of the salon to add to favorites
 *     responses:
 *       201:
 *         description: Added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Salon already in favorites
 *       403:
 *         description: Customer access required
 */
router.route('/favorites')
  .get(authorize('customer'), getFavorites)
  .post(authorize('customer'), addToFavorites);

/**
 * @swagger
 * /api/social/favorites/{salonId}:
 *   delete:
 *     summary: Remove salon from favorites
 *     tags: [7. Customer - Reviews & Social]
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
 *         description: Removed from favorites successfully
 *   get:
 *     summary: Check if salon is favorited
 *     tags: [7. Customer - Reviews & Social]
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
 *         description: Favorite status retrieved
 */
router.route('/favorites/:salonId')
  .delete(authorize('customer'), removeFromFavorites)
  .get(authorize('customer'), checkFavorite);

/**
 * @swagger
 * /api/social/referral/generate:
 *   post:
 *     summary: Generate referral code
 *     tags: [7. Customer - Reviews & Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Referral code generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Referral'
 *       200:
 *         description: Existing active referral code returned
 *       403:
 *         description: Customer access required
 */
router.post('/referral/generate', authorize('customer'), generateReferralCode);

/**
 * @swagger
 * /api/social/referral/use:
 *   post:
 *     summary: Use referral code
 *     tags: [7. Customer - Reviews & Social]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 description: Referral code to use
 *     responses:
 *       200:
 *         description: Referral code used successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Referral'
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid code or already used referral
 *       404:
 *         description: Referral code not found or expired
 *       403:
 *         description: Customer access required
 */
router.post('/referral/use', authorize('customer'), useReferralCode);

/**
 * @swagger
 * /api/social/referral/my-referrals:
 *   get:
 *     summary: Get user referrals and stats
 *     tags: [7. Customer - Reviews & Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User referrals retrieved successfully
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
 *                     referrals:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Referral'
 *                     stats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: number
 *                         completed:
 *                           type: number
 *                         pending:
 *                           type: number
 *                         totalRewards:
 *                           type: number
 *       403:
 *         description: Customer access required
 */
router.get('/referral/my-referrals', authorize('customer'), getUserReferrals);

/**
 * @swagger
 * /api/social/share/{salonId}:
 *   post:
 *     summary: Share salon
 *     tags: [7. Customer - Reviews & Social]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the salon to share
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [whatsapp, facebook, twitter, copy]
 *                 description: Platform to share on
 *     responses:
 *       200:
 *         description: Share URL generated successfully
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
 *                     shareUrl:
 *                       type: string
 *                     shareText:
 *                       type: string
 *                     platformUrl:
 *                       type: string
 *                     platform:
 *                       type: string
 *       404:
 *         description: Salon not found
 */
router.post('/share/:salonId', shareSalon);

export default router;