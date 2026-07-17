"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProductsRouter = void 0;
const express_1 = require("express");
const requireAdmin_1 = require("../middleware/requireAdmin");
const uploadProductImage_1 = require("../middleware/uploadProductImage");
const productSchema_1 = require("../schemas/productSchema");
const imageStorage_1 = require("../services/imageStorage");
const products_1 = require("../services/products");
exports.adminProductsRouter = (0, express_1.Router)();
exports.adminProductsRouter.post('/', requireAdmin_1.requireAdmin, uploadProductImage_1.uploadProductImage.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'Product image is required. Use the form field name "image".' });
            return;
        }
        if (!req.admin) {
            res.status(401).json({ message: 'Admin session was not attached to the request.' });
            return;
        }
        const input = productSchema_1.createProductSchema.parse(req.body);
        const image = await (0, imageStorage_1.saveProductImage)(req.file, input.name);
        const product = await (0, products_1.createProduct)(input, image, req.admin);
        res.status(201).json({ product });
    }
    catch (error) {
        next(error);
    }
});
