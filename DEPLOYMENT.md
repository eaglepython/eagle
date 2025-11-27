# GitHub Pages Deployment Guide

## Prerequisites

- GitHub account
- Git installed on your computer
- Node.js and npm installed

## Step-by-Step Deployment

### 1. Create a GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name your repository: `life-tracker-app`
3. Choose "Public" (required for GitHub Pages free tier)
4. Click "Create repository"

### 2. Initialize Git in Your Project

```bash
cd life-tracker
git init
git add .
git commit -m "Initial commit: Life Tracker App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/life-tracker-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Click "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. The workflow will automatically deploy when you push to main

### 4. Deploy Your App

#### Option A: Automatic Deployment (Recommended)
Just push to your main branch:
```bash
git push origin main
```
GitHub Actions will automatically build and deploy your app!

#### Option B: Manual Deployment
```bash
npm run build
npm run deploy
```

### 5. Access Your Live App

Your app will be live at:
```
https://YOUR_USERNAME.github.io/life-tracker-app/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Important Notes

### About the Base Path

The `vite.config.js` is configured with `base: '/life-tracker-app/'`. This is correct for a project repository. If you're deploying to a user/organization site (repository named `username.github.io`), change this to `base: '/'`.

### LocalStorage Data

Your data is stored locally in your browser. Each browser/device will have its own separate data storage.

To backup your data:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Find `lifeTrackerData`
4. Copy the value and save it somewhere safe

To restore data:
1. Manually paste the JSON back into localStorage

### Custom Domain (Optional)

To use a custom domain:
1. In your repository, create a file named `CNAME` in the `public/` folder
2. Add your custom domain (e.g., `lifetracker.yourdomain.com`)
3. Configure DNS settings with your domain provider

## Troubleshooting

### App not loading
- Check that your repository name matches the `base` in `vite.config.js`
- Clear your browser cache
- Check GitHub Actions for build errors

### Styles not loading
- Check browser console for 404 errors
- Verify the `base` path is correct in `vite.config.js`

### Data not persisting
- Ensure you're using the same browser
- Check if localStorage is enabled
- Try using incognito/private mode to test

## Updating Your App

To update your app after making changes:

```bash
git add .
git commit -m "Update: Description of changes"
git push origin main
```

GitHub Actions will automatically rebuild and deploy!

## Rollback

If something goes wrong:

```bash
git log --oneline
git revert <commit-hash>
git push origin main
```

## Questions?

For more information about GitHub Pages:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite GitHub Pages Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)
