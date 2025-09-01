#!/usr/bin/env node

// Custom build script for Vercel deployment
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Starting Vercel build process...');

try {
  // Run Vite build
  console.log('📦 Building frontend with Vite...');
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Ensure dist/public directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Move dist contents to dist/public for Vercel
  if (!fs.existsSync('dist/public')) {
    console.log('📁 Moving build files to dist/public...');
    execSync('cp -r dist/* dist/public/ 2>/dev/null || true', { stdio: 'inherit' });
  }
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}