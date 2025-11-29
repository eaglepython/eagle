/**
 * Intelligent Recommendation Engine
 * Analyzes user data and provides ML-based adaptive recommendations
 */

export class RecommendationEngine {
  constructor(userData) {
    this.userData = userData;
    this.recommendations = [];
  }

  /**
   * Analyze daily performance patterns
   */
  analyzeDailyPatterns() {
    const dailyScores = this.userData.dailyScores || [];
    if (dailyScores.length < 3) return null;

    const scores = dailyScores.slice(-7).map(d => d.totalScore);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const trend = scores[scores.length - 1] - scores[0];
    const consistency = this._calculateConsistency(scores);

    return {
      average: parseFloat(average.toFixed(2)),
      trend: parseFloat(trend.toFixed(2)),
      consistency,
      status: average >= 8 ? 'excellent' : average >= 6 ? 'good' : 'needs-improvement'
    };
  }

  /**
   * Identify weakest categories in daily tracking
   */
  identifyWeakCategories() {
    const dailyScores = this.userData.dailyScores || [];
    if (dailyScores.length < 3) return [];

    const categories = [
      'morningRoutine', 'deepWork', 'exercise', 'trading',
      'learning', 'nutrition', 'sleep', 'social', 'dailyMIT'
    ];

    const categoryAverages = {};
    categories.forEach(cat => {
      const scores = dailyScores
        .slice(-14)
        .filter(d => d.scores && d.scores[cat] !== undefined)
        .map(d => d.scores[cat]);

      if (scores.length > 0) {
        categoryAverages[cat] = scores.reduce((a, b) => a + b, 0) / scores.length;
      }
    });

    return Object.entries(categoryAverages)
      .map(([cat, avg]) => ({ category: cat, average: parseFloat(avg.toFixed(1)), score: avg }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }

  /**
   * Analyze career application performance
   */
  analyzeCareerMetrics() {
    const apps = this.userData.jobApplications || [];
    const thisWeek = apps.filter(a => this._isThisWeek(a.date));
    
    const statusDistribution = {
      applied: apps.filter(a => a.status === 'Applied').length,
      phoneScreen: apps.filter(a => a.status === 'Phone Screen').length,
      interview: apps.filter(a => a.status === 'Interview').length,
      offer: apps.filter(a => a.status === 'Offer').length
    };

    const tierDistribution = {
      tier1: apps.filter(a => a.tier === 'Tier 1').length,
      tier2: apps.filter(a => a.tier === 'Tier 2').length,
      tier3: apps.filter(a => a.tier === 'Tier 3').length,
      tier4: apps.filter(a => a.tier === 'Tier 4').length
    };

    const conversionRate = apps.length > 0
      ? parseFloat(((statusDistribution.phoneScreen + statusDistribution.interview + statusDistribution.offer) / apps.length * 100).toFixed(1))
      : 0;

    return {
      thisWeekCount: thisWeek.length,
      totalApplications: apps.length,
      statusDistribution,
      tierDistribution,
      conversionRate,
      averagePerWeek: parseFloat((apps.length / Math.max(1, this._getWeeksInData())).toFixed(1)),
      trajectory: thisWeek.length >= 15 ? 'on-track' : 'needs-focus'
    };
  }

  /**
   * Analyze trading journal performance
   */
  analyzeTradingPerformance() {
    const trades = this.userData.tradingJournal || [];
    const completedTrades = trades.filter(t => t.result);

    if (completedTrades.length < 3) return null;

    const wins = completedTrades.filter(t => parseFloat(t.result) > 0);
    const losses = completedTrades.filter(t => parseFloat(t.result) < 0);
    const totalPnL = completedTrades.reduce((sum, t) => sum + parseFloat(t.result || 0), 0);
    const avgPnL = totalPnL / completedTrades.length;
    const winRate = parseFloat((wins.length / completedTrades.length * 100).toFixed(1));

    const thisWeekTrades = completedTrades.filter(t => this._isThisWeek(t.date));
    const weeklyPnL = thisWeekTrades.reduce((sum, t) => sum + parseFloat(t.result || 0), 0);

    return {
      totalTrades: completedTrades.length,
      winRate: parseFloat(winRate),
      totalPnL: parseFloat(totalPnL.toFixed(2)),
      avgPnL: parseFloat(avgPnL.toFixed(2)),
      avgWin: wins.length > 0 ? parseFloat((wins.reduce((s, t) => s + parseFloat(t.result), 0) / wins.length).toFixed(2)) : 0,
      avgLoss: losses.length > 0 ? parseFloat((losses.reduce((s, t) => s + parseFloat(t.result), 0) / losses.length).toFixed(2)) : 0,
      weeklyPnL: parseFloat(weeklyPnL.toFixed(2)),
      thisWeekCount: thisWeekTrades.length,
      profitFactor: wins.length > 0 && losses.length > 0 
        ? parseFloat(((wins.reduce((s, t) => s + parseFloat(t.result), 0)) / Math.abs(losses.reduce((s, t) => s + parseFloat(t.result), 0))).toFixed(2))
        : 0
    };
  }

  /**
   * Analyze health and fitness metrics
   */
  analyzeHealthMetrics() {
    const workouts = this.userData.workouts || [];
    const thisWeek = workouts.filter(w => this._isThisWeek(w.date));

    const totalMinutes = thisWeek.reduce((sum, w) => sum + parseInt(w.duration || 0), 0);
    const avgDuration = thisWeek.length > 0 ? parseFloat((totalMinutes / thisWeek.length).toFixed(1)) : 0;

    const workoutTypes = {};
    workouts.forEach(w => {
      workoutTypes[w.type] = (workoutTypes[w.type] || 0) + 1;
    });

    const favoriteType = Object.entries(workoutTypes).sort((a, b) => b[1] - a[1])[0];

    return {
      thisWeekCount: thisWeek.length,
      totalMinutes: totalMinutes,
      avgDuration: parseFloat(avgDuration),
      target: 6,
      trajectory: thisWeek.length >= 6 ? 'on-track' : 'needs-focus',
      favoriteType: favoriteType ? favoriteType[0] : 'Not tracked',
      consistencyScore: this._calculateWorkoutConsistency(workouts)
    };
  }

  /**
   * Analyze financial progress
   */
  analyzeFinancialProgress() {
    const finance = this.userData.financialData || {};
    const monthlyData = this.userData.monthlyFinance || [];

    const savingsRate = finance.monthlyIncome > 0
      ? parseFloat(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome * 100).toFixed(1))
      : 0;

    const netWorth = finance.netWorth || 0;
    const milestones = [
      { target: 100000, label: '$100K', date: 'Q2 2026' },
      { target: 250000, label: '$250K', date: 'Q4 2026' },
      { target: 500000, label: '$500K', date: 'Q4 2027' },
      { target: 1000000, label: '$1M', date: 'Q4 2029' },
      { target: 2000000, label: '$2M', date: 'Q4 2030' }
    ];

    const nextMilestone = milestones.find(m => m.target > netWorth);
    const milestoneSavingsNeeded = nextMilestone ? nextMilestone.target - netWorth : 0;
    const monthlyRate = (finance.monthlyIncome - finance.monthlyExpenses) || 0;
    const monthsToNextMilestone = monthlyRate > 0 ? Math.ceil(milestoneSavingsNeeded / monthlyRate) : 0;

    return {
      netWorth,
      savingsRate: parseFloat(savingsRate),
      monthlyIncome: finance.monthlyIncome,
      monthlyExpenses: finance.monthlyExpenses,
      nextMilestone: nextMilestone ? nextMilestone.label : 'All goals achieved!',
      monthsToMilestone: monthsToNextMilestone,
      trajectory: savingsRate >= 20 ? 'on-track' : 'needs-focus'
    };
  }

  /**
   * Generate adaptive recommendations based on all metrics
   */
  generateRecommendations() {
    const recs = [];

    // Daily performance recommendations
    const dailyPattern = this.analyzeDailyPatterns();
    if (dailyPattern) {
      if (dailyPattern.status === 'needs-improvement') {
        recs.push({
          type: 'urgent',
          category: 'daily',
          title: 'Daily Performance Needs Attention',
          message: `Your average is ${dailyPattern.average}/10. Focus on weak categories to reach 8+.`,
          action: 'Review weak areas',
          priority: 'high'
        });
      } else if (dailyPattern.trend < -0.5) {
        recs.push({
          type: 'warning',
          category: 'daily',
          title: 'Performance Declining',
          message: `Your scores are trending down (${dailyPattern.trend.toFixed(2)}). Adjust strategy.`,
          action: 'Check daily routines',
          priority: 'medium'
        });
      }

      if (dailyPattern.consistency < 0.3) {
        recs.push({
          type: 'insight',
          category: 'daily',
          title: 'Inconsistent Performance',
          message: 'Your scores vary significantly. Build stronger daily habits.',
          action: 'Create consistency plan',
          priority: 'medium'
        });
      }
    }

    // Weak category recommendations
    const weakCategories = this.identifyWeakCategories();
    weakCategories.forEach((cat, idx) => {
      if (cat.average < 5 && idx === 0) {
        recs.push({
          type: 'urgent',
          category: 'category',
          title: `${this._formatCategoryName(cat.category)} is Critical`,
          message: `Score: ${cat.average}/10. This is your lowest performer. Prioritize improvement.`,
          action: `Focus on ${this._formatCategoryName(cat.category)}`,
          priority: 'high'
        });
      } else if (cat.average < 6) {
        recs.push({
          type: 'warning',
          category: 'category',
          title: `${this._formatCategoryName(cat.category)} Needs Work`,
          message: `Average: ${cat.average}/10. Small improvements here compound quickly.`,
          action: `Improve ${this._formatCategoryName(cat.category)}`,
          priority: 'medium'
        });
      }
    });

    // Career recommendations
    const careerMetrics = this.analyzeCareerMetrics();
    if (careerMetrics.trajectory === 'needs-focus') {
      recs.push({
        type: 'urgent',
        category: 'career',
        title: 'Career Applications Behind Target',
        message: `This week: ${careerMetrics.thisWeekCount}/15. Increase application volume.`,
        action: 'Apply to 15+ companies this week',
        priority: 'high'
      });
    }

    if (careerMetrics.conversionRate < 10) {
      recs.push({
        type: 'insight',
        category: 'career',
        title: 'Low Conversion Rate',
        message: `Only ${careerMetrics.conversionRate}% converting to next stage. Improve resume/interviewing.`,
        action: 'Review application quality',
        priority: 'medium'
      });
    }

    // Trading recommendations
    const tradingMetrics = this.analyzeTradingPerformance();
    if (tradingMetrics) {
      if (tradingMetrics.winRate < 45) {
        recs.push({
          type: 'warning',
          category: 'trading',
          title: 'Win Rate Below Target',
          message: `Current: ${tradingMetrics.winRate}%. Target: 50%+. Review entry strategy.`,
          action: 'Analyze losing trades',
          priority: 'high'
        });
      }

      if (tradingMetrics.profitFactor < 1.5) {
        recs.push({
          type: 'insight',
          category: 'trading',
          title: 'Profit Factor Low',
          message: `Ratio: ${tradingMetrics.profitFactor}. Aim for 2.0+. Improve risk management.`,
          action: 'Tighten stop losses',
          priority: 'medium'
        });
      }
    }

    // Health recommendations
    const healthMetrics = this.analyzeHealthMetrics();
    if (healthMetrics.trajectory === 'needs-focus') {
      recs.push({
        type: 'warning',
        category: 'health',
        title: 'Workout Target Not Met',
        message: `This week: ${healthMetrics.thisWeekCount}/6 workouts. Schedule 2-3 more.`,
        action: 'Plan remaining workouts',
        priority: 'medium'
      });
    }

    // Financial recommendations
    const financialMetrics = this.analyzeFinancialProgress();
    if (financialMetrics.trajectory === 'needs-focus') {
      recs.push({
        type: 'insight',
        category: 'finance',
        title: 'Savings Rate Below 20%',
        message: `Current: ${financialMetrics.savingsRate}%. Increase savings to hit milestones.`,
        action: 'Review expenses',
        priority: 'medium'
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const typeOrder = { urgent: 0, warning: 1, insight: 2 };
      return (priorityOrder[a.priority] - priorityOrder[b.priority]) ||
             (typeOrder[a.type] - typeOrder[b.type]);
    });
  }

  /**
   * Predict goal achievement based on current trajectory
   */
  predictGoalAchievement() {
    const predictions = {};

    // Daily score prediction
    const dailyPattern = this.analyzeDailyPatterns();
    if (dailyPattern) {
      predictions.daily = {
        current: dailyPattern.average,
        target: 8,
        achievable: dailyPattern.average >= 6.5,
        timeline: dailyPattern.average >= 7.5 ? 'within 1 week' : 'within 2-3 weeks',
        confidence: Math.min(100, dailyPattern.consistency * 100 + 30)
      };
    }

    // Career prediction
    const careerMetrics = this.analyzeCareerMetrics();
    const appsPerWeek = careerMetrics.averagePerWeek;
    predictions.career = {
      current: careerMetrics.thisWeekCount,
      target: 15,
      achievable: appsPerWeek >= 15,
      weeksToTarget: careerMetrics.thisWeekCount === 0 ? 'unknown' : 1,
      confidence: careerMetrics.thisWeekCount >= 10 ? 90 : 60
    };

    // Trading prediction
    const tradingMetrics = this.analyzeTradingPerformance();
    if (tradingMetrics) {
      predictions.trading = {
        currentPnL: tradingMetrics.totalPnL,
        target: 50000,
        monthlyRate: tradingMetrics.avgPnL * 20,
        achievable: tradingMetrics.winRate >= 50 && tradingMetrics.profitFactor >= 1.5,
        confidence: tradingMetrics.totalTrades >= 10 ? 75 : 40
      };
    }

    // Health prediction
    const healthMetrics = this.analyzeHealthMetrics();
    predictions.health = {
      current: healthMetrics.thisWeekCount,
      target: 6,
      achievable: healthMetrics.consistencyScore >= 0.7,
      timeline: healthMetrics.thisWeekCount >= 4 ? 'within 1 week' : 'within 2 weeks',
      confidence: healthMetrics.consistencyScore * 100
    };

    return predictions;
  }

  /**
   * Generate smart nudges/motivation messages
   */
  generateNudges() {
    const nudges = [];
    const now = new Date().getHours();

    // Time-based nudges
    if (now === 5) {
      nudges.push({
        time: 'morning',
        message: '🌅 Rise and shine! Time for your morning routine. You\'re about to own this day.',
        emoji: '⏰',
        category: 'morning'
      });
    } else if (now === 8) {
      nudges.push({
        time: 'mid-morning',
        message: '🎯 Deep work session starting? Silence notifications and lock in.',
        emoji: '🔥',
        category: 'focus'
      });
    } else if (now === 12) {
      nudges.push({
        time: 'noon',
        message: '💪 Lunch time! Fuel your body with quality nutrition for afternoon grind.',
        emoji: '🥗',
        category: 'nutrition'
      });
    }

    // Performance-based nudges
    const dailyPattern = this.analyzeDailyPatterns();
    if (dailyPattern && dailyPattern.average < 6) {
      nudges.push({
        time: 'afternoon',
        message: '📊 Your score is low today. You still have time to recover. Pick 1 category and crush it.',
        emoji: '💯',
        category: 'motivation'
      });
    }

    const careerMetrics = this.analyzeCareerMetrics();
    if (careerMetrics.thisWeekCount < 10 && now > 14) {
      nudges.push({
        time: 'end-of-day',
        message: '💼 You\'re at ' + careerMetrics.thisWeekCount + '/15 applications. Add 2-3 more before EOD?',
        emoji: '📬',
        category: 'career'
      });
    }

    return nudges;
  }

  /**
   * Helper methods
   */
  _calculateConsistency(scores) {
    if (scores.length < 2) return 0;
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);
    return Math.max(0, 1 - (stdDev / 10)); // Normalize to 0-1
  }

  _calculateWorkoutConsistency(workouts) {
    if (workouts.length < 3) return 0;
    const lastWeek = workouts.filter(w => this._isThisWeek(w.date));
    const prevWeek = workouts.filter(w => this._isLastWeek(w.date));
    
    if (lastWeek.length === 0 || prevWeek.length === 0) return 0.5;
    return Math.min(1, Math.abs(lastWeek.length - prevWeek.length) / 6);
  }

  _isThisWeek(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && date <= today;
  }

  _isLastWeek(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= twoWeeksAgo && date <= weekAgo;
  }

  _getWeeksInData() {
    const apps = this.userData.jobApplications || [];
    if (apps.length < 2) return 1;
    const oldest = new Date(apps[0].date);
    const newest = new Date(apps[apps.length - 1].date);
    return Math.ceil((newest - oldest) / (7 * 24 * 60 * 60 * 1000)) || 1;
  }

  _formatCategoryName(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }
}

export default RecommendationEngine;
