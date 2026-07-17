"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const multer_1 = __importDefault(require("multer"));
const zod_1 = require("zod");
const errorHandler = (error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            message: 'Invalid request payload.',
            issues: error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        });
        return;
    }
    if (error instanceof multer_1.default.MulterError) {
        res.status(400).json({ message: error.message });
        return;
    }
    if (error instanceof Error && error.message === 'Only image uploads are allowed.') {
        res.status(400).json({ message: error.message });
        return;
    }
    if (error instanceof Error && error.message === 'Not allowed by CORS.') {
        res.status(403).json({ message: error.message });
        return;
    }
    console.error(error);
    res.status(500).json({ message: 'Unexpected backend error.' });
};
exports.errorHandler = errorHandler;
