"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const availability_1 = require("../controllers/availability");
const router = express_1.default.Router();
router.route('/slots')
    .get(availability_1.getAvailableSlots);
exports.default = router;
//# sourceMappingURL=availability.js.map