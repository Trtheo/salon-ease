"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const salons_1 = require("../controllers/salons");
const search_1 = require("../controllers/search");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(salons_1.getSalons)
    .post(auth_1.protect, (0, auth_1.authorize)('salon_owner', 'admin'), salons_1.createSalon);
router.route('/search')
    .get(search_1.searchSalons);
router.route('/:id')
    .get(salons_1.getSalon)
    .put(auth_1.protect, (0, auth_1.authorize)('salon_owner', 'admin'), salons_1.updateSalon)
    .delete(auth_1.protect, (0, auth_1.authorize)('salon_owner', 'admin'), salons_1.deleteSalon);
router.route('/:id/services')
    .get(search_1.getSalonServices);
exports.default = router;
//# sourceMappingURL=salons.js.map