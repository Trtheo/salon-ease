"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Protect all routes and restrict to admin only
router.use(auth_1.protect);
router.use((0, auth_1.authorize)('admin'));
// User management
router.get('/users', admin_1.getAllUsers);
router.get('/salon-owners', admin_1.getSalonOwners);
router.put('/users/:userId/role', admin_1.updateUserRole);
router.delete('/users/:userId', admin_1.deleteUser);
// Salon management
router.get('/salons', admin_1.getAllSalons);
router.put('/salons/:salonId/status', admin_1.updateSalonStatus);
exports.default = router;
//# sourceMappingURL=admin.js.map