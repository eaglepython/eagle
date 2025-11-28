import { useState } from 'react';

/**
 * QuickActionRecommendations Component
 * Displays AI-powered recommendations for quick actions
 */
export function QuickActionRecommendations({ recommendations, onDismiss }) {
  if (!recommendations) return null;

  const getInsightColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-900/20 border-green-600/30 text-green-300';
      case 'opportunity': return 'bg-blue-900/20 border-blue-600/30 text-blue-300';
      case 'warning': return 'bg-yellow-900/20 border-yellow-600/30 text-yellow-300';
      case 'critical': return 'bg-red-900/20 border-red-600/30 text-red-300';
      default: return 'bg-slate-800/20 border-slate-600/30 text-slate-300';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-300 border-red-600/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300 border-orange-600/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-300 border-yellow-600/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-600/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-red-900/50 w-full max-w-2xl my-4 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-b border-red-900/30 px-4 md:px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl">{recommendations.icon}</span>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">{recommendations.title}</h2>
              <p className="text-xs md:text-sm text-slate-400">Smart recommendations for better results</p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white transition text-xl md:text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(100vh-200px)] px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
          
          {/* Current Metrics */}
          {(recommendations.currentScore !== undefined || recommendations.currentWeek !== undefined) && (
            <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
              <h3 className="text-sm md:text-base font-bold text-slate-300 mb-2 md:mb-3">📊 Current Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {recommendations.currentScore !== null && (
                  <div>
                    <div className="text-xs text-slate-400">Current Score</div>
                    <div className="text-lg md:text-xl font-bold text-red-400">
                      {recommendations.currentScore ? recommendations.currentScore.toFixed(1) : '—'}
                    </div>
                  </div>
                )}
                {recommendations.target && (
                  <div>
                    <div className="text-xs text-slate-400">Target</div>
                    <div className="text-lg md:text-xl font-bold text-green-400">{recommendations.target}</div>
                  </div>
                )}
                {recommendations.currentWeek !== undefined && (
                  <div>
                    <div className="text-xs text-slate-400">This Week</div>
                    <div className="text-lg md:text-xl font-bold text-blue-400">{recommendations.currentWeek}/{recommendations.target}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fitness Metrics */}
          {recommendations.fitnessMetrics && Object.keys(recommendations.fitnessMetrics).length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
              <h3 className="text-sm md:text-base font-bold text-slate-300 mb-2 md:mb-3">💪 Fitness Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                {Object.entries(recommendations.fitnessMetrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Week Metrics */}
          {recommendations.weekMetrics && Object.keys(recommendations.weekMetrics).length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
              <h3 className="text-sm md:text-base font-bold text-slate-300 mb-2 md:mb-3">📈 Week Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                {Object.entries(recommendations.weekMetrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {recommendations.insights && recommendations.insights.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-sm md:text-base font-bold text-slate-300">💡 Key Insights</h3>
              {recommendations.insights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 md:p-4 border flex items-start gap-2 md:gap-3 ${getInsightColor(insight.type)}`}
                >
                  <span className="text-base md:text-lg flex-shrink-0 mt-0.5">{insight.type === 'success' ? '✅' : insight.type === 'critical' ? '🚨' : insight.type === 'warning' ? '⚠️' : '📈'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium">{insight.message}</p>
                    <div className="mt-1 text-xs opacity-75">{insight.action}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Focus Areas */}
          {recommendations.focusAreas && recommendations.focusAreas.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-sm md:text-base font-bold text-slate-300">🎯 Focus Areas</h3>
              {recommendations.focusAreas.map((area, idx) => (
                <div key={idx} className="bg-orange-900/20 border border-orange-600/30 rounded-lg p-3 md:p-4">
                  {typeof area === 'object' ? (
                    <>
                      <div className="font-semibold text-orange-300 text-xs md:text-sm">{area.category}</div>
                      <div className="text-xs md:text-sm text-orange-200/80 mt-1">{area.message}</div>
                    </>
                  ) : (
                    <div className="text-xs md:text-sm text-orange-300">{area}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Items */}
          {recommendations.actionItems && recommendations.actionItems.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-sm md:text-base font-bold text-slate-300">✅ Action Items</h3>
              {recommendations.actionItems.slice(0, 5).map((item, idx) => (
                <div key={idx} className={`rounded-lg p-3 md:p-4 border ${getPriorityColor(item.priority)}`}>
                  <div className="flex items-start justify-between gap-2 md:gap-3 mb-1 md:mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs md:text-sm">{item.action}</p>
                      <p className="text-xs text-opacity-75 mt-0.5">Due: {item.deadline}</p>
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 bg-white/10 rounded whitespace-nowrap flex-shrink-0">
                      {item.impact}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quality Metrics */}
          {recommendations.qualityMetrics && Object.keys(recommendations.qualityMetrics).length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
              <h3 className="text-sm md:text-base font-bold text-slate-300 mb-2 md:mb-3">📊 Quality Metrics</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                {Object.entries(recommendations.qualityMetrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Metrics */}
          {recommendations.riskMetrics && Object.keys(recommendations.riskMetrics).length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
              <h3 className="text-sm md:text-base font-bold text-slate-300 mb-2 md:mb-3">⚖️ Risk Management</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm">
                {Object.entries(recommendations.riskMetrics).map(([key, value]) => (
                  <div key={key}>
                    <div className="text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="font-semibold text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Workout Plan */}
          {recommendations.workoutPlan && recommendations.workoutPlan.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-sm md:text-base font-bold text-slate-300">📅 Recommended Workout Plan</h3>
              {recommendations.workoutPlan.map((day, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700 flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="font-semibold text-xs md:text-sm text-white">{day.day}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{day.type} • {day.duration}</div>
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap flex-shrink-0 ${
                    day.intensity === 'HIGH' ? 'bg-red-500/20 text-red-300' :
                    day.intensity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {day.intensity}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Next Week Plan */}
          {recommendations.nextWeekPlan && recommendations.nextWeekPlan.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-sm md:text-base font-bold text-slate-300">📋 Next Week Plan</h3>
              {recommendations.nextWeekPlan.map((plan, idx) => (
                <div key={idx} className="bg-slate-800/50 rounded-lg p-3 md:p-4 border border-slate-700">
                  <div className="font-semibold text-xs md:text-sm text-white mb-1 md:mb-2">{plan.goal}</div>
                  <div className="text-xs text-slate-400 mb-1 md:mb-2">{plan.strategy}</div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded inline-block ${
                    plan.difficulty === 'HIGH' ? 'bg-red-500/20 text-red-300' :
                    plan.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {plan.difficulty} Difficulty
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Top Resources */}
          {recommendations.topResources && recommendations.topResources.length > 0 && (
            <div className="space-y-2 md:space-y-3">
              <h3 className="text-sm md:text-base font-bold text-slate-300">📚 Top Resources</h3>
              {recommendations.topResources.map((res, idx) => (
                <div key={idx} className={`rounded-lg p-3 md:p-4 border ${
                  res.relevance === 'CRITICAL' ? 'bg-red-900/20 border-red-600/30' :
                  'bg-blue-900/20 border-blue-600/30'
                }`}>
                  <div className="flex items-start justify-between gap-2 md:gap-3 mb-1">
                    <div className="font-semibold text-xs md:text-sm text-white">{res.category}</div>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                      res.relevance === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {res.relevance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{res.resource}</p>
                </div>
              ))}
            </div>
          )}

          {/* Predicted Score */}
          {recommendations.predictedScore && (
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 md:p-4 border border-purple-600/30">
              <h3 className="text-sm md:text-base font-bold text-slate-300 mb-2">🔮 Predicted Score</h3>
              <div className="text-2xl md:text-3xl font-bold text-purple-300">
                {recommendations.predictedScore.toFixed(1)}/10
              </div>
              <p className="text-xs text-slate-400 mt-1 md:mt-2">Based on recent performance and planned actions</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-red-900/30 px-4 md:px-6 py-3 md:py-4 bg-slate-900/50 rounded-b-2xl flex gap-2 md:gap-3 justify-end">
          <button
            onClick={onDismiss}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium text-xs md:text-sm transition"
          >
            Close
          </button>
          <button
            onClick={onDismiss}
            className="px-3 md:px-4 py-1.5 md:py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-medium text-xs md:text-sm transition"
          >
            ✓ Ready to Start
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuickActionRecommendations;
