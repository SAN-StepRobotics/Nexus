import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Helper function to ensure tenant isolation
export function withTenant(companyId: string) {
  return {
    where: {
      companyId
    }
  }
}

// Multi-tenant aware queries
export const tenantPrisma = {
  user: {
    findMany: (companyId: string, args?: any) => 
      prisma.user.findMany({
        ...args,
        where: { companyId, ...args?.where }
      }),
    
    findUnique: (companyId: string, args: any) => 
      prisma.user.findUnique({
        ...args,
        where: { companyId, ...args.where }
      }),
    
    create: (companyId: string, args: any) => 
      prisma.user.create({
        ...args,
        data: { companyId, ...args.data }
      }),
    
    update: (companyId: string, args: any) => 
      prisma.user.update({
        ...args,
        where: { companyId, ...args.where }
      }),
    
    delete: (companyId: string, args: any) => 
      prisma.user.delete({
        ...args,
        where: { companyId, ...args.where }
      })
  },
  
  task: {
    findMany: (companyId: string, args?: any) => 
      prisma.task.findMany({
        ...args,
        where: { companyId, ...args?.where }
      }),
    
    findUnique: (companyId: string, args: any) => 
      prisma.task.findUnique({
        ...args,
        where: { companyId, ...args.where }
      }),
    
    create: (companyId: string, args: any) => 
      prisma.task.create({
        ...args,
        data: { companyId, ...args.data }
      }),
    
    update: (companyId: string, args: any) => 
      prisma.task.update({
        ...args,
        where: { companyId, ...args.where }
      }),
    
    delete: (companyId: string, args: any) => 
      prisma.task.delete({
        ...args,
        where: { companyId, ...args.where }
      })
  },
  
  category: {
    findMany: (companyId: string, args?: any) => 
      prisma.category.findMany({
        ...args,
        where: { companyId, ...args?.where }
      }),
    
    create: (companyId: string, args: any) => 
      prisma.category.create({
        ...args,
        data: { companyId, ...args.data }
      })
  },
  
  taskSubmission: {
    findMany: (companyId: string, args?: any) => 
      prisma.taskSubmission.findMany({
        ...args,
        where: { companyId, ...args?.where }
      }),
    
    create: (companyId: string, args: any) => 
      prisma.taskSubmission.create({
        ...args,
        data: { companyId, ...args.data }
      }),
    
    update: (companyId: string, args: any) => 
      prisma.taskSubmission.update({
        ...args,
        where: { companyId, ...args.where }
      })
  }
}