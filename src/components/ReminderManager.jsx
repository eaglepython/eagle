import React, { useState, useEffect } from 'react';
import ReminderSystem from '../utils/ReminderSystem';
import GoogleCalendarIntegration from '../utils/GoogleCalendarIntegration';
import { NavIcons } from './IconSystem';

function ReminderManager({ userData, addNotification }) {
  const [reminders, setReminders] = useState([]);
  const [reminderSystem, setReminderSystem] = useState(null);
  const [calendarIntegration, setCalendarIntegration] = useState(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customReminder, setCustomReminder] = useState({
    title: '',
    time: '',
    enabled: true
  });

  useEffect(() => {
    // Initialize reminder system
    const remindersys = new ReminderSystem(userData);
    setReminderSystem(remindersys);

    // Initialize Google Calendar
    const calendarInt = new GoogleCalendarIntegration();
    setCalendarIntegration(calendarInt);

    // Check if Google Calendar is connected
    const isConnected = localStorage.getItem('googleCalendarToken') !== null;
    setIsGoogleConnected(isConnected);

    // Load saved reminders
    const savedReminders = JSON.parse(localStorage.getItem('customReminders') || '[]');
    setReminders(savedReminders);

    // Schedule daily reminders
    remindersys.scheduleDailyReminders();

    return () => {
      if (remindersys) {
        remindersys.cancelAllReminders();
      }
    };
  }, [userData]);

  /**
   * Enable phone notifications
   */
  const enableNotifications = async () => {
    if (!reminderSystem) return;

    const granted = await reminderSystem.initializeNotifications();
    if (granted) {
      addNotification('Phone notifications enabled! You\'ll receive alerts for important events.', 'success');
    } else {
      addNotification('Notification permission denied. Enable in browser settings.', 'error');
    }
  };

  /**
   * Connect to Google Calendar
   */
  const connectGoogleCalendar = () => {
    if (!calendarIntegration) return;

    const authUrl = calendarIntegration.getAuthorizationUrl();
    window.location.href = authUrl;
  };

  /**
   * Disconnect Google Calendar
   */
  const disconnectGoogleCalendar = () => {
    if (calendarIntegration) {
      calendarIntegration.disconnectCalendar();
      setIsGoogleConnected(false);
      addNotification('Disconnected from Google Calendar', 'info');
    }
  };

  /**
   * Sync to Google Calendar
   */
  const syncToGoogleCalendar = async () => {
    if (!calendarIntegration || !isGoogleConnected) {
      addNotification('Connect to Google Calendar first', 'warning');
      return;
    }

    addNotification('Syncing events to Google Calendar...', 'info');
    const success = await calendarIntegration.syncTrackerEventsToCalendar(userData);

    if (success) {
      addNotification('Events synced to Google Calendar!', 'success');
    } else {
      addNotification('Failed to sync events', 'error');
    }
  };

  /**
   * Add custom reminder
   */
  const addCustomReminder = () => {
    if (!customReminder.title || !customReminder.time) {
      addNotification('Please fill in title and time', 'warning');
      return;
    }

    const newReminder = {
      id: `reminder_${Date.now()}`,
      ...customReminder,
      created: new Date().toISOString()
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    localStorage.setItem('customReminders', JSON.stringify(updated));

    // Schedule the reminder
    if (reminderSystem) {
      reminderSystem.scheduleReminder(
        new Date(customReminder.time),
        customReminder.title,
        { body: 'Reminder from Life Tracker' }
      );
    }

    setCustomReminder({ title: '', time: '', enabled: true });
    addNotification('Reminder added!', 'success');
  };

  /**
   * Delete reminder
   */
  const deleteReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id);
    setReminders(updated);
    localStorage.setItem('customReminders', JSON.stringify(updated));

    if (reminderSystem) {
      reminderSystem.cancelReminder(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Phone Notifications */}
      <div className="glass rounded-2xl p-6 border border-blue-900/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">PHONE NOTIFICATIONS</h3>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-800/30 mb-4">
          <p className="text-slate-300 text-sm mb-4">
            Enable push notifications to get reminders on your phone for important events, daily routines, and goal targets.
          </p>
          <button
            onClick={enableNotifications}
            className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 text-blue-300 rounded-lg hover:bg-blue-600/30 transition text-sm font-semibold"
          >
            Enable Phone Notifications
          </button>
        </div>

        {/* Daily Reminders Info */}
        <div className="text-xs text-slate-400 space-y-1">
          <div>📅 Daily reminders scheduled:</div>
          <div>• 5:00 AM - Morning Routine</div>
          <div>• 8:00 AM - Deep Work Session</div>
          <div>• 12:00 PM - Midday Check</div>
          <div>• 2:00 PM - Trading Session</div>
          <div>• 6:00 PM - Workout Time</div>
          <div>• 8:00 PM - Evening Reflection</div>
          <div>• 10:00 PM - Sleep Prep</div>
        </div>
      </div>

      {/* Google Calendar Integration */}
      <div className="glass rounded-2xl p-6 border border-red-900/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">GOOGLE CALENDAR SYNC</h3>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-red-800/30 mb-4">
          {!isGoogleConnected ? (
            <div>
              <p className="text-slate-300 text-sm mb-4">
                Connect your Google Calendar to automatically sync all your Life Tracker events, reminders, and goals.
              </p>
              <button
                onClick={connectGoogleCalendar}
                className="px-4 py-2 bg-red-600/20 border border-red-600/50 text-red-300 rounded-lg hover:bg-red-600/30 transition text-sm font-semibold"
              >
                Connect Google Calendar
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-300 font-semibold text-sm">Connected to Google Calendar</span>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={syncToGoogleCalendar}
                  className="w-full px-4 py-2 bg-green-600/20 border border-green-600/50 text-green-300 rounded-lg hover:bg-green-600/30 transition text-sm font-semibold"
                >
                  Sync Events Now
                </button>
                <button
                  onClick={disconnectGoogleCalendar}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition text-sm font-semibold"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-400">
          Syncs: Career applications • Trading events • Workouts • Daily scores
        </div>
      </div>

      {/* Custom Reminders */}
      <div className="glass rounded-2xl p-6 border border-purple-900/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 9v4m3-1h-6" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">CUSTOM REMINDERS</h3>
        </div>

        <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-800/30 mb-4 space-y-3">
          <input
            type="text"
            placeholder="Reminder title"
            value={customReminder.title}
            onChange={(e) => setCustomReminder({ ...customReminder, title: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-purple-600"
          />
          <input
            type="datetime-local"
            value={customReminder.time}
            onChange={(e) => setCustomReminder({ ...customReminder, time: e.target.value })}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-purple-600"
          />
          <button
            onClick={addCustomReminder}
            className="w-full px-4 py-2 bg-purple-600/20 border border-purple-600/50 text-purple-300 rounded-lg hover:bg-purple-600/30 transition text-sm font-semibold"
          >
            Add Reminder
          </button>
        </div>

        {/* List of reminders */}
        {reminders.length > 0 && (
          <div className="space-y-2">
            {reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <div className="text-sm">
                  <div className="text-white font-semibold">{reminder.title}</div>
                  <div className="text-xs text-slate-400">
                    {new Date(reminder.time).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-400 hover:text-red-300 transition text-xs font-semibold"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="glass rounded-2xl p-6 border border-slate-800/50">
        <h3 className="text-lg font-bold text-white mb-3">REMINDER STATUS</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <div className="text-slate-400 text-xs">Phone Notifications</div>
            <div className="text-white font-semibold mt-1">
              {typeof Notification !== 'undefined' && Notification.permission === 'granted' ? '✓ Enabled' : '✗ Disabled'}
            </div>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <div className="text-slate-400 text-xs">Google Calendar</div>
            <div className="text-white font-semibold mt-1">
              {isGoogleConnected ? '✓ Connected' : '✗ Disconnected'}
            </div>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <div className="text-slate-400 text-xs">Custom Reminders</div>
            <div className="text-white font-semibold mt-1">{reminders.length} active</div>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <div className="text-slate-400 text-xs">Daily Reminders</div>
            <div className="text-white font-semibold mt-1">7 scheduled</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReminderManager;
