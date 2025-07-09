#!/bin/bash

echo "🚀 Setting up Salon Payroll System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup Prisma database
echo "🗄️ Setting up database..."
npx prisma generate
npx prisma db push

# Seed database with sample data
echo "🌱 Seeding database..."
npx prisma db seed

# Setup environment variables
if [ ! -f .env ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "📝 Please update .env file with your database credentials"
fi

echo "✅ Setup complete!"
echo ""
echo "🎉 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 To build for production:"
echo "   npm run build"
echo ""
echo "🐳 To run with Docker:"
echo "   docker-compose up"
echo ""
echo "🚀 To deploy to Vercel:"
echo "   npm run deploy:vercel"
