import { NextRequest, NextResponse } from 'next/server'
import { RegisterSchema, LoginSchema } from '@/shared/schemas'
import { withValidation } from '@/middleware/validation'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, createAccessToken, createRefreshToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  return withValidation(RegisterSchema, async (req, data) => {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'כתובת אימייל כבר קיימת' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await hashPassword(data.password)

      // Create user
      const user = await prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          city: data.city,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          city: true,
          role: true,
          isVerified: true,
          createdAt: true,
        }
      })

      // Create tokens
      const accessToken = await createAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      const refreshToken = await createRefreshToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      })

      return NextResponse.json({
        success: true,
        message: 'נרשמת בהצלחה',
        data: {
          user,
          accessToken,
          refreshToken,
        }
      })
    } catch (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בהרשמה' },
        { status: 500 }
      )
    }
  })(request)
}
