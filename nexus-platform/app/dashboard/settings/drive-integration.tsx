'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { HardDrive, CheckCircle, AlertCircle, ExternalLink, Folder } from 'lucide-react'

interface DriveIntegrationProps {
  companyId: string
  isConnected: boolean
  driveInfo?: {
    email: string
    rootFolderId: string
    folderName: string
  }
}

export function DriveIntegration({ companyId, isConnected, driveInfo }: DriveIntegrationProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  const handleConnectDrive = async () => {
    setIsConnecting(true)
    
    try {
      // This will redirect to Google OAuth flow
      const authUrl = `/api/admin/drive/connect?companyId=${companyId}`
      window.location.href = authUrl
    } catch (error) {
      console.error('Error connecting Drive:', error)
      toast({
        title: 'Connection Failed',
        description: 'Failed to connect Google Drive. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectDrive = async () => {
    try {
      const response = await fetch(`/api/admin/drive/disconnect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyId })
      })

      if (response.ok) {
        toast({
          title: 'Drive Disconnected',
          description: 'Google Drive has been disconnected from your company account.',
        })
        window.location.reload()
      } else {
        throw new Error('Failed to disconnect')
      }
    } catch (error) {
      toast({
        title: 'Disconnection Failed',
        description: 'Failed to disconnect Google Drive. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const openDriveFolder = () => {
    if (driveInfo?.rootFolderId) {
      window.open(`https://drive.google.com/drive/folders/${driveInfo.rootFolderId}`, '_blank')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <HardDrive className="h-6 w-6 text-nexus-600" />
          <div>
            <CardTitle>Google Drive Integration</CardTitle>
            <CardDescription>
              Connect your Google Drive account to automatically organize and store task submissions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          // Not Connected State
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Google Drive Not Connected
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Connect your Google Drive account to enable automatic file organization and storage for your team's task submissions.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-medium text-slate-900 mb-3">What happens when you connect:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <Folder className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>A "Nexus-Workflow-Data" folder will be created in your Google Drive</span>
                </li>
                <li className="flex items-start gap-2">
                  <Folder className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Individual folders will be created for each team member</span>
                </li>
                <li className="flex items-start gap-2">
                  <Folder className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>Files will be organized by user, category, and submission date</span>
                </li>
                <li className="flex items-start gap-2">
                  <Folder className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>You maintain full control and ownership of all data</span>
                </li>
              </ul>
            </div>

            <Button 
              onClick={handleConnectDrive} 
              disabled={isConnecting}
              size="lg"
              className="bg-nexus-600 hover:bg-nexus-700"
            >
              {isConnecting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Connect Google Drive
                </div>
              )}
            </Button>
          </div>
        ) : (
          // Connected State
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Google Drive Connected
            </h3>
            <p className="text-slate-600 mb-6">
              Your Google Drive account is successfully connected and ready to receive file uploads.
            </p>

            {driveInfo && (
              <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-green-900 mb-3">Connection Details:</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex justify-between">
                    <span className="font-medium">Connected Account:</span>
                    <span>{driveInfo.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Root Folder:</span>
                    <span>{driveInfo.folderName}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                variant="outline"
                onClick={openDriveFolder}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in Drive
              </Button>
              <Button
                variant="destructive"
                onClick={handleDisconnectDrive}
              >
                Disconnect Drive
              </Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="border-t pt-6">
          <h4 className="font-medium text-slate-900 mb-2">Need Help?</h4>
          <p className="text-sm text-slate-600">
            Having trouble connecting your Google Drive? Check our{' '}
            <a href="/help/drive-integration" className="text-nexus-600 hover:underline">
              setup guide
            </a>{' '}
            or contact support.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}