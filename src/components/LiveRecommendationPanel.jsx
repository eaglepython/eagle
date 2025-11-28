import { useEffect, useState } from 'react';
import { QuickActionAgent } from '../utils/QuickActionAgent';

/**
 * LiveRecommendationPanel Component
 * Shows continuous, real-time recommendations based on current action
 */
export function LiveRecommendationPanel({ userData, actionType, compact = false }) {
  const [recommendations, setRecommendations] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const agent = new QuickActionAgent(userData);
    const recs = agent.getRecommendations(actionType);
    setRecommendations(recs);
  }, [userData, actionType]);

  if (!recommendations) return null;

  const getActionColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-300 bg-red-900/20';
      case 'HIGH': return 'text-orange-300 bg-orange-900/20';
      case 'MEDIUM': return 'text-yellow-300 bg-yellow-900/20';
      default: return 'text-blue-300 bg-blue-900/20';
    }
  };

  if (compact) {
    // Compact version for inline display
    return (
      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{recommendations.icon}</span>
            <h3 className="text-sm font-bold text-slate-200">Smart Recommendations</h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-green-900/30 text-green-300">LIVE</span>
        </div>

        {/* Quick Insights */}
        {recommendations.insights && recommendations.insights.length > 0 && (
          <div className="space-y-1">
            {recommendations.insights.slice(0, 2).map((insight, idx) => (
              <div key={idx} className="text-xs text-slate-300 p-1.5 bg-slate-900/50 rounded">
                {insight.message}
              </div>
            ))}
          </div>
        )}

        {/* Top Action Item */}
        {recommendations.actionItems && recommendations.actionItems.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-700">
            <div className={`text-xs font-semibold ${getActionColor(recommendations.actionItems[0].priority)}`}>
              ▶ Next: {recommendations.actionItems[0].action}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full version
  return (
    <div className="framework-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{recommendations.icon}</span>
          <div>
            <h2 className="text-xl font-bold text-white">{recommendations.title}</h2>
            <p className="text-xs text-slate-400">Live analysis & intelligent suggestions</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-green-900/30 text-green-300 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          LIVE
        </span>
      </div>

      {/* Insights Section */}
      {recommendations.insights && recommendations.insights.length > 0 && (
        <div className="mb-4 space-y-2">
          <button
            onClick={() => setExpandedSection(expandedSection === 'insights' ? null : 'insights')}
            className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <span className="font-semibold text-slate-200">💡 Key Insights</span>
            <span className="text-slate-400">{expandedSection === 'insights' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'insights' && (
            <div className="space-y-2 pl-3">
              {recommendations.insights.map((insight, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-sm ${
                  insight.type === 'success' ? 'bg-green-900/10 border-green-600/30 text-green-300' :
                  insight.type === 'critical' ? 'bg-red-900/10 border-red-600/30 text-red-300' :
                  insight.type === 'warning' ? 'bg-yellow-900/10 border-yellow-600/30 text-yellow-300' :
                  'bg-blue-900/10 border-blue-600/30 text-blue-300'
                }`}>
                  {insight.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Items Section */}
      {recommendations.actionItems && recommendations.actionItems.length > 0 && (
        <div className="mb-4 space-y-2">
          <button
            onClick={() => setExpandedSection(expandedSection === 'actions' ? null : 'actions')}
            className="w-full flex items-center justify-between p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700 transition"
          >
            <span className="font-semibold text-slate-200">✅ Action Items ({recommendations.actionItems.length})</span>
            <span className="text-slate-400">{expandedSection === 'actions' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'actions' && (
            <div className="space-y-2 pl-3">
              {recommendations.actionItems.map((item, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-sm ${getActionColor(item.priority)}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold">{item.action}</span>
                    <span className="text-xs font-semibold whitespace-nowrap">{item.impact}</span>
                  </div>
                  <div className="text-xs opacity-75">Due: {item.deadline}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Status for relevant recs */}
      {(recommendations.currentScore !== undefined || recommendations.currentWeek !== undefined) && (
        <div className="p-3 bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-lg border border-red-600/30 text-sm">
          <div className="font-semibold text-slate-200 mb-2">📊 Progress</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {recommendations.currentScore !== null && (
              <div>
                <div className="text-xs text-slate-400">Score</div>
                <div className="text-xl font-bold text-red-400">
                  {recommendations.currentScore ? recommendations.currentScore.toFixed(1) : '—'}/10
                </div>
              </div>
            )}
            {recommendations.target && (
              <div>
                <div className="text-xs text-slate-400">Target</div>
                <div className="text-xl font-bold text-green-400">{recommendations.target}</div>
              </div>
            )}
            {recommendations.currentWeek !== undefined && (
              <div>
                <div className="text-xs text-slate-400">This Week</div>
                <div className="text-xl font-bold text-blue-400">{recommendations.currentWeek}/{recommendations.target}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Focus Areas */}
      {recommendations.focusAreas && recommendations.focusAreas.length > 0 && (
        <div className="mt-4 p-3 bg-orange-900/10 rounded-lg border border-orange-600/30">
          <h3 className="font-semibold text-orange-300 text-sm mb-2">🎯 Focus Areas</h3>
          <div className="space-y-1">
            {recommendations.focusAreas.slice(0, 3).map((area, idx) => (
              <div key={idx} className="text-xs text-orange-200">
                {typeof area === 'object' ? `${area.category}: ${area.message}` : area}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predicted Score */}
      {recommendations.predictedScore && (
        <div className="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-600/30 text-center">
          <div className="text-xs text-slate-400 mb-1">Predicted Score if Actions Completed</div>
          <div className="text-3xl font-bold text-purple-300">{recommendations.predictedScore.toFixed(1)}/10</div>
        </div>
      )}
    </div>
  );
}

export default LiveRecommendationPanel;
