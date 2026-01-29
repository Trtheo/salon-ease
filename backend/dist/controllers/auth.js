"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User_1.default.create({
            name,
            email,
            password,
            role
        });
        const token = signToken(user._id);
        res.status(201).json({
            success: true,
            token,
            data: {
                user: {
                    id: user._id,
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Please provide email and password'
            });
        }
        const user = await User_1.default.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }
        const token = signToken(user._id);
        res.status(200).json({
            success: true,
            token,
            data: {
                user: {
                    id: user._id,
                    userId: user.userId,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: { user }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.js.map