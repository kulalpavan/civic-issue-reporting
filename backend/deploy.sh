#!/bin/bash

# Quick deployment script for Civic Issue Reporting App

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Creating .env file..."
    echo "JWT_SECRET=your-super-secret-jwt-key-12345" > .env
    echo "NODE_ENV=production" >> .env
    echo "PORT=10000" >> .env
fi

echo "✅ Backend ready for deployment!"
echo "📝 Next steps:"
echo "   1. Push to GitHub"
echo "   2. Deploy to Render/Railway"
echo "   3. Update frontend API URL"
echo "   4. Deploy frontend to Vercel"

echo "🌐 Your app will be accessible worldwide after deployment!"