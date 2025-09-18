import { Button } from '@/components/ui/button'
import { Building2 } from 'lucide-react'
import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-nexus-600" />
          <span className="text-xl font-bold text-slate-900">Nexus</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
          <a href="#pricing" className="text-slate-600 hover:text-slate-900">Pricing</a>
          <a href="#about" className="text-slate-600 hover:text-slate-900">About</a>
          <a href="#contact" className="text-slate-600 hover:text-slate-900">Contact</a>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/auth/signin">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Button className="bg-nexus-600 hover:bg-nexus-700">
            Start Free Trial
          </Button>
        </div>
      </div>
    </nav>
  )
}