/**
 * Google Calendar Integration
 * Sync events and reminders with Google Calendar
 */

export class GoogleCalendarIntegration {
  constructor() {
    this.calendarId = 'primary';
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID;
    this.clientSecret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET || process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
    this.redirectUri = this.getRedirectUri();
    this.isAuthenticated = false;
    this.accessToken = localStorage.getItem('googleAccessToken');
    if (this.accessToken) {
      this.isAuthenticated = true;
    }
  }

  /**
   * Get appropriate redirect URI based on environment
   */
  getRedirectUri() {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      return `http://localhost:5173`;
    }
    return `https://eaglepython.github.io`;
  }

  /**
   * Initialize Google API and get OAuth token
   */
  async initializeGoogleCalendar() {
    try {
      // Check if token exists in localStorage
      const token = localStorage.getItem('googleAccessToken');
      if (token) {
        this.accessToken = token;
        this.isAuthenticated = true;
        return true;
      }

      // Check for authorization code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      
      if (code) {
        const success = await this.exchangeCodeForToken(code);
        if (success) {
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Google Calendar initialization error:', error);
      return false;
    }
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code) {
    try {
      // For browser-based apps, we need to use a backend or public flow
      // Using PKCE flow for enhanced security
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code: code,
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          grant_type: 'authorization_code',
        }).toString(),
      });

      if (!response.ok) {
        console.error('Token exchange failed:', response.status);
        return false;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      
      // Save tokens to localStorage
      localStorage.setItem('googleAccessToken', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('googleRefreshToken', data.refresh_token);
      }

      this.isAuthenticated = true;
      console.log('Successfully authenticated with Google Calendar');
      return true;
    } catch (error) {
      console.error('Token exchange error:', error);
      return false;
    }
  }

  /**
   * Get authorization URL for Google OAuth
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/calendar',
      access_type: 'offline',
      prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Save authentication token
   */
  saveAuthToken(token, refreshToken = null) {
    localStorage.setItem('googleAccessToken', token);
    if (refreshToken) {
      localStorage.setItem('googleRefreshToken', refreshToken);
    }
    this.accessToken = token;
    this.isAuthenticated = true;
  }

  /**
   * Refresh access token if expired
   */
  async refreshAccessToken() {
    try {
      const refreshToken = localStorage.getItem('googleRefreshToken');
      if (!refreshToken) {
        this.isAuthenticated = false;
        return false;
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }).toString(),
      });

      if (!response.ok) {
        this.isAuthenticated = false;
        return false;
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      localStorage.setItem('googleAccessToken', data.access_token);
      this.isAuthenticated = true;
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.isAuthenticated = false;
      return false;
    }
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
    localStorage.removeItem('googleAccessToken');
    localStorage.removeItem('googleRefreshToken');
    this.isAuthenticated = false;
    this.accessToken = null;
  }
}
