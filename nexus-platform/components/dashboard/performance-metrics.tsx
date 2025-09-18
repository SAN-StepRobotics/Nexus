import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceMetricsProps {
  companyId: string
  userId: string
  userRole: string
}

export function PerformanceMetrics({ companyId, userId, userRole }: PerformanceMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Your productivity insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">92%</div>
            <div className="text-sm text-slate-600">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">85%</div>
            <div className="text-sm text-slate-600">On-Time Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">4.8</div>
            <div className="text-sm text-slate-600">Avg Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">28</div>
            <div className="text-sm text-slate-600">Tasks This Week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}