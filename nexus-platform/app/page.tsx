import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Nexus</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">N</span>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Transform Your Team's 
            <span className="text-blue-600"> Workflow</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Nexus is a modern, multi-tenant task management platform that helps teams organize, 
            track, and complete work with automatic Google Drive integration and real-time analytics.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-lg"
            >
              Start Free Trial →
            </Link>
            <button className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-lg font-medium text-lg transition-colors">
              Schedule Demo
            </button>
          </div>
          
          <p className="text-sm text-slate-500 mt-4">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to manage your team
            </h2>
            <p className="text-xl text-slate-600">
              Built for modern teams that need flexibility and control
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">🏢</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Multi-Tenant Architecture
              </h3>
              <p className="text-slate-600">
                Complete isolation between companies with their own data and settings
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">💽</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Google Drive Integration
              </h3>
              <p className="text-slate-600">
                Automatic file organization with dynamic folder creation
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Role-Based Access
              </h3>
              <p className="text-slate-600">
                Granular permissions and user management
              </p>
            </div>
            
            <div className="text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Real-Time Analytics
              </h3>
              <p className="text-slate-600">
                Performance tracking and insights
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of teams already using Nexus to streamline their work and boost productivity.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/signin"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-lg"
            >
              Start Free Trial →
            </Link>
          </div>
          
          <p className="text-sm text-blue-200 mt-4">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-white font-semibold text-lg">Nexus</span>
          </div>
          <p className="text-sm mb-8">
            Modern workflow management for teams that demand excellence.
          </p>
          <p className="text-xs">
            © 2024 Nexus Workflow Management Platform. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}