import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const JWT_REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)

export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(JWT_SECRET)
}

export async function createRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_REFRESH_SECRET)
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_REFRESH_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}
