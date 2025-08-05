# Deployment Guide for School ERP System

This guide will walk you through deploying your School ERP System to Vercel, a popular platform for hosting React applications.

## Prerequisites

1. A GitHub account
2. A Vercel account (you can sign up using your GitHub account)

## Step 1: Prepare Your Repository

Your codebase is already optimized for deployment with:
- Correct `package.json` configuration
- A `vercel.json` configuration file
- TypeScript errors have been fixed

## Step 2: Push Your Code to GitHub

1. If you haven't already, create a new repository on GitHub
2. Initialize Git in your project (if not already done):
   ```
   git init
   git add .
   git commit -m "Initial commit ready for deployment"
   ```
3. Add your GitHub repository as a remote:
   ```
   git remote add origin https://github.com/yourusername/your-repo-name.git
   ```
4. Push your code to GitHub:
   ```
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com/) and sign in with your GitHub account
2. Click on "Add New" → "Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Vite
   - Build Command: `npm run build` (should be pre-filled)
   - Output Directory: `dist` (should be pre-filled)
   - Root Directory: `./` (should be pre-filled)
5. Click "Deploy"

Vercel will automatically detect your Vite project settings from the `vercel.json` file and deploy your application.

## Step 4: Verify Your Deployment

1. Once deployment is complete, Vercel will provide you with a URL (typically `https://your-project-name.vercel.app`)
2. Open the URL in your browser to verify that your School ERP System is working correctly

## Step 5: Custom Domain (Optional)

If you want to use a custom domain:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Domains"
3. Add your custom domain and follow the instructions to set up DNS records

## Continuous Deployment

Vercel automatically sets up continuous deployment. When you push changes to your GitHub repository, Vercel will automatically build and deploy the new version.

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in Vercel for specific errors
2. Ensure all dependencies are correctly listed in your package.json
3. Verify that your application works locally with `npm run build && npm run preview`
4. Check that environment variables (if any) are properly set in the Vercel dashboard

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router and Vercel](https://vercel.com/guides/deploying-react-with-vercel)
