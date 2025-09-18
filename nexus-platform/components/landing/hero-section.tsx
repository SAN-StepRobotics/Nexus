import { Button } from '@/components/ui/button'
import { ArrowRight, Building2 } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-nexus-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          Transform Your Team's 
          <span className="text-nexus-600"> Workflow</span>
        </h1>
        
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
          Nexus is a modern, multi-tenant task management platform that helps teams organize, 
          track, and complete work with automatic Google Drive integration and real-time analytics.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-nexus-600 hover:bg-nexus-700">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg">
            Schedule Demo
          </Button>
        </div>
        
        <p className="text-sm text-slate-500 mt-4">
          No credit card required. 14-day free trial.
        </p>
      </div>
    </section>
  )
}