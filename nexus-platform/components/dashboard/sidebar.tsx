'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  Building2,
  Plus,
  Calendar,
  FileText,
  Zap
} from 'lucide-react'

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
    companySlug?: string
    permissions?: string[]
  }
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['tasks.read']
  },
  {
    name: 'My Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
    permissions: ['tasks.read']
  },
  {
    name: 'Submit Task',
    href: '/dashboard/submit',
    icon: Plus,
    permissions: ['submissions.create']
  },
  {
    name: 'Team Tasks',
    href: '/dashboard/team-tasks',
    icon: Users,
    permissions: ['tasks.read', 'submissions.review']
  },
  {
    name: 'Categories',
    href: '/dashboard/categories',
    icon: FolderOpen,
    permissions: ['categories.read']
  },
  {
    name: 'Calendar',
    href: '/dashboard/calendar',
    icon: Calendar,
    permissions: ['tasks.read']
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    permissions: ['analytics.read']
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText,
    permissions: ['analytics.read']
  },
  {
    name: 'Team Management',
    href: '/dashboard/team',
    icon: Users,
    permissions: ['users.read']
  },
  {
    name: 'Automation',
    href: '/dashboard/automation',
    icon: Zap,
    permissions: ['admin.all']
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    permissions: ['admin.all']
  }
]

const bottomNavigation = [
  {
    name: 'Help & Support',
    href: '/dashboard/help',
    icon: HelpCircle
  }
]

function hasPermission(userPermissions: string[] = [], requiredPermissions: string[]): boolean {
  if (userPermissions.includes('admin.all')) return true
  return requiredPermissions.some(permission => userPermissions.includes(permission))
}

export function DashboardSidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  const filteredNavigation = navigation.filter(item => 
    !item.permissions || hasPermission(user.permissions, item.permissions)
  )

  return (
    <div className={cn(
      "nexus-sidebar flex flex-col border-r border-slate-800 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-nexus-500 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Nexus</h2>
                <p className="text-slate-400 text-xs truncate max-w-32">
                  {user.companySlug}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "nexus-sidebar-item",
                  isActive && "active",
                  isCollapsed && "justify-center px-3"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-slate-800 p-3">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "nexus-sidebar-item",
              isCollapsed && "justify-center px-3"
            )}
            title={isCollapsed ? item.name : undefined}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-nexus-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user.name}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}