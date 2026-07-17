import { cert, getApps, initializeApp, type ServiceAccount } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

import { env } from '../config/env'

const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')

const serviceAccount: ServiceAccount = {
  projectId: env.FIREBASE_PROJECT_ID,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
  privateKey,
}

const app =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: env.FIREBASE_DATABASE_URL,
  })

export const firebaseAuth = getAuth(app)
export const realtimeDb = getDatabase(app)