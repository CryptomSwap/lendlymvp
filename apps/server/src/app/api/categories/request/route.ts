import { NextRequest, NextResponse } from 'next/server'
import { CreateCategoryRequestSchema } from '@/shared/schemas'
import { withValidation } from '@/middleware/validation'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

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
