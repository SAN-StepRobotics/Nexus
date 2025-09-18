import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    console.log('Auth check - checking session...')
    
    // Get session token from cookies
    const sessionToken = request.cookies.get('session-token')?.value
    console.log('Session token found:', !!sessionToken)

    if (!sessionToken) {
      console.log('No session token found')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Find session
    console.log('Looking for session in database...')
    const session = await prisma.session.findUnique({
      where: { token: sessionToken }
    })

    console.log('Session found:', !!session)
    console.log('Session expires at:', session?.expiresAt)

    if (!session || session.expiresAt < new Date()) {
      console.log('Session expired or not found')
      
      // Clean up expired session
      if (session) {
        await prisma.session.delete({
          where: { id: session.id }
        })
      }
      
      const response = NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      )
      
      // Clear expired cookie
      response.cookies.delete('session-token')
      return response
    }

    // Get user with company
    console.log('Getting user with company...')
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { company: true }
    })

    console.log('User found:', !!user, 'User active:', user?.isActive)

    if (!user || !user.isActive) {
      console.log('User not found or inactive')
      return NextResponse.json(
        { error: 'User not found or inactive' },
        { status: 401 }
      )
    }

    console.log('Auth check successful for user:', user.email)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        position: user.position,
        department: user.department
      },
      company: {
        id: user.company.id,
        name: user.company.name,
        slug: user.company.slug
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}