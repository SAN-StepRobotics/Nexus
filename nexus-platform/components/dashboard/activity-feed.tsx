import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ActivityFeedProps {
  companyId: string
  userId: string
}

export function ActivityFeed({ companyId, userId }: ActivityFeedProps) {
  const activities = [
    { id: 1, action: "Task completed", description: "Daily Social Media Post", time: "2 minutes ago", type: "success" },
    { id: 2, action: "File uploaded", description: "Weekly report.pdf", time: "1 hour ago", type: "info" },
    { id: 3, action: "Task assigned", description: "New lead generation task", time: "3 hours ago", type: "info" },
    { id: 4, action: "Review received", description: "Blog article approved", time: "1 day ago", type: "success" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent activity in your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`h-2 w-2 rounded-full mt-2 ${
                activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                <p className="text-sm text-slate-600">{activity.description}</p>
                <p className="text-xs text-slate-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}