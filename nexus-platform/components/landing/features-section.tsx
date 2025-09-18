import { Building2, HardDrive, Users, BarChart3 } from 'lucide-react'

interface Feature {
  title: string
  description: string
  icon: string
}

interface FeaturesSectionProps {
  features: Feature[]
}

const iconMap = {
  building: Building2,
  'hard-drive': HardDrive,
  users: Users,
  'bar-chart': BarChart3,
}

export function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
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
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap] || Building2
            
            return (
              <div key={index} className="text-center">
                <div className="h-12 w-12 bg-nexus-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-nexus-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}