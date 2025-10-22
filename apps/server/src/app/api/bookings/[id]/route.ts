import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const UpdateBookingSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED']).optional(),
  depositStatus: z.enum(['PENDING', 'PAID', 'REFUNDED', 'FORFEITED']).optional(),
  ownerNotes: z.string().optional(),
  pickupNotes: z.string().optional(),
  returnNotes: z.string().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: params.id },
        include: {
          item: {
            include: {
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                  city: true,
                  isVerified: true,
                }
              }
            }
          },
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              city: true,
              isVerified: true,
            }
          },
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                }
              },
              receiver: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                }
              }
            },
            orderBy: {
              createdAt: 'asc',
            }
          }
        }
      })

      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'הזמנה לא נמצאה' },
          { status: 404 }
        )
      }

      // Check if user has access to this booking
      const hasAccess = booking.renterId === req.user!.userId || 
                       booking.item.ownerId === req.user!.userId ||
                       req.user!.role === 'ADMIN'

      if (!hasAccess) {
        return NextResponse.json(
          { success: false, error: 'אין הרשאה לצפייה בהזמנה זו' },
          { status: 403 }
        )
      }

      return NextResponse.json({
        success: true,
        data: booking
      })
    } catch (error) {
      console.error('Get booking error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בטעינת הזמנה' },
        { status: 500 }
      )
    }
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json()
      const validatedData = UpdateBookingSchema.parse(body)

      // Get booking to check permissions
      const booking = await prisma.booking.findUnique({
        where: { id: params.id },
        include: {
          item: {
            select: {
              ownerId: true,
            }
          }
        }
      })

      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'הזמנה לא נמצאה' },
          { status: 404 }
        )
      }

      // Check permissions
      const isOwner = booking.item.ownerId === req.user!.userId
      const isRenter = booking.renterId === req.user!.userId
      const isAdmin = req.user!.role === 'ADMIN'

      if (!isOwner && !isRenter && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'אין הרשאה לערוך הזמנה זו' },
          { status: 403 }
        )
      }

      // Additional permission checks for specific fields
      if (validatedData.status && !isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'רק בעל הציוד יכול לשנות סטטוס' },
          { status: 403 }
        )
      }

      if (validatedData.depositStatus && !isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'רק בעל הציוד יכול לשנות סטטוס ערבות' },
          { status: 403 }
        )
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: params.id },
        data: validatedData,
        include: {
          item: {
            include: {
              owner: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  phone: true,
                  city: true,
                }
              }
            }
          },
          renter: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              city: true,
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'ההזמנה עודכנה בהצלחה',
        data: updatedBooking
      })
    } catch (error) {
      console.error('Update booking error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בעדכון הזמנה' },
        { status: 500 }
      )
    }
  })
}
