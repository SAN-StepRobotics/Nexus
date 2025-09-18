#!/bin/bash

echo "🚀 Nexus Workflow Platform - Local Setup"
echo "====================================="

# Step 1: Copy environment file
echo ""
echo "📋 Step 1: Copying environment file..."
cp .env.local .env
if [ $? -eq 0 ]; then
    echo "✅ Environment file created (.env)"
else
    echo "❌ Failed to copy environment file"
    exit 1
fi

# Step 2: Install dependencies
echo ""
echo "📦 Step 2: Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Step 3: Start Docker services
echo ""
echo "🐳 Step 3: Starting Docker services..."
docker-compose -f docker-compose.dev.yml up -d postgres redis
if [ $? -eq 0 ]; then
    echo "✅ Docker services started"
else
    echo "❌ Failed to start Docker services"
    echo "Make sure Docker is running"
    exit 1
fi

# Wait for database
echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

# Step 4: Setup database
echo ""
echo "🗄️ Step 4: Setting up database..."
npx prisma generate
npx prisma db push
if [ $? -eq 0 ]; then
    echo "✅ Database setup completed"
else
    echo "❌ Failed to setup database"
    exit 1
fi

# Step 5: Seed database
echo ""
echo "🌱 Step 5: Seeding database with demo data..."
npx tsx prisma/seed.ts
if [ $? -eq 0 ]; then
    echo "✅ Database seeded with demo data"
else
    echo "❌ Failed to seed database"
    exit 1
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📝 Next Steps:"
echo "1. Update your .env file with Google credentials"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000"
echo ""
echo "🔑 Demo Login Credentials:"
echo "   Company: demo-company"
echo "   Email: admin@demo-company.com"
echo "   Password: admin123"
echo ""