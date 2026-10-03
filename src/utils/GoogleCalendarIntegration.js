/**
 * Google Calendar Integration
 * Sync events and reminders with Google Calendar
 */

let sharedTokenClient = null;
let sharedAccessToken = null;
let sharedTokenExpiresAt = 0;

export class GoogleCalendarIntegration {
  constructor() {
    this.calendarId = 'primary';
    this.accessToken = sharedAccessToken;
    this.tokenExpiresAt = sharedTokenExpiresAt;
    this.tokenClient = sharedTokenClient;
    this.isAuthenticated = Boolean(this.accessToken && Date.now() < this.tokenExpiresAt - 30_000);
    this.removeLegacyTokens();
  }

  removeLegacyTokens() {
    // Older versions persisted bearer and refresh tokens in localStorage.
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleRefreshToken');
  }

  /**
   * Load Google Identity Services. No OAuth secrets are used in this browser app.
   */
  async loadGoogleIdentityServices() {
    if (window.google?.accounts?.oauth2) return;

    if (!GoogleCalendarIntegration.gisScriptPromise) {
      GoogleCalendarIntegration.gisScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Google sign-in could not be loaded. Check your connection and try again.'));
        document.head.appendChild(script);
      }).catch((error) => {
        GoogleCalendarIntegration.gisScriptPromise = null;
        throw error;
      });
    }

    await GoogleCalendarIntegration.gisScriptPromise;
  }

  /**
   * Open Google's consent popup. Call from a user click handler.
   */
  connectCalendar() {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new Error('Google Calendar is not configured. Set VITE_GOOGLE_CLIENT_ID in .env.local.');
    }
    if (!window.google?.accounts?.oauth2) {
      throw new Error('Google sign-in is still loading. Try again in a moment.');
    }
    sharedTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events',
      callback: () => {},
    });
    this.tokenClient = sharedTokenClient;

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = (response) => {
        if (response.error) {
          reject(new Error(response.error_description || response.error));
          return;
        }

        this.setAccessToken(response);
        resolve(true);
      };
      this.tokenClient.error_callback = (error) => {
        reject(new Error(error.message || 'Google sign-in was closed before it completed.'));
      };
      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  /**
   * Request a fresh short-lived access token without storing it on disk.
   */
  async refreshAccessToken() {
    this.tokenClient = sharedTokenClient;
    if (!this.tokenClient) {
      this.isAuthenticated = false;
      return false;
    }

    return new Promise((resolve, reject) => {
      this.tokenClient.callback = (response) => {
        if (response.error) {
          this.isAuthenticated = false;
          resolve(false);
          return;
        }
        this.setAccessToken(response);
        resolve(true);
      };
      this.tokenClient.error_callback = () => {
        this.isAuthenticated = false;
        resolve(false);
      };
      this.tokenClient.requestAccessToken({ prompt: '' });
    });
  }

  setAccessToken(response) {
    this.accessToken = response.access_token;
    this.tokenExpiresAt = Date.now() + (Number(response.expires_in) || 3600) * 1000;
    this.isAuthenticated = true;
    sharedAccessToken = this.accessToken;
    sharedTokenExpiresAt = this.tokenExpiresAt;
  }

  async initializeGoogleCalendar() {
    if (!this.accessToken || Date.now() >= this.tokenExpiresAt - 30_000) {
      this.isAuthenticated = false;
      this.accessToken = null;
      return false;
    }
    return true;
  }

  /**
   * Create event in Google Calendar
   */
  async createCalendarEvent(event) {
    if (!this.isAuthenticated || !this.accessToken) {
      console.warn('Not authenticated with Google Calendar');
      return null;
    }

    try {
      const eventData = {
        summary: event.title,
        description: event.description || '',
        start: {
          dateTime: new Date(event.startTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        end: {
          dateTime: new Date(event.endTime).toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'notification', minutes: 15 },
            { method: 'popup', minutes: 5 }
          ]
        }
      };

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        }
      );

      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.createCalendarEvent(event); // Retry with new token
        }
        throw new Error('Token expired and refresh failed');
      }

      if (!response.ok) {
        throw new Error(`Failed to create calendar event: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Calendar event creation error:', error);
      return null;
    }
  }

  /**
   * Sync Life Tracker events to Google Calendar
   */
  async syncTrackerEventsToCalendar(userData) {
    if (!this.isAuthenticated || !this.accessToken) {
      console.warn('Not authenticated with Google Calendar');
      return false;
    }

    try {
      const events = this.generateTrackerEvents(userData);
      let successCount = 0;

      for (const event of events) {
        const result = await this.createCalendarEvent(event);
        if (result) successCount++;
      }

      console.log(`Synced ${successCount}/${events.length} events to Google Calendar`);
      return successCount > 0;
    } catch (error) {
      console.error('Sync error:', error);
      return false;
    }
  }

  /**
   * Generate events from tracker data
   */
  generateTrackerEvents(userData) {
    const events = [];
    const today = new Date();

    // Daily score as event
    if (userData.dailyScores && userData.dailyScores.length > 0) {
      const todayScore = userData.dailyScores.find(s => s.date === today.toISOString().split('T')[0]);
      if (todayScore) {
        events.push({
          title: `Daily Score: ${todayScore.totalScore}/10`,
          description: `Tracked score for today. Discipline = Freedom.`,
          startTime: today,
          endTime: new Date(today.getTime() + 1800000)
        });
      }
    }

    // Career application events
    if (userData.jobApplications && userData.jobApplications.length > 0) {
      userData.jobApplications.slice(-3).forEach(app => {
        events.push({
          title: `Career: ${app.company}`,
          description: `Position: ${app.position || 'N/A'}\nTier: ${app.tier || 'N/A'}\nStatus: ${app.status || 'Applied'}`,
          startTime: new Date(app.date || today),
          endTime: new Date((new Date(app.date || today)).getTime() + 3600000)
        });
      });
    }

    // Recent trades
    if (userData.tradingJournal && userData.tradingJournal.length > 0) {
      userData.tradingJournal.slice(-3).forEach(trade => {
        events.push({
          title: `Trading: ${trade.symbol || 'Trade'} - ${trade.type || 'Unknown'}`,
          description: `Entry: ${trade.entry || 'N/A'}\nExit: ${trade.exit || 'N/A'}\nP&L: $${trade.pnl || 0}`,
          startTime: new Date(trade.entryTime || today),
          endTime: new Date((new Date(trade.entryTime || today)).getTime() + 3600000)
        });
      });
    }

    // Scheduled workouts
    if (userData.workouts && userData.workouts.length > 0) {
      userData.workouts.filter(w => w.date === today.toISOString().split('T')[0]).forEach(workout => {
        events.push({
          title: `Fitness: ${workout.type || 'Workout'}`,
          description: `Duration: ${workout.duration || 0}min\nIntensity: ${workout.intensity || 'Medium'}`,
          startTime: today,
          endTime: new Date(today.getTime() + (workout.duration || 60) * 60000)
        });
      });
    }

    return events;
  }

  /**
   * Get upcoming events from Google Calendar
   */
  async getUpcomingEvents(maxResults = 10) {
    if (!this.isAuthenticated || !this.accessToken) {
      console.warn('Not authenticated with Google Calendar');
      return null;
    }

    try {
      const now = new Date();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?` +
        `timeMin=${now.toISOString()}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (response.status === 401) {
        // Token expired, refresh and retry
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.getUpcomingEvents(maxResults);
        }
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch calendar events: ${response.status}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      return null;
    }
  }

  /**
   * Create reminder-based calendar event
   */
  async createReminderEvent(reminderData) {
    return this.createCalendarEvent({
      title: reminderData.title,
      description: reminderData.message,
      startTime: reminderData.time,
      endTime: new Date(new Date(reminderData.time).getTime() + 1800000)
    });
  }

  /**
   * Disconnect from Google Calendar
   */
  disconnectCalendar() {
    if (this.accessToken && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(this.accessToken, () => {});
    }
    this.removeLegacyTokens();
    this.isAuthenticated = false;
    this.accessToken = null;
    this.tokenExpiresAt = 0;
    this.tokenClient = null;
    sharedAccessToken = null;
    sharedTokenExpiresAt = 0;
    sharedTokenClient = null;
  }
}

GoogleCalendarIntegration.gisScriptPromise = null;
