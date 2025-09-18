@echo off
echo 🚀 Nexus Workflow Platform - Local Setup
echo =====================================

echo.
echo 📋 Step 1: Copying environment file...
copy .env.local .env
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to copy environment file
    pause
    exit /b 1
)
echo ✅ Environment file created (.env)

echo.
echo 📦 Step 2: Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🐳 Step 3: Starting Docker services...
docker-compose -f docker-compose.dev.yml up -d postgres redis
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to start Docker services
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak

echo.
echo 🗄️ Step 4: Setting up database...
call npx prisma generate
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to setup database
    pause
    exit /b 1
)

echo.
echo 🌱 Step 5: Seeding database with demo data...
call npx tsx prisma/seed.ts
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo.
echo ✅ Setup completed successfully!
echo.
echo 📝 Next Steps:
echo 1. Update your .env file with Google credentials
echo 2. Run: npm run dev
echo 3. Visit: http://localhost:3000
echo.
echo 🔑 Demo Login Credentials:
echo    Company: demo-company
echo    Email: admin@demo-company.com
echo    Password: admin123
echo.
pause