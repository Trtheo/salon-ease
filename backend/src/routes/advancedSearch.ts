import express from 'express';
import {
  advancedSalonSearch,
  searchServices,
  getSearchFilters,
  getPopularSearches
} from '../controllers/advancedSearch';

const router = express.Router();

/**
 * @swagger
 * /api/search/salons:
 *   get:
 *     summary: Advanced salon search with filters
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *           minimum: 0
 *           maximum: 5
 *         description: Minimum rating
 *       - in: query
 *         name: services
 *         schema:
 *           type: string
 *         description: Comma-separated service names
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, price, name, createdAt]
 *           default: rating
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Search results with filters applied
 */
router.get('/salons', advancedSalonSearch);

/**
 * @swagger
 * /api/search/services:
 *   get:
 *     summary: Search services with filters
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Service category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum duration in minutes
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum duration in minutes
 *       - in: query
 *         name: salonId
 *         schema:
 *           type: string
 *         description: Filter by specific salon
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [price, duration, name]
 *           default: price
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *     responses:
 *       200:
 *         description: Service search results
 */
router.get('/services', searchServices);

/**
 * @swagger
 * /api/search/filters:
 *   get:
 *     summary: Get available search filters and options
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Available filter options
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
 *                     categories:
 *                       type: array
 *                       items:
 *                         type: string
 *                     priceRange:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                         max:
 *                           type: number
 *                     durationRange:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                         max:
 *                           type: number
 *                     ratingRange:
 *                       type: object
 *                       properties:
 *                         min:
 *                           type: number
 *                         max:
 *                           type: number
 */
router.get('/filters', getSearchFilters);

/**
 * @swagger
 * /api/search/popular:
 *   get:
 *     summary: Get popular searches and suggestions
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: Popular search data
 */
router.get('/popular', getPopularSearches);

export default router;