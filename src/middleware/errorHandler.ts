import type { ErrorRequestHandler } from 'express'
import multer from 'multer'
import { ZodError } from 'zod'

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Invalid request payload.',
      issues: error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    })
    return
  }

  if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message })
    return
  }

  if (error instanceof Error && error.message === 'Only image uploads are allowed.') {
    res.status(400).json({ message: error.message })
    return
  }

  if (error instanceof Error && error.message === 'Not allowed by CORS.') {
    res.status(403).json({ message: error.message })
    return
  }

  console.error(error)
  res.status(500).json({ message: 'Unexpected backend error.' })
}