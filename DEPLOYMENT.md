# Deployment

This repository deploys to GitHub Pages at [https://eaglepython.github.io/eagle/](https://eaglepython.github.io/eagle/) through the workflow in `.github/workflows/deploy.yml`.

## One-time GitHub Pages setup

1. Open **Settings → Pages** in the `eaglepython/eagle` repository.
2. Set the Pages source to **GitHub Actions**.
3. For Google Calendar, add the public OAuth client ID as an Actions repository variable named `VITE_GOOGLE_CLIENT_ID` under **Settings → Secrets and variables → Actions → Variables**. This value is a client identifier, not a client secret.
4. In Google Cloud Console, enable the Google Calendar API, configure the OAuth consent screen, and add `http://localhost:5173` and `https://eaglepython.github.io` as authorized JavaScript origins for the Web application client.

Pushing to `main` runs `npm ci`, builds the app into `docs/`, and deploys that folder to Pages. The build workflow reads `VITE_GOOGLE_CLIENT_ID` from the repository variable. Local builds read the same variable from `.env.local`.

## Local build

```bash
npm ci
npm run dev
npm run build
npm run preview
```

The Vite base path is `/eagle/`, matching the GitHub Pages project URL. Do not change it to `/` unless deploying to a user or organization site.

See [REMINDER_SETUP.md](REMINDER_SETUP.md) for Google Calendar consent, token handling, and troubleshooting.

## User data

Life Tracker data is stored in the browser's local storage. It is not copied to GitHub Pages. If you sync events, the selected tracker data is sent to Google Calendar only after you connect your account and request a sync.
