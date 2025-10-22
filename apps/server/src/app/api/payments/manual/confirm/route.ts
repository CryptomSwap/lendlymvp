import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ManualPaymentConfirmSchema = z.object({
  bookingId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'BANK_TRANSFER']),
  notes: z.string().optional(),
})

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json()
      const data = ManualPaymentConfirmSchema.parse(body)

      // Get booking
      const booking = await prisma.booking.findUnique({
        where: { id: data.bookingId },
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

      // Check if user is the owner or admin
      const isOwner = booking.item.ownerId === req.user!.userId
      const isAdmin = req.user!.role === 'ADMIN'

      if (!isOwner && !isAdmin) {
        return NextResponse.json(
          { success: false, error: 'רק בעל הציוד יכול לאשר תשלום' },
          { status: 403 }
        )
      }

      // Update booking payment status
      const updatedBooking = await prisma.booking.update({
        where: { id: data.bookingId },
        data: {
          depositStatus: 'PAID',
          paymentMethod: data.paymentMethod,
          ownerNotes: data.notes,
        },
        include: {
          item: {
            select: {
              title: true,
            }
          },
          renter: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      })

      return NextResponse.json({
        success: true,
        message: 'התשלום אושר בהצלחה',
        data: updatedBooking
      })
    } catch (error) {
      console.error('Manual payment confirm error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה באישור תשלום' },
        { status: 500 }
      )
    }
  })
}
