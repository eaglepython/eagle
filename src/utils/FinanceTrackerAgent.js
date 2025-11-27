/**
 * Specialized Finance Tracker Agent
 * Expense category analysis, spending patterns, and milestone tracking
 */

export class FinanceTrackerAgent {
  constructor(userData) {
    this.userData = userData;
  }

  /**
   * Analyze financial data in detail
   */
  analyzeFinancialHealth() {
    const financialData = this.userData.financialData || {};
    
    // Define expense categories (you'd track these separately)
    const categories = {
      housing: {
        label: 'Housing',
        typical: 'Rent/Mortgage, utilities, internet',
        variability: 'Low',
        control: 'Fixed'
      },
      food: {
        label: 'Food',
        typical: 'Groceries, dining out',
        variability: 'Medium',
        control: 'High'
      },
      transportation: {
        label: 'Transportation',
        typical: 'Car, gas, insurance, rides',
        variability: 'Medium',
        control: 'Medium'
      },
      health: {
        label: 'Health',
        typical: 'Gym, medical, supplements',
        variability: 'Low',
        control: 'High'
      },
      entertainment: {
        label: 'Entertainment',
        typical: 'Subscriptions, events, hobbies',
        variability: 'High',
        control: 'High'
      },
      shopping: {
        label: 'Shopping',
        typical: 'Clothes, gadgets, misc',
        variability: 'High',
        control: 'High'
      },
      trading_fees: {
        label: 'Trading Fees',
        typical: 'Brokerage fees, commissions',
        variability: 'Medium',
        control: 'High'
      },
      education: {
        label: 'Education',
        typical: 'Courses, books, certifications',
        variability: 'Medium',
        control: 'High'
      }
    };

    const analysis = {
      netWorth: financialData.netWorth || 0,
      monthlyIncome: financialData.monthlyIncome || 0,
      monthlyExpenses: financialData.monthlyExpenses || 0,
      savingsRate: financialData.savingsRate || 0
    };

    // Calculate derived metrics
    analysis.monthlySavings = analysis.monthlyIncome - analysis.monthlyExpenses;
    analysis.savingsRatePercent = analysis.monthlyIncome > 0 
      ? ((analysis.monthlySavings / analysis.monthlyIncome) * 100).toFixed(1)
      : 0;
    analysis.expenseRatioOfIncome = analysis.monthlyIncome > 0
      ? ((analysis.monthlyExpenses / analysis.monthlyIncome) * 100).toFixed(1)
      : 0;

    return {
      analysis,
      categories,
      healthScore: this._assessFinancialHealth(analysis)
    };
  }

  /**
   * Assess overall financial health
   */
  _assessFinancialHealth(analysis) {
    const savingsRate = parseFloat(analysis.savingsRatePercent);
    
    if (savingsRate >= 30) return 'EXCELLENT';
    if (savingsRate >= 20) return 'VERY_GOOD';
    if (savingsRate >= 10) return 'GOOD';
    if (savingsRate >= 0) return 'FAIR';
    return 'POOR';
  }

  /**
   * Generate specific financial recommendations
   */
  generateFinancialRecommendations() {
    const health = this.analyzeFinancialHealth();
    const analysis = health.analysis;
    const recs = [];

    // Savings rate check
    const savingsRate = parseFloat(analysis.savingsRatePercent);
    
    if (savingsRate < 10) {
      recs.push({
        type: 'urgent',
        title: '💰 Critical Savings Rate',
        current: `${analysis.savingsRatePercent}% savings rate`,
        target: 'Target: 30% for wealth building',
        problem: `At ${analysis.savingsRatePercent}% savings, you can't reach $2M by 2030.`,
        math: `Current: $${analysis.monthlySavings}/month = $${(analysis.monthlySavings * 12).toFixed(0)}/year`,
        needed: `Need: ~$10K/month = 30% savings rate to hit $2M in 10 years`,
        solution: [
          '1. IMMEDIATE: Cut discretionary spending 20-30%',
          '2. Identify: Entertainment + shopping likely culprits',
          '3. Action: Track every expense this month',
          '4. Goal: Move to 20%+ savings rate within 60 days'
        ],
        impact: `Improving ${analysis.savingsRatePercent}% → 20% = ${(analysis.monthlyIncome * 0.20 - analysis.monthlyIncome * (savingsRate / 100)).toFixed(0)}/month extra for investing`
      });
    } else if (savingsRate < 20) {
      recs.push({
        type: 'warning',
        title: '⚠️ Below Optimal Savings Rate',
        current: `${analysis.savingsRatePercent}% savings rate`,
        target: '25-30% for accelerated wealth building',
        gap: `Gap: ${(25 - savingsRate).toFixed(1)}%`,
        problem: `At ${analysis.savingsRatePercent}%, wealth building is slow. $2M goal by 2030 will be tight.`,
        action: [
          '1. Analyze spending: Which category can you cut 10%?',
          '2. Likely: Dining out, entertainment, shopping',
          '3. Opportunity: Cut $${((analysis.monthlyIncome * 0.10) - (analysis.monthlySavings)).toFixed(0)}/month',
          '4. Goal: 25%+ savings within 90 days'
        ],
        timeline: `At 25% savings: 10 years to $2M (vs. 2030 target)`
      });
    } else if (savingsRate >= 30) {
      recs.push({
        type: 'insight',
        title: '✅ Excellent Savings Rate',
        current: `${analysis.savingsRatePercent}% savings rate`,
        achievement: `$${analysis.monthlySavings}/month = $${(analysis.monthlySavings * 12).toFixed(0)}/year saved`,
        trajectory: `At this rate: $${(analysis.monthlySavings * 120).toFixed(0)} in 10 years (pre-investing returns)`,
        investing: 'Invest savings aggressively: Index funds, trading, diversified portfolio',
        compound: 'Compounding at 10-20% annually: Real wealth acceleration'
      });
    }

    // Expense ratio analysis
    if (analysis.expenseRatioOfIncome > 85) {
      recs.push({
        type: 'warning',
        title: '🚨 High Expense-to-Income Ratio',
        current: `Expenses: ${analysis.expenseRatioOfIncome}% of income`,
        problem: 'Spending nearly all you earn. Zero margin for error.',
        solution: [
          '1. Cut expenses by 15-20% minimum',
          '2. Create buffer: Target 75% expense ratio',
          '3. Rebuild: 10% emergency fund, 15% invest'
        ]
      });
    }

    // Monthly income analysis
    if (analysis.monthlyIncome < 5000) {
      recs.push({
        type: 'insight',
        title: '💵 Income Growth Opportunity',
        current: `Monthly income: $${analysis.monthlyIncome}`,
        target_2026: '$10-15K/month (from trading + career)',
        path: [
          'Trading development: Build to $500K AUM (20% returns = $100K/year = $8.3K/month)',
          'Career growth: Quant researcher role at Tier 1 firm ($200-300K/year = $17-25K/month)',
          'Combined: $25-30K/month by 2026'
        ],
        immediate: 'Focus on trading skill development + career advancement'
      });
    }

    // Net worth goal
    recs.push({
      type: 'insight',
      title: '🎯 Net Worth Goal: $2M by 2030',
      currentNetWorth: `$${analysis.netWorth}`,
      target: '$2,000,000',
      timeframe: '10 years (2030)',
      requiredGrowth: ((2000000 / (analysis.netWorth || 100000)) ** (1/10) - 1) * 100,
      path: {
        year1: 'Build income to $10K/month, 30% savings rate',
        year2_3: 'Accumulate $500K invested, 15%+ annual returns',
        year4_5: 'Reach $1M net worth (milestone)',
        year6_10: 'Compound at 15-20% annually to reach $2M'
      },
      keyFactors: [
        '1. Income growth (trading + career)',
        '2. Consistent savings (30% rate)',
        '3. Smart investing (15-20% returns)',
        '4. Discipline (no lifestyle inflation)'
      ]
    });

    return recs.sort((a, b) => {
      const order = { urgent: 0, warning: 1, insight: 2 };
      return (order[a.type] || 2) - (order[b.type] || 2);
    });
  }

  /**
   * Detailed expense category analysis
   */
  analyzeExpenseCategories() {
    // This assumes you're tracking expenses by category
    // For now, returns framework
    const categories = {
      housing: {
        typical: '$1200-2000/month',
        controlLevel: 'Low (fixed)',
        reduction: 'Not recommended unless relocating'
      },
      food: {
        typical: '$400-600/month',
        breakdown: {
          groceries: '$300-400',
          dining_out: '$100-200'
        },
        controlLevel: 'HIGH',
        reduction_opportunity: 'Cut dining out 50-70%, increase grocery cooking',
        potential_savings: '$50-150/month'
      },
      transportation: {
        typical: '$200-400/month',
        items: ['Car payment', 'Gas', 'Insurance', 'Rideshare'],
        controlLevel: 'Medium',
        reduction_opportunity: 'Carpool, public transit, reduce rideshare'
      },
      entertainment: {
        typical: '$100-300/month',
        items: ['Streaming services', 'Events', 'Hobbies'],
        controlLevel: 'HIGH',
        reduction_opportunity: 'Cancel unused subscriptions, reduce event spending',
        potential_savings: '$50-150/month'
      },
      shopping: {
        typical: '$200-500/month',
        items: ['Clothes', 'Gadgets', 'General purchases'],
        controlLevel: 'VERY HIGH',
        reduction_opportunity: 'Impulse buying is here. 80% of this is optional.',
        potential_savings: '$100-300/month'
      },
      trading_fees: {
        typical: '$20-100/month',
        controlLevel: 'Medium',
        reduction_opportunity: 'Use low-commission brokers, minimize fee trades'
      },
      education: {
        typical: '$50-200/month',
        controlLevel: 'HIGH (invest in yourself, good ROI)',
        note: 'Keep this, focus cuts elsewhere'
      }
    };

    return categories;
  }

  /**
   * Monthly expense tracker framework
   */
  getMonthlyExpenseTemplate() {
    return {
      target_income: 'Track actual vs. projected',
      fixed_expenses: {
        housing: 'Rent/mortgage + utilities',
        insurance: 'Car, health, renter\'s',
        subscriptions: 'Minimize these'
      },
      variable_expenses: {
        food: 'Groceries + dining out',
        transportation: 'Gas, car maintenance, rideshare',
        shopping: 'Clothes, gadgets, impulse buys',
        entertainment: 'Events, hobbies'
      },
      investment_expenses: {
        trading_fees: 'Commission, spreads',
        education: 'Courses, books, tools'
      },
      monthly_calculation: {
        step1: 'Monthly Income (actual)',
        step2: '- Fixed Expenses',
        step3: '- Variable Expenses',
        step4: '= Monthly Savings',
        step5: 'Monthly Savings / Income = Savings Rate %'
      },
      target_breakdown: {
        income: '$10,000 (goal)',
        fixed: '$2,500 (25%)',
        variable: '$2,500 (25%)',
        savings: '$3,000 (30%)',
        investment: '$2,000 (20%)'
      }
    };
  }

  /**
   * Spending reduction opportunities
   */
  getSpendingCuts() {
    return {
      easy_cuts: {
        cancel_subscriptions: {
          items: ['Unused streaming', 'Apps', 'Memberships'],
          potential: '$50-100/month'
        },
        reduce_dining_out: {
          target: 'Cut by 50%',
          path: 'Cook 80% of meals at home',
          potential: '$100-200/month'
        },
        minimize_shopping: {
          target: 'Conscious purchases only',
          avoid: 'Impulse buying, one-click purchases',
          potential: '$100-300/month'
        }
      },
      medium_cuts: {
        transportation: {
          reduce: 'Rideshare usage 50%',
          use: 'Public transit, carpool, walking',
          potential: '$50-100/month'
        },
        entertainment: {
          reduce: 'Expensive hobbies',
          keep: 'Health-related activities (gym good)',
          potential: '$50-100/month'
        }
      },
      total_potential: '$350-700/month',
      impact: 'Moves savings rate from 15% to 25-30%'
    };
  }

  /**
   * Investment strategy for net worth goal
   */
  getInvestmentStrategy() {
    return {
      goal: '$2M net worth by 2030',
      current_capital: 'Build from 30% savings rate',
      asset_allocation: {
        index_funds: {
          percentage: '40%',
          strategy: 'VTI, VOO, BND (diversified long-term)',
          returns: 'Historical 8-10% annual'
        },
        trading: {
          percentage: '40%',
          strategy: 'Personal trading account (20%+ target)',
          risk: 'Higher risk, higher potential return',
          path: 'Build to $500K AUM by 2026'
        },
        real_estate: {
          percentage: '10%',
          strategy: 'Build capital for down payment',
          timeline: 'Invest 2025-2026'
        },
        cash: {
          percentage: '10%',
          purpose: 'Emergency fund + trading margin'
        }
      },
      timeline: {
        year_1: 'Build emergency fund, start investing in index funds + trading',
        year_3: 'Reach $500K invested, start real estate planning',
        year_5: 'Target $1M net worth',
        year_7_10: 'Compound to $2M (15-20% annual returns)'
      },
      discipline_required: 'Maintain savings rate even when markets down, stay invested'
    };
  }

  /**
   * Monthly financial review checklist
   */
  getMonthlyFinancialChecklist() {
    return {
      first_week: [
        '☐ Review income: Actual vs. budget?',
        '☐ Check expenses: Any overspending categories?',
        '☐ Savings calculation: Did I hit savings goal?',
        '☐ Trading P&L: Track monthly performance'
      ],
      mid_month: [
        '☐ Investments: Add monthly savings to portfolio',
        '☐ Rebalance: If needed (quarterly typically)',
        '☐ Debt check: Any high-interest debt to pay off?',
        '☐ Spending trends: Identify any patterns'
      ],
      end_month: [
        '☐ Net worth update: Total assets - liabilities',
        '☐ Year-to-date: Compare to annual goals',
        '☐ Next month plan: Any big expenses coming?',
        '☐ Adjust budget: If needed based on actuals'
      ],
      quarterly: [
        '☐ Asset allocation review: Still aligned?',
        '☐ Goal progress: On track for $2M?',
        '☐ Income growth: Salary, trading, passive?',
        '☐ Lifestyle inflation: Keeping expenses stable?'
      ]
    };
  }

  /**
   * Calculate months to financial milestone
   */
  getMilestoneTimeline() {
    const financialData = this.userData.financialData || {};
    const netWorth = financialData.netWorth || 0;
    const monthlySavings = financialData.monthlyIncome - financialData.monthlyExpenses || 0;
    
    // Assuming 10% annual return on invested capital
    const monthlyReturn = 0.10 / 12;

    const milestones = {
      'milestone_500k': this._calculateMonthsToMilestone(netWorth, 500000, monthlySavings, monthlyReturn),
      'milestone_1m': this._calculateMonthsToMilestone(netWorth, 1000000, monthlySavings, monthlyReturn),
      'milestone_2m': this._calculateMonthsToMilestone(netWorth, 2000000, monthlySavings, monthlyReturn)
    };

    return milestones;
  }

  /**
   * Calculate months to reach a financial milestone
   */
  _calculateMonthsToMilestone(current, target, monthlyAddition, monthlyReturn) {
    if (monthlyAddition <= 0) return 'Infinite (no savings)';
    
    let balance = current;
    let months = 0;
    
    while (balance < target && months < 600) { // Max 50 years
      balance = balance * (1 + monthlyReturn) + monthlyAddition;
      months++;
    }
    
    return months <= 600 ? months : 'Beyond 50 years';
  }

  /**
   * Financial discipline tracking
   */
  getFinancialDisciplineScore() {
    const analysis = this.analyzeFinancialHealth();
    const health = analysis.healthScore;
    
    let score = 0;
    let maxScore = 100;

    // Savings rate (40 points)
    const savingsRate = parseFloat(analysis.analysis.savingsRatePercent);
    score += Math.min(40, (savingsRate / 30) * 40);

    // Expense control (30 points)
    const expenseRatio = parseFloat(analysis.analysis.expenseRatioOfIncome);
    score += Math.min(30, ((100 - expenseRatio) / 25) * 30);

    // Income stability (30 points)
    if (analysis.analysis.monthlyIncome > 0) score += 30;

    return {
      score: parseInt(score),
      maxScore,
      percentage: ((score / maxScore) * 100).toFixed(0),
      rating: score >= 80 ? 'EXCELLENT' : score >= 60 ? 'GOOD' : score >= 40 ? 'FAIR' : 'NEEDS_IMPROVEMENT',
      breakdown: {
        savings_rate: `${Math.min(40, (savingsRate / 30) * 40).toFixed(0)}/40`,
        expense_control: `${Math.min(30, ((100 - expenseRatio) / 25) * 30).toFixed(0)}/30`,
        income_stability: '30/30'
      }
    };
  }
}

export default FinanceTrackerAgent;
