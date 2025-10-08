import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

// Base storage directory (will be created in project root)
const STORAGE_BASE_DIR = path.join(process.cwd(), 'storage')

export class LocalFileStorageService {
  private companyId: string
  private basePath: string

  constructor(companyId: string) {
    this.companyId = companyId
    this.basePath = path.join(STORAGE_BASE_DIR, companyId)
  }

  static async fromCompany(companyId: string): Promise<LocalFileStorageService> {
    return new LocalFileStorageService(companyId)
  }

  /**
   * Initialize company storage structure
   */
  async initializeCompanyStructure(): Promise<string> {
    try {
      // Create company base directory
      await fs.mkdir(this.basePath, { recursive: true })

      // Create subdirectories
      const subdirs = ['users', 'tasks', 'submissions', 'analytics', 'temp']
      for (const subdir of subdirs) {
        await fs.mkdir(path.join(this.basePath, subdir), { recursive: true })
      }

      return this.basePath
    } catch (error) {
      console.error('Error initializing company storage structure:', error)
      throw new Error('Failed to initialize storage structure')
    }
  }

  /**
   * Create user-specific folder
   */
  async createUserFolder(userName: string): Promise<string> {
    try {
      const userFolderPath = path.join(this.basePath, 'users', this.sanitizeFolderName(userName))
      await fs.mkdir(userFolderPath, { recursive: true })
      return userFolderPath
    } catch (error) {
      console.error('Error creating user folder:', error)
      throw new Error('Failed to create user folder')
    }
  }

  /**
   * Create category folder
   */
  async createCategoryFolder(userId: string, categoryName: string): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const categoryPath = path.join(
        this.basePath,
        'users',
        this.sanitizeFolderName(user.name),
        this.sanitizeFolderName(categoryName)
      )

      await fs.mkdir(categoryPath, { recursive: true })
      return categoryPath
    } catch (error) {
      console.error('Error creating category folder:', error)
      throw new Error('Failed to create category folder')
    }
  }

  /**
   * Create task submission folder
   */
  async createTaskSubmissionFolder(
    userId: string,
    categoryName: string,
    taskName: string,
    submissionDate: Date
  ): Promise<string> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const dateStr = submissionDate.toISOString().split('T')[0] // YYYY-MM-DD
      const folderName = `${dateStr}_${this.sanitizeFolderName(taskName)}`

      const submissionPath = path.join(
        this.basePath,
        'submissions',
        this.sanitizeFolderName(user.name),
        this.sanitizeFolderName(categoryName),
        folderName
      )

      await fs.mkdir(submissionPath, { recursive: true })
      return submissionPath
    } catch (error) {
      console.error('Error creating task submission folder:', error)
      throw new Error('Failed to create task submission folder')
    }
  }

  /**
   * Upload/save file to local storage
   */
  async uploadFile(
    uploadedById: string,
    fileName: string,
    fileBuffer: Buffer,
    mimeType: string,
    category?: string
  ): Promise<{ fileId: string; filePath: string; downloadUrl: string }> {
    try {
      // Generate unique filename
      const uniqueId = randomBytes(8).toString('hex')
      const ext = path.extname(fileName)
      const baseName = path.basename(fileName, ext)
      const uniqueFileName = `${baseName}_${uniqueId}${ext}`

      // Determine storage path based on category
      let storagePath: string
      if (category) {
        storagePath = path.join(this.basePath, 'tasks', category)
      } else {
        storagePath = path.join(this.basePath, 'temp')
      }

      await fs.mkdir(storagePath, { recursive: true })

      const fullPath = path.join(storagePath, uniqueFileName)

      // Write file to disk
      await fs.writeFile(fullPath, fileBuffer)

      // Store file info in database
      const fileRecord = await prisma.file.create({
        data: {
          companyId: this.companyId,
          uploadedById: uploadedById,
          fileName: uniqueFileName,
          originalName: fileName,
          mimeType: mimeType,
          size: fileBuffer.length,
          storagePath: fullPath,
          category: category,
        }
      })

      // Generate download URL (will be handled by API endpoint)
      const downloadUrl = `/api/files/${fileRecord.id}/download`

      return {
        fileId: fileRecord.id,
        filePath: fullPath,
        downloadUrl: downloadUrl,
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  /**
   * Delete file from storage
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      const fileRecord = await prisma.file.findUnique({
        where: { id: fileId, companyId: this.companyId }
      })

      if (!fileRecord) {
        throw new Error('File not found')
      }

      // Delete physical file
      try {
        await fs.unlink(fileRecord.storagePath)
      } catch (error) {
        console.warn('Physical file not found, continuing with database cleanup')
      }

      // Remove from database
      await prisma.file.delete({
        where: { id: fileId }
      })
    } catch (error) {
      console.error('Error deleting file:', error)
      throw new Error('Failed to delete file')
    }
  }

  /**
   * Get file information
   */
  async getFileInfo(fileId: string): Promise<any> {
    try {
      const fileRecord = await prisma.file.findUnique({
        where: { id: fileId, companyId: this.companyId },
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      if (!fileRecord) {
        throw new Error('File not found')
      }

      return fileRecord
    } catch (error) {
      console.error('Error getting file info:', error)
      throw new Error('Failed to get file info')
    }
  }

  /**
   * Read file from storage
   */
  async readFile(fileId: string): Promise<Buffer> {
    try {
      const fileRecord = await prisma.file.findUnique({
        where: { id: fileId, companyId: this.companyId }
      })

      if (!fileRecord) {
        throw new Error('File not found')
      }

      return await fs.readFile(fileRecord.storagePath)
    } catch (error) {
      console.error('Error reading file:', error)
      throw new Error('Failed to read file')
    }
  }

  /**
   * List files by category
   */
  async listFilesByCategory(category: string): Promise<any[]> {
    try {
      const files = await prisma.file.findMany({
        where: {
          companyId: this.companyId,
          category: category
        },
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return files
    } catch (error) {
      console.error('Error listing files:', error)
      throw new Error('Failed to list files')
    }
  }

  /**
   * Sanitize folder/file names
   */
  private sanitizeFolderName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

// Utility functions for file storage
export async function initializeCompanyStorage(companyId: string): Promise<string> {
  const storageService = new LocalFileStorageService(companyId)
  return await storageService.initializeCompanyStructure()
}

export async function createUserStorageFolder(companyId: string, userName: string): Promise<string> {
  const storageService = await LocalFileStorageService.fromCompany(companyId)
  return await storageService.createUserFolder(userName)
}

export async function uploadTaskSubmissionFiles(
  companyId: string,
  userId: string,
  categoryName: string,
  taskName: string,
  files: Array<{ name: string; buffer: Buffer; mimeType: string }>
): Promise<Array<{ fileId: string; filePath: string; downloadUrl: string }>> {
  const storageService = await LocalFileStorageService.fromCompany(companyId)

  // Create submission folder
  const submissionFolderPath = await storageService.createTaskSubmissionFolder(
    userId,
    categoryName,
    taskName,
    new Date()
  )

  // Upload all files
  const uploadResults = []
  for (const file of files) {
    const result = await storageService.uploadFile(
      userId,
      file.name,
      file.buffer,
      file.mimeType,
      categoryName
    )
    uploadResults.push(result)
  }

  return uploadResults
}