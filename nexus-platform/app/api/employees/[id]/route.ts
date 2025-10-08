import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hasPermission } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET /api/employees/[id] - Get employee details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const employee = await prisma.user.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId
      },
      include: {
        role: {
          select: {
            id: true,
            name: true,
            permissions: true,
            description: true
          }
        }
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Remove sensitive data
    const { passwordHash: _, ...sanitizedEmployee } = employee

    return NextResponse.json({ employee: sanitizedEmployee })
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

// PATCH /api/employees/[id] - Update employee
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!hasPermission(session.user.permissions, 'users.update')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { name, email, roleId, position, department, isActive, password } =
      await request.json()

    // Verify employee belongs to the company
    const employee = await prisma.user.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Build update data
    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (position !== undefined) updateData.position = position
    if (department !== undefined) updateData.department = department
    if (isActive !== undefined) updateData.isActive = isActive

    if (email !== undefined && email !== employee.email) {
      // Check if new email is already in use
      const existingEmail = await prisma.user.findUnique({
        where: {
          companyId_email: {
            companyId: session.user.companyId,
            email: email.toLowerCase()
          }
        }
      })

      if (existingEmail && existingEmail.id !== params.id) {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 400 }
        )
      }

      updateData.email = email.toLowerCase()
    }

    if (roleId !== undefined) {
      // Verify role belongs to the company
      const role = await prisma.role.findFirst({
        where: {
          id: roleId,
          companyId: session.user.companyId
        }
      })

      if (!role) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
      }

      updateData.roleId = roleId
    }

    if (password !== undefined && password.length > 0) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }
      updateData.passwordHash = await bcrypt.hash(password, 12)
    }

    // Update employee
    const updatedEmployee = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
    const { passwordHash: _, ...sanitizedEmployee } = updatedEmployee

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      employee: sanitizedEmployee
    })
  } catch (error) {
    console.error('Error updating employee:', error)
    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

// DELETE /api/employees/[id] - Delete employee
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!hasPermission(session.user.permissions, 'users.delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Prevent self-deletion
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    // Verify employee belongs to the company
    const employee = await prisma.user.findFirst({
      where: {
        id: params.id,
        companyId: session.user.companyId
      }
    })

    if (!employee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    }

    // Delete employee (cascade will handle related records)
    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
