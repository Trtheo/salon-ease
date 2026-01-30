import express from 'express';
import {
  initiateCall,
  joinCall,
  endCall,
  getCallHistory,
  getActiveCalls
} from '../controllers/videoCalls';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     VideoCall:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         initiator:
 *           $ref: '#/components/schemas/User'
 *         participant:
 *           $ref: '#/components/schemas/User'
 *         roomId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, active, ended, missed]
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: number
 *         callType:
 *           type: string
 *           enum: [consultation, booking_discussion, support]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/video-calls/initiate:
 *   post:
 *     summary: Initiate video call
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participantId
 *             properties:
 *               participantId:
 *                 type: string
 *                 description: ID of the call participant
 *               callType:
 *                 type: string
 *                 enum: [consultation, booking_discussion, support]
 *                 default: consultation
 *                 description: Type of video call
 *     responses:
 *       201:
 *         description: Video call initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/VideoCall'
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Not authorized
 */
router.post('/initiate', initiateCall);

/**
 * @swagger
 * /api/video-calls/{callId}/join:
 *   post:
 *     summary: Join video call
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: callId
 *         required: true
 *         schema:
 *           type: string
 *         description: Video call ID
 *     responses:
 *       200:
 *         description: Joined call successfully
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
 *                     roomId:
 *                       type: string
 *                       description: WebRTC room identifier
 *                     status:
 *                       type: string
 *                       enum: [pending, active, ended, missed]
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: List of participant IDs
 *       403:
 *         description: Not authorized to join this call
 *       404:
 *         description: Video call not found
 */
router.post('/:callId/join', joinCall);

/**
 * @swagger
 * /api/video-calls/{callId}/end:
 *   put:
 *     summary: End video call
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: callId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Call ended successfully
 */
router.put('/:callId/end', endCall);

/**
 * @swagger
 * /api/video-calls/history:
 *   get:
 *     summary: Get call history
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of calls per page
 *     responses:
 *       200:
 *         description: Call history retrieved successfully
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
 *                     $ref: '#/components/schemas/VideoCall'
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
router.get('/history', getCallHistory);

/**
 * @swagger
 * /api/video-calls/active:
 *   get:
 *     summary: Get active calls
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active calls retrieved successfully
 */
router.get('/active', getActiveCalls);

export default router;