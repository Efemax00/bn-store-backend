"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parseList = (value) => value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT) || 5000,
    // CORS
    CORS_ORIGINS: parseList(process.env.CORS_ORIGINS),
    // Firebase
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || '',
    // Admin access
    ADMIN_UID_LIST: parseList(process.env.ADMIN_UID_LIST),
    ADMIN_EMAIL_LIST: parseList(process.env.ADMIN_EMAIL_LIST),
    MAX_IMAGE_SIZE_BYTES: Number(process.env.MAX_IMAGE_SIZE_BYTES) || 5 * 1024 * 1024,
};
