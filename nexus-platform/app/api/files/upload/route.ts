import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions, hasPermission } from '@/lib/auth'
import { LocalFileStorageService } from '@/lib/file-storage'

export const config = {
  api: {
    bodyParser: false,
  },
}

// POST /api/files/upload - Upload file
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check permission
    if (!hasPermission(session.user.permissions, 'files.create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file
    const storageService = await LocalFileStorageService.fromCompany(
      session.user.companyId
    )

    const result = await storageService.uploadFile(
      session.user.id,
      file.name,
      buffer,
      file.type,
      category || undefined
    )

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        id: result.fileId,
        fileName: file.name,
        downloadUrl: result.downloadUrl,
        size: file.size,
        mimeType: file.type
      }
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}
