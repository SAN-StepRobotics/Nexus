import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value

    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token: sessionToken }
      })
    }

    // Create response
    const response = NextResponse.json({ 
      success: true,
      message: 'Signed out successfully' 
    })

    // Clear session cookie
    response.cookies.delete('session-token')

    return response

  } catch (error) {
    console.error('Sign out error:', error)
    
    // Even if there's an error, clear the cookie
    const response = NextResponse.json({ 
      success: true,
      message: 'Signed out' 
    })
    
    response.cookies.delete('session-token')
    return response
  }
}