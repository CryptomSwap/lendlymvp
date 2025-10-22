import { NextRequest, NextResponse } from 'next/server'
import { verifyRefreshToken, createAccessToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: 'Refresh token is required' },
        { status: 400 }
      )
    }

    // Verify refresh token
    const payload = await verifyRefreshToken(refreshToken)
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 401 }
      )
    }

    // Create new access token
    const newAccessToken = await createAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({
      success: true,
      data: {
        accessToken: newAccessToken,
      }
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to refresh token' },
      { status: 500 }
    )
  }
}
