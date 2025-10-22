import { NextRequest, NextResponse } from 'next/server'
import { CreateItemSchema, UpdateItemSchema } from '@/shared/schemas'
import { withValidation, withQueryValidation } from '@/middleware/validation'
import { withAuth, withRole } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const GetItemsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  category: z.string().optional(),
  city: z.string().optional(),
  minPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  latitude: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  longitude: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  radius: z.string().optional().transform(val => val ? parseInt(val) : 10), // km
})

export async function GET(request: NextRequest) {
  return withQueryValidation(GetItemsQuerySchema, async (req, query) => {
    try {
      const { page, limit, category, city, minPrice, maxPrice, latitude, longitude, radius } = query
      const skip = (page - 1) * limit

      // Build where clause
      const where: any = {
        isActive: true,
        isApproved: true,
      }

      if (category) {
        where.category = category
      }

      if (city) {
        where.city = city
      }

      if (minPrice || maxPrice) {
        where.dailyRate = {}
        if (minPrice) where.dailyRate.gte = minPrice
        if (maxPrice) where.dailyRate.lte = maxPrice
      }

      // Location-based filtering
      if (latitude && longitude && radius) {
        // This is a simplified approach - in production, you'd use PostGIS or similar
        where.latitude = {
          gte: latitude - (radius / 111), // Rough conversion: 1 degree ≈ 111 km
          lte: latitude + (radius / 111),
        }
        where.longitude = {
          gte: longitude - (radius / (111 * Math.cos(latitude * Math.PI / 180))),
          lte: longitude + (radius / (111 * Math.cos(latitude * Math.PI / 180))),
        }
      }

      const [items, total] = await Promise.all([
        prisma.item.findMany({
          where,
          skip,
          take: limit,
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                city: true,
                isVerified: true,
              }
            },
            reviews: {
              select: {
                rating: true,
              }
            },
            _count: {
              select: {
                bookings: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc',
          }
        }),
        prisma.item.count({ where })
      ])

      // Calculate average ratings
      const itemsWithRatings = items.map(item => ({
        ...item,
        averageRating: item.reviews.length > 0 
          ? item.reviews.reduce((sum, review) => sum + review.rating, 0) / item.reviews.length
          : 0,
        reviewCount: item.reviews.length,
      }))

      return NextResponse.json({
        success: true,
        data: {
          items: itemsWithRatings,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          }
        }
      })
    } catch (error) {
      console.error('Get items error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בטעינת פריטים' },
        { status: 500 }
      )
    }
  })(request)
}

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withValidation(CreateItemSchema, async (req, data) => {
      try {
        const item = await prisma.item.create({
          data: {
            ...data,
            ownerId: req.user!.userId,
            isApproved: req.user!.role === 'ADMIN', // Auto-approve for admins
          },
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
          message: 'הפריט נוסף בהצלחה',
          data: item
        })
      } catch (error) {
        console.error('Create item error:', error)
        return NextResponse.json(
          { success: false, error: 'שגיאה ביצירת פריט' },
          { status: 500 }
        )
      }
    })(req)
  })
}
