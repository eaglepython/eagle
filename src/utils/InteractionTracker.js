/**
 * Interaction Tracker
 * Captures all user interactions and evaluates progress toward goals
 * Provides adaptive feedback based on actual performance
 */

export class InteractionTracker {
  constructor(userData) {
    this.userData = userData;
    this.interactions = userData.interactions || [];
  }

  /**
   * Track user action with context
   */
  trackInteraction(action) {
    const interaction = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: action.type, // 'daily_score', 'application_logged', 'trade_executed', 'workout_logged', etc.
      component: action.component, // Which tracker
      data: action.data, // Actual data from the action
      goalAlignment: this._alignToGoals(action),
      metrics: this._extractMetrics(action)
    };

    return interaction;
  }

  /**
   * Align interaction to your 2026 goals
   */
  _alignToGoals(action) {
    const goals = {
      // 2026 Goal: $2M Net Worth
      netWorthGoal: {
        target: 2000000,
        path: ['Trading (20%+ AUM returns)', 'Career ($250K+ salary)', 'Savings (30% rate)'],
        deadline: '2030' // Extended to 2030
      },

      // 2026 Goal: Quant Researcher Role
      careerGoal: {
        target: 'Quant Researcher at Tier 1 (Google/Meta/OpenAI)',
        requirements: [
          'Education: MS degree (Stats/CS/Physics)',
          'Experience: $500K AUM with 20%+ returns',
          'Network: Strong Tier 1 connections',
          'Portfolio: Published research/projects'
        ],
        deadline: '2026'
      },

      // 2026 Goal: $500K Trading AUM with 20%+ Returns
      tradingGoal: {
        target: '$500K AUM',
        returns: '20%+ annually',
        breakdownBy: '2026',
        progression: [
          { year: 2024, aum: 50000, returns: '15%' },
          { year: 2025, aum: 150000, returns: '18%' },
          { year: 2026, aum: 500000, returns: '20%' }
        ]
      },

      // 2026 Goal: MS Degree + Research Track
      educationGoal: {
        target: 'MS in Quantitative Finance or Statistics',
        timeline: '2-year program starting 2024',
        balance: 'Maintain trading + career focus while studying'
      },

      // 2026 Goal: 12% Body Fat
      bodyFatGoal: {
        target: '12% body fat',
        progression: [
          { now: '15-17%', month3: '14-15%', month6: '13-14%', month12: '12-13%', final: '12%' }
        ],
        drivers: ['Consistency (6 workouts/week)', 'Nutrition (caloric deficit)', 'Sleep (7-8 hrs)']
      },

      // Daily Protocol Goals
      dailyProtocol: {
        target: '8+ daily score average',
        categories: [
          'Morning Routine (discipline anchor)',
          'Deep Work (career leverage)',
          'Exercise (health + energy)',
          'Trading (revenue)',
          'Learning (skill development)',
          'Nutrition (performance)',
          'Sleep (recovery)',
          'Social (balance)',
          'MIT (accomplishment)'
        ],
        target_categories: 8.5 // Average across all
      }
    };

    // Evaluate interaction against goals
    const alignment = {
      directGoals: [],
      supportingGoals: [],
      offTrack: []
    };

    if (action.component === 'trading') {
      alignment.directGoals.push('Trading Goal: $500K AUM by 2026');
      alignment.directGoals.push('Net Worth Goal: $2M by 2030');
    }
    if (action.component === 'career') {
      alignment.directGoals.push('Career Goal: Quant Researcher by 2026');
      alignment.directGoals.push('Net Worth Goal: Salary component');
    }
    if (action.component === 'health') {
      alignment.supportingGoals.push('Body Fat Goal: 12% by 2026');
      alignment.supportingGoals.push('Energy/focus for deep work');
    }
    if (action.component === 'daily') {
      alignment.supportingGoals.push('Daily Protocol: 8+ average');
      alignment.supportingGoals.push('All other goals depend on daily discipline');
    }

    return alignment;
  }

  /**
   * Extract metrics from interaction
   */
  _extractMetrics(action) {
    const metrics = {};

    if (action.type === 'daily_score') {
      metrics.score = action.data.totalScore;
      metrics.categoryScores = action.data.scores;
      metrics.excellentDay = action.data.totalScore >= 8;
    }

    if (action.type === 'application_logged') {
      metrics.tier = action.data.tier;
      metrics.company = action.data.company;
      metrics.targetTier = action.data.tier === 'Tier 1' ? true : false;
    }

    if (action.type === 'trade_executed') {
      metrics.asset = action.data.asset;
      metrics.pnl = action.data.pnl;
      metrics.profitable = action.data.pnl > 0;
      metrics.riskReward = action.data.riskReward;
    }

    if (action.type === 'workout_logged') {
      metrics.type = action.data.type;
      metrics.duration = action.data.duration;
      metrics.bodyFatProgress = true;
    }

    if (action.type === 'expense_tracked') {
      metrics.category = action.data.category;
      metrics.amount = action.data.amount;
      metrics.savingsImpact = action.data.savingsImpact;
    }

    return metrics;
  }

  /**
   * Evaluate progress toward goals (real-time)
   */
  evaluateProgress() {
    const thisMonth = new Date();
    const monthStart = new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1);

    const monthInteractions = this.interactions.filter(
      i => new Date(i.timestamp) >= monthStart
    );

    const evaluation = {
      period: `${thisMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}`,
      summary: {},
      detailedProgress: {},
      recommendations: []
    };

    // DAILY PROTOCOL PROGRESS
    const dailyInteractions = monthInteractions.filter(i => i.type === 'daily_score');
    if (dailyInteractions.length > 0) {
      const dailyScores = dailyInteractions.map(i => i.data.totalScore);
      const avgScore = dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length;
      const excellentDays = dailyScores.filter(s => s >= 8).length;

      evaluation.summary.dailyProtocol = {
        status: avgScore >= 8 ? '✅ ON TRACK' : avgScore >= 7 ? '⚠️ CLOSE' : '🔴 NEEDS FOCUS',
        average: parseFloat(avgScore.toFixed(2)),
        target: 8.0,
        gap: parseFloat((8.0 - avgScore).toFixed(2)),
        excellentDays: excellentDays,
        daysTracked: dailyInteractions.length,
        consistency: ((excellentDays / dailyInteractions.length) * 100).toFixed(0) + '%'
      };

      evaluation.detailedProgress.daily = {
        whatWorked: this._identifyWorks(dailyInteractions),
        weakAreas: this._identifyWeakAreas(dailyInteractions),
        pattern: this._detectPattern(dailyInteractions)
      };
    }

    // CAREER PROGRESS
    const careerInteractions = monthInteractions.filter(i => i.type === 'application_logged');
    if (careerInteractions.length > 0) {
      const tier1Apps = careerInteractions.filter(i => i.metrics.targetTier).length;
      const totalApps = careerInteractions.length;

      evaluation.summary.careerProgress = {
        applicationsThisMonth: totalApps,
        target: 15,
        status: totalApps >= 15 ? '✅ ON TRACK' : `⚠️ NEED ${15 - totalApps} MORE`,
        tier1Percentage: ((tier1Apps / totalApps) * 100).toFixed(0),
        expectedOffers: (totalApps * 0.02).toFixed(1), // 2% Tier 1 conversion
        pace: `At current pace: ${(totalApps * 12).toFixed(0)} applications/year`
      };

      evaluation.detailedProgress.career = {
        distribution: this._getTierDistribution(careerInteractions),
        quality: tier1Apps > totalApps * 0.3 ? 'HIGH_FOCUS_TIER1' : 'NEEDS_TIER1_SHIFT',
        recommendation: tier1Apps < totalApps * 0.4 ? 'Increase Tier 1 focus to 40%+' : 'Maintain current distribution'
      };
    }

    // TRADING PROGRESS
    const tradingInteractions = monthInteractions.filter(i => i.type === 'trade_executed');
    if (tradingInteractions.length > 0) {
      const profitableTrades = tradingInteractions.filter(i => i.metrics.profitable).length;
      const winRate = (profitableTrades / tradingInteractions.length) * 100;
      const totalPnL = tradingInteractions.reduce((sum, i) => sum + (i.metrics.pnl || 0), 0);

      evaluation.summary.tradingProgress = {
        tradesThisMonth: tradingInteractions.length,
        winRate: parseFloat(winRate.toFixed(1)),
        totalPnL: parseFloat(totalPnL.toFixed(2)),
        status: winRate >= 50 ? '✅ PROFITABLE' : '⚠️ BELOW 50%',
        annualizedPnL: parseFloat((totalPnL * 12).toFixed(2)),
        pathTo500KAum: this._calculate500KProgress(totalPnL)
      };

      evaluation.detailedProgress.trading = {
        trendingAssets: this._getTrendingAssets(tradingInteractions),
        bestSetups: this._identifyBestSetups(tradingInteractions),
        losses: this._analyzeLosses(tradingInteractions)
      };
    }

    // FITNESS PROGRESS
    const workoutInteractions = monthInteractions.filter(i => i.type === 'workout_logged');
    if (workoutInteractions.length > 0) {
      const workoutsTarget = 24; // 6 per week * 4 weeks

      evaluation.summary.fitnessProgress = {
        workoutsThisMonth: workoutInteractions.length,
        target: workoutsTarget,
        status: workoutInteractions.length >= workoutsTarget ? '✅ ON TRACK' : `⚠️ NEED ${workoutsTarget - workoutInteractions.length}`,
        avgDuration: this._getAvgDuration(workoutInteractions),
        bodyFatTrajectory: '12% goal achievable with consistency'
      };

      evaluation.detailedProgress.fitness = {
        workoutTypes: this._getWorkoutBreakdown(workoutInteractions),
        consistency: this._assessFitnessConsistency(workoutInteractions),
        nextWeekFocus: this._getFitnessFocus(workoutInteractions)
      };
    }

    // GENERATE REAL-TIME RECOMMENDATIONS
    evaluation.recommendations = this._generateAdaptiveRecommendations(evaluation);

    return evaluation;
  }

  /**
   * Identify what's working in daily protocol
   */
  _identifyWorks(dailyInteractions) {
    const patterns = {};

    dailyInteractions.forEach(i => {
      const scores = i.data.categoryScores || {};
      Object.entries(scores).forEach(([cat, score]) => {
        if (score >= 8) {
          patterns[cat] = (patterns[cat] || 0) + 1;
        }
      });
    });

    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, count]) => `${cat}: ${count} excellent days`);
  }

  /**
   * Identify weak areas in daily protocol
   */
  _identifyWeakAreas(dailyInteractions) {
    const patterns = {};

    dailyInteractions.forEach(i => {
      const scores = i.data.categoryScores || {};
      Object.entries(scores).forEach(([cat, score]) => {
        if (score < 6) {
          patterns[cat] = (patterns[cat] || 0) + 1;
        }
      });
    });

    return Object.entries(patterns)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, count]) => `${cat}: ${count} struggles`);
  }

  /**
   * Detect behavioral patterns
   */
  _detectPattern(dailyInteractions) {
    if (dailyInteractions.length < 3) return 'Insufficient data';

    const recent = dailyInteractions.slice(-7);
    const trend = recent[recent.length - 1].data.totalScore - recent[0].data.totalScore;

    if (trend > 1) return '📈 Upward trend - Momentum building';
    if (trend < -1) return '📉 Downward trend - Reset needed';
    return '→ Stable - Maintain consistency';
  }

  /**
   * Get tier distribution for career applications
   */
  _getTierDistribution(careerInteractions) {
    const dist = {};
    careerInteractions.forEach(i => {
      const tier = i.metrics.tier || 'unknown';
      dist[tier] = (dist[tier] || 0) + 1;
    });
    return dist;
  }

  /**
   * Calculate progress toward $500K AUM
   */
  _calculate500KProgress(monthlyPnL) {
    const annualPnL = monthlyPnL * 12;
    const estimatedAUM = 100000; // Starting point
    const returnRate = annualPnL / estimatedAUM;

    return {
      currentAnnualPnL: parseFloat(annualPnL.toFixed(2)),
      estimatedReturn: parseFloat((returnRate * 100).toFixed(2)) + '%',
      progressToward500K: 'Building based on consistent performance',
      yearsAtCurrentRate: (500000 / (annualPnL || 1)).toFixed(1)
    };
  }

  /**
   * Get trending assets
   */
  _getTrendingAssets(tradingInteractions) {
    const assets = {};
    tradingInteractions.forEach(i => {
      const asset = i.metrics.asset || 'unknown';
      if (!assets[asset]) assets[asset] = { count: 0, pnl: 0 };
      assets[asset].count += 1;
      assets[asset].pnl += i.metrics.pnl || 0;
    });

    return Object.entries(assets)
      .sort((a, b) => b[1].pnl - a[1].pnl)
      .map(([asset, data]) => `${asset}: ${data.count} trades, $${data.pnl.toFixed(2)}`);
  }

  /**
   * Identify best trading setups
   */
  _identifyBestSetups(tradingInteractions) {
    const winners = tradingInteractions
      .filter(i => i.metrics.profitable)
      .sort((a, b) => (b.metrics.pnl || 0) - (a.metrics.pnl || 0))
      .slice(0, 3);

    return winners.length > 0 ? winners.map(w => `${w.metrics.asset}: +$${w.metrics.pnl}`) : ['No winners yet'];
  }

  /**
   * Analyze losses
   */
  _analyzeLosses(tradingInteractions) {
    const losses = tradingInteractions.filter(i => !i.metrics.profitable);
    if (losses.length === 0) return [];

    return {
      lossCount: losses.length,
      totalLoss: parseFloat(losses.reduce((sum, l) => sum + (l.metrics.pnl || 0), 0).toFixed(2)),
      pattern: 'Analyze for repeated mistakes'
    };
  }

  /**
   * Get average workout duration
   */
  _getAvgDuration(workoutInteractions) {
    const durations = workoutInteractions.map(i => i.metrics.duration || 0).filter(d => d > 0);
    if (durations.length === 0) return 0;
    return (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(0) + ' min';
  }

  /**
   * Get workout breakdown
   */
  _getWorkoutBreakdown(workoutInteractions) {
    const breakdown = {};
    workoutInteractions.forEach(i => {
      const type = i.metrics.type || 'unknown';
      breakdown[type] = (breakdown[type] || 0) + 1;
    });
    return breakdown;
  }

  /**
   * Assess fitness consistency
   */
  _assessFitnessConsistency(workoutInteractions) {
    if (workoutInteractions.length < 4) return 'Building consistency';
    const last4Weeks = workoutInteractions.slice(-24);
    const avgPerWeek = (last4Weeks.length / 4).toFixed(1);
    return `${avgPerWeek} workouts/week`;
  }

  /**
   * Get fitness focus for next week
   */
  _getFitnessFocus(workoutInteractions) {
    const breakdown = this._getWorkoutBreakdown(workoutInteractions);
    const types = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

    if (types.length === 0) return 'All types equally';
    const weakest = types[types.length - 1];
    return `Focus on: ${weakest[0]} (only ${weakest[1]} this month)`;
  }

  /**
   * Generate adaptive recommendations based on actual performance
   */
  _generateAdaptiveRecommendations(evaluation) {
    const recs = [];

    // Daily protocol recommendations
    if (evaluation.summary.dailyProtocol) {
      if (evaluation.summary.dailyProtocol.average < 7) {
        recs.push({
          priority: 'URGENT',
          area: 'Daily Protocol',
          current: `${evaluation.summary.dailyProtocol.average}/10 average`,
          issue: 'Daily discipline is foundation for all goals. All other progress depends on this.',
          action: `Focus on ${evaluation.detailedProgress.daily.weakAreas[0] || 'weakest area'} first`,
          impact: 'Each 0.5 point gain in daily score = 10% faster progress on all goals'
        });
      }
    }

    // Career recommendations
    if (evaluation.summary.careerProgress) {
      if (evaluation.summary.careerProgress.status.includes('NEED')) {
        recs.push({
          priority: 'HIGH',
          area: 'Career Applications',
          current: `${evaluation.summary.careerProgress.applicationsThisMonth}/15 this month`,
          issue: 'Below weekly target of 15. Affects Tier 1 offer probability.',
          action: `Complete ${15 - evaluation.summary.careerProgress.applicationsThisMonth} applications this week`,
          impact: '15 apps/week × 2% tier1 conversion = 0.3 offers/week'
        });
      }

      if (evaluation.detailedProgress.career.quality === 'NEEDS_TIER1_SHIFT') {
        recs.push({
          priority: 'HIGH',
          area: 'Application Quality - Tier Distribution',
          current: `Tier 1: ${evaluation.summary.careerProgress.tier1Percentage}%`,
          issue: 'Too many lower-tier applications. Tier 1 = Quant researcher path.',
          action: 'Next week: 50%+ of applications to Tier 1 companies',
          impact: 'Tier 1 focus accelerates 2026 goal achievement'
        });
      }
    }

    // Trading recommendations
    if (evaluation.summary.tradingProgress) {
      if (evaluation.summary.tradingProgress.winRate < 45) {
        recs.push({
          priority: 'URGENT',
          area: 'Trading - Win Rate Critical',
          current: `${evaluation.summary.tradingProgress.winRate}% win rate`,
          issue: `Below 50% = unsustainable. Losing more than winning.`,
          action: 'Review last 5 losses: What went wrong? Fix entry criteria.',
          impact: 'Fixing this = Path to $500K AUM stays on track'
        });
      }

      if (evaluation.summary.tradingProgress.totalPnL > 0) {
        recs.push({
          priority: 'MEDIUM',
          area: 'Trading - Positive Month Alert',
          current: `+$${evaluation.summary.tradingProgress.totalPnL} P&L`,
          insight: `This month's setup worked. Repeat and scale.`,
          action: 'Document winning setup. Focus 60%+ of trades on this pattern.',
          impact: 'Consistency = Compounding toward $500K AUM'
        });
      }
    }

    // Fitness recommendations
    if (evaluation.summary.fitnessProgress) {
      if (evaluation.summary.fitnessProgress.status.includes('NEED')) {
        recs.push({
          priority: 'HIGH',
          area: 'Fitness - Consistency Gap',
          current: `${evaluation.summary.fitnessProgress.workoutsThisMonth}/${evaluation.summary.fitnessProgress.target} workouts`,
          issue: 'Missing workouts = Body fat won\'t drop. Energy for deep work suffers.',
          action: `${evaluation.detailedProgress.fitness.nextWeekFocus}. Schedule all workouts.`,
          impact: '6 workouts/week + nutrition = 12% body fat by 2026'
        });
      }
    }

    return recs;
  }
}

export default InteractionTracker;
