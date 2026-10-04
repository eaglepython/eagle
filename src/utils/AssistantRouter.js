import { RAGEvaluationEngine } from './RAGEvaluationEngine.js';
import { DailyTrackerAgent } from './DailyTrackerAgent.js';
import { CareerTrackerAgent } from './CareerTrackerAgent.js';
import { TradingJournalAgent } from './TradingJournalAgent.js';
import { HealthTrackerAgent } from './HealthTrackerAgent.js';
import { FinanceTrackerAgent } from './FinanceTrackerAgent.js';

const normalizeStatus = (status) => String(status || '').trim().toLowerCase().replace(/[\s_-]+/g, ' ');

export function generateRuleBasedResponse(userQuery, userData = {}) {
  const query = userQuery.toLowerCase();
  const data = {
    ...userData,
    dailyScores: userData.dailyScores || [],
    jobApplications: userData.jobApplications || [],
    tradingJournal: userData.tradingJournal || [],
    workouts: userData.workouts || [],
    goals: userData.goals || [],
    financialData: userData.financialData || {},
    healthData: userData.healthData || {}
  };

  try {
    const ragEngine = new RAGEvaluationEngine(data, []);
    const dailyAgent = new DailyTrackerAgent(data);
    const careerAgent = new CareerTrackerAgent(data);
    const tradingAgent = new TradingJournalAgent(data);
    const healthAgent = new HealthTrackerAgent(data);
    const financeAgent = new FinanceTrackerAgent(data);

    if (query.includes('daily') || query.includes('score') || query.includes('discipline')) {
      const analysis = dailyAgent.analyzeCategoryDetails() || {};
      const recommendations = dailyAgent.generateCategoryRecommendations() || [];
      const best = Object.entries(analysis).sort((a, b) => b[1].current - a[1].current)[0]?.[0];
      const lines = [
        'Daily Score Analysis',
        '',
        `Categories tracked: ${Object.keys(analysis).length}`,
        `Top performing: ${best || 'No daily scores logged yet'}`
      ];
      if (!Object.keys(analysis).length) lines.push('', 'There is not enough saved daily history for category trends yet. Log a daily score to start this analysis.');
      if (recommendations.length) lines.push('', 'Top recommendations:', ...recommendations.slice(0, 3).map((rec, index) => `${index + 1}. ${rec.category}: ${rec.actionable || rec.solution || rec.title}`));
      return { response: lines.join('\n'), sources: ['Daily Tracker Agent', 'RAG Evaluation'] };
    }

    if (query.includes('career') || query.includes('job') || query.includes('application')) {
      const analysis = careerAgent.analyzeTierPerformance() || {};
      const weeklyTarget = careerAgent.getWeeklyTarget();
      const applications = data.jobApplications;
      const interviews = applications.filter((app) => ['phone screen', 'interview', 'interviewing'].includes(normalizeStatus(app.status))).length;
      const offers = applications.filter((app) => normalizeStatus(app.status) === 'offer').length;
      const recommendations = careerAgent.generateTierRecommendations() || [];
      return {
        response: [
          'Career Progress Analysis', '',
          `Applications this week: ${weeklyTarget.completed}/${weeklyTarget.target}`,
          `Tier 1 applications this week: ${weeklyTarget.breakdown.tier1}`,
          `All-time applications by tier: Tier 1 ${analysis.tier1?.total || 0}, Tier 2 ${analysis.tier2?.total || 0}, Tier 3+ ${(analysis.tier3?.total || 0) + (analysis.tier4?.total || 0)}`,
          `Interview rate: ${applications.length ? (interviews / applications.length * 100).toFixed(1) : '0'}%`,
          `Offer rate: ${interviews ? (offers / interviews * 100).toFixed(1) : '0'}%`,
          '',
          ...(recommendations.length ? ['Immediate actions:', ...recommendations.slice(0, 3).map((rec, index) => `${index + 1}. ${rec.recommendation || rec.solution || rec.title}`)] : ['No application history yet. Add an application to get tier-specific coaching.'])
        ].join('\n'),
        sources: ['Career Tracker Agent', 'RAG Evaluation']
      };
    }

    if (query.includes('trading') || query.includes('trade') || query.includes('win rate') || query.includes('pnl')) {
      const patterns = tradingAgent.analyzeTradingPatterns() || {};
      const stats = tradingAgent.getMonthlyStats() || {};
      const recommendations = tradingAgent.generateTradingRecommendations() || [];
      return {
        response: [
          'Trading Performance Analysis', '',
          `Trades this month: ${stats.tradeCount || 0}`,
          `Win rate: ${stats.winRate || 0}% (target: 55%)`,
          `Total P&L: $${Number(stats.totalPnL || 0).toFixed(2)}`,
          `Average win: $${Number(patterns.avgWin || 0).toFixed(2)}`,
          `Average loss: $${Number(patterns.avgLoss || 0).toFixed(2)}`,
          '',
          ...(recommendations.length ? ['Recommendations:', ...recommendations.slice(0, 3).map((rec, index) => `${index + 1}. ${rec}`)] : ['No trades logged yet. Log a trade to get pattern and risk feedback.'])
        ].join('\n'),
        sources: ['Trading Journal Agent', 'RAG Evaluation']
      };
    }

    if (query.includes('health') || query.includes('workout') || query.includes('fitness') || query.includes('body fat')) {
      const patterns = healthAgent.analyzeWorkoutPatterns() || {};
      const recommendations = healthAgent.generateFitnessRecommendations() || [];
      const bodyFat = data.healthData.bodyFat;
      return {
        response: [
          'Health & Fitness Analysis', '',
          `Workouts this month: ${patterns.monthlyWorkouts || 0} (target: 24)`,
          `Workout types: ${Object.keys(patterns.typeBreakdown || {}).join(', ') || 'None tracked'}`,
          `Average duration: ${patterns.avgDuration || 0} minutes`,
          `Body fat: ${bodyFat == null ? 'Not tracked' : `${bodyFat}% (target: 12%)`}`,
          '',
          ...(recommendations.length ? ['Recommendations:', ...recommendations.slice(0, 3).map((rec, index) => `${index + 1}. ${rec}`)] : ['No workouts logged yet. Log a workout to get activity-pattern feedback.'])
        ].join('\n'),
        sources: ['Health Tracker Agent', 'RAG Evaluation']
      };
    }

    if (query.includes('finance') || query.includes('expense') || query.includes('savings') || query.includes('money')) {
      const analysis = financeAgent.analyzeFinancialHealth() || {};
      const recommendations = financeAgent.generateFinancialRecommendations() || [];
      const finance = data.financialData;
      return {
        response: [
          'Financial Health Analysis', '',
          `Monthly expenses: $${Number(finance.monthlyExpenses || 0).toFixed(2)}`,
          `Savings rate: ${analysis.savingsRate || 0}% (target: 30%)`,
          `Net worth: $${Number(finance.netWorth || 0).toFixed(2)}`,
          '',
          'Recommendations:',
          ...recommendations.slice(0, 3).map((rec, index) => `${index + 1}. ${rec}`)
        ].join('\n'),
        sources: ['Finance Tracker Agent', 'RAG Evaluation']
      };
    }

    if (query.includes('progress') || query.includes('goal') || query.includes('2026') || query.includes('overall')) {
      const evaluation = ragEngine.generateAdaptiveEvaluation();
      const insights = evaluation.keyInsights || [];
      return {
        response: [
          '2026 Goals Progress Report', '',
          `Overall progress: ${evaluation.overallScore}%`,
          '', 'Goal status:',
          ...Object.entries(evaluation.categories || {}).map(([goal, result]) => `${goal.replace(/_/g, ' ')}: ${result.score}% (${result.current}/${result.target})`),
          '', 'Key insights:',
          ...(insights.length ? insights.slice(0, 3).map((insight, index) => `${index + 1}. ${insight.message}`) : ['Keep logging tracker activity to build reliable progress insights.'])
        ].join('\n'),
        sources: ['RAG Evaluation Engine', 'All Agents']
      };
    }

    return {
      response: 'I can help with daily scores, career applications, trading, health, finance, and 2026 goal progress. Ask about one area to see its agent analysis.',
      sources: ['System Overview']
    };
  } catch (error) {
    console.error('Error generating rule-based assistant response:', error);
    return { response: `I could not complete that analysis: ${error.message}`, sources: ['Error Handler'] };
  }
}
