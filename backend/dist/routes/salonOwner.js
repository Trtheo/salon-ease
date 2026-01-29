"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salonOwner_1 = require("../controllers/salonOwner");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protect all routes and restrict to salon owners
router.use(auth_1.protect);
router.use((0, auth_1.authorize)('salon_owner'));
// Salon management
router.get('/salons', salonOwner_1.getMySalons);
router.get('/salons/:salonId/bookings', salonOwner_1.getSalonBookings);
router.get('/salons/:salonId/stats', salonOwner_1.getSalonStats);
// Booking management
router.put('/bookings/:bookingId/status', salonOwner_1.updateBookingStatus);
exports.default = router;
//# sourceMappingURL=salonOwner.js.map