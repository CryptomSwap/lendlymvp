import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ReportIssueSchema = z.object({
  type: z.enum(['item', 'user', 'booking', 'payment', 'other']),
  targetId: z.string().optional(), // ID of item, user, or booking being reported
  description: z.string().min(10),
  severity: z.enum(['low', 'medium', 'high']).default('medium'),
})

export async function POST(request: NextRequest) {
  return withAuth(request, async (req) => {
    try {
      const body = await request.json()
      const data = ReportIssueSchema.parse(body)

      // Create a simple report record (in production, you'd have a proper reports table)
      const report = {
        id: `report_${Date.now()}`,
        reporterId: req.user!.userId,
        type: data.type,
        targetId: data.targetId,
        description: data.description,
        severity: data.severity,
        createdAt: new Date(),
        status: 'pending',
      }

      // In a real app, you'd save this to a database
      console.log('Safety report received:', report)

      // For now, we'll just log it and return success
      return NextResponse.json({
        success: true,
        message: 'הדוח נשלח בהצלחה',
        data: {
          reportId: report.id,
          status: 'pending',
        }
      })
    } catch (error) {
      console.error('Report issue error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בשליחת דוח' },
        { status: 500 }
      )
    }
  })
}
