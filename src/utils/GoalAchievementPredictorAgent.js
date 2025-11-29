/**
 * GoalAchievementPredictorAgent.js
 * 
 * Advanced Prediction Engine for 2026 Goal Achievement
 * 
 * Uses:
 * - Historical trajectories
 * - Velocity analysis
 * - Neuroplasticity phases
 * - Compound growth models
 * - Risk factors
 * - Opportunity factors
 * 
 * Provides:
 * - Individual goal achievement probability
 * - Timeline predictions
 * - Critical success factors
 * - Risk warnings
 * - Acceleration opportunities
 */

export class GoalAchievementPredictorAgent {
  constructor(userData) {
    this.userData = userData;
    this.dailyScores = userData.dailyScores || [];
    this.jobApplications = userData.jobApplications || [];
    this.tradingJournal = userData.tradingJournal || [];
    this.workouts = userData.workouts || [];
    this.financialData = userData.financialData || {};
    this.goals = userData.goals || [];
    this.today = new Date();
    this.endOf2026 = new Date(2026, 11, 31);
    this.daysRemaining = Math.floor((this.endOf2026 - this.today) / (1000 * 60 * 60 * 24));
  }

  /**
   * Get comprehensive 2026 predictions
   */
  get2026Predictions() {
    return {
      overallScore: this._predictOverallAchievement(),
      byGoal: this._predictIndividualGoals(),
      timeline: this._predictTimeline(),
      riskFactors: this._identifyRiskFactors(),
      opportunities: this._identifyOpportunities(),
      criticalFactors: this._identifyCriticalFactors(),
      confidenceScore: this._calculateConfidence(),
      recommendation: this._generateRecommendation()
    };
  }

  /**
   * Predict overall achievement probability
   */
  _predictOverallAchievement() {
    const predictions = this._predictIndividualGoals();
    
    // Weight by importance
    const weights = {
      dailyScore: 1.0,        // Foundation
      careerRole: 1.2,        // Most important
      tradingAUM: 1.1,        // Major wealth driver
      netWorth: 1.0,          // Financial goal
      bodyFat: 0.8,           // Health goal
      workouts: 0.8,          // Consistency
      applications: 1.1,      // Career driver
      savingsRate: 0.9,       // Finance driver
      learningHours: 0.7      // Support goal
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(predictions).forEach(([goal, pred]) => {
      const weight = weights[goal] || 1;
      // Parse probability string (e.g., "75.3%") to number
      const probStr = String(pred.probability || '0').replace('%', '').trim();
      const probNum = parseFloat(probStr) / 100 || 0; // Convert back to 0-1 scale
      totalScore += probNum * weight;
      totalWeight += weight;
    });

    const overallProbability = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      probability: (Math.max(0, Math.min(1, overallProbability)) * 100).toFixed(1) + '%',
      description: this._getAchievementDescription(overallProbability),
      status: overallProbability >= 0.85 ? 'Excellent' : 
              overallProbability >= 0.70 ? 'Very Good' : 
              overallProbability >= 0.50 ? 'Good' : 
              overallProbability >= 0.30 ? 'Fair' : 'Poor',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Predict individual goal achievements
   */
  _predictIndividualGoals() {
    return {
      dailyScore: this._predictDailyScore(),
      careerRole: this._predictCareerAchievement(),
      tradingAUM: this._predictTradingAUM(),
      netWorth: this._predictNetWorth(),
      bodyFat: this._predictBodyFat(),
      workouts: this._predictWorkoutConsistency(),
      applications: this._predictApplicationSuccess(),
      savingsRate: this._predictSavingsRate(),
      learningHours: this._predictLearningProgress()
    };
  }

  /**
   * Predict Daily Score (7 → 8+)
   */
  _predictDailyScore() {
    const last7 = this.dailyScores.slice(-7).map(s => s?.score || 0);
    const last30 = this.dailyScores.slice(-30).map(s => s?.score || 0);
    
    const avg7 = last7.length > 0 ? last7.reduce((a, b) => a + b, 0) / last7.length : 0;
    const avg30 = last30.length > 0 ? last30.reduce((a, b) => a + b, 0) / last30.length : 0;
    
    // Calculate velocity
    const weeklyVelocity = (avg7 - avg30) / 4; // per week
    const velocity = Math.max(0.1, weeklyVelocity); // Min 0.1 per week
    
    // Project to 2026
    const weeksRemaining = Math.floor(this.daysRemaining / 7);
    const projected = avg7 + (velocity * weeksRemaining);
    const target = 8;

    return {
      current: avg7.toFixed(1),
      target: target,
      projected: Math.min(10, projected).toFixed(1),
      probability: this._calculateProbability(projected, target, 10),
      velocity: `+${velocity.toFixed(2)}/week`,
      timeToTarget: projected >= target ? 'Achieved' : `${Math.ceil((target - projected) / Math.max(0.01, velocity))} weeks`,
      factors: [
        `Current: ${avg7.toFixed(1)}/10 (${(avg7/10*100).toFixed(0)}%)`,
        `Trend: +${velocity.toFixed(2)}/week`,
        `Neuroplasticity phase: ${this._getNeuroplasticityPhase(this.dailyScores.length)}`,
        `Psychology coaching active: +0.5/week expected`
      ]
    };
  }

  /**
   * Predict Career Achievement (Quant Researcher role)
   */
  _predictCareerAchievement() {
    const last7Apps = this.jobApplications.filter(a => {
      const date = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const last30Apps = this.jobApplications.filter(a => {
      const date = new Date(a.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return date >= monthAgo;
    }).length;

    const tier1Apps = this.jobApplications.filter(a => a.tier === 'Tier 1').length;
    
    // Estimate conversion rates
    const interviews = this.jobApplications.filter(a => a.status === 'Interview').length;
    const offers = this.jobApplications.filter(a => a.status === 'Offer').length;
    
    const interviewRate = this.jobApplications.length > 0 ? interviews / this.jobApplications.length : 0;
    const offerRate = this.jobApplications.length > 0 ? offers / this.jobApplications.length : 0;

    // Project forward
    const monthsRemaining = Math.ceil(this.daysRemaining / 30);
    const projectedApps = last7Apps * (monthsRemaining / 4); // Assume consistent pace
    const projectedInterviews = projectedApps * interviewRate * 1.2; // 20% improvement expected
    const projectedOffers = projectedApps * offerRate * 1.5; // 50% improvement from optimization

    const hasTargetOffer = projectedOffers >= 1;
    const probability = hasTargetOffer ? 0.85 : (projectedOffers / 1);

    return {
      target: 'Quant Researcher role at Tier 1 firm',
      currentProgress: `${tier1Apps} Tier 1 apps, ${interviews} interviews, ${offers} offers`,
      monthlyVelocity: `${last7Apps * 4}/month (${last7Apps}/week)`,
      projectedApplications: Math.ceil(projectedApps),
      projectedInterviews: Math.ceil(projectedInterviews),
      projectedOffers: Math.ceil(projectedOffers),
      probability: (probability * 100).toFixed(1) + '%',
      criticalFactor: last7Apps < 15 ? 'CRITICAL: App volume too low' : 'On pace',
      timeline: offers > 0 ? 'Offer in hand - execute' : `${projectedOffers >= 1 ? 'Q3-Q4 2026' : '2027+'}`,
      accelerators: [
        'Increase Tier 1 apps to 5-7/week (currently below)',
        'Improve interview conversion (better prep)',
        'Network with 50+ industry professionals',
        'Build strong trading track record (credibility)'
      ]
    };
  }

  /**
   * Predict Trading AUM ($500K target)
   */
  _predictTradingAUM() {
    const totalTrades = this.tradingJournal.length;
    const winRate = totalTrades > 0 
      ? (this.tradingJournal.filter(t => (t.pnl || 0) > 0).length / totalTrades)
      : 0;
    
    const totalPnL = this.tradingJournal.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const avgMonthlyPnL = totalPnL / Math.max(1, this.tradingJournal.length / 20); // Estimate months
    
    const currentAUM = this.financialData?.tradingAUM || 50000; // Assume starting point
    const targetAUM = 500000;
    
    // Calculate growth rate
    const monthlyReturnRate = avgMonthlyPnL > 0 ? avgMonthlyPnL / currentAUM : 0.15; // Assume 15% monthly if no PnL yet
    const monthsRemaining = Math.ceil(this.daysRemaining / 30);
    
    // Compound growth
    const projectedAUM = currentAUM * Math.pow(1 + monthlyReturnRate, monthsRemaining);
    const probability = Math.min(1, projectedAUM / targetAUM);

    return {
      current: `$${(currentAUM / 1000).toFixed(0)}K`,
      target: '$500K',
      projected: `$${(projectedAUM / 1000).toFixed(0)}K`,
      probability: (probability * 100).toFixed(1) + '%',
      winRate: (winRate * 100).toFixed(0) + '%',
      monthlyReturnRate: (monthlyReturnRate * 100).toFixed(1) + '%',
      monthsToTarget: projectedAUM >= targetAUM ? 'Achieved' : `${Math.ceil(Math.log(targetAUM / currentAUM) / Math.log(1 + monthlyReturnRate))} months`,
      criticalFactor: winRate < 0.45 ? 'CRITICAL: Win rate too low' : 'On track',
      factors: [
        `Current: $${(currentAUM / 1000).toFixed(0)}K`,
        `Win rate: ${(winRate * 100).toFixed(0)}%`,
        `Monthly growth: ${(monthlyReturnRate * 100).toFixed(1)}%`,
        `Required to reach $500K: ${(monthlyReturnRate * 100).toFixed(1)}% monthly`
      ]
    };
  }

  /**
   * Predict Net Worth ($2M by 2030, track progress to 2026)
   */
  _predictNetWorth() {
    const currentNetWorth = this.financialData?.netWorth || 100000;
    const target2026 = 250000; // Intermediate target (1/4 of way to $2M by 2030)
    
    const monthlyIncome = this.financialData?.monthlyIncome || 5000;
    const savingsRate = this.financialData?.savingsRate || 0.3;
    const monthlySavings = monthlyIncome * savingsRate;
    
    const investmentReturn = 0.15; // Assume 15% annual return
    const monthlyReturnRate = Math.pow(1 + investmentReturn, 1/12) - 1;
    
    const monthsRemaining = Math.ceil(this.daysRemaining / 30);
    
    // Calculate compound growth
    let projected = currentNetWorth;
    for (let i = 0; i < monthsRemaining; i++) {
      projected = projected * (1 + monthlyReturnRate) + monthlySavings;
    }
    
    const probability = Math.min(1, projected / target2026);

    return {
      current: `$${(currentNetWorth / 1000).toFixed(0)}K`,
      target2026: `$${(target2026 / 1000).toFixed(0)}K`,
      target2030: '$2M',
      projected2026: `$${(projected / 1000).toFixed(0)}K`,
      probability: (probability * 100).toFixed(1) + '%',
      monthlySavings: `$${monthlySavings.toFixed(0)}`,
      investmentReturn: `${(investmentReturn * 100).toFixed(0)}% annual`,
      factors: [
        `Current: $${(currentNetWorth / 1000).toFixed(0)}K`,
        `Monthly savings: $${monthlySavings.toFixed(0)}`,
        `Investment returns: ${(investmentReturn * 100).toFixed(0)}% annually`,
        `Career growth impact: +$100K/year potential`,
        `Trading success impact: +$50K-200K/year`
      ]
    };
  }

  /**
   * Predict Body Fat (12% by 2026)
   */
  _predictBodyFat() {
    const workoutsPerWeek = this.workouts.filter(w => {
      const date = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const currentBodyFat = this.financialData?.bodyFat || 14;
    const target = 12;
    const improvementPerMonth = 0.5; // Estimate -0.5% per month with consistent training
    
    const monthsRemaining = Math.ceil(this.daysRemaining / 30);
    const projected = currentBodyFat - (improvementPerMonth * monthsRemaining);
    
    const probability = Math.min(1, (currentBodyFat - projected) / (currentBodyFat - target));

    return {
      current: `${currentBodyFat}%`,
      target: '12%',
      projected: `${Math.max(target, projected).toFixed(1)}%`,
      probability: (probability * 100).toFixed(1) + '%',
      workoutsPerWeek: workoutsPerWeek,
      improvementPerMonth: `-${improvementPerMonth}% estimated`,
      timeline: projected <= target ? 'Achieved' : `${Math.ceil((projected - target) / improvementPerMonth)} months`,
      criticalFactor: workoutsPerWeek >= 6 ? 'On pace' : `ATTENTION: Only ${workoutsPerWeek}/week (target 6+)`
    };
  }

  /**
   * Predict Workout Consistency (6+ per week)
   */
  _predictWorkoutConsistency() {
    const last7Workouts = this.workouts.filter(w => {
      const date = new Date(w.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const last30Workouts = this.workouts.filter(w => {
      const date = new Date(w.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return date >= monthAgo;
    }).length;

    const avgPerWeek = last30Workouts > 0 ? (last30Workouts / 4.3) : 0;
    const target = 6;
    
    const probability = Math.min(1, avgPerWeek / target);

    return {
      last7Days: last7Workouts,
      lastMonthAverage: avgPerWeek.toFixed(1),
      target: target,
      probability: (probability * 100).toFixed(1) + '%',
      status: avgPerWeek >= target ? 'On pace' : 'Below target',
      gap: (target - avgPerWeek).toFixed(1),
      recommendation: avgPerWeek < target ? `Add ${Math.ceil(target - avgPerWeek)} workouts/week` : 'Maintain consistency'
    };
  }

  /**
   * Predict Application Success (15+ per week)
   */
  _predictApplicationSuccess() {
    const last7Apps = this.jobApplications.filter(a => {
      const date = new Date(a.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length;

    const last30Apps = this.jobApplications.filter(a => {
      const date = new Date(a.date);
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      return date >= monthAgo;
    }).length;

    const avgPerWeek = last30Apps > 0 ? (last30Apps / 4.3) : 0;
    const target = 15;
    
    const probability = Math.min(1, avgPerWeek / target);

    return {
      last7Days: last7Apps,
      lastMonthAverage: avgPerWeek.toFixed(1),
      target: target,
      probability: (probability * 100).toFixed(1) + '%',
      status: avgPerWeek >= target ? 'On pace' : 'Below target',
      gap: (target - avgPerWeek).toFixed(1),
      recommendation: avgPerWeek < target ? `Increase by ${Math.ceil(target - avgPerWeek)}/week` : 'Maintain quality + volume'
    };
  }

  /**
   * Predict Savings Rate (30%)
   */
  _predictSavingsRate() {
    const monthlyIncome = this.financialData?.monthlyIncome || 5000;
    const monthlyExpenses = this.financialData?.monthlyExpenses || 3500;
    const currentRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) : 0;
    const target = 0.30;

    const probability = Math.min(1, currentRate / target);

    return {
      current: (currentRate * 100).toFixed(1) + '%',
      target: '30%',
      probability: (probability * 100).toFixed(1) + '%',
      status: currentRate >= target ? 'On pace' : 'Below target',
      monthlyIncome: `$${monthlyIncome.toFixed(0)}`,
      monthlyExpenses: `$${monthlyExpenses.toFixed(0)}`,
      monthlySavings: `$${(monthlyIncome - monthlyExpenses).toFixed(0)}`,
      recommendation: currentRate < target ? 'Reduce expenses or increase income' : 'Maintain discipline'
    };
  }

  /**
   * Predict Learning Progress
   */
  _predictLearningProgress() {
    const target = 250; // hours per year
    const monthsRemaining = Math.ceil(this.daysRemaining / 30);
    const hoursRemaining = target * (monthsRemaining / 12);
    
    const probability = 1.0; // Learning is self-paced, achievable

    return {
      target: '250 hours/year',
      hoursRemaining: hoursRemaining.toFixed(0),
      monthlyTarget: `${(target / 12).toFixed(0)} hours`,
      probability: (probability * 100).toFixed(1) + '%',
      status: 'Achievable with 1h/day',
      recommendation: 'Maintain 1h daily learning habit'
    };
  }

  /**
   * Predict overall timeline to goals
   */
  _predictTimeline() {
    const predictions = this._predictIndividualGoals();
    
    return {
      q4_2025: [
        predictions.dailyScore.probability >= 0.5 ? '✅ Daily Score 7.5+' : '⚠️ Daily Score building',
        predictions.applications.last7Days >= 10 ? '✅ Career momentum' : '⚠️ Increase app volume'
      ],
      q1_2026: [
        predictions.careerRole.projectedInterviews > 0 ? '✅ Career interviews' : '⚠️ Interview prep needed',
        predictions.tradingAUM.probability >= 0.5 ? '✅ Trading scalable' : '⚠️ Focus on consistency'
      ],
      q2_q3_2026: [
        predictions.careerRole.probability >= 0.7 ? '✅ Offer likely' : '⚠️ Maintain pressure',
        predictions.netWorth.probability >= 0.7 ? '✅ Net worth on track' : '⚠️ Income acceleration needed'
      ],
      q4_2026: [
        '✅ 2026 objectives achieved',
        '🚀 Ready for 2027 scaling'
      ]
    };
  }

  /**
   * Identify risk factors
   */
  _identifyRiskFactors() {
    const risks = [];
    const predictions = this._predictIndividualGoals();

    // Low app volume
    if (predictions.applications.lastMonthAverage < 10) {
      risks.push({
        factor: 'Insufficient Career Application Volume',
        severity: 'CRITICAL',
        impact: 'Career goal achievement probability -40%',
        mitigation: 'Increase to 15+ apps/week immediately'
      });
    }

    // Low consistency
    if (this.dailyScores.length < 30) {
      risks.push({
        factor: 'Consistency Not Established',
        severity: 'HIGH',
        impact: 'Neuroplasticity not activated, willpower still scarce',
        mitigation: 'Build 21-day consistency streak (builds neural pathways)'
      });
    }

    // Low workouts
    if (predictions.workouts.lastMonthAverage < 5) {
      risks.push({
        factor: 'Insufficient Workout Volume',
        severity: 'MEDIUM',
        impact: 'Health goal at risk, energy management compromised',
        mitigation: 'Schedule 6+ workouts/week, habit stack to make automatic'
      });
    }

    return risks;
  }

  /**
   * Identify opportunities
   */
  _identifyOpportunities() {
    const opportunities = [];
    const predictions = this._predictIndividualGoals();

    // Consistency advantage
    if (this.dailyScores.length > 30) {
      opportunities.push({
        opportunity: 'Neuroplasticity Activated',
        potential: '+2-3 hours effective willpower daily',
        action: 'Leverage automated habits to scale other goals'
      });
    }

    // Trading growth
    if (predictions.trading.probability >= 0.5) {
      opportunities.push({
        opportunity: 'Trading Momentum',
        potential: 'Compound growth to $500K AUM',
        action: 'Scale position sizing, diversify strategies'
      });
    }

    // Career momentum
    if (predictions.applications.lastMonthAverage >= 12) {
      opportunities.push({
        opportunity: 'Career Pipeline Building',
        potential: '85%+ probability of Tier 1 offer',
        action: 'Accelerate networking + interview prep'
      });
    }

    return opportunities;
  }

  /**
   * Identify critical success factors
   */
  _identifyCriticalFactors() {
    return [
      '🎯 Career: 15+ quality applications/week (path to $500K salary)',
      '📈 Trading: 50%+ win rate + consistent execution (path to $500K AUM)',
      '💪 Health: 6+ workouts/week + sleep optimization (supports both)',
      '🧠 Discipline: 7+ daily score + consistency streak (neuroplasticity)',
      '💰 Finance: 30% savings rate + income growth (path to $2M)',
      '📚 Learning: 1h/day focused learning (supports all goals)',
      '😴 Sleep: 8h nightly (multiplier for all performance)'
    ];
  }

  /**
   * Calculate overall confidence
   */
  _calculateConfidence() {
    const dataPoints = this.dailyScores.length + 
                      this.jobApplications.length + 
                      this.tradingJournal.length + 
                      this.workouts.length;
    
    const confidence = Math.min(1, (dataPoints / 500)); // More data = higher confidence

    return {
      dataPoints,
      level: confidence >= 0.8 ? 'Very High' : confidence >= 0.6 ? 'High' : confidence >= 0.4 ? 'Moderate' : 'Low',
      percentage: (confidence * 100).toFixed(0) + '%'
    };
  }

  /**
   * Generate recommendation
   */
  _generateRecommendation() {
    const overall = this._predictOverallAchievement();
    const prob = parseFloat(overall.probability) / 100;

    if (prob >= 0.85) {
      return '🟢 EXCELLENT - On track for 95%+ of 2026 goals. Maintain systems, execute, optimize.';
    } else if (prob >= 0.70) {
      return '🟡 GOOD - 70-85% probability. Focus on fixing 1-2 bottlenecks (career apps, sleep).';
    } else if (prob >= 0.50) {
      return '🟠 FAIR - 50-70% probability. Critical fixes needed: increase app volume + consistency.';
    } else {
      return '🔴 POOR - <50% probability. Major restructuring needed. Focus on top 3 goals only.';
    }
  }

  // Helper methods
  _calculateProbability(projected, target, max) {
    if (projected >= target) return 1.0;
    if (projected >= target * 0.8) return 0.8;
    if (projected >= target * 0.6) return 0.6;
    return Math.max(0.1, projected / target);
  }

  _getNeuroplasticityPhase(streak) {
    if (streak < 7) return 'Initial (Days 1-7)';
    if (streak < 21) return 'Forming (Days 7-21)';
    if (streak < 66) return 'Building (Days 21-66)';
    return 'Established (66+ days)';
  }

  _getAchievementDescription(prob) {
    if (prob >= 0.9) return 'Very likely to achieve most/all 2026 goals';
    if (prob >= 0.75) return 'Good chance of achieving 2026 goals';
    if (prob >= 0.60) return 'Reasonable chance with focused effort';
    if (prob >= 0.40) return 'Possible but requires significant improvements';
    return 'Unlikely unless major changes made';
  }
}

export default GoalAchievementPredictorAgent;
