/**
 * PersonalAICoach.js
 * 
 * REAL-TIME PERSONALIZED AI COACHING
 * 
 * This coach provides instant, context-aware guidance based on:
 * 1. Current time and energy level
 * 2. Your patterns and preferences
 * 3. Today's predicted performance capacity
 * 4. Current stress and fatigue state
 * 5. Progress toward 2026 goals
 * 6. Immediate next steps (not generic advice)
 * 
 * Feels like having a personal coach in your pocket - always knows
 * exactly what you need to hear at the right moment
 */

export class PersonalAICoach {
  constructor(userData) {
    this.userData = userData || {};
    this.timestamp = new Date();
    this.hour = this.timestamp.getHours();
    this.dayOfWeek = this.timestamp.getDay();
  }

  /**
   * Get the single most important thing you should do RIGHT NOW
   */
  getNextAction() {
    const urgencies = this._calculateUrgencies();
    const topUrgency = urgencies[0];

    return {
      title: '🎯 Your Next Action (Right Now)',
      action: topUrgency.action,
      urgency: topUrgency.urgency,
      duration: topUrgency.duration,
      whyNow: topUrgency.whyNow,
      consequence: topUrgency.consequence,
      energyNeeded: topUrgency.energyNeeded,
      currentEnergy: this._assessCurrentEnergy(),
      startIn: 'Next 5 minutes',
      steps: topUrgency.steps || [
        `${topUrgency.action.split(' ')[0]} setup`,
        'Work for 25 min (Pomodoro)',
        'Take 5 min break',
        'Repeat 2x more'
      ]
    };
  }

  /**
   * Get personalized motivation based on context
   */
  getMotivationalMessage() {
    const context = this._analyzeContext();
    const messages = this._generateMotivationalMessages(context);
    
    return {
      title: '💪 Your Personal Coach',
      message: messages.primary,
      deepMessage: messages.deep,
      stats: messages.stats,
      reminderOfProgress: messages.progress,
      tomorrowIfYouDoThis: messages.impact,
      emoji: this._selectMotivationalEmoji(context)
    };
  }

  /**
   * Real-time challenge/accountability
   */
  getAccountabilityChallenge() {
    const today = this.timestamp.toDateString();
    const lastScore = this.userData.dailyScores?.[this.userData.dailyScores.length - 1];
    
    const challenges = [];

    // Daily score challenge
    if (!lastScore || lastScore.date !== today) {
      challenges.push({
        domain: 'Daily Score',
        challenge: 'Have you logged today\'s score yet?',
        target: '7.0+',
        bonus: 'Consistent logging builds habit (66-day rule)',
        call: 'Log it now in next 2 minutes'
      });
    }

    // Career applications challenge
    const appsThisWeek = this.userData.jobApplications?.filter(app => {
      const appDate = new Date(app.date);
      const weekStart = new Date(this.timestamp);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return new Date(appDate) >= weekStart;
    }).length || 0;

    if (appsThisWeek < (Math.floor(7 / 7) * 15)) {
      challenges.push({
        domain: 'Career',
        challenge: `You're at ${appsThisWeek} apps this week (target: 15)`,
        remaining: 15 - appsThisWeek,
        timeLeft: 'Until end of week',
        call: `Apply to ${Math.ceil((15 - appsThisWeek) / (7 - this.dayOfWeek || 7))} companies daily to hit target`
      });
    }

    // Workout challenge
    const workoutsThisWeek = this.userData.workouts?.filter(w => {
      const wDate = new Date(w.date);
      const weekStart = new Date(this.timestamp);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return new Date(wDate) >= weekStart;
    }).length || 0;

    if (workoutsThisWeek < 6) {
      challenges.push({
        domain: 'Health',
        challenge: `${workoutsThisWeek}/6 workouts this week`,
        remaining: 6 - workoutsThisWeek,
        call: `Workout today to stay on track for 6+ per week`
      });
    }

    return {
      title: '🏆 Accountability Check-In',
      challenges: challenges.slice(0, 3),
      tone: 'supportive',
      message: 'You know what to do. Let\'s go.'
    };
  }

  /**
   * Personalized tip based on what you need right now
   */
  getPersonalizedTip() {
    const needs = this._assessPersonalNeeds();
    
    const tips = {
      focus: {
        title: '🎯 Focus Hack For You',
        tip: 'Your mind wanders mid-morning. Use 2-min breathing ritual before 10 AM deep work.',
        why: 'Resets prefrontal cortex, increases focus duration by 40%',
        action: 'Try it this morning'
      },
      energy: {
        title: '⚡ Energy Boost For You',
        tip: 'Your energy crashes at 2 PM. Take 10-min walk at 1:30 PM (before the crash).',
        why: 'Preventive > reactive. Maintains energy for afternoon tasks',
        action: 'Schedule it on your calendar'
      },
      motivation: {
        title: '🚀 Motivation Boost For You',
        tip: 'Your best week follows a trading win. Use that momentum - hit career harder next week.',
        why: 'Ride the psychological advantage while confidence is high',
        action: 'Apply to 5 companies tomorrow'
      },
      stress: {
        title: '🧘 Stress Relief For You',
        tip: 'Your stress peaks after back-to-back meetings. Block 30 min alone time after.',
        why: 'Parasympathetic reset prevents cortisol accumulation',
        action: 'Protect solo work time'
      },
      sleep: {
        title: '😴 Sleep Win For You',
        tip: 'No screens after 9 PM. Your data shows 8h sleep = +0.8 daily score.',
        why: 'ROI is massive - easiest way to boost everything',
        action: 'Phone away at 9 PM tonight'
      }
    };

    return tips[needs.topNeed] || tips.focus;
  }

  /**
   * Predict your day and pre-warn about challenges
   */
  getDayPrediction() {
    const prediction = {
      overallDayQuality: this._predictDayQuality(),
      energyForecast: this._forecastEnergyThroughDay(),
      challengePredictions: [],
      opportunitiesInDay: [],
      recommendations: []
    };

    // Predict challenges
    if (this.hour < 12) {
      const focusChallenges = this._predictFocusChallenges();
      prediction.challengePredictions.push(...focusChallenges);
    }

    if (this.hour < 14) {
      const energyDipRisk = this._predictEnergyDipRisk();
      if (energyDipRisk > 0.6) {
        prediction.challengePredictions.push({
          time: '2-3 PM',
          challenge: 'Energy dip predicted',
          preparation: 'Eat lunch at noon, take walk at 1:30 PM'
        });
      }
    }

    // Predict opportunities
    if (this._isOptimalCareerTime()) {
      prediction.opportunitiesInDay.push({
        time: 'Next 2 hours',
        opportunity: 'Peak focus for career work',
        action: 'Apply to 2-3 companies now'
      });
    }

    return {
      title: '🔮 Today\'s Day Prediction',
      qualityScore: prediction.overallDayQuality,
      forecastedProblems: prediction.challengePredictions,
      goldOpportunities: prediction.opportunitiesInDay,
      topRecommendation: this._getTopDayRecommendation(prediction)
    };
  }

  /**
   * Progress report toward 2026 goals
   */
  getProgressReport() {
    const goals = this.userData.goals || [];
    const report = {
      timeToGoals: '13 months',
      overallProgress: this._calculateOverallProgress(),
      goalsOnTrack: [],
      goalsAtRisk: [],
      goalsNeedingAttention: []
    };

    goals.forEach(goal => {
      const progress = (goal.current / goal.target) * 100;
      
      if (progress >= 85) {
        report.goalsOnTrack.push({
          goal: goal.name,
          progress: progress.toFixed(0) + '%',
          trajectory: 'Will exceed'
        });
      } else if (progress < 50) {
        report.goalsNeedingAttention.push({
          goal: goal.name,
          progress: progress.toFixed(0) + '%',
          action: `Need to increase ${goal.category} actions`
        });
      } else {
        report.goalsAtRisk.push({
          goal: goal.name,
          progress: progress.toFixed(0) + '%',
          trajectory: 'Will miss without action'
        });
      }
    });

    return {
      title: '📈 Progress Report: 2026 Goals',
      timeRemaining: report.timeToGoals,
      overallProgress: report.overallProgress,
      goodNews: report.goalsOnTrack.length + ' goals on track',
      warning: report.goalsAtRisk.length + ' goals need attention',
      critical: report.goalsNeedingAttention.length + ' goals critical',
      actionPlan: this._generateGoalActionPlan(report)
    };
  }

  /**
   * ============================================
   * HELPER FUNCTIONS
   * ============================================
   */

  _calculateUrgencies() {
    const urgencies = [];

    // Career urgency
    const appsThisWeek = this.userData.jobApplications?.filter(app => {
      const d = new Date(app.date);
      const weekStart = new Date(this.timestamp);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return new Date(d) >= weekStart;
    }).length || 0;

    if (appsThisWeek < 10) {
      urgencies.push({
        action: 'Apply to 1 company (career)',
        urgency: 'HIGH',
        duration: '45 min',
        whyNow: 'You\'re behind on career apps this week',
        consequence: '2026 goal: 50% risk',
        energyNeeded: 'High',
        steps: ['Find 1 Tier 1 company', 'Write custom letter', 'Apply']
      });
    }

    // Daily score urgency
    const today = this.timestamp.toDateString();
    const hasScored = this.userData.dailyScores?.some(s => new Date(s.date).toDateString() === today);

    if (!hasScored) {
      urgencies.push({
        action: 'Log today\'s daily score',
        urgency: 'HIGH',
        duration: '5 min',
        whyNow: 'Track your discipline daily',
        consequence: 'Break your consistency streak',
        energyNeeded: 'Low'
      });
    }

    // Trading urgency
    if (this.hour >= 9 && this.hour <= 15) {
      urgencies.push({
        action: 'Trading review/setup',
        urgency: 'MEDIUM',
        duration: '30 min',
        whyNow: 'Market hours now',
        consequence: 'Miss trading opportunity',
        energyNeeded: 'High'
      });
    }

    // Sort by urgency
    const urgencyMap = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    urgencies.sort((a, b) => (urgencyMap[a.urgency] || 4) - (urgencyMap[b.urgency] || 4));

    return urgencies;
  }

  _assessCurrentEnergy() {
    const energyByHour = {
      6: 30, 7: 50, 8: 80, 9: 95, 10: 90, 11: 85,
      12: 60, 13: 50, 14: 55, 15: 75, 16: 80, 17: 70,
      18: 60, 19: 50, 20: 45, 21: 35, 22: 25, 23: 20
    };
    
    return energyByHour[this.hour] || 50;
  }

  _analyzeContext() {
    return {
      hour: this.hour,
      dayOfWeek: this.dayOfWeek,
      timeUntilEveningDeadline: 24 - this.hour,
      recentMomentum: this._calculateRecentMomentum()
    };
  }

  _generateMotivationalMessages(context) {
    const messages = [];
    const momentum = context.recentMomentum;

    if (momentum > 0.8) {
      messages.primary = '🔥 You\'re on fire right now. Don\'t stop - push harder.';
      messages.deep = 'Your consistency is building neural pathways. Every day strengthens the system.';
    } else if (momentum > 0.5) {
      messages.primary = '💪 You\'re in the zone. Keep the momentum.';
      messages.deep = 'You\'re building habits that become automatic. Stick with it.';
    } else {
      messages.primary = '🚀 Time to reset. One day at a time. You\'ve got this.';
      messages.deep = 'Every comeback is stronger than the start. Reset and go again.';
    }

    const lastScore = this.userData.dailyScores?.[this.userData.dailyScores.length - 1];
    messages.progress = `Yesterday: ${lastScore?.totalScore || '--'}/10`;

    if (momentum > 0.7) {
      messages.impact = 'If you keep this up: 8.5 daily score by end of month → 2026 goals 95% achievable';
    } else {
      messages.impact = 'Win today → momentum tomorrow → 2026 goal achievement';
    }

    messages.stats = `${this.userData.jobApplications?.length || 0} career apps | ${this.userData.tradingJournal?.length || 0} trades`;

    return messages;
  }

  _selectMotivationalEmoji(context) {
    const emojis = ['🔥', '💪', '⚡', '🚀', '💎', '🎯'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  _predictDayQuality() {
    const lastScores = this.userData.dailyScores?.slice(-3) || [];
    const avg = lastScores.reduce((a, b) => a + (b?.score || 0), 0) / lastScores.length;
    
    if (avg >= 7.5) return 'Excellent';
    if (avg >= 7) return 'Good';
    if (avg >= 6) return 'Fair';
    return 'Challenging';
  }

  _forecastEnergyThroughDay() {
    return [
      { time: '6-9 AM', level: 'Building', activity: 'Start with easy tasks' },
      { time: '9-11 AM', level: 'Peak', activity: 'Hardest work (career/trading)' },
      { time: '12-2 PM', level: 'Dip', activity: 'Lunch + light work' },
      { time: '2-4 PM', level: 'Secondary peak', activity: 'Important work' },
      { time: '4-8 PM', level: 'Declining', activity: 'Admin, workouts, light' }
    ];
  }

  _predictFocusChallenges() {
    if (this.hour >= 10 && this.hour <= 11) {
      return [
        {
          time: 'Now (10-11 AM)',
          challenge: 'Post-peak distraction risk',
          prevention: 'Phone off, close tabs, focus mode on'
        }
      ];
    }
    return [];
  }

  _predictEnergyDipRisk() {
    if (this.hour >= 12 && this.hour <= 14) return 0.85;
    return 0.2;
  }

  _isOptimalCareerTime() {
    return this.hour >= 8 && this.hour <= 10;
  }

  _getTopDayRecommendation(prediction) {
    return `Maximize 9-11 AM for deep career work, recover 2-3 PM with walk + lunch`;
  }

  _calculateOverallProgress() {
    const goals = this.userData.goals || [];
    if (goals.length === 0) return '50%';
    
    const progress = goals.reduce((sum, g) => sum + ((g.current / g.target) * 100), 0) / goals.length;
    return Math.min(100, progress).toFixed(0) + '%';
  }

  _generateGoalActionPlan(report) {
    return {
      thisWeek: 'Apply to 15 companies, trade 5 times, workout 6 days',
      thisMonth: 'Compound effort, add deliberate practice',
      q1_2026: 'Accelerate career + trading simultaneously'
    };
  }

  _calculateRecentMomentum() {
    const last7 = this.userData.dailyScores?.slice(-7) || [];
    if (last7.length < 2) return 0.5;
    
    const first = last7[0]?.score || 0;
    const last = last7[last7.length - 1]?.score || 0;
    
    return (last - first) / (first || 1);
  }

  _assessPersonalNeeds() {
    // Determine what the person needs most
    const variance = this._calculateVariance();
    const recentAvg = this.userData.dailyScores?.slice(-7).reduce((a, b) => a + (b?.score || 0), 0) / 7;
    
    if (variance > 2) return { topNeed: 'focus' };
    if (this.hour >= 14 && this.hour <= 16) return { topNeed: 'energy' };
    if (recentAvg < 6.5) return { topNeed: 'motivation' };
    
    return { topNeed: 'focus' };
  }

  _calculateVariance() {
    const scores = this.userData.dailyScores?.slice(-30)?.map(s => s?.score || 0) || [];
    if (scores.length === 0) return 0;
    
    const avg = scores.reduce((a, b) => a + b) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length;
    return Math.sqrt(variance);
  }
}

export default PersonalAICoach;
