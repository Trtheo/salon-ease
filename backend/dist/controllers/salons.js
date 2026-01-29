"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSalon = exports.updateSalon = exports.createSalon = exports.getSalon = exports.getSalons = void 0;
const Salon_1 = __importDefault(require("../models/Salon"));
const getSalons = async (req, res) => {
    try {
        const salons = await Salon_1.default.find().populate('owner', 'name email').populate('services');
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
exports.getSalons = getSalons;
const getSalon = async (req, res) => {
    try {
        const salon = await Salon_1.default.findById(req.params.id).populate('owner', 'name email').populate('services');
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found'
            });
        }
        res.status(200).json({
            success: true,
            data: salon
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getSalon = getSalon;
const createSalon = async (req, res) => {
    try {
        req.body.owner = req.user.id;
        const salon = await Salon_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: salon
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.createSalon = createSalon;
const updateSalon = async (req, res) => {
    try {
        let salon = await Salon_1.default.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found'
            });
        }
        if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to update this salon'
            });
        }
        salon = await Salon_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: salon
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.updateSalon = updateSalon;
const deleteSalon = async (req, res) => {
    try {
        const salon = await Salon_1.default.findById(req.params.id);
        if (!salon) {
            return res.status(404).json({
                success: false,
                error: 'Salon not found'
            });
        }
        if (salon.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                error: 'Not authorized to delete this salon'
            });
        }
        await salon.deleteOne();
        res.status(200).json({
            success: true,
            data: {}
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.deleteSalon = deleteSalon;
//# sourceMappingURL=salons.js.map