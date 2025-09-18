'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  name: string
  email: string
  position?: string
  department?: string
}

interface Company {
  id: string
  name: string
  slug: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log('Dashboard: Checking authentication...')
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })
      
      console.log('Dashboard: Auth response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Dashboard: User authenticated:', data.user.email)
        setUser(data.user)
        setCompany(data.company)
        setLoading(false)
      } else {
        console.log('Dashboard: Not authenticated, redirecting to signin')
        // Use window.location for consistent behavior
        window.location.href = '/auth/signin'
        return
      }
    } catch (error) {
      console.error('Dashboard: Auth check failed:', error)
      window.location.href = '/auth/signin'
      return
    }
  }

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      router.push('/auth/signin')
    } catch (error) {
      console.error('Sign out failed:', error)
      // Force redirect anyway
      router.push('/auth/signin')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {company?.name} Dashboard
              </h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                🎉 Authentication System Working!
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900">User Information</h3>
                  <div className="mt-2 text-sm text-blue-800">
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Position:</strong> {user?.position || 'Not set'}</p>
                    <p><strong>Department:</strong> {user?.department || 'Not set'}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900">Company Information</h3>
                  <div className="mt-2 text-sm text-green-800">
                    <p><strong>Company:</strong> {company?.name}</p>
                    <p><strong>Slug:</strong> {company?.slug}</p>
                    <p><strong>ID:</strong> {company?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Custom Authentication</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Successfully implemented custom signup and signin
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">SQLite Database</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Database connection fixed with reliable SQLite
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-bold">✓</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Session Management</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Secure session-based authentication working
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white overflow-hidden shadow rounded-lg mt-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ready to Build!</h3>
              <p className="text-gray-600 mb-4">
                The authentication system is now working perfectly. You can now:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Create new accounts via the signup page</li>
                <li>Sign in with existing credentials</li>
                <li>Sessions persist across page refreshes</li>
                <li>Build additional features on this foundation</li>
              </ul>
              <div className="mt-6">
                <Link 
                  href="/auth/signup" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Create Another Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}