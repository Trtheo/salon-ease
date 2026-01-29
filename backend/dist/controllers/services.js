"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createService = exports.getServices = void 0;
const Service_1 = __importDefault(require("../models/Service"));
const getServices = async (req, res) => {
    try {
        const services = await Service_1.default.find().populate('salon', 'name address');
        res.status(200).json({
            success: true,
            count: services.length,
            data: services
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.getServices = getServices;
const createService = async (req, res) => {
    try {
        const service = await Service_1.default.create(req.body);
        res.status(201).json({
            success: true,
            data: service
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.createService = createService;
//# sourceMappingURL=services.js.map