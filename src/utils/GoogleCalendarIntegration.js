/**
 * Google Calendar Integration
 * Sync events and reminders with Google Calendar
 */

export class GoogleCalendarIntegration {
  constructor() {
    this.calendarId = 'primary';
    this.apiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
    this.isAuthenticated = false;
  }

  /**
   * Initialize Google API and get OAuth token
   */
  async initializeGoogleCalendar() {
    // Note: This requires setting up Google OAuth 2.0
    // User needs to authorize the app first
    
    try {
      // Check if token exists in localStorage
      const token = localStorage.getItem('googleCalendarToken');
      if (token) {
        this.isAuthenticated = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Google Calendar initialization error:', error);
      return false;
    }
  }

  /**
   * Get authorization URL for Google OAuth
   */
  getAuthorizationUrl() {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/eagle/auth-callback`;
    const scope = 'https://www.googleapis.com/auth/calendar';

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
  }

  /**
   * Save authentication token
   */
  saveAuthToken(token) {
    localStorage.setItem('googleCalendarToken', token);
    this.isAuthenticated = true;
  }

  /**
   * Create event in Google Calendar
   */
  async createCalendarEvent(event) {
    if (!this.isAuthenticated) {
      console.warn('Not authenticated with Google Calendar');
      return null;
    }

    try {
      const token = localStorage.getItem('googleCalendarToken');
      
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create calendar event');
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
    if (!this.isAuthenticated) return;

    try {
      const events = this.generateTrackerEvents(userData);

      for (const event of events) {
        await this.createCalendarEvent(event);
      }

      console.log(`Synced ${events.length} events to Google Calendar`);
      return true;
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

    // Career application events
    if (userData.applications && userData.applications.length > 0) {
      userData.applications.slice(-5).forEach(app => {
        events.push({
          title: `Career: Application to ${app.company}`,
          description: `Position: ${app.position}\nStatus: ${app.status}`,
          startTime: new Date(app.dateApplied),
          endTime: new Date(new Date(app.dateApplied).getTime() + 3600000)
        });
      });
    }

    // Recent trades
    if (userData.trades && userData.trades.length > 0) {
      userData.trades.slice(-5).forEach(trade => {
        events.push({
          title: `Trading: ${trade.symbol} - ${trade.type}`,
          description: `Entry: ${trade.entry}\nExit: ${trade.exit}\nP&L: $${trade.pnl}`,
          startTime: new Date(trade.entryTime),
          endTime: new Date(new Date(trade.entryTime).getTime() + 3600000)
        });
      });
    }

    // Scheduled workouts
    if (userData.workouts && userData.workouts.length > 0) {
      userData.workouts.filter(w => w.date === today.toISOString().split('T')[0]).forEach(workout => {
        events.push({
          title: `Fitness: ${workout.type}`,
          description: `Duration: ${workout.duration}min\nIntensity: ${workout.intensity}`,
          startTime: today,
          endTime: new Date(today.getTime() + workout.duration * 60000)
        });
      });
    }

    return events;
  }

  /**
   * Get upcoming events from Google Calendar
   */
  async getUpcomingEvents(maxResults = 10) {
    if (!this.isAuthenticated) return null;

    try {
      const token = localStorage.getItem('googleCalendarToken');
      const now = new Date();

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?` +
        `timeMin=${now.toISOString()}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
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
      endTime: new Date(new Date(reminderData.time).getTime() + 1800000) // 30 min duration
    });
  }

  /**
   * Share calendar with view-only link
   */
  async getCalendarLink() {
    if (!this.isAuthenticated) return null;

    try {
      const token = localStorage.getItem('googleCalendarToken');

      // Get calendar details
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const calendar = await response.json();
        return `https://calendar.google.com/calendar/u/0/r?cid=${calendar.id}`;
      }

      return null;
    } catch (error) {
      console.error('Error getting calendar link:', error);
      return null;
    }
  }

  /**
   * Disconnect from Google Calendar
   */
  disconnectCalendar() {
    localStorage.removeItem('googleCalendarToken');
    this.isAuthenticated = false;
  }
}

export default GoogleCalendarIntegration;
