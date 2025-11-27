/**
 * Specialized Career Tracker Agent
 * Tier-specific, quality-focused analysis and actionable recommendations
 */

export class CareerTrackerAgent {
  constructor(userData) {
    this.userData = userData;
  }

  /**
   * Deep tier analysis with quality metrics
   */
  analyzeTierPerformance() {
    const applications = this.userData.jobApplications || [];
    if (applications.length === 0) return null;

    // Define tiers
    const tiers = {
      tier1: {
        label: 'Tier 1 (FAANG/Elite)',
        companies: ['Google', 'Meta', 'Apple', 'Amazon', 'Microsoft', 'Tesla', 'OpenAI', 'DeepMind'],
        target: 'Target: 5-7 per week',
        importance: 'Highest prestige, best network, highest salary',
        difficulty: 'Extremely competitive',
        successRate: 0.02 // 2% historical
      },
      tier2: {
        label: 'Tier 2 (Strong Startups/Growth)',
        companies: ['Series B-D well-funded', 'Proven founders', 'Growing 50%+ YoY'],
        target: 'Target: 3-5 per week',
        importance: 'Equity upside, learning opportunity, good network',
        difficulty: 'Competitive but achievable',
        successRate: 0.08 // 8% historical
      },
      tier3: {
        label: 'Tier 3 (Solid Companies)',
        companies: ['Series A solid', 'Good growth trajectory', 'Stable revenue'],
        target: 'Target: 3-5 per week',
        importance: 'Balance, learning, less risk',
        difficulty: 'Moderate',
        successRate: 0.15 // 15% historical
      },
      tier4: {
        label: 'Tier 4 (Safety Net)',
        companies: ['Stable large corps', 'Contract roles', 'Remote-first companies'],
        target: 'Target: 1-2 per week',
        importance: 'Fallback option',
        difficulty: 'Easiest',
        successRate: 0.30 // 30% historical
      }
    };

    const analysis = {};

    Object.entries(tiers).forEach(([key, tier]) => {
      const tierApps = applications.filter(app => {
        // Group applications into tiers (you'd have this logic based on actual company data)
        if (key === 'tier1') return app.tier === 1 || app.tier === 'tier1';
        if (key === 'tier2') return app.tier === 2 || app.tier === 'tier2';
        if (key === 'tier3') return app.tier === 3 || app.tier === 'tier3';
        if (key === 'tier4') return app.tier === 4 || app.tier === 'tier4';
      });

      const statuses = {
        applied: tierApps.filter(a => a.status === 'applied').length,
        interview: tierApps.filter(a => a.status === 'interview' || a.status === 'interviewing').length,
        offer: tierApps.filter(a => a.status === 'offer').length,
        rejected: tierApps.filter(a => a.status === 'rejected').length
      };

      const conversionRates = {
        applicationToInterview: statuses.applied > 0 ? (statuses.interview / statuses.applied * 100).toFixed(1) : 0,
        interviewToOffer: statuses.interview > 0 ? (statuses.offer / statuses.interview * 100).toFixed(1) : 0,
        applicationToOffer: tierApps.length > 0 ? (statuses.offer / tierApps.length * 100).toFixed(1) : 0
      };

      analysis[key] = {
        ...tier,
        total: tierApps.length,
        statuses,
        conversionRates,
        expectedOffers: (tierApps.length * tier.successRate).toFixed(1),
        pipelineHealth: this._assessPipelineHealth(tierApps, tier),
        qualityFlags: this._identifyQualityIssues(tierApps, tier)
      };
    });

    return analysis;
  }

  /**
   * Assess pipeline health by tier
   */
  _assessPipelineHealth(tierApps, tierDef) {
    if (tierApps.length === 0) return 'EMPTY - No applications';
    
    const interviews = tierApps.filter(a => a.status === 'interview' || a.status === 'interviewing').length;
    const offers = tierApps.filter(a => a.status === 'offer').length;
    
    if (offers > 0) return 'STRONG - Offers in pipeline';
    if (interviews > tierApps.length * 0.1) return 'HEALTHY - 10%+ interview rate';
    if (tierApps.length >= 5) return 'ACTIVE - Good application count';
    return 'WEAK - Low activity or conversion';
  }

  /**
   * Identify quality issues in applications
   */
  _identifyQualityIssues(tierApps, tierDef) {
    const flags = [];
    
    if (tierApps.length > 0 && tierApps.filter(a => a.status !== 'rejected').length === 0) {
      flags.push('ALL_REJECTED');
    }
    
    const recentRejections = tierApps
      .filter(a => a.status === 'rejected')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    if (recentRejections.length >= 2) {
      flags.push('RECENT_REJECTIONS');
    }
    
    return flags;
  }

  /**
   * Generate tier-specific recommendations
   */
  generateTierRecommendations() {
    const analysis = this.analyzeTierPerformance();
    if (!analysis) return [];

    const recommendations = [];

    // Tier 1 Analysis
    if (analysis.tier1.total < 3) {
      recommendations.push({
        tier: 'Tier 1',
        type: 'urgent',
        title: '🎯 Tier 1 Volume Too Low',
        current: `${analysis.tier1.total} applications`,
        target: '5-7 per week',
        problem: 'Tier 1 is the ONLY path to $500K salary + prestige network. Need volume to generate interviews.',
        specific: `At ${analysis.tier1.total} apps, even with 2% conversion, you get 0-1 interview. Need 7 = expected 0.14 offers/week.`,
        solution: 'Daily deep work goal: Research + apply to 1 Tier 1 company (high quality)',
        focus: 'Quality > Speed: Customized resume, tailored cover letter, research firm',
        timeline: 'This week: +5 Tier 1 applications',
        research: 'Target: Google Brain, Meta AI, OpenAI, DeepMind, Tesla AI Research',
        successFactor: '80% of offer probability depends on application quality, not just volume'
      });
    } else if (analysis.tier1.conversionRates.applicationToInterview < 5) {
      recommendations.push({
        tier: 'Tier 1',
        type: 'warning',
        title: '📊 Tier 1 Conversion Rate Low',
        current: `${analysis.tier1.conversionRates.applicationToInterview}% app→interview`,
        benchmark: '5-8% is good for Tier 1',
        problem: 'Applications not strong enough. Getting filtered out before human review.',
        analysis: `Of ${analysis.tier1.total} Tier 1 apps, only ${analysis.tier1.statuses.interview} interviews.`,
        issues: [
          'Resume may not highlight relevant skills for role',
          'Cover letter too generic',
          'LinkedIn profile not optimized',
          'Application not compelling enough'
        ],
        solution: 'Audit: Take best Tier 1 interview and reverse engineer what worked.',
        actionItems: [
          '1. Get Tier 1 offer feedback if possible (ask interviewers)',
          '2. Update resume to emphasize: Quantitative skills, projects, proven results',
          '3. Write custom cover letter for EACH application (15 min investment = 5x better)',
          '4. Optimize LinkedIn: Add trading P&L, career trajectory, recommendations'
        ],
        expectedImprovement: 'Fixing application quality: 5% → 12-15% interview rate'
      });
    }

    // Tier 2 Analysis
    if (analysis.tier2.total < 3) {
      recommendations.push({
        tier: 'Tier 2',
        type: 'insight',
        title: '💼 Tier 2 Pipeline Underdeveloped',
        current: `${analysis.tier2.total} applications`,
        target: '3-5 per week',
        benefit: 'Tier 2 has 8% conversion rate vs. 2% Tier 1. Better offer probability.',
        strategy: 'Tier 2 = Bridge opportunity: Build interviewing skills for Tier 1',
        focus: 'Prioritize: Series B-C well-funded, strong founders, $10M-$100M ARR',
        weekly: '+3 Tier 2 applications to build momentum',
        preparation: 'Tier 2 interviews = Practice for Tier 1 interviews'
      });
    }

    // Tier 3 Analysis
    if (analysis.tier3.total < 3) {
      recommendations.push({
        tier: 'Tier 3',
        type: 'insight',
        title: '🛡️ Tier 3 Safety Net Weak',
        current: `${analysis.tier3.total} applications`,
        target: '3-5 per week',
        purpose: 'Tier 3 is safety net: 15% conversion rate, solid companies, better odds',
        strategy: 'Guaranteed interview + offer probability at Tier 3 = 45-60%',
        value: 'If Tier 1/2 stall, Tier 3 provides landing',
        weekly: '+3 Tier 3 applications for security'
      });
    }

    // Tier 4 Analysis
    if (analysis.tier4.total === 0) {
      recommendations.push({
        tier: 'Tier 4',
        type: 'insight',
        title: '🆘 No Safety Net Applications',
        current: '0 applications',
        purpose: 'Tier 4 = Guaranteed backup: 30% conversion rate, remote-friendly',
        strategy: 'Not about prestige, but guaranteed employment if needed',
        examples: 'LinkedIn, remote contract firms, established tech companies',
        recommendation: 'Add 1-2 Tier 4 applications (takes 20 min each)',
        psychological: 'Knowing you have a backup = Better performance in Tier 1 interviews'
      });
    }

    // Overall Balance Check
    const tierDistribution = {
      tier1: analysis.tier1.total,
      tier2: analysis.tier2.total,
      tier3: analysis.tier3.total,
      tier4: analysis.tier4.total
    };

    const totalApps = Object.values(tierDistribution).reduce((a, b) => a + b, 0);

    if (totalApps > 0) {
      const ratios = {
        tier1Pct: ((tierDistribution.tier1 / totalApps) * 100).toFixed(0),
        tier2Pct: ((tierDistribution.tier2 / totalApps) * 100).toFixed(0),
        tier3Pct: ((tierDistribution.tier3 / totalApps) * 100).toFixed(0),
        tier4Pct: ((tierDistribution.tier4 / totalApps) * 100).toFixed(0)
      };

      const idealRatio = { tier1: 40, tier2: 30, tier3: 25, tier4: 5 };

      if (ratios.tier1Pct < 30) {
        recommendations.push({
          type: 'warning',
          title: '⚖️ Application Distribution Out of Balance',
          current: `Tier 1: ${ratios.tier1Pct}% | Tier 2: ${ratios.tier2Pct}% | Tier 3: ${ratios.tier3Pct}% | Tier 4: ${ratios.tier4Pct}%`,
          ideal: `Tier 1: 40% | Tier 2: 30% | Tier 3: 25% | Tier 4: 5%`,
          problem: 'Too many applications to lower tiers. Reduces offer probability.',
          solution: 'Shift focus: Next week, 60%+ of applications should be Tier 1-2',
          reasoning: '40% Tier 1 + 30% Tier 2 = Higher-tier offer probability'
        });
      }
    }

    return recommendations.sort((a, b) => {
      const order = { urgent: 0, warning: 1, insight: 2 };
      return (order[a.type] || 2) - (order[b.type] || 2);
    });
  }

  /**
   * Application quality checklist
   */
  getApplicationQualityChecklist() {
    return {
      before_applying: [
        '☐ Research company: Founded when, funding, recent news, product',
        '☐ Identify decision maker: Who would be your manager? LinkedIn search.',
        '☐ Customize resume: Highlight 3-5 skills matching job description',
        '☐ Write cover letter: Personal note on why YOU + why this company (not generic)',
        '☐ Review LinkedIn: Make sure profile aligns with resume',
        '☐ Check job fit: Be honest—is this 80%+ match?'
      ],
      during_interview: [
        '☐ Research interviewer: LinkedIn profile + recent activity',
        '☐ Prepare STAR stories: 5 quantitative success stories',
        '☐ Know your numbers: GitHub contributions, trading P&L, project impact',
        '☐ Have questions: Show genuine interest in company',
        '☐ Ask about compensation: Know market rate ($150-$350K range for Tier 1 Quant)'
      ],
      after_interview: [
        '☐ Send thank you email: Within 24 hours, reference specific conversation',
        '☐ Request feedback: If rejected, ask what you could improve',
        '☐ Log in tracker: Update status + key learnings',
        '☐ Analyze: What worked? What didn\'t? Document for next interview'
      ]
    };
  }

  /**
   * Weekly applications target
   */
  getWeeklyTarget() {
    const applications = this.userData.jobApplications || [];
    const thisWeek = applications.filter(app => {
      const appDate = new Date(app.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate > weekAgo;
    });

    const target = 15;
    const completed = thisWeek.length;
    const remaining = Math.max(0, target - completed);

    return {
      target,
      completed,
      remaining,
      status: completed >= target ? '✅ TARGET MET' : `⚠️ NEED ${remaining} MORE`,
      breakdown: {
        tier1: thisWeek.filter(a => a.tier === 1 || a.tier === 'tier1').length + ' / 5',
        tier2: thisWeek.filter(a => a.tier === 2 || a.tier === 'tier2').length + ' / 4',
        tier3: thisWeek.filter(a => a.tier === 3 || a.tier === 'tier3').length + ' / 4',
        tier4: thisWeek.filter(a => a.tier === 4 || a.tier === 'tier4').length + ' / 2'
      },
      pace: `At current pace: ${(completed * 52).toFixed(0)} applications/year (${(completed * 52 / 15).toFixed(1)}x target)`
    };
  }

  /**
   * Interview pipeline analysis
   */
  getInterviewPipeline() {
    const applications = this.userData.jobApplications || [];
    const interviews = applications.filter(a => a.status === 'interview' || a.status === 'interviewing');
    const offers = applications.filter(a => a.status === 'offer');
    const rejected = applications.filter(a => a.status === 'rejected');

    return {
      totalApplications: applications.length,
      interviews: interviews.length,
      offers: offers.length,
      rejected: rejected.length,
      conversionRate: applications.length > 0 ? ((offers.length / applications.length) * 100).toFixed(1) : 0,
      expectedOffers: this._calculateExpectedOffers(),
      upcomingInterviews: interviews.slice(0, 5).map(i => ({
        company: i.company,
        position: i.position,
        status: i.status,
        date: i.date
      }))
    };
  }

  /**
   * Expected offers calculation
   */
  _calculateExpectedOffers() {
    const analysis = this.analyzeTierPerformance();
    if (!analysis) return 0;

    let expected = 0;
    expected += (analysis.tier1.total || 0) * 0.02;
    expected += (analysis.tier2.total || 0) * 0.08;
    expected += (analysis.tier3.total || 0) * 0.15;
    expected += (analysis.tier4.total || 0) * 0.30;

    return parseFloat(expected.toFixed(2));
  }

  /**
   * 2026 career goal tracking
   */
  getCareerGoalProgress() {
    return {
      goal2026: 'Quant Researcher at Tier 1 firm',
      requirements: {
        education: 'MS in relevant field (Statistics, CS, Physics, or similar)',
        experience: 'Track record: $500K+ trading AUM with 20%+ returns',
        network: 'Strong relationships at target firms',
        portfolio: 'Published research or significant projects'
      },
      currentStatus: {
        education: 'In progress (needs to start/complete)',
        trading: `Trading P&L: ${this.userData.financialData?.monthlyIncome || 0} (path to $500K AUM)`,
        network: 'Building through applications',
        portfolio: 'Dashboard app is strong portfolio piece'
      },
      timeline: {
        thisYear: 'Build trading AUM, get interviews, network',
        2025: 'Secure $100K+ AUM, complete MS application',
        2026: 'Target: Quant researcher role with strong AUM history'
      }
    };
  }
}

export default CareerTrackerAgent;
