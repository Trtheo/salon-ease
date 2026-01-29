"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookings_1 = require("../controllers/bookings");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, bookings_1.getBookings)
    .post(auth_1.protect, bookings_1.createBooking);
router.route('/:id/cancel')
    .put(auth_1.protect, bookings_1.cancelBooking);
router.route('/:id/reschedule')
    .put(auth_1.protect, bookings_1.rescheduleBooking);
exports.default = router;
//# sourceMappingURL=bookings.js.map