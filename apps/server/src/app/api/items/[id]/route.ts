import { NextRequest, NextResponse } from 'next/server'
import { UpdateItemSchema } from '@/shared/schemas'
import { withValidation } from '@/middleware/validation'
import { withAuth, withRole } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            city: true,
            isVerified: true,
            phone: true,
          }
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc',
          }
        },
        bookings: {
          where: {
            status: {
              in: ['CONFIRMED', 'IN_PROGRESS'],
            }
          },
          select: {
            startDate: true,
            endDate: true,
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'פריט לא נמצא' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const averageRating = item.reviews.length > 0 
      ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
      : 0

    return NextResponse.json({
      success: true,
      data: {
        ...item,
        averageRating,
        reviewCount: item.reviews.length,
      }
    })
  } catch (error) {
    console.error('Get item error:', error)
    return NextResponse.json(
      { success: false, error: 'שגיאה בטעינת פריט' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    return withValidation(UpdateItemSchema, async (req, data) => {
      try {
        // Check if user owns the item or is admin
        const item = await prisma.item.findUnique({
          where: { id: params.id },
          select: { ownerId: true }
        })

        if (!item) {
          return NextResponse.json(
            { success: false, error: 'פריט לא נמצא' },
            { status: 404 }
          )
        }

        if (item.ownerId !== req.user!.userId && req.user!.role !== 'ADMIN') {
          return NextResponse.json(
            { success: false, error: 'אין הרשאה לערוך פריט זה' },
            { status: 403 }
          )
        }

        const updatedItem = await prisma.item.update({
          where: { id: params.id },
          data,
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                city: true,
                isVerified: true,
              }
            }
          }
        })

        return NextResponse.json({
          success: true,
          message: 'הפריט עודכן בהצלחה',
          data: updatedItem
        })
      } catch (error) {
        console.error('Update item error:', error)
        return NextResponse.json(
          { success: false, error: 'שגיאה בעדכון פריט' },
          { status: 500 }
        )
      }
    })(req)
  })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      // Check if user owns the item or is admin
      const item = await prisma.item.findUnique({
        where: { id: params.id },
        select: { ownerId: true }
      })

      if (!item) {
        return NextResponse.json(
          { success: false, error: 'פריט לא נמצא' },
          { status: 404 }
        )
      }

      if (item.ownerId !== req.user!.userId && req.user!.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'אין הרשאה למחוק פריט זה' },
          { status: 403 }
        )
      }

      await prisma.item.delete({
        where: { id: params.id }
      })

      return NextResponse.json({
        success: true,
        message: 'הפריט נמחק בהצלחה'
      })
    } catch (error) {
      console.error('Delete item error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה במחיקת פריט' },
        { status: 500 }
      )
    }
  })
}
