# System Testing Guide - Nexus Platform

## Overview
This guide provides comprehensive testing steps for the newly refactored Nexus Platform with local file storage and role-based access control.

## Prerequisites
- Development server running on http://localhost:3000
- Fresh database (dev.db)
- Storage directory created automatically

## Test Scenarios

### 1. Company Registration & Admin Account Creation

**Test Steps:**
1. Navigate to http://localhost:3000
2. Click on "Sign Up" or "Get Started"
3. Fill in the registration form:
   - Company Name: "Test Company"
   - Your Name: "Admin User"
   - Email: "admin@testcompany.com"
   - Password: "admin123"
4. Click "Create Account"

**Expected Results:**
- Account created successfully
- Redirected to sign-in page or dashboard
- Admin role automatically assigned
- Company storage folder created in /storage directory

### 2. Admin Sign In

**Test Steps:**
1. Navigate to http://localhost:3000/auth/signin
2. Fill in:
   - Company Slug: "test-company"
   - Email: "admin@testcompany.com"
   - Password: "admin123"
3. Click "Sign In"

**Expected Results:**
- Successfully authenticated
- Redirected to dashboard
- Admin permissions active

### 3. Employee Management - Create Employee

**Test Steps:**
1. While signed in as admin, navigate to /dashboard/employees
2. Click "Add Employee"
3. Fill in employee details:
   - Name: "John Employee"
   - Email: "john@testcompany.com"
   - Password: "john123"
   - Position: "Software Engineer"
   - Department: "Engineering"
   - Role: "Employee"
4. Click "Create Employee"

**Expected Results:**
- Employee created successfully
- Redirected back to employee list
- New employee visible in the list with "Employee" role

### 4. Employee Sign In

**Test Steps:**
1. Sign out as admin
2. Navigate to /auth/signin
3. Fill in:
   - Company Slug: "test-company"
   - Email: "john@testcompany.com"
   - Password: "john123"
4. Sign in

**Expected Results:**
- Successfully authenticated
- Limited permissions (cannot access employee management)
- Can view assigned tasks only

### 5. File Upload & Storage

**Test Steps:**
1. Sign in as admin
2. Navigate to file upload section (if available in UI)
3. Upload a test file (PDF, image, or document)

**Expected Results:**
- File uploaded successfully
- File stored in local storage directory (/storage/[company-id]/...)
- File metadata saved in database
- File accessible via download link

### 6. File Download

**Test Steps:**
1. Navigate to files list
2. Click download on a previously uploaded file

**Expected Results:**
- File downloads successfully
- Correct file name and content

### 7. Employee Management - Update Employee

**Test Steps:**
1. Sign in as admin
2. Navigate to /dashboard/employees
3. Click edit on "John Employee"
4. Update position to "Senior Software Engineer"
5. Save changes

**Expected Results:**
- Employee updated successfully
- Changes reflected in employee list

### 8. Employee Management - Delete Employee

**Test Steps:**
1. Sign in as admin
2. Navigate to /dashboard/employees
3. Click delete on an employee (not yourself)
4. Confirm deletion

**Expected Results:**
- Employee deleted successfully
- Removed from employee list
- Associated data cleaned up

### 9. Role-Based Access Control

**Test Steps:**
1. Sign in as employee (john@testcompany.com)
2. Try to access /dashboard/employees

**Expected Results:**
- Access denied or redirected
- "Forbidden" error displayed
- Cannot view/modify other employees

### 10. Session Persistence

**Test Steps:**
1. Sign in as admin
2. Refresh the page
3. Navigate to different pages

**Expected Results:**
- Session maintained
- No need to sign in again
- User data persists

## API Testing

### Authentication API
```bash
# Sign Up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Test Co","email":"test@test.com","name":"Test User","password":"test123"}'

# Expected: 200 OK with user and company data
```

### Employee Management API
```bash
# List Employees (requires authentication)
curl http://localhost:3000/api/employees \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN"

# Expected: 200 OK with employees array
```

### File Management API
```bash
# Upload File (requires authentication)
curl -X POST http://localhost:3000/api/files/upload \
  -H "Cookie: next-auth.session-token=YOUR_SESSION_TOKEN" \
  -F "file=@test.pdf" \
  -F "category=test"

# Expected: 200 OK with file metadata
```

## Database Verification

Check that the database schema is correctly applied:

```bash
# Open Prisma Studio
npm run db:studio

# Verify tables exist:
# - companies
# - roles
# - users
# - files
# - categories
# - tasks
# - task_assignments
# - submissions
# - sessions
```

## File System Verification

Check that files are stored correctly:

1. Navigate to `/storage` directory in project root
2. Verify company folders exist (e.g., `/storage/[company-id]/`)
3. Verify subdirectories: `users/`, `tasks/`, `submissions/`, `analytics/`, `temp/`
4. Check that uploaded files are present in appropriate folders

## Common Issues & Solutions

### Issue: "Role not found" error
**Solution:** Ensure roles are created during company signup. Check signup API includes role creation.

### Issue: Files not uploading
**Solution:** Check file size limits (10MB default). Verify storage directory has write permissions.

### Issue: Cannot sign in
**Solution:** Verify company slug is correct (lowercase, hyphenated). Check database for user record.

### Issue: Permission denied errors
**Solution:** Verify user role permissions in database. Check auth middleware.

## Test Coverage Checklist

- [ ] Company registration works
- [ ] Admin role created automatically
- [ ] Employee role created automatically
- [ ] Admin can sign in
- [ ] Admin can create employees
- [ ] Admin can update employees
- [ ] Admin can delete employees
- [ ] Employee can sign in
- [ ] Employee has limited permissions
- [ ] File upload works
- [ ] File download works
- [ ] Local storage directory created
- [ ] Files stored in correct locations
- [ ] Session management works
- [ ] Role-based access control enforced
- [ ] No Google Drive dependencies remain

## Performance Tests

1. Upload multiple files (test concurrency)
2. Create multiple employees (test database performance)
3. Sign in/out multiple times (test session management)

## Security Tests

1. Try accessing admin endpoints as employee
2. Try accessing other company's data
3. Test SQL injection on input fields
4. Test XSS on text inputs
5. Verify password hashing (check database - should see hashed passwords)

## Success Criteria

All tests pass and the system:
- ✓ Runs locally without external dependencies
- ✓ No Google Drive integration
- ✓ Local file storage working
- ✓ Role-based access control functional
- ✓ Admin can manage employees
- ✓ Employees have restricted access
- ✓ File upload/download operational
- ✓ Session management secure
