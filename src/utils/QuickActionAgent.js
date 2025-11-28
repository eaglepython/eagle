/**
 * QuickActionAgent - Intelligent recommendations for quick actions
 * Provides context-aware suggestions for each daily action
 */

export class QuickActionAgent {
  constructor(userData) {
    this.userData = userData;
  }

  /**
   * Get Daily Score recommendations
   */
  getDailyScoreRecommendations() {
    const today = new Date().toISOString().split('T')[0];
    const todayScore = this.userData.dailyScores.find(s => s.date === today);
    const lastScore = this.userData.dailyScores[this.userData.dailyScores.length - 1];
    
    const recommendations = {
      title: '📝 Daily Score Recommendations',
      icon: '📊',
      currentScore: todayScore?.totalScore || null,
      target: 8.0,
      insights: [],
      actionItems: [],
      predictedScore: null,
      focusAreas: []
    };

    // Analyze previous day performance
    if (lastScore) {
      const scores = lastScore.scores || [0, 0, 0, 0, 0, 0, 0, 0, 0];
      const categories = ['Morning', 'Deep Work', 'Exercise', 'Trading', 'Learning', 'Nutrition', 'Sleep', 'Social', 'MIT'];
      
      // Find weakest areas
      const weakAreas = categories
        .map((cat, idx) => ({ category: cat, score: scores[idx] }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3);

      weakAreas.forEach(area => {
        if (area.score < 7) {
          recommendations.focusAreas.push({
            category: area.category,
            score: area.score,
            message: `${area.category} was at ${area.score}/10 - aim for 8+`
          });
        }
      });

      // Generate insights
      const avgScore = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
      if (avgScore >= 8) {
        recommendations.insights.push({
          type: 'success',
          message: `✅ Yesterday averaged ${avgScore}/10! Maintain momentum today.`,
          action: 'MAINTAIN'
        });
      } else {
        recommendations.insights.push({
          type: 'opportunity',
          message: `📈 Yesterday averaged ${avgScore}/10. Focus on ${weakAreas[0].category} today.`,
          action: 'IMPROVE'
        });
      }
    }

    // Generate action items
    recommendations.actionItems = [
      {
        priority: 'CRITICAL',
        action: '⏰ Complete 5AM morning routine',
        deadline: 'Start of day',
        impact: '+1.5 points'
      },
      {
        priority: 'CRITICAL',
        action: '🎯 2 hrs deep work session (MIT)',
        deadline: 'Before noon',
        impact: '+2.0 points'
      },
      {
        priority: 'HIGH',
        action: '💪 1 workout (30+ min)',
        deadline: 'During day',
        impact: '+1.0 point'
      },
      {
        priority: 'HIGH',
        action: '📚 1 hour learning/study',
        deadline: 'Evening',
        impact: '+0.8 points'
      },
      {
        priority: 'MEDIUM',
        action: '😴 8 hrs quality sleep',
        deadline: 'Before midnight',
        impact: '+1.2 points'
      }
    ];

    // Predict likely score
    const recentScores = this.userData.dailyScores.slice(-7).map(s => s.totalScore);
    const avgRecent = recentScores.length > 0 
      ? (recentScores.reduce((a, b) => a + b, 0) / recentScores.length).toFixed(1)
      : 6.0;
    
    recommendations.predictedScore = Math.min(10, parseFloat(avgRecent) + 0.5);

    return recommendations;
  }

  /**
   * Get Job Application recommendations
   */
  getJobApplicationRecommendations() {
    const thisWeek = this.getUserData().jobApplications.filter(app => {
      const appDate = new Date(app.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate >= weekAgo;
    });

    const recommendations = {
      title: '💼 Job Application Recommendations',
      icon: '📋',
      currentWeek: thisWeek.length,
      target: 15,
      insights: [],
      actionItems: [],
      tierFocus: null,
      qualityMetrics: {}
    };

    // Tier distribution
    const tier1 = this.userData.jobApplications.filter(a => a.tier === 'Tier 1');
    const tier1Week = thisWeek.filter(a => a.tier === 'Tier 1');

    if (tier1Week.length >= 5) {
      recommendations.insights.push({
        type: 'success',
        message: `✅ ${tier1Week.length} Tier 1 apps this week! Great focus on quality.`,
        action: 'MAINTAIN'
      });
      recommendations.tierFocus = 'EXPAND_VOLUME';
    } else if (tier1Week.length > 0) {
      recommendations.insights.push({
        type: 'opportunity',
        message: `📈 ${tier1Week.length}/5 Tier 1 apps. Target ${5 - tier1Week.length} more this week.`,
        action: 'PRIORITIZE_TIER1'
      });
      recommendations.tierFocus = 'FOCUS_TIER1';
    } else {
      recommendations.insights.push({
        type: 'critical',
        message: `🚨 Zero Tier 1 applications this week! Must prioritize quality companies.`,
        action: 'PIVOT_TO_TIER1'
      });
      recommendations.tierFocus = 'URGENT_TIER1';
    }

    // Quality analysis
    const interviewRate = tier1.length > 0 
      ? ((tier1.filter(a => a.status !== 'Applied').length / tier1.length) * 100).toFixed(1)
      : 0;

    recommendations.qualityMetrics = {
      tier1Total: tier1.length,
      tier1ThisWeek: tier1Week.length,
      interviewRate: `${interviewRate}%`,
      averageTimeToInterview: '3-5 days'
    };

    // Action items
    recommendations.actionItems = [
      {
        priority: 'CRITICAL',
        action: '🎯 Apply to 5 Tier 1 companies',
        deadline: 'This week',
        impact: 'Meets target'
      },
      {
        priority: 'CRITICAL',
        action: '📝 Customize cover letter per company',
        deadline: 'Before applying',
        impact: '+15% response rate'
      },
      {
        priority: 'HIGH',
        action: '🔗 LinkedIn outreach to 3 recruiters',
        deadline: 'This week',
        impact: '+20% interview chances'
      },
      {
        priority: 'HIGH',
        action: '📊 Update resume with 2026 achievements',
        deadline: 'Today',
        impact: '+10% quality increase'
      },
      {
        priority: 'MEDIUM',
        action: '📋 Create target company list (50 companies)',
        deadline: 'This weekend',
        impact: 'Streamlines process'
      }
    ];

    return recommendations;
  }

  /**
   * Get Trading Log recommendations
   */
  getTradingLogRecommendations() {
    const thisWeek = this.userData.tradingJournal.filter(t => {
      const tDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return tDate >= weekAgo;
    });

    const recommendations = {
      title: '📊 Trading Log Recommendations',
      icon: '💹',
      currentWeekTrades: thisWeek.length,
      targetTrades: '3-5',
      insights: [],
      actionItems: [],
      riskMetrics: {},
      performanceMetrics: {}
    };

    // Calculate metrics
    const allPnL = thisWeek.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const winningTrades = thisWeek.filter(t => (t.pnl || 0) > 0).length;
    const winRate = thisWeek.length > 0 ? ((winningTrades / thisWeek.length) * 100).toFixed(1) : 0;
    const avgWin = winningTrades > 0 
      ? (thisWeek.filter(t => (t.pnl || 0) > 0).reduce((sum, t) => sum + t.pnl, 0) / winningTrades).toFixed(2)
      : 0;

    recommendations.performanceMetrics = {
      weeklyPnL: `$${allPnL.toFixed(2)}`,
      winRate: `${winRate}%`,
      avgWin: `$${avgWin}`,
      tradesThisWeek: thisWeek.length
    };

    // Generate insights
    if (winRate >= 55) {
      recommendations.insights.push({
        type: 'success',
        message: `✅ Win rate at ${winRate}%! Above 50% target. Consider scaling.`,
        action: 'SCALE'
      });
    } else if (winRate >= 45) {
      recommendations.insights.push({
        type: 'opportunity',
        message: `📈 Win rate at ${winRate}%. Need 55%+ for profitability. Review losing trades.`,
        action: 'IMPROVE_EDGE'
      });
    } else {
      recommendations.insights.push({
        type: 'critical',
        message: `🚨 Win rate ${winRate}% is too low. Review strategy immediately.`,
        action: 'REVIEW_STRATEGY'
      });
    }

    if (allPnL > 0) {
      recommendations.insights.push({
        type: 'success',
        message: `💰 Weekly P&L: +$${allPnL.toFixed(2)}. On track for $5K monthly target.`,
        action: 'MAINTAIN'
      });
    } else if (allPnL < 0) {
      recommendations.insights.push({
        type: 'warning',
        message: `⚠️ Negative P&L this week (-$${Math.abs(allPnL).toFixed(2)}). Reduce size and tighten stops.`,
        action: 'REDUCE_SIZE'
      });
    }

    // Action items
    recommendations.actionItems = [
      {
        priority: 'CRITICAL',
        action: '📋 Journal every trade (3-5 today)',
        deadline: 'During market hours',
        impact: 'Captures edge patterns'
      },
      {
        priority: 'CRITICAL',
        action: '✏️ Review 5 worst trades from this month',
        deadline: 'After market close',
        impact: '+5% edge improvement'
      },
      {
        priority: 'HIGH',
        action: '📊 Set position sizing rules (risk 1% max)',
        deadline: 'Before next trade',
        impact: 'Better risk management'
      },
      {
        priority: 'HIGH',
        action: '🎯 Identify 2 high-probability setups',
        deadline: 'Next session',
        impact: '+10% win rate'
      },
      {
        priority: 'MEDIUM',
        action: '📈 Analyze market conditions (trend, volatility)',
        deadline: 'Morning prep',
        impact: 'Context awareness'
      }
    ];

    recommendations.riskMetrics = {
      recommendedMaxSize: '$10K',
      recommendedRiskPerTrade: '1%',
      recommendedStopDistance: '2%',
      weeklyDrawdownMax: '2%'
    };

    return recommendations;
  }

  /**
   * Get Workout recommendations
   */
  getWorkoutRecommendations() {
    const thisWeek = this.userData.workouts.filter(w => {
      const wDate = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return wDate >= weekAgo;
    });

    const recommendations = {
      title: '💪 Workout Recommendations',
      icon: '🏋️',
      currentWeek: thisWeek.length,
      target: 6,
      insights: [],
      actionItems: [],
      fitnessMetrics: {},
      workoutPlan: []
    };

    // Calculate metrics
    const totalMinutes = thisWeek.reduce((sum, w) => sum + (w.duration || 0), 0);
    const avgDuration = thisWeek.length > 0 ? (totalMinutes / thisWeek.length).toFixed(0) : 0;
    const types = {};
    thisWeek.forEach(w => { types[w.type] = (types[w.type] || 0) + 1; });

    recommendations.fitnessMetrics = {
      workoutsThisWeek: thisWeek.length,
      target: 6,
      totalMinutes: totalMinutes,
      avgDuration: `${avgDuration} min`,
      typesLogged: Object.keys(types).join(', ')
    };

    // Generate insights
    if (thisWeek.length >= 6) {
      recommendations.insights.push({
        type: 'success',
        message: `✅ ${thisWeek.length} workouts this week! Goal met. Maintain consistency.`,
        action: 'MAINTAIN'
      });
    } else {
      const remaining = 6 - thisWeek.length;
      recommendations.insights.push({
        type: 'opportunity',
        message: `📈 ${thisWeek.length}/6 workouts. Need ${remaining} more to hit target.`,
        action: 'SCHEDULE_NOW'
      });
    }

    // Check variety
    if (Object.keys(types).length >= 3) {
      recommendations.insights.push({
        type: 'success',
        message: `💯 Great variety: ${Object.keys(types).join(', ')}. Balanced approach.`,
        action: 'MAINTAIN'
      });
    } else {
      recommendations.insights.push({
        type: 'opportunity',
        message: `🔄 Add workout variety. Currently: ${Object.keys(types).join(', ')}`,
        action: 'ADD_VARIETY'
      });
    }

    // Action items
    recommendations.actionItems = [
      {
        priority: 'CRITICAL',
        action: '⏰ Schedule 6 workouts for this week',
        deadline: 'Monday morning',
        impact: 'Locks in commitment'
      },
      {
        priority: 'CRITICAL',
        action: '💪 Complete today\'s workout (30+ min)',
        deadline: 'Today',
        impact: '+1 toward target'
      },
      {
        priority: 'HIGH',
        action: '🏃 2 cardio sessions (running/bike)',
        deadline: 'This week',
        impact: 'Cardiovascular health'
      },
      {
        priority: 'HIGH',
        action: '🏋️ 3 strength training sessions',
        deadline: 'This week',
        impact: 'Muscle development'
      },
      {
        priority: 'MEDIUM',
        action: '📊 Track body metrics weekly',
        deadline: 'Sunday evening',
        impact: 'Progress monitoring'
      }
    ];

    // Recommended workout plan
    recommendations.workoutPlan = [
      { day: 'Monday', type: 'Strength', duration: '45 min', intensity: 'HIGH' },
      { day: 'Tuesday', type: 'Cardio', duration: '30 min', intensity: 'MEDIUM' },
      { day: 'Wednesday', type: 'Strength', duration: '45 min', intensity: 'HIGH' },
      { day: 'Thursday', type: 'Active Recovery', duration: '20 min', intensity: 'LOW' },
      { day: 'Friday', type: 'Strength', duration: '45 min', intensity: 'MEDIUM' },
      { day: 'Saturday', type: 'Cardio', duration: '45 min', intensity: 'HIGH' }
    ];

    return recommendations;
  }

  /**
   * Get Learning/Resources recommendations
   */
  getLearningRecommendations() {
    const goals = this.userData.goals || [];
    const careerGoals = goals.filter(g => g.category === 'career');
    
    const recommendations = {
      title: '📚 Learning & Resources Recommendations',
      icon: '🎓',
      insights: [],
      actionItems: [],
      topResources: [],
      focusAreas: []
    };

    // Generate insights
    recommendations.insights.push({
      type: 'opportunity',
      message: '🎯 Resources system provides AI-curated learning for all 10 goals',
      action: 'EXPLORE'
    });

    recommendations.insights.push({
      type: 'info',
      message: '📚 Click on any goal to see strategies, action items, and online resources',
      action: 'LEARN'
    });

    // Action items
    recommendations.actionItems = [
      {
        priority: 'CRITICAL',
        action: '🎯 Select top goal to get resources',
        deadline: 'Now',
        impact: 'Immediate actionable steps'
      },
      {
        priority: 'HIGH',
        action: '📖 Read 1 CRITICAL resource from selected goal',
        deadline: 'Today',
        impact: '+1 knowledge point'
      },
      {
        priority: 'HIGH',
        action: '📋 Implement 1 strategy from recommendations',
        deadline: 'This week',
        impact: 'Direct goal progress'
      },
      {
        priority: 'MEDIUM',
        action: '🔄 Refresh recommendations weekly',
        deadline: 'Every Sunday',
        impact: 'Fresh strategies'
      }
    ];

    // Top resources by category
    recommendations.topResources = [
      {
        category: 'DISCIPLINE',
        resource: 'Atomic Habits - Build 1% daily improvement',
        relevance: 'CRITICAL'
      },
      {
        category: 'CAREER',
        resource: 'Cracking the Coding Interview - Ace technical interviews',
        relevance: 'CRITICAL'
      },
      {
        category: 'TRADING',
        resource: 'Market Wizards - Psychology of winning traders',
        relevance: 'CRITICAL'
      },
      {
        category: 'HEALTH',
        resource: 'Renaissance Periodization - Science-based training',
        relevance: 'HIGH'
      },
      {
        category: 'FINANCE',
        resource: 'A Random Walk Down Wall Street - Investment fundamentals',
        relevance: 'HIGH'
      }
    ];

    recommendations.focusAreas = careerGoals.map(g => g.name);

    return recommendations;
  }

  /**
   * Get Weekly Reflection recommendations
   */
  getWeeklyReflectionRecommendations() {
    const thisWeek = this.userData.dailyScores.filter(s => {
      const scoreDate = new Date(s.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scoreDate >= weekAgo;
    });

    const recommendations = {
      title: '📋 Weekly Reflection Recommendations',
      icon: '🎯',
      weekMetrics: {},
      insights: [],
      actionItems: [],
      nextWeekPlan: []
    };

    // Calculate week metrics
    const weekScores = thisWeek.map(s => s.totalScore);
    const avgWeekScore = thisWeek.length > 0 
      ? (weekScores.reduce((a, b) => a + b, 0) / thisWeek.length).toFixed(1)
      : 0;
    const bestDay = Math.max(...weekScores);
    const worstDay = Math.min(...weekScores);

    recommendations.weekMetrics = {
      daysLogged: thisWeek.length,
      averageScore: avgWeekScore,
      bestDay: bestDay,
      worstDay: worstDay,
      consistency: `${((thisWeek.length / 7) * 100).toFixed(0)}%`
    };

    // Generate insights
    if (avgWeekScore >= 8) {
      recommendations.insights.push({
        type: 'success',
        message: `✅ Excellent week! Average ${avgWeekScore}/10. Keep this momentum going.`,
        action: 'CELEBRATE'
      });
    } else if (avgWeekScore >= 6.5) {
      recommendations.insights.push({
        type: 'opportunity',
        message: `📈 Good week at ${avgWeekScore}/10. Target 8.0+ next week.`,
        action: 'IMPROVE'
      });
    } else {
      recommendations.insights.push({
        type: 'critical',
        message: `🚨 Challenging week (${avgWeekScore}/10). Review what went wrong and adjust.`,
        action: 'RESET'
      });
    }

    // Action items
    recommendations.actionItems = [
      {
        priority: 'CRITICAL',
        action: '🎯 Review all 7 daily scores from this week',
        deadline: 'Now',
        impact: 'Pattern recognition'
      },
      {
        priority: 'CRITICAL',
        action: '📊 Analyze best day (${bestDay}/10) - what was different?',
        deadline: '30 min',
        impact: 'Identify success patterns'
      },
      {
        priority: 'HIGH',
        action: '🔍 Identify worst performing category',
        deadline: '1 hour',
        impact: 'Target improvement area'
      },
      {
        priority: 'HIGH',
        action: '✍️ Write 3 wins and 3 lessons for next week',
        deadline: '1.5 hours',
        impact: 'Reflection & learning'
      },
      {
        priority: 'MEDIUM',
        action: '🎯 Set specific 3 goals for next week',
        deadline: '2 hours',
        impact: 'Direction & motivation'
      }
    ];

    // Next week plan
    recommendations.nextWeekPlan = [
      {
        goal: 'Daily Score 8.0+',
        strategy: 'Focus on ${worstDay < 7 ? "weak categories" : "maintaining consistency"}',
        difficulty: 'MEDIUM'
      },
      {
        goal: '15 Job Applications',
        strategy: 'Prioritize Tier 1 companies',
        difficulty: 'HIGH'
      },
      {
        goal: '6 Workouts',
        strategy: 'Schedule all sessions Sunday evening',
        difficulty: 'MEDIUM'
      }
    ];

    return recommendations;
  }

  /**
   * Get all recommendations based on action type
   */
  getRecommendations(actionType) {
    const actionMap = {
      'Log today': () => this.getDailyScoreRecommendations(),
      'Add app': () => this.getJobApplicationRecommendations(),
      'Log trade': () => this.getTradingLogRecommendations(),
      'Log workout': () => this.getWorkoutRecommendations(),
      'Track hours': () => this.getLearningRecommendations(),
      'Reflect': () => this.getWeeklyReflectionRecommendations()
    };

    return actionMap[actionType] ? actionMap[actionType]() : null;
  }

  /**
   * Get user data (helper)
   */
  getUserData() {
    return this.userData;
  }
}

export default QuickActionAgent;
