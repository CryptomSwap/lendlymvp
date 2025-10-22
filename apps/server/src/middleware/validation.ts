import { NextRequest, NextResponse } from 'next/server'
import { ZodSchema, ZodError } from 'zod'

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json()
      const validatedData = schema.parse(body)
      return handler(request, validatedData)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Validation failed',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        )
      }
      
      console.error('Validation middleware error:', error)
      return NextResponse.json(
        { success: false, error: 'Invalid request data' },
        { status: 400 }
      )
    }
  }
}

export function withQueryValidation<T>(
  schema: ZodSchema<T>,
  handler: (req: NextRequest, data: T) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const url = new URL(request.url)
      const queryParams = Object.fromEntries(url.searchParams.entries())
      const validatedData = schema.parse(queryParams)
      return handler(request, validatedData)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid query parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
          { status: 400 }
        )
      }
      
      console.error('Query validation middleware error:', error)
      return NextResponse.json(
        { success: false, error: 'Invalid query parameters' },
        { status: 400 }
      )
    }
  }
}
