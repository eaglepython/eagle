import { useState, useEffect } from 'react';
import { NavIcons } from './IconSystem';
import { FinanceTrackerAgent } from '../utils/FinanceTrackerAgent';

function FinanceTracker({ userData, setUserData, addNotification }) {
  const [finance, setFinance] = useState(userData.financialData);
  const [agentInsights, setAgentInsights] = useState(null);

  useEffect(() => {
    const agent = new FinanceTrackerAgent(userData);
    const recommendations = agent.generateFinancialRecommendations();
    const disciplineScore = agent.getFinancialDisciplineScore();
    
    setAgentInsights({
      recommendations,
      disciplineScore
    });
  }, [userData]);

  const saveFinance = () => {
    setUserData(prev => {
      const updatedData = {
        ...prev,
        financialData: finance
      };

      // Track interaction
      if (!updatedData.interactions) updatedData.interactions = [];
      updatedData.interactions.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'expense_tracked',
        component: 'finance',
        data: finance,
        goalAlignment: 'Finance Goal - $2M net worth by 2030'
      });

      return updatedData;
    });
    addNotification('Financial data updated! 💰', 'success');
  };

  const savingsRate = finance.monthlyIncome > 0
    ? parseFloat(((finance.monthlyIncome - finance.monthlyExpenses) / finance.monthlyIncome * 100).toFixed(1))
    : 0;

  const milestones = [
    { target: 100000, label: '$100K', date: 'Q2 2026', emoji: '🎯' },
    { target: 250000, label: '$250K', date: 'Q4 2026', emoji: '🚀' },
    { target: 500000, label: '$500K', date: 'Q4 2027', emoji: '💎' },
    { target: 1000000, label: '$1M', date: 'Q4 2029', emoji: '👑' },
    { target: 2000000, label: '$2M', date: 'Q4 2030', emoji: '🏆' }
  ];

  return (
    <div className="space-y-6">
      {/* AI Agent Insights Panel */}
      {agentInsights?.recommendations && agentInsights.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-yellow-900/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-bold text-white">SPENDING & WEALTH ANALYSIS</h3>
          </div>
          
          <div className="space-y-3">
            {agentInsights.recommendations.slice(0, 2).map((rec, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-yellow-800/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-yellow-200">{rec.title}</div>
                  <span className="text-xs px-2 py-1 rounded bg-yellow-900/50 text-yellow-200">
                    {rec.type === 'urgent' ? '🔴 URGENT' : rec.type === 'warning' ? '⚠️ WARNING' : '✅ TRACK'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-300">
                  {rec.current && <div>{rec.current}</div>}
                  {rec.target && <div className="text-yellow-300">{rec.target}</div>}
                  {rec.problem && <div className="text-red-300">{rec.problem}</div>}
                </div>
              </div>
            ))}
          </div>

          {agentInsights.disciplineScore && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-sm">
                <span className="font-bold text-white">Financial Discipline Score:</span>
                <div className="text-yellow-300 font-semibold">{agentInsights.disciplineScore.score}/{agentInsights.disciplineScore.maxScore} ({agentInsights.disciplineScore.rating})</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Current Metrics */}
      <div className="glass rounded-2xl p-6 border border-red-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <NavIcons.Finance />
          </div>
          <h2 className="text-2xl font-bold text-white">FINANCE TRACKER</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Net Worth</div>
            <div className="text-2xl font-bold text-green-400">${finance.netWorth.toLocaleString()}</div>
          </div>
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Monthly Income</div>
            <div className="text-2xl font-bold text-blue-400">${finance.monthlyIncome.toLocaleString()}</div>
          </div>
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Savings Rate</div>
            <div className={`text-2xl font-bold ${parseFloat(savingsRate) >= 50 ? 'text-green-400' : 'text-yellow-400'}`}>
              {savingsRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Edit Finance Form */}
      <div className="framework-card">
        <h3 className="text-xl font-bold text-white mb-4">📊 UPDATE FINANCIAL DATA</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-red-400 font-semibold mb-2">Net Worth</label>
            <input
              type="number"
              step="1000"
              value={finance.netWorth}
              onChange={(e) => setFinance(prev => ({ ...prev, netWorth: parseFloat(e.target.value) || 0 }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-red-400 font-semibold mb-2">Monthly Income</label>
            <input
              type="number"
              step="100"
              value={finance.monthlyIncome}
              onChange={(e) => setFinance(prev => ({ ...prev, monthlyIncome: parseFloat(e.target.value) || 0 }))}
              className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-red-400 font-semibold mb-2">Monthly Expenses</label>
            <input
              type="number"
              step="100"
              value={finance.monthlyExpenses}
              onChange={(e) => setFinance(prev => ({ ...prev, monthlyExpenses: parseFloat(e.target.value) || 0 }))}
              className="input-field w-full"
            />
          </div>
        </div>

        <button
          onClick={saveFinance}
          className="btn-primary w-full py-3"
        >
          💾 UPDATE FINANCIAL DATA
        </button>
      </div>

      {/* Net Worth Milestones */}
      <div className="framework-card">
        <h2 className="section-title">🎯 NET WORTH MILESTONES</h2>
        <div className="space-y-3">
          {milestones.map(milestone => {
            const progress = (finance.netWorth / milestone.target) * 100;
            const achieved = progress >= 100;

            return (
              <div key={milestone.target} className="bg-slate-900/50 rounded-lg p-4 border border-red-900/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{milestone.emoji}</span>
                    <div>
                      <span className="text-white font-semibold">{milestone.label}</span>
                      <span className="text-slate-400 text-sm ml-3">by {milestone.date}</span>
                    </div>
                  </div>
                  <span className={`text-lg font-bold ${achieved ? 'text-green-400' : 'text-slate-400'}`}>
                    {achieved ? '✅' : `${Math.min(progress, 100).toFixed(0)}%`}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-red-900/30">
                  <div
                    className={`h-3 rounded-full transition-all ${achieved ? 'bg-green-500' : 'bg-red-700'}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Progress: ${finance.netWorth.toLocaleString()} / ${milestone.target.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Income Streams */}
      <div className="glass rounded-2xl p-4 border border-slate-700 text-sm text-slate-300">
        <div className="font-semibold text-white mb-2">📌 WEALTH BUILDING STRATEGY:</div>
        <p className="mb-2">Primary income: Quant researcher role (Q2 2026, $150K-250K). Secondary: Consulting ($2.5K-3K/week). Tertiary: Algorithmic trading ($500K AUM, 20%+ returns). Target savings rate: 50-60%. Auto-invest first day of month: 80% investments, 20% enjoyment.</p>
      </div>
    </div>
  );
}

export default FinanceTracker;
