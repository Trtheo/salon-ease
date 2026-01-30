import express from 'express';
import {
  submitReview,
  getSalonReviews,
  getUserReviews,
  respondToReview,
  getSalonRatingStats
} from '../controllers/reviews';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customer:
 *           $ref: '#/components/schemas/User'
 *         salon:
 *           $ref: '#/components/schemas/Salon'
 *         booking:
 *           type: string
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *         comment:
 *           type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         response:
 *           type: object
 *           properties:
 *             text:
 *               type: string
 *             respondedAt:
 *               type: string
 *               format: date-time
 *         isVerified:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reviews/submit:
 *   post:
 *     summary: Submit a review (Customer only)
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
 *               - rating
 *               - comment
 *             properties:
 *               salonId:
 *                 type: string
 *                 description: ID of the salon being reviewed
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Rating from 1 to 5 stars
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *                 description: Review comment
 *               bookingId:
 *                 type: string
 *                 description: Optional booking ID for verified reviews
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Optional review images
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Already reviewed or invalid data
 *       403:
 *         description: Customer access required
 */
router.post('/submit', protect, authorize('customer'), submitReview);

/**
 * @swagger
 * /api/reviews/salon/{salonId}:
 *   get:
 *     summary: Get salon reviews
 *     tags: [7. Customer - Reviews & Social]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the salon
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
 *         description: Reviews per page
 *       - in: query
 *         name: rating
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         description: Filter by specific rating
 *     responses:
 *       200:
 *         description: Salon reviews retrieved successfully
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
 *                     $ref: '#/components/schemas/Review'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                     limit:
 *                       type: number
 *                     total:
 *                       type: number
 *                     pages:
 *                       type: number
 */
router.get('/salon/:salonId', getSalonReviews);

/**
 * @swagger
 * /api/reviews/salon/{salonId}/stats:
 *   get:
 *     summary: Get salon rating statistics
 *     tags: [7. Customer - Reviews & Social]
 *     parameters:
 *       - in: path
 *         name: salonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the salon
 *     responses:
 *       200:
 *         description: Rating statistics retrieved successfully
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
 *                     totalReviews:
 *                       type: number
 *                     averageRating:
 *                       type: number
 *                     ratingBreakdown:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: number
 *                           count:
 *                             type: number
 */
router.get('/salon/:salonId/stats', getSalonRatingStats);

/**
 * @swagger
 * /api/reviews/my-reviews:
 *   get:
 *     summary: Get user's reviews (Customer only)
 *     tags: [7. Customer - Reviews & Social]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 */
router.get('/my-reviews', protect, authorize('customer'), getUserReviews);

/**
 * @swagger
 * /api/reviews/{reviewId}/respond:
 *   put:
 *     summary: Respond to review (Salon Owner only)
 *     tags: [15. Salon Owner - Reviews Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
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
 *               - response
 *             properties:
 *               response:
 *                 type: string
 *     responses:
 *       200:
 *         description: Response added successfully
 *       403:
 *         description: Not authorized
 */
router.put('/:reviewId/respond', protect, authorize('salon_owner'), respondToReview);

export default router;