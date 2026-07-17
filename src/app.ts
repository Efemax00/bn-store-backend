import cors from 'cors'
import express from 'express'

import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import { adminProductsRouter } from './routes/adminProducts'
import { productsRouter } from './routes/products'
import { adminSalesRouter } from './routes/adminSales'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || env.CORS_ORIGINS.includes('*') || env.CORS_ORIGINS.includes(origin)) {
          callback(null, true)
          return
        }

        callback(new Error('Not allowed by CORS.'))
      },
    }),
  )

  app.use(express.json())

  app.get('/health', (_req, res) => {
    res.json({ ok: true })
  })

  app.use('/api/products', productsRouter)
  app.use('/api/admin/products', adminProductsRouter)
  app.use("/api/admin/sales", adminSalesRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: 'Route not found.' })
  })

  app.use(errorHandler)

  return app
}