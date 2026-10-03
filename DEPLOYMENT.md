# Deployment

## Deploy on Netlify

The repository includes [`netlify.toml`](netlify.toml), which sets the build command to `npm run build`, publishes `docs/`, and maps `/app` to `app.html`. Vite uses `/` on Netlify and `/eagle/` on GitHub Pages.

1. In Netlify, choose **Add new project → Import an existing project** and connect `eaglepython/eagle` from GitHub.
2. Select `main` as the production branch. Netlify reads the build and publish settings from `netlify.toml` and deploys a new version when commits are pushed to the connected branch.
3. To enable Google Calendar, add `VITE_GOOGLE_CLIENT_ID` under the site's **Environment variables** with the **Builds** scope. It is a public OAuth client ID, not a client secret. Netlify does not read the repository's `.env.local` during hosted builds.
4. After Netlify assigns the site domain, add `http://localhost:5173` and `https://YOUR-SITE.netlify.app` as authorized JavaScript origins for the OAuth Web application client in Google Cloud Console. Add any custom domain origin too.
5. Trigger a deploy after adding the variable or changing OAuth settings.

The Vite build is already verified locally. For local use, put `VITE_GOOGLE_CLIENT_ID` in `.env.local` and run:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

See [REMINDER_SETUP.md](REMINDER_SETUP.md) for Calendar consent and token troubleshooting.

## GitHub Pages (optional)

The existing workflow in `.github/workflows/deploy.yml` also publishes `docs/` to [https://eaglepython.github.io/eagle/](https://eaglepython.github.io/eagle/). Set the `VITE_GOOGLE_CLIENT_ID` Actions repository variable to enable Calendar there.

## User data

Life Tracker data is stored in the browser's local storage. It is not copied to Netlify or GitHub Pages. If you sync events, selected tracker data is sent to Google Calendar only after you connect your account and request a sync.
