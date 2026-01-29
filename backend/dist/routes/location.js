"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const location_1 = require("../controllers/location");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get('/nearest', location_1.getNearestSalons);
router.put('/update', auth_1.protect, location_1.updateUserLocation);
exports.default = router;
//# sourceMappingURL=location.js.map