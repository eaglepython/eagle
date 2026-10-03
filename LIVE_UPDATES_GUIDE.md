# Live Updates

## Current behavior

The Live Updates screen displays bundled sample insights for discipline, career, trading, health, and finance. While the page is open, it refreshes the local timestamp and history every two hours. A manual refresh is also available.

The app does **not** currently fetch news, market, job, or research feeds. Treat its cards as examples, not current data. Connecting real feeds requires selecting providers and using a server-side endpoint so private API keys are not exposed in browser code.

## Use the screen

1. Open the app and select **Live Updates** in navigation.
2. Choose a category or expand a card to see its sample insight, suggested action, and source link.
3. Use the refresh control to update the timestamp and local history, or pause automatic refresh.

The timer runs only while the app page is open. Netlify continuous deployment is separate: it rebuilds and republishes app code after pushes to the connected Git branch, but does not update insight content.

## Add actual live sources

Choose the feeds and cadence first. Fetch provider data through a Netlify Function and store private API keys in Netlify environment variables. Do not put private keys in `VITE_*` variables or browser code. Show the source and last successful fetch time, and handle provider failures without presenting sample cards as current data.
