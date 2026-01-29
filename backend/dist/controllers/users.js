"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-password');
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
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            avatar: req.body.avatar
        };
        const user = await User_1.default.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        }).select('-password');
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
exports.updateProfile = updateProfile;
//# sourceMappingURL=users.js.map