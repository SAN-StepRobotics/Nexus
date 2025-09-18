import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-nexus-600">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-4">
          Ready to transform your workflow?
        </h2>
        <p className="text-xl mb-8 text-nexus-100">
          Join thousands of teams already using Nexus to streamline their work and boost productivity.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Start Free Trial
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-nexus-600">
            Contact Sales
          </Button>
        </div>
        
        <p className="text-sm text-nexus-200 mt-4">
          14-day free trial • No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  )
}