import { NextRequest, NextResponse } from 'next/server'
import { CreateCategoryRequestSchema } from '@/shared/schemas'
import { withValidation } from '@/middleware/validation'
import { withAuth, withRole } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.categoryRequest.findMany({
      where: {
        status: 'APPROVED',
      },
      orderBy: {
        name: 'asc',
      }
    })

    return NextResponse.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת קטגוריות' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withValidation(CreateCategoryRequestSchema, async (req, data) => {
      try {
        const categoryRequest = await prisma.categoryRequest.create({
          data: {
            ...data,
            requesterId: req.user!.userId,
          }
        })

        return NextResponse.json({
          success: true,
          message: 'בקשת הקטגוריה נשלחה בהצלחה',
          data: categoryRequest
        })
      } catch (error) {
        console.error('Create category request error:', error)
        return NextResponse.json(
          { success: false, error: 'שגיאה ביצירת בקשת קטגוריה' },
          { status: 500 }
        )
      }
    })(req)
  })
}
