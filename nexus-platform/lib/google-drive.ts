import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

export class GoogleDriveService {
  private drive: any
  private companyId: string

  constructor(companyId: string, accessToken: string, refreshToken: string) {
    this.companyId = companyId

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    })

    this.drive = google.drive({ version: 'v3', auth: oauth2Client })
  }

  static async fromCompany(companyId: string): Promise<GoogleDriveService | null> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        driveAccessToken: true,
        driveRefreshToken: true,
        driveEnabled: true,
      }
    })

    if (!company?.driveEnabled || !company.driveAccessToken || !company.driveRefreshToken) {
      return null
    }

    return new GoogleDriveService(
      companyId,
      company.driveAccessToken,
      company.driveRefreshToken
    )
  }

  async initializeCompanyStructure(): Promise<string> {
    try {
      // Create root folder for company
      const rootFolderResponse = await this.drive.files.create({
        requestBody: {
          name: 'Nexus-Workflow-Data',
          mimeType: 'application/vnd.google-apps.folder',
        },
      })

      const rootFolderId = rootFolderResponse.data.id

      // Create Users subfolder
      const usersFolderResponse = await this.drive.files.create({
        requestBody: {
          name: 'Users',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [rootFolderId],
        },
      })

      // Create Analytics subfolder
      const analyticsFolderResponse = await this.drive.files.create({
        requestBody: {
          name: 'Analytics',
          mimeType: 'application/vnd.google-apps.folder',
          parents: [rootFolderId],
        },
      })

      // Update company with root folder ID
      await prisma.company.update({
        where: { id: this.companyId },
        data: { driveRootFolderId: rootFolderId }
      })

      return rootFolderId
    } catch (error) {
      console.error('Error initializing company Drive structure:', error)
      throw new Error('Failed to initialize Google Drive structure')
    }
  }

  async createUserFolder(userName: string): Promise<string> {
    try {
      const company = await prisma.company.findUnique({
        where: { id: this.companyId },
        select: { driveRootFolderId: true }
      })

      if (!company?.driveRootFolderId) {
        throw new Error('Company Drive not initialized')
      }

      // Get Users folder
      const usersFolder = await this.findFolder('Users', company.driveRootFolderId)
      if (!usersFolder) {
        throw new Error('Users folder not found')
      }

      // Create user folder
      const userFolderResponse = await this.drive.files.create({
        requestBody: {
          name: `${userName}_Submissions`,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [usersFolder.id],
        },
      })

      return userFolderResponse.data.id
    } catch (error) {
      console.error('Error creating user folder:', error)
      throw new Error('Failed to create user folder')
    }
  }

  async createCategoryFolder(userId: string, categoryName: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { driveFolderId: true, name: true }
      })

      if (!user?.driveFolderId) {
        throw new Error('User Drive folder not found')
      }

      // Create category folder inside user folder
      const categoryFolderResponse = await this.drive.files.create({
        requestBody: {
          name: categoryName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [user.driveFolderId],
        },
      })

      return categoryFolderResponse.data.id
    } catch (error) {
      console.error('Error creating category folder:', error)
      throw new Error('Failed to create category folder')
    }
  }

  async createTaskSubmissionFolder(
    userId: string, 
    categoryName: string, 
    taskName: string, 
    submissionDate: Date
  ): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { driveFolderId: true }
      })

      if (!user?.driveFolderId) {
        throw new Error('User Drive folder not found')
      }

      // Find or create category folder
      let categoryFolder = await this.findFolder(categoryName, user.driveFolderId)
      if (!categoryFolder) {
        const categoryFolderResponse = await this.drive.files.create({
          requestBody: {
            name: categoryName,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [user.driveFolderId],
          },
        })
        categoryFolder = { id: categoryFolderResponse.data.id }
      }

      // Create task folder with date
      const dateStr = submissionDate.toISOString().split('T')[0] // YYYY-MM-DD
      const folderName = `${dateStr}_${taskName}`

      const taskFolderResponse = await this.drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: [categoryFolder.id],
        },
      })

      return taskFolderResponse.data.id
    } catch (error) {
      console.error('Error creating task submission folder:', error)
      throw new Error('Failed to create task submission folder')
    }
  }

  async uploadFile(
    folderId: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ fileId: string; webViewLink: string; downloadUrl: string }> {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: mimeType,
          body: fileBuffer,
        },
        fields: 'id, webViewLink',
      })

      // Make file shareable
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      })

      const downloadUrl = `https://drive.google.com/uc?id=${response.data.id}&export=download`

      // Store file info in database
      await prisma.driveFile.create({
        data: {
          companyId: this.companyId,
          driveFileId: response.data.id,
          fileName: fileName,
          mimeType: mimeType,
          size: BigInt(fileBuffer.length),
          downloadUrl: downloadUrl,
          webViewUrl: response.data.webViewLink,
          parentFolderId: folderId,
          uploadedBy: 'system', // This should be set to actual user ID
        }
      })

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
        downloadUrl: downloadUrl,
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  async findFolder(folderName: string, parentId: string): Promise<{ id: string } | null> {
    try {
      const response = await this.drive.files.list({
        q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: 'files(id, name)',
      })

      return response.data.files?.[0] || null
    } catch (error) {
      console.error('Error finding folder:', error)
      return null
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await this.drive.files.delete({
        fileId: fileId,
      })

      // Remove from database
      await prisma.driveFile.deleteMany({
        where: {
          companyId: this.companyId,
          driveFileId: fileId,
        }
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Failed to delete file')
    }
  }

  async getFileInfo(fileId: string): Promise<any> {
    try {
      const response = await this.drive.files.get({
        fileId: fileId,
        fields: 'id, name, size, mimeType, webViewLink, createdTime, modifiedTime',
      })

      return response.data
    } catch (error) {
      console.error('Error getting file info:', error)
      throw new Error('Failed to get file info')
    }
  }

  async listFolderContents(folderId: string): Promise<any[]> {
    try {
      const response = await this.drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, size, mimeType, webViewLink, createdTime, modifiedTime)',
      })

      return response.data.files || []
    } catch (error) {
      console.error('Error listing folder contents:', error)
      throw new Error('Failed to list folder contents')
    }
  }
}

// Utility functions for Drive integration
export async function initializeCompanyDrive(companyId: string, accessToken: string, refreshToken: string): Promise<string> {
  const driveService = new GoogleDriveService(companyId, accessToken, refreshToken)
  return await driveService.initializeCompanyStructure()
}

export async function createUserDriveFolder(companyId: string, userName: string): Promise<string> {
  const driveService = await GoogleDriveService.fromCompany(companyId)
  if (!driveService) {
    throw new Error('Google Drive not configured for company')
  }

  return await driveService.createUserFolder(userName)
}

export async function uploadTaskSubmissionFiles(
  companyId: string,
  userId: string,
  categoryName: string,
  taskName: string,
  files: Array<{ name: string; buffer: Buffer; mimeType: string }>
): Promise<Array<{ fileId: string; webViewLink: string; downloadUrl: string }>> {
  const driveService = await GoogleDriveService.fromCompany(companyId)
  if (!driveService) {
    throw new Error('Google Drive not configured for company')
  }

  // Create submission folder
  const submissionFolderId = await driveService.createTaskSubmissionFolder(
    userId,
    categoryName,
    taskName,
    new Date()
  )

  // Upload all files
  const uploadResults = []
  for (const file of files) {
    const result = await driveService.uploadFile(
      submissionFolderId,
      file.name,
      file.buffer,
      file.mimeType
    )
    uploadResults.push(result)
  }

  return uploadResults
}