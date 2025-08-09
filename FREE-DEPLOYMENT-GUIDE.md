# Free Deployment Platforms Guide

## 🚀 Frontend Deployment Options (React App)

### 1. Vercel (सबसे अच्छा)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
npx vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: school-erp-system
# - Directory: ./
# - Override settings? No
```

**Features:**
- ✅ Unlimited bandwidth
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ GitHub integration

### 2. Netlify (Alternative)
```bash
# Build project first
npm run build

# Drag and drop dist folder to app.netlify.com/drop
```

### 3. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://jiamitk83.github.io/GOOD-WORK",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

### 4. Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and init
firebase login
firebase init hosting

# Deploy
firebase deploy
```

### 5. Surge.sh (Simplest)
```bash
# Install Surge
npm install -g surge

# Build and deploy
npm run build
cd dist
surge

# Enter domain: schoolerp.surge.sh
```

## 🖥️ Backend Deployment Options

### 1. Railway (Best Free Option)
- Visit railway.app
- Connect GitHub repo
- Deploy server folder
- $5/month free credit

### 2. Render
- Visit render.com
- Connect GitHub repo
- Free tier available
- PostgreSQL database included

### 3. Heroku (Limited)
- Visit heroku.com
- Connect GitHub repo
- Free dyno hours limited

### 4. Glitch
- Visit glitch.com
- Import from GitHub
- Good for small projects

## 💾 Free Database Options

### 1. MongoDB Atlas
- Visit mongodb.com/atlas
- 512MB free tier
- No credit card required

### 2. PlanetScale (MySQL)
- Visit planetscale.com
- 1 database free
- 1GB storage

### 3. Supabase (PostgreSQL)
- Visit supabase.com
- 500MB database
- Real-time features

### 4. Aiven (Various DBs)
- Visit aiven.io
- 1-month free trial
- Multiple database types

## 🏆 Recommended Stack for Free Deployment

1. **Frontend**: Vercel
2. **Backend**: Railway or Render
3. **Database**: MongoDB Atlas or Supabase

## Quick Deploy Commands

### For Vercel:
```bash
# 1. Build project
npm run build

# 2. Install Vercel CLI
npm install -g vercel

# 3. Deploy
npx vercel --prod
```

### For Surge:
```bash
# 1. Build project
npm run build

# 2. Install Surge
npm install -g surge

# 3. Deploy
cd dist && surge
```

## Environment Variables
For production deployment, create `.env.production`:
```
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_ENV=production
```

## Notes:
- Vercel automatically detects Vite projects
- Railway gives $5 monthly credit (enough for small apps)
- MongoDB Atlas 512MB is sufficient for development
- All platforms support custom domains (free)

## Support:
If you need help with any platform, just ask! 🚀
