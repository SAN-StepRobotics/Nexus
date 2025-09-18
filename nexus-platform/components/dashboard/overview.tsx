interface DashboardOverviewProps {
  companyId: string
  userId: string
  userRole: string
}

export function DashboardOverview({ companyId, userId, userRole }: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="nexus-card">
        <div className="nexus-card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Tasks</p>
              <p className="text-3xl font-bold text-slate-900">12</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="nexus-card">
        <div className="nexus-card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Completed Today</p>
              <p className="text-3xl font-bold text-slate-900">5</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="nexus-card">
        <div className="nexus-card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Team Members</p>
              <p className="text-3xl font-bold text-slate-900">8</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 text-xl">👥</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="nexus-card">
        <div className="nexus-card-content">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Points Earned</p>
              <p className="text-3xl font-bold text-slate-900">245</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}