import type { NextFunction, Request, Response } from 'express'

import { env } from '../config/env'
import { firebaseAuth } from '../firebase/admin'

const getBearerToken = (authorization?: string) => {
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length).trim()
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = getBearerToken(req.header('authorization'))

    if (!token) {
      return res.status(401).json({
        message: 'Missing admin authorization token.',
      })
    }

    const decodedToken = await firebaseAuth.verifyIdToken(token)

    const email = decodedToken.email?.toLowerCase()

    const uidIsAllowed = env.ADMIN_UID_LIST.includes(decodedToken.uid)
    const emailIsAllowed = Boolean(
      email && env.ADMIN_EMAIL_LIST.includes(email)
    )

    if (!uidIsAllowed && !emailIsAllowed) {
      return res.status(403).json({
        message: 'This Firebase user is not allowed to manage products.',
      })
    }

    // Attach authenticated admin to the request
    req.admin = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    }

    next()
  } catch (error) {
    console.error('Admin authentication failed:', error)

    return res.status(401).json({
      message: 'Invalid or expired admin token.',
    })
  }
}