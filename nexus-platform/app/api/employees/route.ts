import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hasPermission } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/employees - List all employees in the company
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!hasPermission(session.user.permissions, 'users.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const employees = await prisma.user.findMany({
      where: {
        companyId: session.user.companyId
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            permissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Remove sensitive data
    const sanitizedEmployees = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      role: emp.role,
      position: emp.position,
      department: emp.department,
      isActive: emp.isActive,
      emailVerified: emp.emailVerified,
      avatar: emp.avatar,
      lastLoginAt: emp.lastLoginAt,
      createdAt: emp.createdAt,
      updatedAt: emp.updatedAt
    }))

    return NextResponse.json({ employees: sanitizedEmployees })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!hasPermission(session.user.permissions, 'users.create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { email, name, password, roleId, position, department } = await request.json()

    // Validate input
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists in this company
    const existingUser = await prisma.user.findUnique({
      where: {
        companyId_email: {
          companyId: session.user.companyId,
          email: email.toLowerCase()
        }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists in your company' },
        { status: 400 }
      )
    }

    // Get default employee role if roleId not provided
    let finalRoleId = roleId
    if (!finalRoleId) {
      const defaultRole = await prisma.role.findFirst({
        where: {
          companyId: session.user.companyId,
          isDefault: true
        }
      })

      if (!defaultRole) {
        return NextResponse.json(
          { error: 'No default role found' },
          { status: 500 }
        )
      }

      finalRoleId = defaultRole.id
    } else {
      // Verify role belongs to the company
      const role = await prisma.role.findFirst({
        where: {
          id: roleId,
          companyId: session.user.companyId
        }
      })

      if (!role) {
        return NextResponse.json(
          { error: 'Invalid role' },
          { status: 400 }
        )
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create employee
    const employee = await prisma.user.create({
      data: {
        companyId: session.user.companyId,
        roleId: finalRoleId,
        email: email.toLowerCase(),
        name,
        passwordHash,
        position: position || 'Employee',
        department: department || 'General',
        isActive: true,
        emailVerified: false
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            permissions: true
          }
        }
      }
    })

    // Remove sensitive data
    const { passwordHash: _, ...sanitizedEmployee } = employee

    return NextResponse.json({
      success: true,
      message: 'Employee created successfully',
      employee: sanitizedEmployee
    })
  } catch (error) {
    console.error('Error creating employee:', error)
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
