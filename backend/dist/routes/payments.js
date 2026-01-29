"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payments_1 = require("../controllers/payments");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .post(auth_1.protect, payments_1.createPayment)
    .get(auth_1.protect, payments_1.getPaymentHistory);
exports.default = router;
//# sourceMappingURL=payments.js.map