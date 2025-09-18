'use client'

import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState('Loading...')
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    testAuth()
  }, [])

  const testAuth = async () => {
    try {
      console.log('Testing /api/auth/me...')
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Ensure cookies are sent
      })
      
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      
      if (response.ok) {
        setStatus('✅ Authentication working!')
        setUserData(data)
      } else {
        setStatus(`❌ Auth failed: ${data.error}`)
        setUserData(data)
      }
    } catch (error) {
      console.error('Test error:', error)
      setStatus('❌ Network error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
        
        <div className="mb-4">
          <strong>Status:</strong> {status}
        </div>
        
        {userData && (
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-bold mb-2">Response Data:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-6 space-x-4">
          <button 
            onClick={testAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Again
          </button>
          
          <a 
            href="/auth/signin"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
          >
            Go to Sign In
          </a>
          
          <a 
            href="/dashboard"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}