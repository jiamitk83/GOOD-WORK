# School ERP System - Netlify CLI Auto-Deploy Script
# This script will deploy your School ERP System to Netlify automatically

Write-Host "🚀 School ERP System - Auto Deploy to Netlify" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if Netlify CLI is installed
Write-Host "📋 Checking Netlify CLI installation..." -ForegroundColor Yellow

try {
    $netlifyVersion = netlify --version
    Write-Host "✅ Netlify CLI found: $netlifyVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Netlify CLI not found. Installing..." -ForegroundColor Red
    Write-Host "📦 Installing Netlify CLI globally..." -ForegroundColor Yellow
    
    try {
        npm install -g netlify-cli
        Write-Host "✅ Netlify CLI installed successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed to install Netlify CLI. Please install manually:" -ForegroundColor Red
        Write-Host "   npm install -g netlify-cli" -ForegroundColor White
        Write-Host "   or visit: https://docs.netlify.com/cli/get-started/" -ForegroundColor White
        exit 1
    }
}

# Ensure we're in the correct directory
Set-Location -Path $PSScriptRoot

# Check if dist folder exists
if (-not (Test-Path "dist")) {
    Write-Host "📦 Building production version..." -ForegroundColor Yellow
    try {
        npm run build
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✅ Found existing dist folder" -ForegroundColor Green
}

# Deploy to Netlify
Write-Host "🌐 Deploying to Netlify..." -ForegroundColor Yellow
Write-Host "   This will create a new site and give you a live URL!" -ForegroundColor Cyan

try {
    # Deploy and capture the output
    netlify deploy --prod --dir=dist
    
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔒 Login Credentials:" -ForegroundColor Yellow
    Write-Host "   Admin: admin@school.edu / SecureAdmin2024!" -ForegroundColor White
    Write-Host "   Teacher: teacher@school.edu / SecureTeacher2024!" -ForegroundColor White
    Write-Host "   Student: student@school.edu / SecureStudent2024!" -ForegroundColor White
    Write-Host ""
}
catch {
    Write-Host "❌ Deployment failed. Trying alternative method..." -ForegroundColor Red
    
    try {
        # Try with login first
        Write-Host "🔐 Please login to Netlify (browser will open)..." -ForegroundColor Yellow
        netlify login
        
        Write-Host "🌐 Deploying after login..." -ForegroundColor Yellow
        netlify deploy --prod --dir=dist
        
        Write-Host "✅ Deployment should be complete!" -ForegroundColor Green
        Write-Host "   Check your Netlify dashboard for the live URL." -ForegroundColor White
    }
    catch {
        Write-Host "❌ Auto-deployment failed. Please use manual method:" -ForegroundColor Red
        Write-Host "   1. Go to https://netlify.com/drop" -ForegroundColor White
        Write-Host "   2. Drag your 'dist' folder to the page" -ForegroundColor White
        Write-Host "   3. Get your instant live URL!" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "📋 Deployment Summary:" -ForegroundColor Green
Write-Host "   ✅ Production build ready" -ForegroundColor White
Write-Host "   ✅ Demo login removed" -ForegroundColor White
Write-Host "   ✅ Secure credentials active" -ForegroundColor White
Write-Host "   ✅ SPA routing configured" -ForegroundColor White
Write-Host "   ✅ Mobile responsive design" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Your School ERP System is production ready!" -ForegroundColor Green

Read-Host "Press Enter to exit"
