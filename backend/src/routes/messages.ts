import express from 'express';
import { sendMessage, getConversations, getMessages, markAsRead, getMediaFile } from '../controllers/messages';
import { uploadVoiceMessage, getVoiceMessage } from '../controllers/voiceMessages';
import { uploadVoiceNote } from '../utils/voiceUpload';
import { uploadMedia } from '../utils/mediaUpload';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "60f7b3b3b3b3b3b3b3b3b3b3"
 *         sender:
 *           $ref: '#/components/schemas/User'
 *         receiver:
 *           $ref: '#/components/schemas/User'
 *         content:
 *           type: string
 *           example: "Hello! How are you?"
 *         messageType:
 *           type: string
 *           enum: [text, voice, image, video]
 *           example: "text"
 *         voiceData:
 *           type: object
 *           properties:
 *             filename:
 *               type: string
 *               example: "voice-1640995200000-123456789.mp3"
 *             duration:
 *               type: number
 *               example: 15
 *             size:
 *               type: number
 *               example: 245760
 *         mediaData:
 *           type: object
 *           properties:
 *             filename:
 *               type: string
 *               example: "media-1640995200000-123456789.jpg"
 *             originalName:
 *               type: string
 *               example: "photo.jpg"
 *             size:
 *               type: number
 *               example: 1048576
 *             mimeType:
 *               type: string
 *               example: "image/jpeg"
 *             duration:
 *               type: number
 *               example: 30
 *               description: "Duration in seconds (for videos only)"
 *         isRead:
 *           type: boolean
 *           example: false
 *         readAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-31T12:00:00.000Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-12-31T10:00:00.000Z"
 *     Conversation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         participants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         lastMessage:
 *           $ref: '#/components/schemas/Message'
 *         lastMessageAt:
 *           type: string
 *           format: date-time
 *         unreadCount:
 *           type: object
 */

/**
 * @swagger
 * /api/messages/send:
 *   post:
 *     summary: Send a text message
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
 *               - receiverId
 *               - content
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the message recipient
 *               content:
 *                 type: string
 *                 description: Message content
 *               messageType:
 *                 type: string
 *                 enum: [text]
 *                 default: text
 *                 description: Type of message (text only for this endpoint)
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid request data
 */
router.post('/send', sendMessage);

/**
 * @swagger
 * /api/messages/conversations:
 *   get:
 *     summary: Get user conversations
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of conversations
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
 *                     $ref: '#/components/schemas/Conversation'
 */
router.get('/conversations', getConversations);

/**
 * @swagger
 * /api/messages/{userId}:
 *   get:
 *     summary: Get messages with specific user
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to get messages with
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
 *           default: 50
 *         description: Number of messages per page
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
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
 *                     $ref: '#/components/schemas/Message'
 */
router.get('/:userId', getMessages);

/**
 * @swagger
 * /api/messages/{userId}/read:
 *   put:
 *     summary: Mark messages as read
 *     tags: [8. Customer - Communication]
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
 *         description: Messages marked as read
 */
/**
 * @swagger
 * /api/messages/voice:
 *   post:
 *     summary: Send voice message
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - voice
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the message recipient
 *               voice:
 *                 type: string
 *                 format: binary
 *                 description: Voice message file (MP3, WAV, M4A, WebM)
 *               duration:
 *                 type: number
 *                 description: Voice message duration in seconds
 *     responses:
 *       201:
 *         description: Voice message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid file or missing data
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
 *                   example: "Invalid voice file format"
 */
/**
 * @swagger
 * /api/messages/media:
 *   post:
 *     summary: Send image or video message
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - media
 *               - messageType
 *             properties:
 *               receiverId:
 *                 type: string
 *                 description: ID of the message recipient
 *               media:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, GIF, WebP) or Video file (MP4, MOV, AVI, WebM) - Max 50MB
 *               messageType:
 *                 type: string
 *                 enum: [image, video]
 *                 description: Type of media message
 *               duration:
 *                 type: number
 *                 description: Video duration in seconds (required for videos)
 *     responses:
 *       201:
 *         description: Media message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid file type, size too large, or missing data
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
 *                   example: "Only images (JPEG, PNG, GIF, WebP) and videos (MP4, MOV, AVI, WebM) are allowed"
 */
router.post('/media', uploadMedia, sendMessage);

/**
 * @swagger
 * /api/messages/media/{messageId}:
 *   get:
 *     summary: Get media file (image or video)
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message containing the media
 *     responses:
 *       200:
 *         description: Media file served with appropriate MIME type
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/gif:
 *             schema:
 *               type: string
 *               format: binary
 *           image/webp:
 *             schema:
 *               type: string
 *               format: binary
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *           video/quicktime:
 *             schema:
 *               type: string
 *               format: binary
 *           video/x-msvideo:
 *             schema:
 *               type: string
 *               format: binary
 *           video/webm:
 *             schema:
 *               type: string
 *               format: binary
 *         headers:
 *           Content-Type:
 *             description: MIME type of the media file
 *             schema:
 *               type: string
 *           Content-Disposition:
 *             description: Inline display with original filename
 *             schema:
 *               type: string
 *       404:
 *         description: Message not found, no media file, or access denied
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
 *                   example: "Message not found or access denied"
 */
router.get('/media/:messageId', getMediaFile);

router.post('/voice', uploadVoiceNote, uploadVoiceMessage);

/**
 * @swagger
 * /api/messages/voice/{messageId}:
 *   get:
 *     summary: Get voice message file
 *     tags: [8. Customer - Communication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Voice file
 *         content:
 *           audio/*:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get('/voice/:messageId', getVoiceMessage);

router.put('/:userId/read', markAsRead);

export default router;