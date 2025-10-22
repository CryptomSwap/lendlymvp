import { NextRequest, NextResponse } from 'next/server'
import { LoginSchema } from '@/shared/schemas'
import { withValidation } from '@/middleware/validation'
import { prisma } from '@/lib/prisma'
import { verifyPassword, createAccessToken, createRefreshToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  return withValidation(LoginSchema, async (req, data) => {
    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email: data.email }
      })

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'פרטי התחברות שגויים' },
          { status: 401 }
        )
      }

      // Verify password
      const isValidPassword = await verifyPassword(data.password, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: 'פרטי התחברות שגויים' },
          { status: 401 }
        )
      }

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

      // Return user data (without password)
      const { password, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        message: 'התחברת בהצלחה',
        data: {
          user: userWithoutPassword,
          accessToken,
          refreshToken,
        }
      })
    } catch (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בהתחברות' },
        { status: 500 }
      )
    }
  })(request)
}
