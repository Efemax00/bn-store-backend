"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = require("express");
const products_1 = require("../services/products");
exports.productsRouter = (0, express_1.Router)();
exports.productsRouter.get('/', async (_req, res, next) => {
    try {
        const products = await (0, products_1.listProducts)();
        res.json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        next(error);
    }
});
