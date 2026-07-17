import dotenv from 'dotenv'

dotenv.config()

const parseList = (value?: string) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 3000,

  // CORS
  CORS_ORIGINS: parseList(process.env.CORS_ORIGINS),

  // Firebase
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL || '',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Admin access
  ADMIN_UID_LIST: parseList(process.env.ADMIN_UID_LIST),
  ADMIN_EMAIL_LIST: parseList(process.env.ADMIN_EMAIL_LIST),

  MAX_IMAGE_SIZE_BYTES:
  Number(process.env.MAX_IMAGE_SIZE_BYTES) || 5 * 1024 * 1024,
}
