"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalonServices = exports.searchSalons = void 0;
const Salon_1 = __importDefault(require("../models/Salon"));
const searchSalons = async (req, res) => {
    try {
        const { name, location, service } = req.query;
        let query = { isVerified: true };
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }
        if (location) {
            query.address = { $regex: location, $options: 'i' };
        }
        const salons = await Salon_1.default.find(query)
            .populate('owner', 'name email')
            .populate('services');
        res.status(200).json({
            success: true,
            count: salons.length,
            data: salons
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.searchSalons = searchSalons;
const getSalonServices = async (req, res) => {
    try {
        const salon = await Salon_1.default.findById(req.params.id).populate('services');
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found'
            });
        }
        res.status(200).json({
            success: true,
            data: salon.services
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getSalonServices = getSalonServices;
//# sourceMappingURL=search.js.map