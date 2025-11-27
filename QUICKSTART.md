# Quick Start Guide

## What You Have

A fully functional React app with 8 different tracking modules:

1. **Dashboard** - Overview of your life metrics
2. **Daily Tracker** - Rate 9 daily categories (1-10 scale)
3. **Weekly Review** - Reflect on wins, metrics, gaps, and next week
4. **Career Tracker** - Log job applications with tier levels
5. **Trading Journal** - Track trades with P&L calculations
6. **Health Tracker** - Log workouts and track minutes
7. **Finance Tracker** - Monitor net worth and savings rate
8. **Goals Manager** - Create and track goals by category

## Getting Started Locally

### 1. Install Dependencies

```bash
cd "c:\Users\josep\Desktop\LIFE TRACKER\life-tracker"
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open your browser and go to: `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

This creates an optimized version in the `dist` folder.

## Deploying to GitHub Pages

### Quick 5-Step Process

1. **Create GitHub Repository**
   - Go to github.com/new
   - Name it: `life-tracker-app`
   - Make it public
   - Click Create

2. **Initialize Git**
   ```bash
   cd "c:\Users\josep\Desktop\LIFE TRACKER\life-tracker"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/life-tracker-app.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as source
   - Done! (No need to do anything else)

4. **GitHub Actions Will Deploy Automatically**
   - Your app builds and deploys on every push
   - Takes 1-2 minutes
   - No manual deployment needed!

5. **Access Your App**
   ```
   https://YOUR_USERNAME.github.io/life-tracker-app/
   ```

## Features

### Data Storage
- ✅ All data stored locally in your browser (localStorage)
- ✅ No backend server needed
- ✅ Completely private
- ✅ Data persists between sessions

### UI/UX
- ✅ Beautiful glassmorphism design
- ✅ Responsive on mobile, tablet, desktop
- ✅ Real-time clock display
- ✅ Animated notifications
- ✅ Visual progress indicators

### Tracking
- ✅ Daily scores with 9 categories
- ✅ Weekly reflections
- ✅ Job application management
- ✅ Trading P&L calculations
- ✅ Workout tracking
- ✅ Financial milestones
- ✅ Goal management

## File Structure

```
life-tracker/
├── .github/workflows/deploy.yml    # Auto-deployment config
├── src/
│   ├── components/                 # 12 React components
│   ├── App.jsx                     # Main app component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind styles
├── index.html                      # HTML template
├── vite.config.js                  # Build config
├── package.json                    # Dependencies
├── README.md                        # Full documentation
└── DEPLOYMENT.md                   # Detailed deployment guide
```

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run deploy   # Build and deploy to GitHub Pages
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Ultra-fast build tool
- **Tailwind CSS** - Beautiful styling
- **Chart.js** - Data visualization
- **date-fns** - Date utilities

## Next Steps

1. Run the app locally: `npm run dev`
2. Test all features and add your data
3. Create a GitHub repository
4. Deploy using GitHub Pages
5. Share your live app URL!

## Support

- 📖 Full docs in `README.md`
- 🚀 Deployment guide in `DEPLOYMENT.md`
- 🐛 Check GitHub Actions logs for any build errors

Enjoy tracking your life excellence! 🚀
