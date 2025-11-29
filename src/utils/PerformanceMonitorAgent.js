/**
 * PerformanceMonitorAgent.js
 * 
 * Real-Time Performance Tracking & Optimization Metrics
 * 
 * Monitors:
 * - Consistency streaks (neuroplasticity building)
 * - Deep work hours (productivity)
 * - Distraction incidents (focus quality)
 * - Energy levels (burnout risk)
 * - Goal progress velocity (achievement trajectory)
 * - Habit automation (willpower savings)
 * - Sleep quality impact (cognitive function)
 * - Stress resilience (emotional management)
 */

export class PerformanceMonitorAgent {
  constructor(userData) {
    this.userData = userData || {};
    this.dailyScores = userData.dailyScores || [];
    this.jobApplications = userData.jobApplications || [];
    this.tradingJournal = userData.tradingJournal || [];
    this.workouts = userData.workouts || [];
    this.goals = userData.goals || [];
  }

  /**
   * Get real-time performance dashboard metrics
   */
  getPerformanceDashboard() {
    return {
      consistency: this._trackConsistencyStreak(),
      productivity: this._trackProductivity(),
      focus: this._trackFocusQuality(),
      energy: this._trackEnergyMetrics(),
      goalVelocity: this._trackGoalVelocity(),
      habitAutomation: this._trackHabitAutomation(),
      sleepImpact: this._trackSleepImpact(),
      stressResilience: this._trackStressResilience(),
      overallScore: this._calculateOptimizationScore(),
      weeklyTrend: this._calculateWeeklyTrend(),
      predictedMonthlyScore: this._predictMonthlyScore()
    };
  }

  /**
   * Track consistency streak (critical for neuroplasticity)
   */
  _trackConsistencyStreak() {
    if (this.dailyScores.length === 0) {
      return {
        streak: 0,
        neuroplasticityPhase: 'Not Started',
        nextMilestone: '21 days (habit formation begins)',
        impact: 'No neural pathway activation yet',
        status: 'critical'
      };
    }

    let streak = 0;
    let phase = 'Not Started';
    let nextMilestone = '21 days';

    // Count backwards from most recent
    for (let i = this.dailyScores.length - 1; i >= 0; i--) {
      if (this.dailyScores[i]) {
        streak++;
      } else {
        break;
      }
    }

    // Determine neuroplasticity phase
    if (streak === 0) {
      phase = 'Not Started';
      nextMilestone = '1 day (start today)';
    } else if (streak < 7) {
      phase = 'Initial (Days 1-7): Habit awareness beginning';
      nextMilestone = `${7 - streak} days to Week 1`;
    } else if (streak < 21) {
      phase = 'Forming (Days 7-21): Neural connections activating';
      nextMilestone = `${21 - streak} days to autopilot trigger`;
    } else if (streak < 66) {
      phase = 'Building (Days 21-66): Neural pathways strengthening';
      nextMilestone = `${66 - streak} days to deep automation`;
    } else {
      phase = 'Established (66+ days): Habit is automatic (basal ganglia)';
      nextMilestone = 'Maintenance only';
    }

    const status = streak >= 21 ? 'success' : streak >= 7 ? 'warning' : 'critical';

    return {
      streak,
      phase,
      nextMilestone,
      neuroplasticityLevel: Math.min(100, (streak / 66) * 100),
      willpowerSavings: Math.max(0, (streak - 21) * 2), // % willpower saved after day 21
      automationProba: Math.min(100, (streak / 21) * 100),
      status,
      recommendation: streak === 0 ? 'Start TODAY' : streak < 21 ? 'CRITICAL: Never miss twice' : 'Maintain + add complexity'
    };
  }

  /**
   * Track deep work productivity
   */
  _trackProductivity() {
    const last7Days = this.dailyScores.slice(-7);
    const last30Days = this.dailyScores.slice(-30);

    const avg7Day = last7Days.length > 0 
      ? last7Days.reduce((sum, s) => sum + (s?.score || 0), 0) / last7Days.length 
      : 0;

    const avg30Day = last30Days.length > 0 
      ? last30Days.reduce((sum, s) => sum + (s?.score || 0), 0) / last30Days.length 
      : 0;

    const trend = avg7Day - avg30Day;

    return {
      last7DayAverage: avg7Day.toFixed(1),
      last30DayAverage: avg30Day.toFixed(1),
      trend: trend > 0 ? `📈 +${trend.toFixed(1)}` : trend < 0 ? `📉 ${trend.toFixed(1)}` : '→ Stable',
      deepWorkHoursNeeded: 4.5,
      estimatedDeepWorkHours: (avg7Day / 10) * 4.5,
      productivityGap: Math.max(0, 4.5 - ((avg7Day / 10) * 4.5)),
      status: avg7Day >= 7.5 ? 'excellent' : avg7Day >= 7 ? 'good' : avg7Day >= 5 ? 'fair' : 'needs-work',
      insight: avg7Day >= 7.5 
        ? 'Excellent productivity - you\'re in flow state'
        : avg7Day >= 7
        ? 'Good productivity - close to peak'
        : 'Deep work hours insufficient for 2026 goals'
    };
  }

  /**
   * Track focus quality (distraction incidents)
   */
  _trackFocusQuality() {
    const last7Days = this.dailyScores.slice(-7);
    
    // Estimate distraction from variance in daily scores
    let variance = 0;
    if (last7Days.length > 1) {
      const avg = last7Days.reduce((sum, s) => sum + (s?.score || 0), 0) / last7Days.length;
      variance = Math.sqrt(
        last7Days.reduce((sum, s) => sum + Math.pow((s?.score || 0) - avg, 2), 0) / last7Days.length
      );
    }

    const distractionEstimate = Math.min(100, variance * 30); // 0-100% estimated distraction
    const focusQuality = 100 - distractionEstimate;

    return {
      focusQuality: focusQuality.toFixed(0) + '%',
      estimatedDistractionIncidents: Math.round(distractionEstimate / 10),
      timeWastedToDistraction: `${(distractionEstimate / 100 * 8).toFixed(1)}h/day`,
      status: focusQuality >= 80 ? 'excellent' : focusQuality >= 60 ? 'good' : 'needs-improvement',
      recommendation: focusQuality < 80 
        ? `CRITICAL: Implement distraction elimination. Recover ${(distractionEstimate / 100 * 8).toFixed(1)}h/day`
        : 'Maintain focus protocols',
      focusToolsNeeded: [
        distractionEstimate > 30 ? '📱 Phone airplane mode' : null,
        distractionEstimate > 30 ? '🔕 Disable notifications' : null,
        distractionEstimate > 30 ? '🌐 Block social sites' : null,
        distractionEstimate > 30 ? '🎵 Focus music' : null,
        distractionEstimate > 30 ? '🚪 Distraction-free location' : null
      ].filter(Boolean)
    };
  }

  /**
   * Track energy metrics (burnout risk)
   */
  _trackEnergyMetrics() {
    const last14Days = this.dailyScores.slice(-14);
    
    // Calculate energy trend
    const firstHalf = last14Days.slice(0, 7).reduce((sum, s) => sum + (s?.score || 0), 0) / 7;
    const secondHalf = last14Days.slice(7).reduce((sum, s) => sum + (s?.score || 0), 0) / 7;
    const energyTrend = secondHalf - firstHalf;

    // Estimate workload from multiple data sources
    const appsThisWeek = this.jobApplications.filter(a => {
      const date = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const tradesThisWeek = this.tradingJournal.filter(t => {
      const date = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const workoutsThisWeek = this.workouts.filter(w => {
      const date = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const totalActivityLoad = appsThisWeek + tradesThisWeek + workoutsThisWeek;
    const burnoutRisk = energyTrend < -0.5 && totalActivityLoad > 40 ? 'HIGH' : energyTrend < 0 ? 'MODERATE' : 'LOW';

    return {
      energyTrend: energyTrend > 0 ? `📈 Rising` : energyTrend < 0 ? `📉 Declining` : '→ Stable',
      burnoutRisk,
      currentEnergyLevel: secondHalf.toFixed(1),
      activityLoad: totalActivityLoad,
      recoveryNeeded: burnoutRisk === 'HIGH',
      recoveryProtocol: burnoutRisk === 'HIGH' ? [
        '😴 Sleep 8h minimum',
        '🧘 20 min morning meditation',
        '🏃 Light yoga/walks only',
        '📵 1 evening digital detox',
        '🎵 Leisure activity'
      ] : ['✅ Maintain current pace'],
      status: burnoutRisk === 'HIGH' ? 'critical' : burnoutRisk === 'MODERATE' ? 'warning' : 'good'
    };
  }

  /**
   * Track goal progress velocity (trajectory toward 2026)
   */
  _trackGoalVelocity() {
    const velocities = {};

    // Daily Score Velocity
    const last7Daily = this.dailyScores.slice(-7);
    const last30Daily = this.dailyScores.slice(-30);
    const avg7 = last7Daily.length > 0 ? last7Daily.reduce((sum, s) => sum + (s?.score || 0), 0) / last7Daily.length : 0;
    const avg30 = last30Daily.length > 0 ? last30Daily.reduce((sum, s) => sum + (s?.score || 0), 0) / last30Daily.length : 0;
    velocities.dailyScore = {
      current: avg7.toFixed(1),
      target: 8,
      weeksToTarget: avg7 < 8 ? Math.ceil((8 - avg7) / 0.2) : 0,
      velocity: `${((avg7 - avg30) / 30 * 7).toFixed(2)}/week`
    };

    // Career Velocity
    const last7Apps = this.jobApplications.filter(a => {
      const date = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;
    velocities.careerApps = {
      current: last7Apps,
      target: 15,
      weeksToTarget: last7Apps < 15 ? Math.ceil((15 - last7Apps) / Math.max(1, last7Apps)) : 0,
      velocity: `${last7Apps}/week`
    };

    // Trading Velocity
    const tradesThisWeek = this.tradingJournal.filter(t => {
      const date = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;
    const winRate = this.tradingJournal.length > 0 
      ? (this.tradingJournal.filter(t => (t.pnl || 0) > 0).length / this.tradingJournal.length * 100)
      : 0;
    velocities.trading = {
      current: winRate.toFixed(1) + '%',
      target: '50%+',
      tradesThisWeek,
      velocity: `${tradesThisWeek} trades/week @ ${winRate.toFixed(0)}% win rate`
    };

    // Workout Velocity
    const workoutsThisWeek = this.workouts.filter(w => {
      const date = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;
    velocities.health = {
      current: workoutsThisWeek,
      target: 6,
      weeksToTarget: workoutsThisWeek < 6 ? Math.ceil((6 - workoutsThisWeek) / Math.max(1, workoutsThisWeek)) : 0,
      velocity: `${workoutsThisWeek}/week`
    };

    return velocities;
  }

  /**
   * Track habit automation (willpower savings)
   */
  _trackHabitAutomation() {
    const streak = this._trackConsistencyStreak().streak;
    
    // Estimate habit automation from streak
    let automationLevel = 0;
    let willpowerSavings = 0;
    let habitsAutomated = [];

    if (streak >= 7) {
      automationLevel += 20;
      willpowerSavings += 5;
      habitsAutomated.push('Daily reflection beginning');
    }
    if (streak >= 21) {
      automationLevel += 30;
      willpowerSavings += 15;
      habitsAutomated.push('Daily tracking becoming automatic');
    }
    if (streak >= 66) {
      automationLevel += 50;
      willpowerSavings += 30;
      habitsAutomated.push('Daily practice fully automatic (basal ganglia)');
    }

    // Estimate from other habits
    if (this.workouts.length > 20) {
      automationLevel += 15;
      willpowerSavings += 10;
      habitsAutomated.push('Workout routine automated');
    }
    if (this.jobApplications.length > 15) {
      automationLevel += 10;
      habitsAutomated.push('Career focus becoming routine');
    }

    return {
      automationLevel: Math.min(100, automationLevel),
      willpowerSavingsPercent: Math.min(50, willpowerSavings), // Max 50% willpower savings
      habitsAutomated,
      nextMilestone: streak < 21 ? '21 days for first automation' : '66 days for deep automation',
      impact: `Saving ${Math.min(50, willpowerSavings).toFixed(0)}% of daily willpower`
    };
  }

  /**
   * Track sleep impact on performance
   */
  _trackSleepImpact() {
    const last7Days = this.dailyScores.slice(-7);
    
    // Rough estimate: daily score variance relates to sleep quality
    let avgScore = 0;
    if (last7Days.length > 0) {
      avgScore = last7Days.reduce((sum, s) => sum + (s?.score || 0), 0) / last7Days.length;
    }

    // Calculate estimated sleep quality from score stability
    let variance = 0;
    if (last7Days.length > 1) {
      const avg = avgScore;
      variance = Math.sqrt(
        last7Days.reduce((sum, s) => sum + Math.pow((s?.score || 0) - avg, 2), 0) / last7Days.length
      );
    }

    const estimatedSleepQuality = 100 - (variance * 25); // Estimate 0-100%
    const cognitiveFunctionImpact = estimatedSleepQuality >= 80 ? '+30%' : estimatedSleepQuality >= 60 ? '+15%' : '+0%';

    return {
      estimatedSleepQuality: Math.max(0, Math.min(100, estimatedSleepQuality)).toFixed(0) + '%',
      cognitiveFunctionImpact,
      productivityImpact: estimatedSleepQuality >= 80 ? 'Excellent' : estimatedSleepQuality >= 60 ? 'Good' : 'Poor',
      recommendation: estimatedSleepQuality < 80 
        ? 'CRITICAL: Optimize sleep for +40% cognitive function'
        : 'Sleep quality excellent - maintain protocols',
      sleepOptimizationProtocol: [
        '⏰ Consistent bedtime (every night)',
        '😴 Target 8 hours',
        '🌙 Cool (65-68°F), dark, quiet',
        '📵 No screens 1h before bed',
        '☕ No caffeine after 2 PM',
        '🌅 Morning sun exposure 10 min'
      ]
    };
  }

  /**
   * Track stress resilience
   */
  _trackStressResilience() {
    const last7Days = this.dailyScores.slice(-7);
    
    // Calculate variance as stress indicator
    let variance = 0;
    if (last7Days.length > 1) {
      const avg = last7Days.reduce((sum, s) => sum + (s?.score || 0), 0) / last7Days.length;
      variance = Math.sqrt(
        last7Days.reduce((sum, s) => sum + Math.pow((s?.score || 0) - avg, 2), 0) / last7Days.length
      );
    }

    const stressLevel = Math.min(100, variance * 40);
    const resilience = 100 - stressLevel;

    return {
      stressLevel: stressLevel.toFixed(0),
      resilience: resilience.toFixed(0) + '%',
      status: resilience >= 80 ? 'excellent' : resilience >= 60 ? 'good' : 'needs-support',
      recommendation: resilience < 60 
        ? 'Implement daily stress management protocol'
        : 'Maintain stress management practices',
      stressReductionTechniques: [
        '🧘 4-7-8 breathing (1 min)',
        '🏃 10 min walk (restores 20% resilience)',
        '💧 Hydration (critical)',
        '🎵 Calming music',
        '🤝 Social connection',
        '😴 Sleep optimization'
      ],
      emotionalRegulationTips: [
        '📓 Name emotions (deactivates amygdala)',
        '🤔 Understand context',
        '🧠 Reframe thoughts',
        '💪 Choose response (emotion ≠ behavior)'
      ]
    };
  }

  /**
   * Calculate overall optimization score
   */
  _calculateOptimizationScore() {
    const consistency = this._trackConsistencyStreak();
    const productivity = this._trackProductivity();
    const focus = this._trackFocusQuality();
    const energy = this._trackEnergyMetrics();

    const components = {
      consistency: (consistency.streak / 66) * 25, // 25 points max
      productivity: (parseFloat(productivity.last7DayAverage) / 10) * 25, // 25 points
      focus: (parseFloat(focus.focusQuality) / 100) * 25, // 25 points
      energy: energy.burnoutRisk === 'LOW' ? 25 : energy.burnoutRisk === 'MODERATE' ? 15 : 5 // 25 points
    };

    const total = Math.min(100, Object.values(components).reduce((a, b) => a + b, 0));

    return {
      overall: total.toFixed(1),
      components,
      breakdown: {
        consistency: `${components.consistency.toFixed(0)}/25 - ${consistency.phase}`,
        productivity: `${components.productivity.toFixed(0)}/25 - ${productivity.insight}`,
        focus: `${components.focus.toFixed(0)}/25 - Focus quality ${focus.focusQuality}`,
        energy: `${components.energy.toFixed(0)}/25 - Burnout risk ${energy.burnoutRisk}`
      },
      status: total >= 80 ? 'Excellent' : total >= 60 ? 'Good' : total >= 40 ? 'Fair' : 'Poor'
    };
  }

  /**
   * Calculate weekly trend
   */
  _calculateWeeklyTrend() {
    const last14Days = this.dailyScores.slice(-14);
    if (last14Days.length < 7) return 'Insufficient data';

    const week1 = last14Days.slice(0, 7).reduce((sum, s) => sum + (s?.score || 0), 0) / 7;
    const week2 = last14Days.slice(7).reduce((sum, s) => sum + (s?.score || 0), 0) / 7;

    const diff = week2 - week1;

    return {
      week1Average: parseFloat(week1.toFixed(1)),
      week2Average: parseFloat(week2.toFixed(1)),
      trend: diff > 0.5 ? '📈 Strong positive' : diff > 0 ? '📈 Positive' : diff < -0.5 ? '📉 Strong negative' : '→ Stable',
      change: parseFloat(diff.toFixed(2)),
      projection: week2 + diff * 2 // Predict 2 weeks ahead
    };
  }

  /**
   * Predict monthly score based on current trajectory
   */
  _predictMonthlyScore() {
    const last7Days = this.dailyScores.slice(-7);
    if (last7Days.length < 7) return 'Insufficient data';

    const avg7 = last7Days.reduce((sum, s) => sum + (s?.score || 0), 0) / last7Days.length;
    const trend = this._calculateWeeklyTrend();
    
    if (trend === 'Insufficient data') return 'Insufficient data';

    const weeklyChange = parseFloat(trend.change) || 0;
    const predicted4Weeks = avg7 + (weeklyChange * 4);

    return {
      projected: parseFloat(Math.min(10, Math.max(0, predicted4Weeks)).toFixed(1)),
      confidence: last7Days.length >= 7 ? 'High' : 'Medium',
      scenario: {
        conservative: parseFloat(Math.min(10, Math.max(0, avg7)).toFixed(1)),
        optimistic: parseFloat(Math.min(10, Math.max(0, predicted4Weeks + 1)).toFixed(1)),
        pessimistic: parseFloat(Math.min(10, Math.max(0, predicted4Weeks - 1)).toFixed(1))
      }
    };
  }
}

export default PerformanceMonitorAgent;
