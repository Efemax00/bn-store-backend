"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
const adminProducts_1 = require("./routes/adminProducts");
const products_1 = require("./routes/products");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin(origin, callback) {
            if (!origin || env_1.env.CORS_ORIGINS.includes('*') || env_1.env.CORS_ORIGINS.includes(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error('Not allowed by CORS.'));
        },
    }));
    app.use(express_1.default.json());
    app.get('/health', (_req, res) => {
        res.json({ ok: true });
    });
    app.use('/api/products', products_1.productsRouter);
    app.use('/api/admin/products', adminProducts_1.adminProductsRouter);
    app.use((_req, res) => {
        res.status(404).json({ message: 'Route not found.' });
    });
    app.use(errorHandler_1.errorHandler);
    return app;
}
