import express from 'express';
import { uploadSalonImages, uploadAvatar } from '../utils/upload';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [9. Customer - File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
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
 *                     filename:
 *                       type: string
 *                     path:
 *                       type: string
 *                     size:
 *                       type: number
 *       400:
 *         description: No file uploaded
 */
// Upload user avatar
router.post('/avatar', protect, uploadAvatar, (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/upload/salon-images:
 *   post:
 *     summary: Upload salon images (Salon Owner/Admin only)
 *     tags: [17. Salon Owner - File Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Salon image files (max 5)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
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
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                       path:
 *                         type: string
 *                       size:
 *                         type: number
 *       400:
 *         description: No files uploaded
 *       403:
 *         description: Not authorized - Salon Owner or Admin required
 */
// Upload salon images
router.post('/salon-images', protect, authorize('salon_owner', 'admin'), uploadSalonImages, (req: any, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files uploaded'
      });
    }

    const uploadedFiles = req.files.map((file: any) => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size
    }));

    res.status(200).json({
      success: true,
      data: uploadedFiles
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;