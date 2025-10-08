import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { DEFAULT_PERMISSIONS, DEFAULT_ROLE_DESCRIPTIONS } from '@/lib/auth'
import { initializeCompanyStorage } from '@/lib/file-storage'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { companyName, email, name, password } = await request.json()

    // Validate input
    if (!companyName || !email || !name || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase()
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create company slug from name
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // Check if company slug is unique
    let uniqueSlug = slug
    let counter = 1
    while (await prisma.company.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create company, roles, and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          name: companyName,
          slug: uniqueSlug,
          subdomain: uniqueSlug,
          email: email.toLowerCase(),
          settings: JSON.stringify({
            theme: 'light',
            notifications: true
          })
        }
      })

      // Create Admin role
      const adminRole = await tx.role.create({
        data: {
          companyId: company.id,
          name: 'Admin',
          permissions: JSON.stringify(DEFAULT_PERMISSIONS.ADMIN),
          description: DEFAULT_ROLE_DESCRIPTIONS.ADMIN,
          isDefault: false
        }
      })

      // Create Employee role (default)
      const employeeRole = await tx.role.create({
        data: {
          companyId: company.id,
          name: 'Employee',
          permissions: JSON.stringify(DEFAULT_PERMISSIONS.EMPLOYEE),
          description: DEFAULT_ROLE_DESCRIPTIONS.EMPLOYEE,
          isDefault: true
        }
      })

      // Create user with Admin role
      const user = await tx.user.create({
        data: {
          companyId: company.id,
          roleId: adminRole.id,
          email: email.toLowerCase(),
          name: name,
          passwordHash,
          isActive: true,
          emailVerified: true,
          position: 'Administrator',
          department: 'Management'
        }
      })

      return { company, user, adminRole, employeeRole }
    })

    // Initialize company storage structure
    try {
      await initializeCompanyStorage(result.company.id)
    } catch (storageError) {
      console.error('Failed to initialize storage:', storageError)
      // Continue even if storage init fails - can be retried later
    }

    // Return success (without sensitive data)
    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email
      },
      company: {
        id: result.company.id,
        name: result.company.name,
        slug: result.company.slug
      }
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    )
  }
}