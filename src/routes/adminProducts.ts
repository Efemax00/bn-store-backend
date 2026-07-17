import { Router } from 'express'

import { requireAdmin } from '../middleware/requireAdmin'
import { uploadProductImage } from '../middleware/uploadProductImage'
import { createProductSchema } from '../schemas/productSchema'
import { saveProductImage } from '../services/imageStorage'
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../services/products'

export const adminProductsRouter = Router()

/**
 * Create Product
 */
adminProductsRouter.post(
  '/',
  requireAdmin,
  uploadProductImage.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'Product image is required.',
        })
      }

      if (!req.admin) {
        return res.status(401).json({
          message: 'Admin session missing.',
        })
      }

      const input = createProductSchema.parse(req.body)

      const image = await saveProductImage(req.file, input.name)

      const product = await createProduct(
        input,
        image,
        req.admin
      )

      return res.status(201).json(product)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * Update Product
 */
adminProductsRouter.patch(
  '/:id',
  requireAdmin,
  uploadProductImage.single('image'),
  async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id

      const existing = await getProduct(id)

      if (!existing) {
        return res.status(404).json({
          message: 'Product not found.',
        })
      }

      let image = {
        imageUrl: existing.imageUrl,
        imagePath: existing.imagePath,
      }

      if (req.file) {
        image = await saveProductImage(
          req.file,
          req.body.name || existing.name
        )
      }

      const updated = await updateProduct(
        id,
        {
          ...req.body,
          imageUrl: image.imageUrl,
          imagePath: image.imagePath,
        }
      )

      return res.json(updated)
    } catch (error) {
      next(error)
    }
  }
)

/**
 * Delete Product
 */
adminProductsRouter.delete(
  '/:id',
  requireAdmin,
  async (req, res, next) => {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id

      await deleteProduct(id)

      return res.json({
        success: true,
      })
    } catch (error) {
      next(error)
    }
  }
)