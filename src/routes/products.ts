import { Router } from 'express'
import { listProducts } from '../services/products'

export const productsRouter = Router()

productsRouter.get('/', async (req, res, next) => {
  try {
    const adminUid = (req as any).admin?.uid || ''
    const products = await listProducts(adminUid)

    res.json({
      success: true,
      data: products,
    })
  } catch (error) {
    next(error)
  }
})