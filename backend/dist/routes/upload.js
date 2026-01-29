"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_1 = require("../utils/upload");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Upload user avatar
router.post('/avatar', auth_1.protect, upload_1.uploadAvatar, (req, res) => {
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
// Upload salon images
router.post('/salon-images', auth_1.protect, upload_1.uploadSalonImages, (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded'
            });
        }
        const uploadedFiles = req.files.map((file) => ({
            filename: file.filename,
            path: `/uploads/${file.filename}`,
            size: file.size
        }));
        res.status(200).json({
            success: true,
            data: uploadedFiles
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map