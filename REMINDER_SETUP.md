# Google Calendar and Reminder Setup

The app can sync tracker events with Google Calendar and send local browser notifications. Google Calendar is optional; tracker data remains in the browser unless you choose to sync events.

## Configure Google Calendar

1. Create or select a project in the [Google Cloud Console](https://console.cloud.google.com/).
2. Enable the **Google Calendar API**.
3. Configure the OAuth consent screen. While the app is in testing, add your Google account as a test user.
4. Create an OAuth client ID with application type **Web application**.
5. Add these **Authorized JavaScript origins**:
   - `http://localhost:5173` for local development
   - `https://eaglepython.github.io` for the hosted app
6. Copy the client ID into `.env.local`:

   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

The app uses Google Identity Services' popup token flow and requests the `https://www.googleapis.com/auth/calendar.events` scope. The scope lets it list and create events. The browser receives a short-lived access token, which stays in memory and is cleared when the page closes. Connect again after a reload or when the token expires.

**Do not configure a client secret or redirect URI.** This static browser app has no server to protect a client secret, and the popup flow does not use an authorization-code callback. If an older version of the app exposed a client secret, rotate it in Google Cloud Console. Legacy access and refresh tokens saved by older versions are cleared when the Calendar integration initializes.

## Use the integration

Open the app's **Reminders** section and select **Connect Google Calendar**. Google opens a consent popup. After granting access, select **Sync to Calendar** to create events from tracker data.

Local notifications work independently of Google Calendar. The browser must grant notification permission, and support varies by browser and device. On mobile, install the app from the browser menu or add it to the home screen for the best notification support.

## Troubleshooting

- **Google sign-in is not configured:** check that `.env.local` contains `VITE_GOOGLE_CLIENT_ID`, then restart the Vite development server.
- **`origin_mismatch`:** add the current site origin under **Authorized JavaScript origins**. Include scheme and host only, with no path or trailing slash.
- **Access blocked:** check the OAuth consent screen's publishing status and add your Google account as a test user if the app is in testing.
- **Calendar API errors:** verify that the Google Calendar API is enabled for the same Cloud project as the OAuth client.
- **Token expired:** connect Google Calendar again from the Reminders section.

Never commit `.env.local`, client secrets, access tokens, or refresh tokens.
