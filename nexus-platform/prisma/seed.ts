import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default company for testing
  const testCompany = await prisma.company.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      name: 'Demo Company',
      slug: 'demo-company',
      subdomain: 'demo',
      email: 'admin@demo-company.com',
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: 'professional',
      settings: {
        theme: 'light',
        notifications: true,
        allowWeekendWork: false
      }
    }
  })

  console.log('✅ Created demo company:', testCompany.name)

  // Create default roles
  const adminRole = await prisma.role.upsert({
    where: { 
      companyId_name: {
        companyId: testCompany.id,
        name: 'Admin'
      }
    },
    update: {},
    create: {
      companyId: testCompany.id,
      name: 'Admin',
      description: 'Full system access',
      permissions: ['admin.all'],
      isSystemRole: true,
      color: '#DC2626'
    }
  })

  const managerRole = await prisma.role.upsert({
    where: {
      companyId_name: {
        companyId: testCompany.id,
        name: 'Manager'
      }
    },
    update: {},
    create: {
      companyId: testCompany.id,
      name: 'Manager',
      description: 'Team management and task oversight',
      permissions: [
        'users.read',
        'tasks.create', 'tasks.read', 'tasks.update', 'tasks.delete',
        'categories.create', 'categories.read', 'categories.update',
        'submissions.review', 'submissions.read',
        'analytics.read', 'analytics.export'
      ],
      isSystemRole: true,
      color: '#2563EB'
    }
  })

  const employeeRole = await prisma.role.upsert({
    where: {
      companyId_name: {
        companyId: testCompany.id,
        name: 'Employee'
      }
    },
    update: {},
    create: {
      companyId: testCompany.id,
      name: 'Employee',
      description: 'Task execution and submission',
      permissions: [
        'tasks.read',
        'submissions.create', 'submissions.read'
      ],
      isSystemRole: true,
      color: '#059669'
    }
  })

  console.log('✅ Created default roles')

  // Create demo admin user
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const adminUser = await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId: testCompany.id,
        email: 'admin@demo-company.com'
      }
    },
    update: {},
    create: {
      companyId: testCompany.id,
      email: 'admin@demo-company.com',
      name: 'Admin User',
      passwordHash: hashedPassword,
      roleId: adminRole.id,
      isActive: true,
      emailVerified: true,
      position: 'System Administrator',
      department: 'IT'
    }
  })

  // Create demo manager
  const managerPassword = await bcrypt.hash('manager123', 12)
  
  const managerUser = await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId: testCompany.id,
        email: 'manager@demo-company.com'
      }
    },
    update: {},
    create: {
      companyId: testCompany.id,
      email: 'manager@demo-company.com',
      name: 'Jane Manager',
      passwordHash: managerPassword,
      roleId: managerRole.id,
      isActive: true,
      emailVerified: true,
      position: 'Team Lead',
      department: 'Marketing'
    }
  })

  // Create demo employees
  const employeePassword = await bcrypt.hash('employee123', 12)
  
  const employees = [
    { name: 'John Employee', email: 'john@demo-company.com', department: 'Marketing' },
    { name: 'Sarah Worker', email: 'sarah@demo-company.com', department: 'Sales' },
    { name: 'Mike Developer', email: 'mike@demo-company.com', department: 'Engineering' }
  ]

  const createdEmployees = []
  for (const emp of employees) {
    const user = await prisma.user.upsert({
      where: {
        companyId_email: {
          companyId: testCompany.id,
          email: emp.email
        }
      },
      update: {},
      create: {
        companyId: testCompany.id,
        email: emp.email,
        name: emp.name,
        passwordHash: employeePassword,
        roleId: employeeRole.id,
        isActive: true,
        emailVerified: true,
        position: 'Team Member',
        department: emp.department
      }
    })
    createdEmployees.push(user)
  }

  console.log('✅ Created demo users')

  // Create demo categories
  const categories = [
    { name: 'Social Media', description: 'Social media content and engagement', color: '#3B82F6', icon: 'share' },
    { name: 'Content Creation', description: 'Blog posts, articles, and written content', color: '#10B981', icon: 'edit' },
    { name: 'Lead Generation', description: 'Prospecting and outreach activities', color: '#F59E0B', icon: 'target' },
    { name: 'Customer Support', description: 'Customer service and support tasks', color: '#EF4444', icon: 'help-circle' },
    { name: 'Analytics', description: 'Data analysis and reporting', color: '#8B5CF6', icon: 'bar-chart' },
    { name: 'Administration', description: 'Administrative and management tasks', color: '#6B7280', icon: 'settings' }
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: {
        companyId_name: {
          companyId: testCompany.id,
          name: cat.name
        }
      },
      update: {},
      create: {
        companyId: testCompany.id,
        name: cat.name,
        description: cat.description,
        color: cat.color,
        icon: cat.icon,
        createdBy: adminUser.id,
        sortOrder: createdCategories.length
      }
    })
    createdCategories.push(category)
  }

  console.log('✅ Created demo categories')

  // Create demo tasks
  const tasks = [
    {
      name: 'Daily Social Media Post',
      description: 'Create and publish daily social media content on LinkedIn and Twitter',
      categoryName: 'Social Media',
      assignedTo: createdEmployees[0].id,
      frequency: 'DAILY',
      priority: 'MEDIUM',
      points: 5
    },
    {
      name: 'Weekly Blog Article',
      description: 'Write and publish a weekly blog article on industry trends',
      categoryName: 'Content Creation',
      assignedTo: createdEmployees[1].id,
      frequency: 'WEEKLY',
      priority: 'HIGH',
      points: 10
    },
    {
      name: 'Lead Outreach Campaign',
      description: 'Reach out to 10 potential leads via email and LinkedIn',
      categoryName: 'Lead Generation',
      assignedTo: createdEmployees[2].id,
      frequency: 'DAILY',
      priority: 'HIGH',
      points: 8
    },
    {
      name: 'Customer Support Tickets',
      description: 'Respond to customer support tickets within 2 hours',
      categoryName: 'Customer Support',
      assignedTo: createdEmployees[0].id,
      frequency: 'DAILY',
      priority: 'URGENT',
      points: 6
    },
    {
      name: 'Monthly Analytics Report',
      description: 'Compile monthly performance analytics and insights',
      categoryName: 'Analytics',
      assignedTo: managerUser.id,
      frequency: 'MONTHLY',
      priority: 'MEDIUM',
      points: 15
    }
  ]

  for (const task of tasks) {
    const category = createdCategories.find(c => c.name === task.categoryName)
    if (category) {
      await prisma.task.upsert({
        where: {
          id: `task-${task.name.toLowerCase().replace(/\s+/g, '-')}`
        },
        update: {},
        create: {
          companyId: testCompany.id,
          categoryId: category.id,
          name: task.name,
          description: task.description,
          assignedToId: task.assignedTo,
          createdById: adminUser.id,
          frequencyType: task.frequency as any,
          status: 'ACTIVE',
          priority: task.priority as any,
          points: task.points,
          nextDueDate: new Date()
        }
      })
    }
  }

  console.log('✅ Created demo tasks')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📋 Demo Accounts Created:')
  console.log('👑 Admin: admin@demo-company.com / admin123')
  console.log('👨‍💼 Manager: manager@demo-company.com / manager123') 
  console.log('👨‍💻 Employee: john@demo-company.com / employee123')
  console.log('👩‍💻 Employee: sarah@demo-company.com / employee123')
  console.log('🔧 Employee: mike@demo-company.com / employee123')
  console.log('\n🏢 Company Slug: demo-company')
  console.log('🌐 Login URL: http://localhost:3000/auth/signin')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })