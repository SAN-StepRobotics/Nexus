import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { validateEmail } from '@/lib/utils'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        companySlug: { label: 'Company', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.companySlug) {
          throw new Error('Missing credentials')
        }

        if (!validateEmail(credentials.email)) {
          throw new Error('Invalid email format')
        }

        try {
          // Find company first
          const company = await prisma.company.findUnique({
            where: { slug: credentials.companySlug }
          })

          if (!company) {
            throw new Error('Company not found')
          }

          // Find user within company
          const user = await prisma.user.findUnique({
            where: {
              companyId_email: {
                companyId: company.id,
                email: credentials.email
              }
            },
            include: {
              role: true,
              company: true
            }
          })

          if (!user || !user.isActive) {
            throw new Error('Invalid credentials')
          }

          // Verify password
          if (!user.passwordHash) {
            throw new Error('Account not properly configured')
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          // Update last login
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
          })

          // Parse permissions from JSON string
          const permissions = user.role.permissions ? JSON.parse(user.role.permissions) : []

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            companyId: user.companyId,
            companySlug: company.slug,
            role: user.role.name,
            permissions: permissions
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companyId = user.companyId
        token.companySlug = user.companySlug
        token.role = user.role
        token.permissions = user.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.companyId = token.companyId as string
        session.user.companySlug = token.companySlug as string
        session.user.role = token.role as string
        session.user.permissions = token.permissions as string[]
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Permission checking utilities
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes('admin.all') || userPermissions.includes(requiredPermission)
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  if (userPermissions.includes('admin.all')) return true
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  if (userPermissions.includes('admin.all')) return true
  return requiredPermissions.every(permission => userPermissions.includes(permission))
}

export function isAdmin(userRole: string): boolean {
  return userRole?.toLowerCase() === 'admin'
}

// Default role permissions
export const DEFAULT_PERMISSIONS = {
  ADMIN: [
    'admin.all',
    'users.create', 'users.read', 'users.update', 'users.delete',
    'roles.create', 'roles.read', 'roles.update', 'roles.delete',
    'tasks.create', 'tasks.read', 'tasks.update', 'tasks.delete',
    'categories.create', 'categories.read', 'categories.update', 'categories.delete',
    'submissions.create', 'submissions.read', 'submissions.update', 'submissions.delete', 'submissions.review',
    'files.create', 'files.read', 'files.update', 'files.delete',
    'analytics.read', 'analytics.export',
    'settings.read', 'settings.update'
  ],
  EMPLOYEE: [
    'tasks.read',
    'submissions.create', 'submissions.read',
    'files.create', 'files.read'
  ]
}

// Default role descriptions
export const DEFAULT_ROLE_DESCRIPTIONS = {
  ADMIN: 'Full system access with ability to manage users, tasks, and all company settings',
  EMPLOYEE: 'Standard employee access to view tasks and submit work'
}