"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSalonStatus = exports.getAllSalons = exports.deleteUser = exports.updateUserRole = exports.getSalonOwners = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Salon_1 = __importDefault(require("../models/Salon"));
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User_1.default.find().select('-password');
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getAllUsers = getAllUsers;
// Get all salon owners
const getSalonOwners = async (req, res) => {
    try {
        const salonOwners = await User_1.default.find({ role: 'salon_owner' }).select('-password');
        res.status(200).json({
            success: true,
            count: salonOwners.length,
            data: salonOwners
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getSalonOwners = getSalonOwners;
// Update user role
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        const user = await User_1.default.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.updateUserRole = updateUserRole;
// Delete user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User_1.default.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.deleteUser = deleteUser;
// Get all salons
const getAllSalons = async (req, res) => {
    try {
        const salons = await Salon_1.default.find().populate('owner', 'name email');
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
exports.getAllSalons = getAllSalons;
// Approve/reject salon
const updateSalonStatus = async (req, res) => {
    try {
        const { salonId } = req.params;
        const { status } = req.body;
        const salon = await Salon_1.default.findByIdAndUpdate(salonId, { status }, { new: true, runValidators: true }).populate('owner', 'name email');
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
exports.updateSalonStatus = updateSalonStatus;
//# sourceMappingURL=admin.js.map