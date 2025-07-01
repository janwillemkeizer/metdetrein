#!/bin/bash

# Dutch Train Station Finder - Deployment Script
# This script builds and deploys the application

echo "🚂 Dutch Train Station Finder - Deployment Script"
echo "=================================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Run tests (if any)
echo "🧪 Running tests..."
npm test -- --watchAll=false || true

# Step 3: Build the application
echo "🏗️  Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Build output is in the 'build' directory"
    echo "🌐 You can serve it with any static hosting service:"
    echo ""
    echo "   Option 1 - Using serve (install globally first):"
    echo "   npm install -g serve"
    echo "   serve -s build"
    echo ""
    echo "   Option 2 - Using Python:"
    echo "   cd build"
    echo "   python -m http.server 8000"
    echo ""
    echo "   Option 3 - Deploy to hosting platforms:"
    echo "   - Netlify: Drag and drop the 'build' folder"
    echo "   - Vercel: Import from GitHub and it will auto-deploy"
    echo "   - GitHub Pages: Push to gh-pages branch"
    echo "   - Surge.sh: surge build/"
    echo ""
    echo "🎉 Your Dutch Train Station Finder is ready to go live!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi