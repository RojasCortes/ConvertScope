#!/bin/bash

echo "🔧 Starting Vercel build process..."

# Build the frontend
echo "📦 Building frontend with Vite..."
npm run build

# Create the correct directory structure for Vercel
echo "📁 Setting up directory structure..."
mkdir -p dist/public

# Copy built files to the expected location
echo "📋 Copying files..."
cp -r dist/* dist/public/ 2>/dev/null || true

echo "✅ Build completed successfully!"