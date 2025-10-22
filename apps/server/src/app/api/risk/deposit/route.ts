import { NextRequest, NextResponse } from 'next/server'
import { RiskInputsSchema } from '@/shared/schemas'
import { withValidation } from '@/middleware/validation'
import { calculateDeposit } from '@/shared/utils'

export async function POST(request: NextRequest) {
  return withValidation(RiskInputsSchema, async (req, data) => {
    try {
      const depositQuote = calculateDeposit(data)
      
      return NextResponse.json({
        success: true,
        data: depositQuote
      })
    } catch (error) {
      console.error('Deposit calculation error:', error)
      return NextResponse.json(
        { success: false, error: 'שגיאה בחישוב ערבות' },
        { status: 500 }
      )
    }
  })(request)
}
