"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const salons_1 = __importDefault(require("./routes/salons"));
const services_1 = __importDefault(require("./routes/services"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const availability_1 = __importDefault(require("./routes/availability"));
const payments_1 = __importDefault(require("./routes/payments"));
const otp_1 = __importDefault(require("./routes/otp"));
const location_1 = __importDefault(require("./routes/location"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const admin_1 = __importDefault(require("./routes/admin"));
const salonOwner_1 = __importDefault(require("./routes/salonOwner"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3005;
// Connect to MongoDB
(0, database_1.connectDB)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use((0, cors_1.default)({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3005'],
    credentials: true
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static files
app.use('/uploads', express_1.default.static('uploads'));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/salons', salons_1.default);
app.use('/api/services', services_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/availability', availability_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/otp', otp_1.default);
app.use('/api/location', location_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/salon-owner', salonOwner_1.default);
app.use('/api/upload', upload_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'SalonEase API is running' });
});
// Error handling
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 SalonEase API server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map