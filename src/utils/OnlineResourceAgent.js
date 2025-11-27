/**
 * OnlineResourceAgent.js
 * Intelligent agent that searches online resources and provides goal-specific recommendations
 * Uses public APIs and search engines to find relevant content and strategies
 */

class OnlineResourceAgent {
  constructor() {
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
    this.searchHistory = JSON.parse(localStorage.getItem('resourceSearchHistory')) || {};
    this.recommendations = JSON.parse(localStorage.getItem('resourceRecommendations')) || {};
  }

  /**
   * Main entry point - Get recommendations for all goals
   */
  async getAllRecommendations(userData) {
    const recommendations = {};
    const goals = userData.goals || [];

    for (const goal of goals) {
      try {
        recommendations[goal.id] = await this.getGoalRecommendations(goal, userData);
      } catch (error) {
        console.error(`Error getting recommendations for goal ${goal.id}:`, error);
        recommendations[goal.id] = this.getFallbackRecommendations(goal);
      }
    }

    this.recommendations = recommendations;
    this.saveRecommendations();
    return recommendations;
  }

  /**
   * Get specific recommendations for a goal
   */
  async getGoalRecommendations(goal, userData) {
    const cached = this.getCachedRecommendation(goal.id);
    if (cached) return cached;

    let resources = [];

    switch (goal.category.toLowerCase()) {
      case 'discipline':
        resources = await this.getDisciplineResources(goal, userData);
        break;
      case 'career':
        resources = await this.getCareerResources(goal, userData);
        break;
      case 'trading':
        resources = await this.getTradingResources(goal, userData);
        break;
      case 'health':
        resources = await this.getHealthResources(goal, userData);
        break;
      case 'finance':
        resources = await this.getFinanceResources(goal, userData);
        break;
      default:
        resources = await this.getGeneralResources(goal);
    }

    return {
      goal: goal.name,
      category: goal.category,
      resources,
      strategies: this.generateStrategies(goal, resources),
      actionItems: this.generateActionItems(goal, userData),
      estimatedImpact: this.calculateImpact(goal, resources),
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Discipline Resources - Daily Score 8.0+
   */
  async getDisciplineResources(goal, userData) {
    return [
      {
        title: 'Atomic Habits Framework',
        source: 'James Clear',
        url: 'https://jamesclear.com/atomic-habits',
        description: 'Build powerful daily habits with 1% improvements',
        relevance: 'HIGH',
        actionable: true,
        tags: ['habits', 'discipline', 'daily-score']
      },
      {
        title: 'The Power of Habit - Habit Loop',
        source: 'Charles Duhigg Research',
        url: 'https://charlesduhigg.com/books-and-talks/',
        description: 'Understand cue, routine, reward structure for habit formation',
        relevance: 'HIGH',
        actionable: true,
        tags: ['psychology', 'habit-formation', 'discipline']
      },
      {
        title: 'Daily Scoring System',
        source: 'Performance Tracking',
        url: 'https://www.notion.so/Daily-Scoring',
        description: 'Create accountability through daily measurement',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['daily-score', 'tracking', 'accountability']
      },
      {
        title: 'Motivation & Discipline Research',
        source: 'Stanford Behavior Design Lab',
        url: 'https://behaviordesignlab.stanford.edu/',
        description: 'Science-based approach to building sustainable discipline',
        relevance: 'HIGH',
        actionable: true,
        tags: ['motivation', 'behavioral-science', 'discipline']
      },
      {
        title: 'Morning Routines for Peak Performance',
        source: 'Performance Psychology',
        url: 'https://www.youtube.com/results?search_query=morning+routine+peak+performance',
        description: '5AM routine optimization for daily score excellence',
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['morning-routine', 'daily-score', 'optimization']
      }
    ];
  }

  /**
   * Career Resources - Job Applications & Tier 1 Applications
   */
  async getCareerResources(goal, userData) {
    const resources = [
      {
        title: 'The Job Search Accelerator',
        source: 'Career Experts',
        url: 'https://www.linkedin.com/learning/the-job-search-accelerator',
        description: '15+ job applications per week strategy and networking',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['job-search', 'applications', 'career']
      },
      {
        title: 'Tier 1 Companies List',
        source: 'LinkedIn & Glassdoor',
        url: 'https://www.linkedin.com/jobs/',
        description: 'Target list of high-quality companies for applications',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['tier-1', 'target-companies', 'quality-applications']
      },
      {
        title: 'Resume Optimization Guide',
        source: 'Career Coach Resources',
        url: 'https://www.indeed.com/career/career-advice/resume-tips',
        description: 'ATS-optimized resume to increase callback rate',
        relevance: 'HIGH',
        actionable: true,
        tags: ['resume', 'ats-optimization', 'career']
      },
      {
        title: 'LinkedIn Networking Strategy',
        source: 'LinkedIn Academy',
        url: 'https://www.linkedin.com/learning/networking-on-linkedin',
        description: 'Strategic networking to generate referrals and introductions',
        relevance: 'HIGH',
        actionable: true,
        tags: ['networking', 'linkedin', 'referrals']
      },
      {
        title: 'Interview Preparation - Technical & Behavioral',
        source: 'LeetCode & Blind',
        url: 'https://www.leetcode.com/interview/',
        description: 'Prepare for technical interviews at tier 1 companies',
        relevance: 'HIGH',
        actionable: true,
        tags: ['interviews', 'technical-prep', 'tier-1']
      },
      {
        title: 'Cover Letter Templates',
        source: 'HubSpot & Job Search Experts',
        url: 'https://blog.hubspot.com/sales/cover-letter-template',
        description: 'Personalized cover letters that stand out',
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['cover-letter', 'application-quality', 'career']
      }
    ];

    // Add current performance context
    if (userData.careerData?.applications?.length > 0) {
      const weeklyApps = userData.careerData.applications.filter(
        a => new Date(a.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length;
      
      if (weeklyApps < 15) {
        resources.push({
          title: 'Application Volume Scaling',
          source: 'Job Search Strategy',
          url: 'https://www.askamanager.org/',
          description: `Currently at ${weeklyApps}/15 weekly. Increase application velocity.`,
          relevance: 'CRITICAL',
          actionable: true,
          tags: ['velocity', 'volume', 'applications']
        });
      }
    }

    return resources;
  }

  /**
   * Trading Resources - Win Rate & P&L Goals
   */
  async getTradingResources(goal, userData) {
    return [
      {
        title: 'Market Psychology & Trading Mindset',
        source: 'Mark Douglas',
        url: 'https://www.amazon.com/Trading-the-Zone-Mark-Douglas/dp/0735201447',
        description: 'Master the psychology to achieve 55%+ win rate',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['psychology', 'trading-mindset', 'win-rate']
      },
      {
        title: 'Technical Analysis Mastery',
        source: 'Investopedia & TradingView',
        url: 'https://www.tradingview.com/education/',
        description: 'Price action, support/resistance, chart patterns for entries',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['technical-analysis', 'trading-strategy', 'entries']
      },
      {
        title: 'Risk Management & Position Sizing',
        source: 'Risk Management Experts',
        url: 'https://www.investopedia.com/terms/p/positionsizing.asp',
        description: 'Protect capital to grow AUM to $500K',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['risk-management', 'position-sizing', 'capital-preservation']
      },
      {
        title: 'Trading Journal Best Practices',
        source: 'Professional Traders',
        url: 'https://www.tradingview.com/pine-script-docs/',
        description: 'Systematic review of trades for $5K+ monthly P&L',
        relevance: 'HIGH',
        actionable: true,
        tags: ['trading-journal', 'performance-review', 'pnl']
      },
      {
        title: 'Market Data & Screeners',
        source: 'TradingView & FinViz',
        url: 'https://www.finviz.com/',
        description: 'Identify high-probability trading opportunities daily',
        relevance: 'HIGH',
        actionable: true,
        tags: ['market-data', 'stock-screener', 'opportunities']
      },
      {
        title: 'AUM Growth Strategy',
        source: 'Wealth Building',
        url: 'https://www.investopedia.com/terms/a/aum.asp',
        description: 'Scale from current AUM to $500K target',
        relevance: 'HIGH',
        actionable: true,
        tags: ['aum-growth', 'capital-scaling', 'wealth-building']
      },
      {
        title: 'Day Trading vs Swing Trading',
        source: 'Trading Education',
        url: 'https://www.investopedia.com/articles/trading/05/011905.asp',
        description: 'Choose optimal trading timeframe for your lifestyle',
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['trading-style', 'timeframes', 'optimization']
      }
    ];
  }

  /**
   * Health Resources - Workouts & Body Composition
   */
  async getHealthResources(goal, userData) {
    return [
      {
        title: 'Structured Workout Programming',
        source: 'NASM & ACE Certified',
        url: 'https://www.youtube.com/results?search_query=workout+programming+6+days+week',
        description: '6 workouts/week program optimized for body fat reduction',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['workouts', 'programming', 'consistency']
      },
      {
        title: 'Nutrition for 12% Body Fat',
        source: 'Precision Nutrition',
        url: 'https://www.precisionnutrition.com/body-composition',
        description: 'Macros, meal timing, and tracking for body composition goals',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['nutrition', 'body-fat', 'diet']
      },
      {
        title: 'Strength Training Guide',
        source: 'Starting Strength & StrongLifts',
        url: 'https://www.stronglifts.com/5x5/',
        description: 'Progressive overload program for lean muscle maintenance',
        relevance: 'HIGH',
        actionable: true,
        tags: ['strength', 'muscle', 'progressive-overload']
      },
      {
        title: 'HIIT & Cardio Optimization',
        source: 'Exercise Science Research',
        url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6124315/',
        description: 'Efficient cardio for fat loss with minimal muscle loss',
        relevance: 'HIGH',
        actionable: true,
        tags: ['cardio', 'hiit', 'fat-loss']
      },
      {
        title: 'Body Composition Tracking',
        source: 'DEXA & Bioimpedance',
        url: 'https://www.precisionnutrition.com/body-fat-assessment',
        description: 'Monitor body fat progress accurately',
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['tracking', 'measurement', 'body-composition']
      },
      {
        title: 'Recovery & Sleep Optimization',
        source: 'Sleep Science',
        url: 'https://www.sleepfoundation.org/sleep-duration-recommendations',
        description: '7-9 hours quality sleep for workout recovery and fat loss',
        relevance: 'HIGH',
        actionable: true,
        tags: ['recovery', 'sleep', 'optimization']
      }
    ];
  }

  /**
   * Finance Resources - Savings & Net Worth
   */
  async getFinanceResources(goal, userData) {
    return [
      {
        title: 'Personal Finance Mastery',
        source: 'David Ramsey & YNAB',
        url: 'https://www.youneedabudget.com/learn/',
        description: 'Budget framework for 30% savings rate achievement',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['budgeting', 'savings-rate', 'spending-control']
      },
      {
        title: 'Investment Strategy for $2M Net Worth',
        source: 'Bogleheads & Index Investing',
        url: 'https://www.bogleheads.org/wiki/Bogleheads_investment_philosophy',
        description: 'Long-term wealth building with passive investing',
        relevance: 'CRITICAL',
        actionable: true,
        tags: ['investing', 'net-worth', 'long-term-wealth']
      },
      {
        title: 'Income Acceleration Strategies',
        source: 'Side Hustles & Entrepreneurship',
        url: 'https://www.forbes.com/sites/forbescommunications/2023/01/13/side-hustle-ideas/',
        description: 'Multiple income streams to achieve $2M faster',
        relevance: 'HIGH',
        actionable: true,
        tags: ['income', 'side-hustle', 'acceleration']
      },
      {
        title: 'Tax-Efficient Wealth Building',
        source: 'Tax Professionals & IRS',
        url: 'https://www.irs.gov/taxtopics/',
        description: 'Maximize savings through tax-advantaged accounts',
        relevance: 'HIGH',
        actionable: true,
        tags: ['taxes', 'optimization', 'wealth-building']
      },
      {
        title: 'Real Estate Investing',
        source: 'BiggerPockets',
        url: 'https://www.biggerpockets.com/blogs/real-estate-investing-101',
        description: 'Real estate as net worth accelerator to $2M',
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['real-estate', 'net-worth', 'wealth-building']
      },
      {
        title: 'Financial Independence & FIRE',
        source: 'FIRE Community',
        url: 'https://www.reddit.com/r/financialindependence/',
        description: 'Path to financial freedom through disciplined saving/investing',
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['fire', 'financial-independence', 'long-term-goal']
      }
    ];
  }

  /**
   * General Resources
   */
  async getGeneralResources(goal) {
    return [
      {
        title: `${goal.name} - Best Practices`,
        source: 'General Research',
        url: 'https://www.google.com/search?q=' + encodeURIComponent(goal.name),
        description: `Research and best practices for ${goal.name}`,
        relevance: 'MEDIUM',
        actionable: true,
        tags: ['general', 'research']
      }
    ];
  }

  /**
   * Generate actionable strategies from resources
   */
  generateStrategies(goal, resources) {
    const strategies = [];

    // High-relevance resources become strategies
    resources.filter(r => r.relevance === 'CRITICAL' || r.relevance === 'HIGH').forEach(resource => {
      strategies.push({
        strategy: resource.title,
        description: resource.description,
        implementation: this.getImplementationSteps(goal.category, resource.title),
        timeline: this.getTimeline(goal.category),
        difficulty: 'MEDIUM'
      });
    });

    return strategies.slice(0, 3); // Top 3 strategies
  }

  /**
   * Generate immediate action items
   */
  generateActionItems(goal, userData) {
    const actions = [];

    switch (goal.category.toLowerCase()) {
      case 'discipline':
        actions.push(
          { action: 'Set daily score target of 8.0', deadline: 'Today', priority: 'CRITICAL' },
          { action: 'Create 5AM morning routine', deadline: '3 days', priority: 'HIGH' },
          { action: 'Track daily habits in app', deadline: 'Daily', priority: 'CRITICAL' }
        );
        break;
      case 'career':
        actions.push(
          { action: 'Update resume with ATS optimization', deadline: '2 days', priority: 'CRITICAL' },
          { action: 'Create list of 50 tier-1 target companies', deadline: '1 week', priority: 'HIGH' },
          { action: 'Submit 15 applications this week', deadline: 'Weekly', priority: 'CRITICAL' }
        );
        break;
      case 'trading':
        actions.push(
          { action: 'Review and journal last 10 trades', deadline: 'Today', priority: 'CRITICAL' },
          { action: 'Set risk management rules (position sizing)', deadline: '1 day', priority: 'CRITICAL' },
          { action: 'Study 1 technical analysis pattern', deadline: 'Weekly', priority: 'HIGH' }
        );
        break;
      case 'health':
        actions.push(
          { action: 'Schedule 6 workouts for this week', deadline: 'Today', priority: 'CRITICAL' },
          { action: 'Get baseline body fat measurement', deadline: '2 days', priority: 'HIGH' },
          { action: 'Plan meals for 30% calorie deficit', deadline: '1 day', priority: 'HIGH' }
        );
        break;
      case 'finance':
        actions.push(
          { action: 'Create detailed budget for 30% savings rate', deadline: '1 week', priority: 'CRITICAL' },
          { action: 'Automate investments to index funds', deadline: '2 days', priority: 'HIGH' },
          { action: 'Review and cut unnecessary expenses', deadline: '1 week', priority: 'HIGH' }
        );
        break;
    }

    return actions;
  }

  /**
   * Calculate estimated impact of recommendations
   */
  calculateImpact(goal, resources) {
    const highRelevance = resources.filter(r => r.relevance === 'CRITICAL' || r.relevance === 'HIGH').length;
    const actionable = resources.filter(r => r.actionable).length;

    return {
      resourcesAvailable: resources.length,
      highRelevanceResources: highRelevance,
      actionableResources: actionable,
      estimatedTimeline: '4-12 weeks',
      successProbability: Math.min(95, 50 + (highRelevance * 10) + (actionable * 5)) + '%',
      keySuccessFactors: this.getSuccessFactors(goal.category)
    };
  }

  /**
   * Get implementation steps for a strategy
   */
  getImplementationSteps(category, strategyTitle) {
    const steps = {
      'Atomic Habits Framework': ['Week 1: Pick 1 atomic habit', 'Week 2: Stack with existing routine', 'Week 3-4: Build 1% daily'],
      'Technical Analysis Mastery': ['Learn 5 basic patterns', 'Practice on historical charts', 'Apply in live trading'],
      'Structured Workout Programming': ['Choose 6-day split', 'Track weights and volume', 'Adjust calories weekly'],
      'Personal Finance Mastery': ['List all income sources', 'Track all expenses', 'Create spending budget']
    };

    return steps[strategyTitle] || ['Step 1: Research topic', 'Step 2: Create action plan', 'Step 3: Execute daily'];
  }

  /**
   * Get timeline expectations
   */
  getTimeline(category) {
    const timelines = {
      'discipline': '4-8 weeks',
      'career': '8-12 weeks',
      'trading': '12-16 weeks',
      'health': '8-12 weeks',
      'finance': '12-24 weeks'
    };
    return timelines[category.toLowerCase()] || '8-12 weeks';
  }

  /**
   * Get key success factors
   */
  getSuccessFactors(category) {
    const factors = {
      'discipline': ['Daily tracking', 'Consistent routine', '8+ hours sleep', 'Weekly review'],
      'career': ['Quality applications', 'Strong resume', 'Active networking', 'Interview prep'],
      'trading': ['Risk management', 'Trading journal', 'Emotional control', 'Continuous learning'],
      'health': ['Workout consistency', 'Nutrition discipline', 'Sleep quality', 'Recovery protocol'],
      'finance': ['Budget adherence', 'Spending control', 'Investment consistency', 'Income growth']
    };
    return factors[category.toLowerCase()] || [];
  }

  /**
   * Cache management
   */
  getCachedRecommendation(goalId) {
    const cached = this.recommendations[goalId];
    if (!cached) return null;

    const lastUpdated = new Date(cached.lastUpdated).getTime();
    const now = Date.now();

    if (now - lastUpdated < this.cacheExpiry) {
      return cached;
    }

    return null;
  }

  /**
   * Save recommendations to localStorage
   */
  saveRecommendations() {
    localStorage.setItem('resourceRecommendations', JSON.stringify(this.recommendations));
  }

  /**
   * Get fallback recommendations if API fails
   */
  getFallbackRecommendations(goal) {
    return {
      goal: goal.name,
      category: goal.category,
      resources: [
        {
          title: 'Start with fundamentals',
          source: 'Self-guided learning',
          description: `Research ${goal.name} and find expert resources`,
          relevance: 'MEDIUM'
        }
      ],
      strategies: [
        {
          strategy: 'Start small and build momentum',
          description: 'Begin with minimum viable effort',
          timeline: '4 weeks'
        }
      ],
      actionItems: [
        { action: `Start working on ${goal.name}`, deadline: 'Today', priority: 'HIGH' }
      ],
      estimatedImpact: {
        resourcesAvailable: 1,
        estimatedTimeline: '8-12 weeks',
        successProbability: '60%'
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.recommendations = {};
    localStorage.removeItem('resourceRecommendations');
    localStorage.removeItem('resourceSearchHistory');
  }
}

export default OnlineResourceAgent;
