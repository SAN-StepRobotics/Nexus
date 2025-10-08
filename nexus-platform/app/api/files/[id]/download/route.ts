import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hasPermission } from '@/lib/auth'
import { LocalFileStorageService } from '@/lib/file-storage'

// GET /api/files/[id]/download - Download file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!hasPermission(session.user.permissions, 'files.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const storageService = await LocalFileStorageService.fromCompany(
      session.user.companyId
    )

    // Get file info first
    const fileInfo = await storageService.getFileInfo(params.id)

    // Read file
    const fileBuffer = await storageService.readFile(params.id)

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': fileInfo.mimeType,
        'Content-Disposition': `attachment; filename="${fileInfo.originalName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading file:', error)
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    )
  }
}
