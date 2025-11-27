# Google Calendar Integration Setup

## Overview
This integration allows Life Tracker to sync events with Google Calendar and send reminders to your phone.

## Features
✅ Sync career applications to calendar
✅ Log trades as calendar events
✅ Schedule workouts
✅ Create daily routine reminders
✅ Share calendar link
✅ Phone notifications

---

## Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "Life Tracker"
4. Click "Create"

### 2. Enable Google Calendar API
1. Go to "APIs & Services" → "Library"
2. Search for "Google Calendar API"
3. Click it and press "Enable"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:5173/auth-callback` (dev)
   - `https://eaglepython.github.io/eagle/auth-callback` (production)
5. Copy the Client ID and Client Secret

### 4. Add Credentials to .env
Create `.env.local` in the project root:

```
REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here
REACT_APP_GOOGLE_CALENDAR_API_KEY=your_api_key_here
```

### 5. Create Auth Callback Handler
Add this route to handle OAuth redirect:

```javascript
// pages/auth-callback.js or similar
const getTokenFromCode = async (code) => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code,
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      client_secret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      redirect_uri: window.location.origin + '/auth-callback',
      grant_type: 'authorization_code'
    })
  });
  
  const data = await response.json();
  return data.access_token;
};
```

---

## Phone Reminders

### iOS (Safari)
1. Open the app in Safari
2. Share → Add to Home Screen
3. Grant notification permissions
4. Reminders will arrive as notifications

### Android (Chrome)
1. Open the app in Chrome
2. Menu → Install app
3. Grant notification permissions
4. Reminders will arrive as push notifications

---

## Usage

### Enable Phone Notifications
```javascript
import ReminderSystem from './utils/ReminderSystem';

const reminders = new ReminderSystem(userData);
await reminders.initializeNotifications();
reminders.scheduleDailyReminders();
```

### Sync to Google Calendar
```javascript
import GoogleCalendarIntegration from './utils/GoogleCalendarIntegration';

const calendar = new GoogleCalendarIntegration();
await calendar.syncTrackerEventsToCalendar(userData);
```

### Custom Reminders
```javascript
reminders.scheduleReminder(
  new Date('2025-11-28T14:00:00'),
  'Trading Session',
  { body: 'Time to review your trades' }
);
```

---

## Daily Reminder Schedule

- **5:00 AM** - Morning Routine
- **8:00 AM** - Deep Work Session
- **12:00 PM** - Midday Check
- **2:00 PM** - Trading Session
- **6:00 PM** - Workout Time
- **8:00 PM** - Evening Reflection
- **10:00 PM** - Sleep Prep

---

## Troubleshooting

### Notifications not working
- Check browser notification settings
- Grant permission when prompted
- Ensure app is installed (iOS) or pinned (Android)

### Google Calendar sync fails
- Verify Google credentials are correct
- Check API rate limits
- Ensure authorization token is valid
- Check browser console for errors

### Events not appearing
- Wait 30 seconds for calendar refresh
- Check calendar visibility settings
- Verify calendar ID is correct

---

## Security Notes
⚠️ Never commit `.env` files to GitHub
⚠️ Rotate API keys periodically
⚠️ Use HTTPS only in production
⚠️ Tokens stored in localStorage (consider using secure cookies)

---

## Support
For issues or questions:
1. Check browser console for errors
2. Verify all environment variables are set
3. Test with demo data first
4. Check Google Cloud project permissions
