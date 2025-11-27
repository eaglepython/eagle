/**
 * Phone Reminder & Notification System
 * Integrates with browser notifications and calendar sync
 */

export class ReminderSystem {
  constructor(userData) {
    this.userData = userData;
    this.reminders = [];
    this.initializeNotifications();
  }

  /**
   * Request permission for notifications
   */
  async initializeNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Notification permission error:', error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  }

  /**
   * Send immediate notification to phone
   */
  async sendNotification(title, options = {}) {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (Notification.permission !== 'granted') {
      const granted = await this.initializeNotifications();
      if (!granted) return false;
    }

    try {
      const notification = new Notification(title, {
        icon: '/eagle/assets/logo-icon.png',
        badge: '/eagle/assets/badge.png',
        tag: options.tag || 'life-tracker',
        requireInteraction: options.requireInteraction || false,
        ...options
      });

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) options.onClick();
      };

      return true;
    } catch (error) {
      console.error('Notification error:', error);
      return false;
    }
  }

  /**
   * Schedule reminder for specific time
   */
  scheduleReminder(time, title, options = {}) {
    const now = new Date();
    const reminderTime = new Date(time);
    const delay = reminderTime - now;

    if (delay < 0) {
      console.warn('Reminder time is in the past');
      return null;
    }

    const reminderId = `reminder_${Date.now()}`;
    
    const timeout = setTimeout(() => {
      this.sendNotification(title, {
        ...options,
        tag: reminderId
      });

      // Store in localStorage
      this.saveReminderLog(title, reminderTime);
    }, delay);

    this.reminders.push({
      id: reminderId,
      time: reminderTime,
      title,
      timeout,
      options
    });

    return reminderId;
  }

  /**
   * Daily routine reminders
   */
  scheduleDailyReminders() {
    const reminders = [
      { time: '05:00', title: 'Morning Routine', message: 'Start your morning discipline - score all 9 categories today' },
      { time: '08:00', title: 'Deep Work Session', message: 'Time for deep work - 90 minutes focus block' },
      { time: '12:00', title: 'Midday Check', message: 'Check your progress - career applications due?' },
      { time: '14:00', title: 'Trading Session', message: 'Market analysis and trading journal update' },
      { time: '18:00', title: 'Workout Time', message: 'Fitness routine - log your workout' },
      { time: '20:00', title: 'Evening Reflection', message: 'Daily score evaluation and category scoring' },
      { time: '22:00', title: 'Sleep Prep', message: 'Wind down - prepare for quality sleep' }
    ];

    reminders.forEach(reminder => {
      const [hours, minutes] = reminder.time.split(':');
      const today = new Date();
      today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      this.scheduleReminder(today, reminder.title, {
        body: reminder.message,
        tag: `daily_${reminder.time}`
      });
    });
  }

  /**
   * Career-focused reminders
   */
  scheduleCareerReminders(applicationsThisWeek = 0, target = 15) {
    const remaining = target - applicationsThisWeek;

    if (remaining > 0) {
      const message = `${remaining} applications needed this week to hit your ${target}/week target`;
      
      this.scheduleReminder(this.getNextTime(10, 0), 'Career Push', {
        body: message,
        tag: 'career_reminder'
      });
    }
  }

  /**
   * Trading reminders
   */
  scheduleTradingReminders(recentWinRate = 0) {
    if (recentWinRate < 0.55) {
      this.scheduleReminder(this.getNextTime(14, 0), 'Trading Analysis', {
        body: 'Win rate below 55%. Review your trading strategy and recent trades.',
        tag: 'trading_reminder'
      });
    }
  }

  /**
   * Health & fitness reminders
   */
  scheduleHealthReminders(workoutsThisWeek = 0, target = 6) {
    const remaining = target - workoutsThisWeek;

    if (remaining > 0) {
      this.scheduleReminder(this.getNextTime(6, 0), 'Workout Due', {
        body: `${remaining} more workouts needed to hit ${target}/week. Let's go!`,
        tag: 'health_reminder'
      });
    }
  }

  /**
   * Get next occurrence of a time
   */
  getNextTime(hours, minutes) {
    const next = new Date();
    next.setHours(hours, minutes, 0, 0);

    if (next <= new Date()) {
      next.setDate(next.getDate() + 1);
    }

    return next;
  }

  /**
   * Save reminder log to localStorage
   */
  saveReminderLog(title, time) {
    const logs = JSON.parse(localStorage.getItem('reminderLogs') || '[]');
    logs.push({
      title,
      time: time.toISOString(),
      delivered: new Date().toISOString()
    });

    // Keep only last 100 reminders
    if (logs.length > 100) {
      logs.shift();
    }

    localStorage.setItem('reminderLogs', JSON.stringify(logs));
  }

  /**
   * Cancel reminder
   */
  cancelReminder(reminderId) {
    const reminder = this.reminders.find(r => r.id === reminderId);
    if (reminder) {
      clearTimeout(reminder.timeout);
      this.reminders = this.reminders.filter(r => r.id !== reminderId);
      return true;
    }
    return false;
  }

  /**
   * Cancel all reminders
   */
  cancelAllReminders() {
    this.reminders.forEach(reminder => clearTimeout(reminder.timeout));
    this.reminders = [];
  }
}

export default ReminderSystem;
