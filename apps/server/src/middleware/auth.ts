import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken, JWTPayload } from '@/lib/auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = await verifyAccessToken(token)
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = payload

    return handler(authenticatedRequest)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function withRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  return withAuth(request, async (req) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    return handler(req)
  })
}
