import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RecentTasksProps {
  companyId: string
  userId: string
  userRole: string
}

export function RecentTasks({ companyId, userId, userRole }: RecentTasksProps) {
  const tasks = [
    { id: 1, name: "Daily Social Media Post", category: "Social Media", status: "Active", dueDate: "Today" },
    { id: 2, name: "Weekly Blog Article", category: "Content Creation", status: "Due Soon", dueDate: "Tomorrow" },
    { id: 3, name: "Lead Outreach Campaign", category: "Lead Generation", status: "Completed", dueDate: "Yesterday" },
    { id: 4, name: "Customer Support Tickets", category: "Customer Support", status: "Active", dueDate: "Today" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Tasks</CardTitle>
        <CardDescription>Your latest task activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h4 className="font-medium text-slate-900">{task.name}</h4>
                <p className="text-sm text-slate-600">{task.category}</p>
              </div>
              <div className="text-right">
                <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
                <p className="text-xs text-slate-500 mt-1">{task.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}