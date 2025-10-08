# Nexus Platform - Quick Start Guide

## 🚀 System Overview

The Nexus Platform has been successfully refactored to:
- ✅ **Remove Google Drive dependency** - All files stored locally
- ✅ **Local file storage** - Files stored in `/storage` directory
- ✅ **Role-based access control** - Admin and Employee roles
- ✅ **Employee management** - Admins can add/edit/delete employees
- ✅ **SQLite database** - No external database required
- ✅ **Runs 100% locally** - No external services needed

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🏃 Quick Start

### 1. Install Dependencies

```bash
cd nexus-platform
npm install
```

### 2. Set Up Environment

The `.env` file is already configured for local development with SQLite:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Initialize Database

```bash
npm run db:generate
npm run db:push
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at **http://localhost:3000**

## 👤 First Time Setup

### Create Your Company Account

1. Navigate to http://localhost:3000
2. Click "Sign Up" or "Get Started"
3. Fill in the registration form:
   - **Company Name**: Your company name
   - **Your Name**: Admin user name
   - **Email**: admin@yourcompany.com
   - **Password**: Secure password (min 6 characters)
4. Click "Create Account"

**What happens:**
- Company account is created
- Admin role is automatically assigned
- Employee role is created for future users
- Local storage directory is initialized

### Sign In

1. Navigate to http://localhost:3000/auth/signin
2. Enter:
   - **Company Slug**: (auto-generated from company name, e.g., "your-company")
   - **Email**: Your admin email
   - **Password**: Your password
3. Click "Sign In"

## 👥 Managing Employees

### Add an Employee

1. Sign in as admin
2. Navigate to **Dashboard > Employees** (http://localhost:3000/dashboard/employees)
3. Click "Add Employee"
4. Fill in employee details:
   - Name
   - Email
   - Password (they'll use this to sign in)
   - Position (optional)
   - Department (optional)
   - Role (Admin or Employee)
5. Click "Create Employee"

### Edit/Delete Employees

- **Edit**: Click the edit icon next to an employee
- **Delete**: Click the delete icon (you cannot delete yourself)

## 📁 File Storage

### How It Works

- Files are stored locally in the `/storage` directory
- Each company has its own folder: `/storage/[company-id]/`
- Organized structure:
  ```
  storage/
  └── [company-id]/
      ├── users/
      ├── tasks/
      ├── submissions/
      ├── analytics/
      └── temp/
  ```

### Upload Files

1. Use the file upload interface in the dashboard
2. Files are stored with unique IDs to prevent conflicts
3. Download via API: `/api/files/[file-id]/download`

## 🔐 Roles & Permissions

### Admin Role
Full access to:
- Employee management (create, read, update, delete)
- File management
- Task management
- Category management
- Company settings
- Analytics

### Employee Role
Limited access to:
- View assigned tasks
- Submit work
- Upload files related to tasks
- View own submissions

## 🗂️ Project Structure

```
nexus-platform/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── employees/     # Employee management
│   │   ├── files/         # File upload/download
│   │   └── roles/         # Role management
│   ├── dashboard/
│   │   └── employees/     # Employee management UI
│   └── auth/              # Sign in/up pages
├── lib/
│   ├── auth.ts            # Authentication logic
│   ├── file-storage.ts    # Local file storage service
│   └── prisma.ts          # Database client
├── prisma/
│   └── schema.prisma      # Database schema
├── storage/               # Local file storage (auto-created)
└── .env                   # Environment variables
```

## 🧪 Testing

### Automated Tests

```bash
node test-api.js
```

This tests:
- Company registration
- Employee creation
- API endpoints
- Storage directory

### Manual Testing

Follow the comprehensive test guide in `test-system.md`

## 📊 Database Management

### View Database

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555

### Reset Database

```bash
npm run db:push -- --force-reset
```

**Warning**: This deletes all data!

## 🔧 Common Tasks

### Add a New Role

1. Sign in as admin
2. Use Prisma Studio or API to create a new role
3. Assign permissions (JSON array format)

### Change Employee Role

1. Go to Employees page
2. Edit employee
3. Select new role
4. Save

### Backup Data

1. Copy the `dev.db` file (database)
2. Copy the `storage/` directory (files)

### Deploy to Production

1. Change DATABASE_URL to production database (PostgreSQL recommended)
2. Update NEXTAUTH_SECRET with strong random string
3. Set NODE_ENV=production
4. Build: `npm run build`
5. Start: `npm start`

## 🐛 Troubleshooting

### "Role not found" error
- Ensure signup process completed successfully
- Check database has Admin and Employee roles
- Run: `npm run db:push`

### Cannot upload files
- Check storage directory permissions
- Verify file size (max 10MB)
- Check available disk space

### Authentication issues
- Clear browser cookies
- Check NEXTAUTH_SECRET is set
- Verify company slug is correct (lowercase, hyphenated)

### Database errors
- Run: `npm run db:generate`
- Then: `npm run db:push`
- Check DATABASE_URL in .env

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register company & admin
- `POST /api/auth/signin` - Sign in (via NextAuth)
- `GET /api/auth/signout` - Sign out

### Employees
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/[id]` - Get employee
- `PATCH /api/employees/[id]` - Update employee
- `DELETE /api/employees/[id]` - Delete employee

### Roles
- `GET /api/roles` - List all roles

### Files
- `POST /api/files/upload` - Upload file
- `GET /api/files` - List files
- `GET /api/files/[id]/download` - Download file
- `DELETE /api/files?id=[id]` - Delete file

## 🎯 Next Steps

1. **Test the system**: Create a test company and employees
2. **Customize roles**: Add custom permissions if needed
3. **Add tasks**: Build out task management features
4. **Enhance UI**: Customize the dashboard
5. **Add features**: File preview, notifications, etc.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section
2. Review test-system.md for detailed testing
3. Check server logs for error messages
4. Review API responses for error details

---

**Status**: ✅ System Ready for Local Testing
**Last Updated**: 2025-10-08
