import { NextRequest, NextResponse } from 'next/server'
import { CreateBookingSchema } from '@/shared/schemas'
import { withValidation, withQueryValidation } from '@/middleware/validation'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { calculatePricing } from '@/shared/utils'
import { z } from 'zod'

const GetBookingsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  status: z.string().optional(),
  role: z.enum(['renter', 'owner']).optional(),
})

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withQueryValidation(GetBookingsQuerySchema, async (req, query) => {
      try {
        const { page, limit, status, role } = query
        const skip = (page - 1) * limit

        // Build where clause based on user role
        const where: any = {}
        
        if (role === 'renter') {
          where.renterId = req.user!.userId
        } else if (role === 'owner') {
          where.item = {
            ownerId: req.user!.userId
          }
        } else {
          // Show both renter and owner bookings
          where.OR = [
            { renterId: req.user!.userId },
            { item: { ownerId: req.user!.userId } }
          ]
        }

        if (status) {
          where.status = status
        }

        const [bookings, total] = await Promise.all([
          prisma.booking.findMany({
            where,
            skip,
            take: limit,
            include: {
              item: {
                select: {
                  id: true,
                  title: true,
                  images: true,
                  city: true,
                  dailyRate: true,
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
              },
              messages: {
                select: {
                  id: true,
                  content: true,
                  createdAt: true,
                  senderId: true,
                  isRead: true,
                },
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              }
            },
            orderBy: {
              createdAt: 'desc',
            }
          }),
          prisma.booking.count({ where })
        ])

        return NextResponse.json({
          success: true,
          data: {
            bookings,
            pagination: {
              page,
              limit,
              total,
              pages: Math.ceil(total / limit),
            }
          }
        })
      } catch (error) {
        console.error('Get bookings error:', error)
        return NextResponse.json(
          { success: false, error: 'שגיאה בטעינת הזמנות' },
          { status: 500 }
        )
      }
    })(req)
  })
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withValidation(CreateBookingSchema, async (req, data) => {
      try {
        // Get item details
        const item = await prisma.item.findUnique({
          where: { id: data.itemId },
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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

        if (!item.isActive || !item.isApproved) {
          return NextResponse.json(
            { success: false, error: 'הפריט לא זמין להזמנה' },
            { status: 400 }
          )
        }

        if (item.ownerId === req.user!.userId) {
          return NextResponse.json(
            { success: false, error: 'לא ניתן להזמין את הפריט שלך' },
            { status: 400 }
          )
        }

        // Calculate dates
        const startDate = new Date(data.startDate)
        const endDate = new Date(data.endDate)
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        if (totalDays < item.minRentalDays) {
          return NextResponse.json(
            { success: false, error: `מינימום ימי השכרה: ${item.minRentalDays}` },
            { status: 400 }
          )
        }

        if (item.maxRentalDays && totalDays > item.maxRentalDays) {
          return NextResponse.json(
            { success: false, error: `מקסימום ימי השכרה: ${item.maxRentalDays}` },
            { status: 400 }
          )
        }

        // Check availability
        const conflictingBookings = await prisma.booking.findMany({
          where: {
            itemId: data.itemId,
            status: {
              in: ['CONFIRMED', 'IN_PROGRESS'],
            },
            OR: [
              {
                startDate: {
                  lte: endDate,
                },
                endDate: {
                  gte: startDate,
                },
              }
            ]
          }
        })

        if (conflictingBookings.length > 0) {
          return NextResponse.json(
            { success: false, error: 'התאריכים המבוקשים תפוסים' },
            { status: 400 }
          )
        }

        // Calculate pricing
        const pricing = calculatePricing(
          item.dailyRate,
          totalDays,
          data.hasInsurance,
          data.insuranceType
        )

        // Create booking
        const booking = await prisma.booking.create({
          data: {
            itemId: data.itemId,
            renterId: req.user!.userId,
            startDate,
            endDate,
            totalDays,
            dailyRate: item.dailyRate,
            totalAmount: pricing.totalAmount,
            depositAmount: pricing.depositAmount,
            insuranceAmount: pricing.insuranceAmount,
            hasInsurance: data.hasInsurance,
            insuranceType: data.insuranceType,
            renterNotes: data.renterNotes,
            paymentMethod: data.paymentMethod,
            status: 'PENDING',
            depositStatus: 'PENDING',
          },
          include: {
            item: {
              select: {
                id: true,
                title: true,
                images: true,
                city: true,
                dailyRate: true,
                owner: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    phone: true,
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
          message: 'ההזמנה נוצרה בהצלחה',
          data: booking
        })
      } catch (error) {
        console.error('Create booking error:', error)
        return NextResponse.json(
          { success: false, error: 'שגיאה ביצירת הזמנה' },
          { status: 500 }
        )
      }
    })(req)
  })
}
