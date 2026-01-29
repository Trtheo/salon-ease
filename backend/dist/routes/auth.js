"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/register', validation_1.validateRegister, validation_1.handleValidationErrors, auth_1.register);
router.post('/login', validation_1.validateLogin, validation_1.handleValidationErrors, auth_1.login);
router.get('/me', auth_2.protect, auth_1.getMe);
exports.default = router;
//# sourceMappingURL=auth.js.map