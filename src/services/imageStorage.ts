import path from 'path'

import cloudinary from '../config/cloudinary'
import { slugify } from '../utils/slug'

const getExtension = (file: Express.Multer.File) => {
  const originalExtension = path.extname(file.originalname).toLowerCase()

  if (originalExtension) {
    return originalExtension
  }

  const fallback = file.mimetype.split('/')[1] || 'jpg'
  return `.${fallback}`
}

export async function saveProductImage(
  file: Express.Multer.File,
  productName: string
) {
  const safeName = slugify(productName) || 'product'

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'products',
    public_id: `${safeName}-${Date.now()}`,
    resource_type: 'image',
    overwrite: false,
  })

  return {
    imageUrl: result.secure_url,
    imagePath: result.public_id,
  }
}