# Netlify Deployment Guide for School ERP System

This guide will walk you through deploying the School ERP System to Netlify.

## Prerequisites

- A GitHub account (to push your code)
- A Netlify account (free tier is sufficient)
- Git installed on your computer

## Deployment Steps

### Option 1: Deploy via Netlify UI (Recommended for Beginners)

1. **Create a Build**:
   - Run the build script first: `npm run build`
   - This will create a `dist` folder with your compiled application

2. **Sign up/Log in to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign up or log in

3. **Deploy your site**:
   - Drag and drop the `dist` folder from your project directly onto the Netlify dashboard
   - Netlify will automatically upload and deploy your site

4. **Configure your site**:
   - After deployment, click on "Site settings"
   - Under "Build & deploy" → "Deploy contexts", ensure that "Production branch" is set to "main"
   - Go to "Domain management" to customize your site URL or add a custom domain

### Option 2: Deploy via GitHub Integration (Recommended for Continuous Deployment)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Sign up/Log in to Netlify**:
   - Go to [netlify.com](https://netlify.com) and sign up or log in

3. **Create a new site**:
   - Click "New site from Git"
   - Select GitHub as your Git provider
   - Authorize Netlify to access your GitHub repositories
   - Select your repository

4. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

5. **Configure additional settings**:
   - After deployment, go to "Site settings"
   - Set up environment variables if needed (not required for this project)
   - Configure domain settings

## Important Configuration Notes

- The `netlify.toml` file in your project root includes:
  - Build settings
  - Redirect rules for single-page application routing
  - Node.js version specification

- **SPA Routing**: The redirect rule in `netlify.toml` ensures that all routes in your React app work correctly. This is important for direct URL access and page refreshes.

## Troubleshooting

- **Build Fails**: Check the build logs for specific errors
- **Routing Issues**: Ensure the redirect rule in `netlify.toml` is correct
- **Page Not Found**: Make sure your routes in React Router match the URLs you're trying to access

## Updating Your Deployment

Once set up with GitHub integration, any push to your main branch will automatically trigger a new build and deployment on Netlify.

## Rollback to Previous Version

If needed, you can roll back to a previous deployment in the Netlify dashboard:
1. Go to "Deploys" in your site dashboard
2. Find the previous working deployment
3. Click the three-dot menu and select "Publish deploy"
