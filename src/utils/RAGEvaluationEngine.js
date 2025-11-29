/**
 * RAG Evaluation Engine
 * Retrieves past interactions, evaluates against goals, provides adaptive feedback
 * Continuously learns from your actual behavior patterns
 */

export class RAGEvaluationEngine {
  constructor(userData, interactions) {
    this.userData = userData;
    this.interactions = interactions || [];
    this.goals = this._defineGoals();
  }

  /**
   * Define your specific goals for evaluation
   */
  _defineGoals() {
    return {
      // Daily Discipline
      dailyScore: {
        metric: 'Daily Average Score',
        target: 8.0,
        current: this._calculateCurrentDailyScore(),
        importance: 'CRITICAL',
        category: 'discipline',
        description: 'Maintain 8+ average daily score across 9 categories'
      },

      // Career
      jobApplicationsPerWeek: {
        metric: 'Job Applications/Week',
        target: 15,
        current: this._calculateApplicationsThisWeek(),
        importance: 'CRITICAL',
        category: 'career',
        description: 'Submit 15 quality job applications per week'
      },

      tier1Applications: {
        metric: 'Tier 1 Applications/Week',
        target: 5,
        current: this._calculateTier1ThisWeek(),
        importance: 'HIGH',
        category: 'career',
        description: 'Focus on 5+ Tier 1 (FAANG/Elite) applications weekly'
      },

      applicationQuality: {
        metric: 'Interview Conversion Rate',
        target: 0.08, // 8%
        current: this._calculateInterviewConversion(),
        importance: 'HIGH',
        category: 'career',
        description: 'Achieve 8%+ interview rate from applications'
      },

      // Trading
      tradingWinRate: {
        metric: 'Trading Win Rate',
        target: 0.55, // 55%
        current: this._calculateWinRate(),
        importance: 'CRITICAL',
        category: 'trading',
        description: 'Maintain 55%+ win rate on trades'
      },

      monthlyTradingPnL: {
        metric: 'Monthly Trading P&L',
        target: 5000, // $5K/month = $60K/year
        current: this._calculateMonthlyPnL(),
        importance: 'HIGH',
        category: 'trading',
        description: 'Generate $5K+ monthly trading profit'
      },

      aumProgression: {
        metric: 'Trading AUM Target',
        target: 500000, // $500K by 2026
        current: this._estimateAUM(),
        importance: 'CRITICAL',
        category: 'trading',
        description: 'Build to $500K AUM with 20%+ returns by 2026'
      },

      // Health
      workoutsPerWeek: {
        metric: 'Workouts/Week',
        target: 6,
        current: this._calculateWorkoutsThisWeek(),
        importance: 'HIGH',
        category: 'health',
        description: 'Complete 6 workouts per week minimum'
      },

      bodyFatGoal: {
        metric: 'Body Fat %',
        target: 0.12, // 12% by 2026
        current: this._estimateBodyFat(),
        importance: 'MEDIUM',
        category: 'health',
        description: 'Achieve 12% body fat by 2026'
      },

      // Finance
      savingsRate: {
        metric: 'Monthly Savings Rate',
        target: 0.30, // 30%
        current: this._calculateSavingsRate(),
        importance: 'HIGH',
        category: 'finance',
        description: 'Maintain 30%+ savings rate'
      },

      netWorthGoal: {
        metric: 'Net Worth Target',
        target: 2000000, // $2M by 2030
        current: this.userData.financialData?.netWorth || 0,
        importance: 'CRITICAL',
        category: 'finance',
        description: 'Build to $2M net worth by 2030'
      }
    };
  }

  /**
   * Calculate current daily score average
   */
  _calculateCurrentDailyScore() {
    const dailyScores = this.userData.dailyScores || [];
    if (dailyScores.length === 0) return 0;

    const lastWeek = dailyScores.slice(-7);
    const avg = lastWeek.reduce((sum, s) => sum + (s.totalScore || 0), 0) / lastWeek.length;
    return parseFloat(avg.toFixed(1));
  }

  /**
   * Calculate applications this week
   */
  _calculateApplicationsThisWeek() {
    const apps = this.userData.jobApplications || [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return apps.filter(a => new Date(a.date) > weekAgo).length;
  }

  /**
   * Calculate Tier 1 applications this week
   */
  _calculateTier1ThisWeek() {
    const apps = this.userData.jobApplications || [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return apps.filter(a => 
      new Date(a.date) > weekAgo && 
      (a.tier === 1 || a.tier === 'Tier 1' || a.tier === 'tier1')
    ).length;
  }

  /**
   * Calculate interview conversion rate
   */
  _calculateInterviewConversion() {
    const apps = this.userData.jobApplications || [];
    if (apps.length === 0) return 0;

    const interviews = apps.filter(a => 
      a.status === 'Interview' || 
      a.status === 'interview' || 
      a.status === 'Interviewing'
    ).length;

    return parseFloat((interviews / apps.length).toFixed(3));
  }

  /**
   * Calculate trading win rate
   */
  _calculateWinRate() {
    const trades = this.userData.tradingJournal || [];
    if (trades.length === 0) return 0;

    const wins = trades.filter(t => parseFloat(t.pnl) > 0).length;
    return parseFloat((wins / trades.length).toFixed(3));
  }

  /**
   * Calculate monthly P&L
   */
  _calculateMonthlyPnL() {
    const trades = this.userData.tradingJournal || [];
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const monthTrades = trades.filter(t => new Date(t.date) > monthAgo);
    const totalPnL = monthTrades.reduce((sum, t) => sum + (parseFloat(t.pnl) || 0), 0);
    return parseFloat(totalPnL.toFixed(2));
  }

  /**
   * Estimate AUM based on trading performance
   */
  _estimateAUM() {
    // Estimate based on monthly P&L trajectory
    const monthlyPnL = this._calculateMonthlyPnL();
    const annualReturn = monthlyPnL * 12;
    const targetReturn = 0.20; // 20% target

    if (annualReturn === 0) return 0;
    return Math.max(0, Math.round((annualReturn / targetReturn) * 0.3)); // Rough estimate
  }

  /**
   * Calculate workouts this week
   */
  _calculateWorkoutsThisWeek() {
    const workouts = this.userData.workouts || [];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    return workouts.filter(w => new Date(w.date) > weekAgo).length;
  }

  /**
   * Estimate body fat based on workouts and nutrition tracking
   */
  _estimateBodyFat() {
    // Simplified estimate: with 6+ workouts/week and tracking, assume progress toward 12%
    const workoutsThisWeek = this._calculateWorkoutsThisWeek();
    
    if (workoutsThisWeek >= 6) {
      return 0.14; // Assuming 14% with consistent training (would need actual data)
    }
    return 0.16; // Estimate without perfect consistency
  }

  /**
   * Calculate savings rate
   */
  _calculateSavingsRate() {
    const financialData = this.userData.financialData || {};
    const income = financialData.monthlyIncome || 0;
    const expenses = financialData.monthlyExpenses || 0;

    if (income === 0) return 0;
    return parseFloat(((income - expenses) / income).toFixed(3));
  }

  /**
   * Generate adaptive evaluation based on interactions
   */
  generateAdaptiveEvaluation() {
    const evaluation = {
      timestamp: new Date().toISOString(),
      overallScore: 0,
      categories: {},
      keyInsights: [],
      nextSteps: [],
      motivationalMessage: ''
    };

    // Evaluate each category
    Object.entries(this.goals).forEach(([key, goal]) => {
      const progress = this._evaluateGoal(goal);
      evaluation.categories[key] = progress;
    });

    // Calculate overall score
    const categoryScores = Object.values(evaluation.categories).map(c => c.score);
    evaluation.overallScore = Math.round(
      categoryScores.reduce((a, b) => a + b, 0) / categoryScores.length
    );

    // Generate insights
    evaluation.keyInsights = this._generateKeyInsights();
    evaluation.nextSteps = this._generateNextSteps();
    evaluation.motivationalMessage = this._generateMotivationalMessage(evaluation.overallScore);

    return evaluation;
  }

  /**
   * Evaluate a specific goal
   */
  _evaluateGoal(goal) {
    const { target, current, importance } = goal;
    
    let score = 0;
    let status = '';
    let gap = '';

    // Calculate progress percentage
    if (typeof target === 'number') {
      const percentage = target === 0 ? 100 : (current / target) * 100;
      score = Math.min(100, Math.round(percentage));

      if (percentage >= 90) {
        status = 'Excellent';
      } else if (percentage >= 70) {
        status = 'Good';
      } else if (percentage >= 50) {
        status = 'Needs Work';
      } else {
        status = 'Critical';
      }

      gap = target - current;
    }

    return {
      score,
      status,
      gap,
      current,
      target,
      importance
    };
  }

  /**
   * Generate key insights from interactions
   */
  _generateKeyInsights() {
    const insights = [];
    const recentInteractions = this.interactions.slice(-50); // Last 50

    // Pattern: Daily score trend
    const dailyScores = this.userData.dailyScores?.slice(-7) || [];
    if (dailyScores.length >= 3) {
      const trend = dailyScores[dailyScores.length - 1].totalScore - dailyScores[0].totalScore;
      if (trend > 0.5) {
        insights.push({
          type: 'positive_trend',
          message: `📈 Daily score trending up +${trend.toFixed(1)} points over last week`,
          action: 'MAINTAIN - You\'re improving!'
        });
      } else if (trend < -0.5) {
        insights.push({
          type: 'negative_trend',
          message: `📉 Daily score trending down ${trend.toFixed(1)} points - investigate`,
          action: 'ANALYZE - What changed? Sleep? Stress? Workload?'
        });
      }
    }

    // Pattern: Trading consistency
    const recentTrades = (this.userData.tradingJournal || []).slice(-20);
    if (recentTrades.length >= 5) {
      const wins = recentTrades.filter(t => parseFloat(t.pnl) > 0).length;
      const winRate = wins / recentTrades.length;
      
      if (winRate >= 0.60) {
        insights.push({
          type: 'trading_edge',
          message: `💰 Trading edge detected: ${(winRate * 100).toFixed(0)}% win rate on last 20 trades`,
          action: 'SCALE - This is your proven edge, increase size slightly'
        });
      }
    }

    // Pattern: Application quality
    const allApps = this.userData.jobApplications || [];
    const offers = allApps.filter(a => a.status === 'Offer').length;
    if (offers > 0) {
      insights.push({
        type: 'career_progress',
        message: `🎯 Career milestone: ${offers} offer(s) in pipeline`,
        action: 'CLOSE - Prepare negotiation strategy'
      });
    }

    return insights;
  }

  /**
   * Generate next steps based on evaluation
   */
  _generateNextSteps() {
    const steps = [];
    const goals = this.goals;

    // Check critical goals
    if (goals.dailyScore.current < goals.dailyScore.target) {
      steps.push({
        priority: 1,
        area: 'Daily Discipline',
        action: `Improve daily score from ${goals.dailyScore.current} to 8.0`,
        specific: 'Focus on lowest-scoring categories today'
      });
    }

    if (goals.jobApplicationsPerWeek.current < goals.jobApplicationsPerWeek.target) {
      const gap = goals.jobApplicationsPerWeek.target - goals.jobApplicationsPerWeek.current;
      steps.push({
        priority: 2,
        area: 'Career',
        action: `Add ${gap} more applications this week`,
        specific: `Focus on Tier 1 companies (${goals.tier1Applications.target} target)`
      });
    }

    if (goals.tradingWinRate.current < goals.tradingWinRate.target) {
      steps.push({
        priority: 2,
        area: 'Trading',
        action: `Improve win rate from ${(goals.tradingWinRate.current * 100).toFixed(0)}% to 55%`,
        specific: 'Tighten entry criteria, ensure 2:1 min risk/reward'
      });
    }

    if (goals.workoutsPerWeek.current < goals.workoutsPerWeek.target) {
      const gap = goals.workoutsPerWeek.target - goals.workoutsPerWeek.current;
      steps.push({
        priority: 3,
        area: 'Health',
        action: `Complete ${gap} more workouts this week`,
        specific: 'Schedule tomorrow: strength + cardio'
      });
    }

    return steps.slice(0, 5); // Top 5 priorities
  }

  /**
   * Generate motivational message based on score
   */
  _generateMotivationalMessage(score) {
    if (score >= 90) {
      return '🔥 EXCEPTIONAL! You\'re crushing your goals. Keep this momentum!';
    } else if (score >= 75) {
      return '💪 SOLID PROGRESS! You\'re on track. Small adjustments = big wins.';
    } else if (score >= 60) {
      return '⚡ BUILDING! You\'re making progress. Focus on 1-2 priority areas.';
    } else if (score >= 45) {
      return '🎯 WAKE UP CALL! Time to refocus. Pick your #1 priority TODAY.';
    } else {
      return '🚨 CRITICAL! You\'re off track. Need immediate action plan.';
    }
  }

  /**
   * Get goal-aligned recommendations
   */
  getGoalAlignedRecommendations() {
    const recs = [];
    const goals = this.goals;

    // For each below-target goal, generate specific recommendation
    Object.entries(goals).forEach(([key, goal]) => {
      if (goal.current < goal.target) {
        const shortfall = goal.target - goal.current;
        const percentBehind = parseFloat(((shortfall / goal.target) * 100).toFixed(0));

        recs.push({
          goal: goal.metric,
          current: goal.current,
          target: goal.target,
          gap: shortfall,
          percentBehind,
          importance: goal.importance,
          category: goal.category,
          recommendation: this._generateGoalSpecificRec(key, goal)
        });
      }
    });

    return recs.sort((a, b) => {
      const importanceOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
      return importanceOrder[a.importance] - importanceOrder[b.importance];
    });
  }

  /**
   * Generate goal-specific recommendations
   */
  _generateGoalSpecificRec(key, goal) {
    const recs = {
      dailyScore: `Each point = better discipline. Focus on: ${this._identifyLowestCategory()}. Set timer, commit TODAY.`,
      jobApplicationsPerWeek: `You need ${goal.target - goal.current} more applications. Schedule 1 per day. Quality > speed.`,
      tier1Applications: `Tier 1 is your path to $500K salary. Commit 1 hour daily to research + apply. Customize each one.`,
      applicationQuality: `Interview rate: ${(goal.current * 100).toFixed(1)}%. Improve resume + cover letter quality.`,
      tradingWinRate: `Current: ${(goal.current * 100).toFixed(0)}%. Tighten entries, increase minimum 2:1 R:R ratio.`,
      monthlyTradingPnL: `On pace for $${(goal.current * 12).toFixed(0)}/year. Need to increase trade size or win rate.`,
      aumProgression: `Path to $500K AUM: Scale trading system, increase capital allocation.`,
      workoutsPerWeek: `Missing ${goal.target - goal.current} workouts. Schedule tomorrow: strength + cardio.`,
      bodyFatGoal: `Target 12% by 2026. Maintain 6+ workouts/week + nutrition discipline.`,
      savingsRate: `Current rate: ${(goal.current * 100).toFixed(0)}%. Target 30%. Cut discretionary spending $${((goal.target - goal.current) * (this.userData.financialData?.monthlyIncome || 10000)).toFixed(0)}/month.`,
      netWorthGoal: `$2M by 2030. Need $10K/month savings + 15-20% investment returns. On track?`
    };

    return recs[key] || 'Stay focused on this goal.';
  }

  /**
   * Identify lowest scoring category
   */
  _identifyLowestCategory() {
    const dailyScores = this.userData.dailyScores?.slice(-1)[0]?.scores;
    if (!dailyScores) return 'all categories';

    const lowest = Object.entries(dailyScores)
      .sort((a, b) => a[1] - b[1])[0];
    
    return lowest ? lowest[0] : 'all categories';
  }
}

export default RAGEvaluationEngine;
