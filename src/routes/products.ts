import { Router } from 'express'
import { listProducts } from '../services/products'

export const productsRouter = Router()

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await listProducts();

    res.json({
      success: true,
      data: products,
    });
  } catch (err) {
    next(err);
  }
});