# School ERP System - Netlify Deployment Script
# Run this script to deploy your app to Netlify

Write-Host "🚀 Starting Netlify Deployment for School ERP System..." -ForegroundColor Green

# Check if npm is available
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Check if Netlify CLI is installed
if (!(Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "📥 Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Netlify CLI" -ForegroundColor Red
        exit 1
    }
}

# Check if user is logged in to Netlify
Write-Host "🔑 Checking Netlify authentication..." -ForegroundColor Yellow
netlify status 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "🔐 Please log in to Netlify..." -ForegroundColor Yellow
    netlify login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to authenticate with Netlify" -ForegroundColor Red
        exit 1
    }
}

# Deploy to Netlify
Write-Host "🌐 Deploying to Netlify..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Choose deployment option:" -ForegroundColor Cyan
Write-Host "1. Deploy to draft URL (preview)" -ForegroundColor White
Write-Host "2. Deploy to production" -ForegroundColor White
Write-Host ""

do {
    $choice = Read-Host "Enter choice (1 or 2)"
} while ($choice -notmatch '^[12]$')

if ($choice -eq "1") {
    Write-Host "📤 Deploying to draft URL..." -ForegroundColor Yellow
    netlify deploy --dir=dist
} else {
    Write-Host "📤 Deploying to production..." -ForegroundColor Yellow
    netlify deploy --prod --dir=dist
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Your School ERP System is now live!" -ForegroundColor Cyan
    Write-Host "Features deployed:" -ForegroundColor White
    Write-Host "  • Mobile-optimized responsive design" -ForegroundColor Gray
    Write-Host "  • PWA support for mobile installation" -ForegroundColor Gray
    Write-Host "  • Complete school management system" -ForegroundColor Gray
    Write-Host "  • SimpleBrowser with educational resources" -ForegroundColor Gray
    Write-Host "  • Admin panel and user management" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🔗 Access your site from the URL provided above" -ForegroundColor Yellow
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}
