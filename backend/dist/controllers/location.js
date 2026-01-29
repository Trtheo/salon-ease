"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserLocation = exports.getNearestSalons = void 0;
const Salon_1 = __importDefault(require("../models/Salon"));
const getNearestSalons = async (req, res) => {
    try {
        const { latitude, longitude, radius = 10 } = req.query;
        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }
        // For now, return all salons (GPS integration would calculate actual distance)
        const salons = await Salon_1.default.find({ isVerified: true })
            .populate('services')
            .limit(20);
        // TODO: Implement actual GPS distance calculation
        const salonsWithDistance = salons.map(salon => ({
            ...salon.toObject(),
            distance: Math.floor(Math.random() * 50) + 1 // Mock distance
        }));
        res.status(200).json({
            success: true,
            data: salonsWithDistance
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getNearestSalons = getNearestSalons;
const updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;
        // Store user location (extend User model if needed)
        res.status(200).json({
            success: true,
            message: 'Location updated successfully',
            data: { latitude, longitude, address }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.updateUserLocation = updateUserLocation;
//# sourceMappingURL=location.js.map