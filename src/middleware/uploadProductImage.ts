import multer from 'multer'

import { env } from '../config/env'

export const uploadProductImage = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: env.MAX_IMAGE_SIZE_BYTES,
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('Only image uploads are allowed.'))
      return
    }

    callback(null, true)
  },
})