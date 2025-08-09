# Netlify Deployment Guide - School ERP System

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Node.js**: Ensure you have Node.js 18+ installed

## Deployment Methods

### Method 1: Git-based Deployment (Recommended)

1. **Push to Git Repository**:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [netlify.com/start](https://app.netlify.com/start)
   - Choose "Import an existing project"
   - Connect your Git provider (GitHub/GitLab/Bitbucket)
   - Select your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

4. **Deploy**: Click "Deploy site"

### Method 2: Manual Deployment

1. **Build the Project**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   # Install Netlify CLI globally
   npm install -g netlify-cli
   
   # Login to Netlify
   netlify login
   
   # Deploy manually
   netlify deploy --prod --dir=dist
   ```

3. **Or Drag & Drop**:
   - Go to [netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder to the deployment area

## Environment Variables

If your app uses environment variables, set them in Netlify:

1. Go to Site Settings → Environment Variables
2. Add variables:
   - `REACT_APP_API_URL`: Your backend API URL
   - Any other environment variables your app needs

## Custom Domain (Optional)

1. Go to Site Settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed by Netlify

## Build Optimization

The `netlify.toml` file includes:
- **SPA Routing**: Redirects all routes to `index.html`
- **Security Headers**: XSS protection, content type sniffing prevention
- **Caching**: Optimized cache headers for static assets
- **Environment Variables**: Production and preview contexts

## Post-Deployment Checklist

1. ✅ Test all routes and navigation
2. ✅ Verify mobile responsiveness
3. ✅ Check PWA functionality
4. ✅ Test authentication flows
5. ✅ Verify API connectivity
6. ✅ Test SimpleBrowser component
7. ✅ Check all CRUD operations

## Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check build logs in Netlify dashboard
   - Ensure all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **404 on Refresh**:
   - Ensure `netlify.toml` has the redirect rule
   - Check publish directory is set to `dist`

3. **API Connection Issues**:
   - Update `REACT_APP_API_URL` environment variable
   - Ensure CORS is configured on your backend

4. **Assets Not Loading**:
   - Check if build artifacts are in the correct directory
   - Verify asset paths are relative

## Performance Tips

1. **Enable Branch Deploys**: For testing features
2. **Use Deploy Previews**: For pull request reviews
3. **Enable Form Handling**: If using Netlify forms
4. **Configure Analytics**: Monitor site performance

## School ERP Specific Notes

This deployment includes:
- **Mobile-Optimized UI**: Responsive design for all devices
- **PWA Support**: Installable as mobile app
- **Educational Resources**: SimpleBrowser with learning links
- **Admin Panel**: Complete school management system
- **Authentication**: Secure login and user management

## Support

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify Community](https://community.netlify.com/)
- [Contact Support](https://www.netlify.com/support/)

---

**Ready to deploy!** 🚀