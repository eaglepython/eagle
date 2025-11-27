/**
 * Demo Data Generator
 * Creates 30 days of realistic sample data for immediate system testing
 * Represents realistic user behavior progressing toward 2026 goals
 */

export function generateDemoData() {
  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const demoData = {
    goals: {
      dailyScore: { target: 8.0, current: 7.2, unit: '/10' },
      careerApps: { target: 15, current: 8, unit: 'apps/week' },
      tradingAUM: { target: 500000, current: 85000, unit: '$' },
      tradingReturns: { target: 20, current: 16.5, unit: '%' },
      bodyFat: { target: 12, current: 14.8, unit: '%' },
      workoutsPerWeek: { target: 6, current: 4.2, unit: 'workouts' },
      netWorth: { target: 2000000, current: 450000, unit: '$' },
      savingsRate: { target: 30, current: 24, unit: '%' }
    },

    careerData: {
      currentRole: 'Quantitative Analyst, Mid-tier Fintech',
      targetRole: 'Quant Researcher, Tier 1 (Google/Meta/OpenAI)',
      education: ['BS Computer Science', 'Some coursework toward MS Statistics'],
      yearsExperience: 2
    },

    healthData: {
      currentBodyFat: 14.8,
      targetBodyFat: 12,
      workoutsPerWeek: 4.2,
      avgWorkoutDuration: 55
    },

    financeData: {
      monthlyExpenses: 3200,
      monthlySavings: 1800,
      savingsRate: 24,
      currentNetWorth: 450000,
      targetNetWorth: 2000000
    },

    tradingData: {
      currentAUM: 85000,
      targetAUM: 500000,
      currentReturnRate: 16.5,
      targetReturnRate: 20
    },

    // 30 days of daily scores
    dailyScores: generateDailyScores(thirtyDaysAgo, today),

    // Career applications
    careerApplications: generateCareerApplications(thirtyDaysAgo, today),

    // Trading journal entries
    tradingEntries: generateTradingEntries(thirtyDaysAgo, today),

    // Workout logs
    workouts: generateWorkouts(thirtyDaysAgo, today),

    // Expense tracking
    expenses: generateExpenses(thirtyDaysAgo, today),

    // Interactions for RAG engine
    interactions: generateInteractions(thirtyDaysAgo, today)
  };

  return demoData;
}

/**
 * Generate 30 days of daily scores with realistic variation
 */
function generateDailyScores(startDate, endDate) {
  const scores = [];
  const categoryTemplates = {
    morningRoutine: [7, 6, 8, 7, 6, 8, 7, 5, 8, 7, 6, 8, 7, 8, 6, 7, 8, 6, 7, 8, 7, 6, 8, 7, 8, 6, 7, 8, 7, 6],
    deepWork: [6, 7, 8, 6, 7, 8, 5, 7, 8, 6, 7, 8, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 8, 6, 7, 8, 6, 7],
    exercise: [8, 7, 6, 8, 7, 6, 5, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 8, 6, 7, 8, 7, 6],
    trading: [7, 6, 7, 8, 6, 7, 6, 8, 7, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 7, 6, 8, 7, 6, 8],
    learning: [6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8, 6, 7, 8],
    nutrition: [7, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 8, 6, 7, 8, 7, 6],
    sleep: [7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8, 7, 6, 8],
    social: [6, 7, 6, 7, 8, 6, 7, 6, 7, 8, 6, 7, 6, 7, 8, 6, 7, 6, 7, 8, 6, 7, 6, 7, 8, 6, 7, 6, 7, 8],
    dailyMIT: [8, 8, 7, 8, 7, 8, 7, 8, 8, 7, 8, 7, 8, 8, 7, 8, 7, 8, 7, 8, 8, 7, 8, 7, 8, 7, 8, 8, 7, 8]
  };

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    const categoryScores = {
      morningRoutine: categoryTemplates.morningRoutine[i],
      deepWork: categoryTemplates.deepWork[i],
      exercise: categoryTemplates.exercise[i],
      trading: categoryTemplates.trading[i],
      learning: categoryTemplates.learning[i],
      nutrition: categoryTemplates.nutrition[i],
      sleep: categoryTemplates.sleep[i],
      social: categoryTemplates.social[i],
      dailyMIT: categoryTemplates.dailyMIT[i]
    };

    const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) / 9;

    scores.push({
      date: dateStr,
      scores: categoryScores,
      totalScore: parseFloat(totalScore.toFixed(1)),
      timestamp: date.toISOString()
    });
  }

  return scores;
}

/**
 * Generate 30 days of career applications
 * Mix of Tier 1, 2, and 3+ companies
 */
function generateCareerApplications(startDate, endDate) {
  const companies = {
    tier1: ['Google', 'Meta', 'OpenAI', 'DeepMind', 'Jane Street', 'Citadel', 'Citadel Securities', 'Apple'],
    tier2: ['Databricks', 'Stripe', 'Figma', 'Rippling', 'Canva', 'Chime', 'Brex', 'Guidepoint'],
    tier3: ['Mid-market Fintech', 'Tech Startup A', 'Tech Startup B', 'Trading Firm', 'Data Analytics Co']
  };

  const applications = [];
  let appId = 1;

  // Generate ~8 applications over 30 days (realistic pace)
  const applicationSchedule = [1, 3, 5, 7, 9, 12, 15, 18, 20, 23, 25, 27];

  applicationSchedule.forEach((day, idx) => {
    const date = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    // 50% Tier 1, 35% Tier 2, 15% Tier 3 for focused approach
    const random = Math.random();
    let tier, company;

    if (random < 0.5) {
      tier = 'Tier 1';
      company = companies.tier1[Math.floor(Math.random() * companies.tier1.length)];
    } else if (random < 0.85) {
      tier = 'Tier 2';
      company = companies.tier2[Math.floor(Math.random() * companies.tier2.length)];
    } else {
      tier = 'Tier 3+';
      company = companies.tier3[Math.floor(Math.random() * companies.tier3.length)];
    }

    applications.push({
      id: appId++,
      date: dateStr,
      company,
      role: 'Quantitative Researcher / Analyst',
      tier,
      status: ['Applied', 'Rejected', 'In Review', 'Phone Screen', 'Applied'][Math.floor(Math.random() * 5)],
      applicationDate: date.toISOString(),
      notes: `Application to ${company} for Quant role`
    });
  });

  return applications;
}

/**
 * Generate 30 days of trading entries
 * Realistic win rate, position sizing, P&L
 */
function generateTradingEntries(startDate, endDate) {
  const assets = ['SPY', 'QQQ', 'BTC', 'ETH', 'AAPL', 'MSFT', 'TSLA', 'NVDA', 'GLD', 'UST'];
  const entries = [];
  let tradeId = 1;

  // Generate ~2-3 trades per week (realistic)
  for (let i = 0; i < 30; i += 2) {
    if (Math.random() > 0.4) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      const asset = assets[Math.floor(Math.random() * assets.length)];
      const entryPrice = 100 + Math.random() * 200;
      const profitable = Math.random() > 0.45; // 55% win rate
      const riskSize = 500 + Math.random() * 1500;

      let exitPrice, pnl;
      if (profitable) {
        const profitPercent = 1 + (0.01 + Math.random() * 0.03); // 1-4% profit
        exitPrice = entryPrice * profitPercent;
        pnl = (exitPrice - entryPrice) * (riskSize / entryPrice);
      } else {
        const lossPercent = 1 - (0.01 + Math.random() * 0.02); // -1 to -2% loss
        exitPrice = entryPrice * lossPercent;
        pnl = (exitPrice - entryPrice) * (riskSize / entryPrice);
      }

      entries.push({
        id: tradeId++,
        date: dateStr,
        asset,
        entryPrice: parseFloat(entryPrice.toFixed(2)),
        exitPrice: parseFloat(exitPrice.toFixed(2)),
        quantity: parseFloat((riskSize / entryPrice).toFixed(4)),
        pnl: parseFloat(pnl.toFixed(2)),
        riskReward: parseFloat(((Math.abs(pnl) / riskSize) * 2).toFixed(2)),
        notes: `${asset} ${profitable ? 'WIN' : 'LOSS'}: ${profitable ? '+' : ''}$${pnl.toFixed(2)}`,
        timestamp: date.toISOString()
      });
    }
  }

  return entries;
}

/**
 * Generate 30 days of workouts
 * 4-6 per week, mix of types
 */
function generateWorkouts(startDate, endDate) {
  const workoutTypes = ['Strength', 'Cardio', 'HIIT', 'Yoga', 'Running', 'Cycling'];
  const durations = [45, 50, 55, 60, 65, 75, 80];
  const workouts = [];
  let workoutId = 1;

  // 4-6 workouts per week
  for (let week = 0; week < 4; week++) {
    const workoutsThisWeek = 4 + Math.floor(Math.random() * 3); // 4-6 workouts

    for (let j = 0; j < workoutsThisWeek; j++) {
      const dayOffset = week * 7 + Math.floor(Math.random() * 7);
      if (dayOffset >= 30) continue;

      const date = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];

      workouts.push({
        id: workoutId++,
        date: dateStr,
        type: workoutTypes[Math.floor(Math.random() * workoutTypes.length)],
        duration: durations[Math.floor(Math.random() * durations.length)],
        intensity: ['Light', 'Moderate', 'High'][Math.floor(Math.random() * 3)],
        notes: 'Morning session',
        timestamp: date.toISOString()
      });
    }
  }

  return workouts;
}

/**
 * Generate 30 days of expenses
 * Realistic monthly spending ~$3200
 */
function generateExpenses(startDate, endDate) {
  const categories = ['Food', 'Housing', 'Utilities', 'Transportation', 'Entertainment', 'Health', 'Software', 'Other'];
  const expenses = [];
  let expenseId = 1;

  const categoryBudgets = {
    Housing: { daily: 110, variance: 0.05 },
    Food: { daily: 35, variance: 0.3 },
    Utilities: { daily: 5, variance: 0.2 },
    Transportation: { daily: 8, variance: 0.5 },
    Entertainment: { daily: 5, variance: 0.6 },
    Health: { daily: 3, variance: 0.8 },
    Software: { daily: 2, variance: 0.9 },
    Other: { daily: 2, variance: 0.7 }
  };

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    // Generate 2-4 expenses per day
    const expensesPerDay = 2 + Math.floor(Math.random() * 2);

    for (let j = 0; j < expensesPerDay; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const budget = categoryBudgets[category] || { daily: 5, variance: 0.5 };
      const amount = budget.daily * (1 + (Math.random() - 0.5) * budget.variance * 2);

      expenses.push({
        id: expenseId++,
        date: dateStr,
        category,
        amount: parseFloat(amount.toFixed(2)),
        description: `${category} expense`,
        timestamp: date.toISOString()
      });
    }
  }

  return expenses;
}

/**
 * Generate interactions for RAG evaluation engine
 */
function generateInteractions(startDate, endDate) {
  const interactions = [];

  // Generate daily score interactions
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];

    interactions.push({
      id: Date.now() + Math.random(),
      timestamp: date.toISOString(),
      type: 'daily_score',
      component: 'daily',
      data: {
        date: dateStr,
        totalScore: 6.5 + Math.random() * 2,
        categoryScores: {}
      },
      goalAlignment: ['Daily Protocol - Foundation for all goals']
    });
  }

  // Generate career interactions
  for (let i = 0; i < 8; i++) {
    interactions.push({
      id: Date.now() + Math.random(),
      timestamp: new Date(startDate.getTime() + i * 4 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'application_logged',
      component: 'career',
      data: {
        tier: Math.random() > 0.5 ? 'Tier 1' : 'Tier 2',
        company: 'Sample Company'
      },
      goalAlignment: ['Career Goal: Quant Researcher by 2026']
    });
  }

  // Generate trading interactions
  for (let i = 0; i < 15; i++) {
    interactions.push({
      id: Date.now() + Math.random(),
      timestamp: new Date(startDate.getTime() + i * 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'trade_executed',
      component: 'trading',
      data: {
        asset: 'SPY',
        pnl: (Math.random() > 0.45 ? 1 : -1) * (500 + Math.random() * 1000)
      },
      goalAlignment: ['Trading Goal: $500K AUM by 2026']
    });
  }

  // Generate workout interactions
  for (let i = 0; i < 18; i++) {
    interactions.push({
      id: Date.now() + Math.random(),
      timestamp: new Date(startDate.getTime() + i * 1.7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'workout_logged',
      component: 'health',
      data: {
        type: 'Strength',
        duration: 55
      },
      goalAlignment: ['Body Fat Goal: 12% by 2026']
    });
  }

  return interactions;
}

export default generateDemoData;
