/**
 * GoalPredictionDashboard.jsx
 * 
 * Beautiful visualization of 2026 goal achievement predictions
 * Shows probabilities, timelines, risks, and opportunities
 */

import React, { useState } from 'react';

export default function GoalPredictionDashboard({ predictions }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedGoal, setExpandedGoal] = useState(null);

  if (!predictions) return null;

  const getProbaColor = (prob) => {
    const val = parseFloat(prob);
    if (val >= 85) return 'from-green-500 to-emerald-500';
    if (val >= 70) return 'from-blue-500 to-cyan-500';
    if (val >= 50) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-orange-500';
  };

  const getStatusEmoji = (prob) => {
    const val = parseFloat(prob);
    if (val >= 85) return '🟢';
    if (val >= 70) return '🟡';
    if (val >= 50) return '🟠';
    return '🔴';
  };

  const goalsList = [
    { key: 'dailyScore', name: 'Daily Score', icon: '📊' },
    { key: 'careerRole', name: 'Career: Quant Researcher', icon: '💼' },
    { key: 'tradingAUM', name: 'Trading: $500K AUM', icon: '📈' },
    { key: 'netWorth', name: 'Net Worth: $250K+', icon: '💰' },
    { key: 'bodyFat', name: 'Health: 12% Body Fat', icon: '💪' },
    { key: 'workouts', name: 'Workouts: 6+/week', icon: '🏋️' },
    { key: 'applications', name: 'Apps: 15+/week', icon: '📝' },
    { key: 'savingsRate', name: 'Savings: 30%+', icon: '🏦' },
    { key: 'learningHours', name: 'Learning: 250h/year', icon: '📚' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">2026 Goal Predictions</h2>
            <p className="text-indigo-100">AI-powered achievement probability analysis</p>
          </div>
          <span className="text-6xl">🎯</span>
        </div>

        {/* Overall Score */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
            <p className="text-indigo-100 text-sm mb-1">Overall Achievement</p>
            <p className="text-4xl font-bold">{predictions.overallScore.probability}</p>
            <p className="text-indigo-100 text-xs mt-1">{predictions.overallScore.status}</p>
          </div>

          <div className="bg-white/20 rounded-lg p-4 backdrop-blur">
            <p className="text-indigo-100 text-sm mb-1">Confidence Level</p>
            <p className="text-3xl font-bold">{predictions.confidenceScore.percentage}</p>
            <p className="text-indigo-100 text-xs mt-1">{predictions.confidenceScore.dataPoints} data points</p>
          </div>

          <div className="bg-white/20 rounded-lg p-4 backdrop-blur col-span-2 sm:col-span-1">
            <p className="text-indigo-100 text-sm mb-1">Status</p>
            <p className="text-lg font-semibold">{predictions.overallScore.description}</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="mt-6 bg-white/10 border border-white/20 rounded-lg p-4">
          <p className="text-sm font-semibold mb-2">🎯 Recommendation</p>
          <p className="text-white">{predictions.recommendation}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {['overview', 'timeline', 'risks', 'opportunities', 'critical'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium whitespace-nowrap transition ${
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {goalsList.map(goal => {
            const data = predictions.byGoal[goal.key];
            // Extract numeric value from probability string (e.g., "75.3%" -> 75.3)
            const prob = parseFloat(data.probability?.toString().replace('%', '') || '0');
            
            return (
              <div
                key={goal.key}
                onClick={() => setExpandedGoal(expandedGoal === goal.key ? null : goal.key)}
                className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-800">{goal.name}</p>
                        <p className="text-sm text-gray-500">{data.target || data.monthlyTarget}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getProbaColor(data.probability)} transition-all`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-2xl font-bold">{data.probability}</p>
                    <p className="text-sm text-gray-500">{getStatusEmoji(data.probability)}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedGoal === goal.key && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {goal.key === 'dailyScore' && (
                      <>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Current</p>
                            <p className="font-semibold">{data.current}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Projected</p>
                            <p className="font-semibold">{data.projected}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Velocity</p>
                            <p className="font-semibold text-green-600">{data.velocity}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold mb-2">Factors:</p>
                          <ul className="space-y-1">
                            {data.factors.map((f, i) => (
                              <li key={i} className="text-xs text-gray-600">✓ {f}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {goal.key === 'careerRole' && (
                      <>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Monthly Pace</p>
                            <p className="font-semibold">{data.monthlyVelocity}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Timeline</p>
                            <p className="font-semibold text-indigo-600">{data.timeline}</p>
                          </div>
                        </div>
                        <div className="text-sm">
                          <p className="text-gray-500 mb-1">Projected Interviews: {data.projectedInterviews}</p>
                          <p className="text-gray-500">Projected Offers: {data.projectedOffers}</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {data.accelerators.map((a, i) => (
                            <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">
                              {a}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    {goal.key === 'tradingAUM' && (
                      <>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Win Rate</p>
                            <p className="font-semibold">{data.winRate}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Return</p>
                            <p className="font-semibold text-green-600">{data.monthlyReturnRate}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Months to Target</p>
                            <p className="font-semibold">{data.monthsToTarget}</p>
                          </div>
                        </div>
                      </>
                    )}

                    {goal.key === 'netWorth' && (
                      <>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Monthly Savings</p>
                            <p className="font-semibold">{data.monthlySavings}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Investment Return</p>
                            <p className="font-semibold text-green-600">{data.investmentReturn}</p>
                          </div>
                        </div>
                      </>
                    )}

                    {goal.key === 'workouts' && (
                      <>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Last 7 Days</p>
                            <p className="font-semibold">{data.last7Days}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Avg</p>
                            <p className="font-semibold">{data.lastMonthAverage}/week</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Gap to Target</p>
                            <p className={`font-semibold ${data.gap > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {data.gap > 0 ? '+' : ''}{data.gap}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {goal.key === 'applications' && (
                      <>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Last 7 Days</p>
                            <p className="font-semibold">{data.last7Days}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Monthly Avg</p>
                            <p className="font-semibold">{data.lastMonthAverage}/week</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Gap to Target</p>
                            <p className={`font-semibold ${data.gap > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {data.gap > 0 ? '+' : ''}{data.gap}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(predictions.timeline).map(([period, items]) => (
            <div key={period} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span>
                {period.replace(/_/g, ' - ').toUpperCase()}
              </h3>
              <ul className="space-y-2">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1">{item.startsWith('✅') ? '✅' : '⚠️'}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Risks Tab */}
      {activeTab === 'risks' && (
        <div className="space-y-3">
          {predictions.riskFactors.length > 0 ? (
            predictions.riskFactors.map((risk, i) => (
              <div
                key={i}
                className={`border-l-4 rounded-r-lg p-4 ${
                  risk.severity === 'CRITICAL'
                    ? 'border-red-500 bg-red-50'
                    : risk.severity === 'HIGH'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-yellow-500 bg-yellow-50'
                }`}
              >
                <div className="flex gap-3">
                  <span
                    className={`text-lg flex-shrink-0 ${
                      risk.severity === 'CRITICAL'
                        ? ''
                        : risk.severity === 'HIGH'
                        ? ''
                        : ''
                    }`}
                  >
                    ⚠️
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{risk.factor}</p>
                    <p className="text-sm text-gray-700 mt-1">{risk.impact}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-2">→ {risk.mitigation}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-semibold">✅ No critical risks identified</p>
            </div>
          )}
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div className="space-y-3">
          {predictions.opportunities.map((opp, i) => (
            <div key={i} className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-3">
                <span className="text-lg flex-shrink-0 mt-1">⚡</span>
                <div>
                  <p className="font-semibold text-gray-800">{opp.opportunity}</p>
                  <p className="text-sm text-gray-700 mt-1">💡 {opp.potential}</p>
                  <p className="text-sm font-semibold text-green-700 mt-2">→ {opp.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Critical Factors Tab */}
      {activeTab === 'critical' && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Critical Success Factors
          </h3>
          <div className="space-y-3">
            {predictions.criticalFactors.map((factor, i) => (
              <div key={i} className="flex gap-3 text-gray-800">
                <span className="font-semibold text-indigo-600">#{i + 1}</span>
                <span className="text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
