"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointments_1 = require("../controllers/appointments");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/request', auth_1.protect, appointments_1.requestAppointment);
router.get('/upcoming', auth_1.protect, appointments_1.getUpcomingAppointments);
router.get('/:id/status', auth_1.protect, appointments_1.getAppointmentStatus);
exports.default = router;
//# sourceMappingURL=appointments.js.map