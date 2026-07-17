"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveProductImage = saveProductImage;
const crypto_1 = require("crypto");
const path_1 = __importDefault(require("path"));
const admin_1 = require("../firebase/admin");
const slug_1 = require("../utils/slug");
const getExtension = (file) => {
    const originalExtension = path_1.default.extname(file.originalname).toLowerCase();
    if (originalExtension) {
        return originalExtension;
    }
    const fallback = file.mimetype.split('/')[1] || 'jpg';
    return `.${fallback}`;
};
async function saveProductImage(file, productName) {
    const token = (0, crypto_1.randomUUID)();
    const id = (0, crypto_1.randomUUID)();
    const safeName = (0, slug_1.slugify)(productName) || 'product';
    const objectPath = `products/${safeName}-${id}${getExtension(file)}`;
    const bucketFile = admin_1.storageBucket.file(objectPath);
    await bucketFile.save(file.buffer, {
        resumable: false,
        metadata: {
            contentType: file.mimetype,
            cacheControl: 'public, max-age=31536000',
            metadata: {
                firebaseStorageDownloadTokens: token,
            },
        },
    });
    const encodedPath = encodeURIComponent(objectPath);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${admin_1.storageBucket.name}/o/${encodedPath}?alt=media&token=${token}`;
    return {
        imageUrl,
        imagePath: objectPath,
    };
}
