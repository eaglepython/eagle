import React, { useState, useEffect } from 'react';
import { RAGEvaluationEngine } from '../utils/RAGEvaluationEngine';

function AdaptiveEvaluation({ userData, setUserData }) {
  const [evaluation, setEvaluation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    // Generate adaptive evaluation in real-time using RAG
    const engine = new RAGEvaluationEngine(userData, []);
    const adaptiveEval = engine.generateAdaptiveEvaluation();
    const recs = engine.getGoalAlignedRecommendations();

    setEvaluation(adaptiveEval);
    setRecommendations(recs);
  }, [userData]);

  if (!evaluation) {
    return (
      <div className="glass rounded-2xl p-8 border border-slate-800 text-center">
        <p className="text-slate-400">Loading adaptive evaluation...</p>
      </div>
    );
  }

  // Score color mapping
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 45) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-green-900/20 border-green-800/50';
    if (score >= 75) return 'bg-blue-900/20 border-blue-800/50';
    if (score >= 60) return 'bg-yellow-900/20 border-yellow-800/50';
    if (score >= 45) return 'bg-orange-900/20 border-orange-800/50';
    return 'bg-red-900/20 border-red-800/50';
  };

  const formatCategoryName = (name) => {
    // Handle camelCase by inserting spaces before capital letters
    const spaced = name
      .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space before capital letters
      .replace(/_/g, ' ');                   // Also handle snake_case

    // Split into words and process each
    return spaced
      .split(' ')
      .map(word => {
        // Handle special cases
        if (word.toLowerCase() === 'aum') return 'AUM';
        if (word.toLowerCase() === 'pnl') return 'P&L';
        if (word === '&' || word === '') return '';
        // Capitalize each word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .filter(word => word.length > 0)  // Remove empty strings
      .join(' ')
      .replace(/\s+/g, ' ')  // Clean up multiple spaces
      .trim();
  };

  return (
    <div className="space-y-6 p-4">
      {/* Overall Score Panel */}
      <div className={`glass rounded-2xl p-6 border ${getScoreBg(evaluation.overallScore)}`}>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-white mb-2">🎯 ADAPTIVE EVALUATION</h3>
            <p className="text-slate-300 text-sm">Real-time assessment based on your actual progress toward 2026 goals</p>
          </div>
          <div className="text-right">
            <div className={`text-6xl font-bold font-mono ${getScoreColor(evaluation.overallScore)}`}>
              {evaluation.overallScore}%
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wide">Overall Progress</div>
          </div>
        </div>

        {/* Motivational Message */}
        {evaluation.motivationalMessage && (
          <div className="mt-4 p-4 bg-slate-900/70 rounded-lg border border-slate-700/50">
            <p className="text-slate-100 text-center font-semibold text-sm">{evaluation.motivationalMessage}</p>
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {evaluation.categories && Object.keys(evaluation.categories).length > 0 && (
        <div className="glass rounded-2xl p-6 border border-slate-800/50">
          <h3 className="text-2xl font-bold text-white mb-6">📊 GOAL CATEGORIES</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(evaluation.categories).map(([key, data]) => (
              <div
                key={key}
                onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  expandedCategory === key 
                    ? 'ring-2 ring-purple-500 bg-slate-800/70 border-purple-600/50' 
                    : 'bg-slate-900/50 border-slate-700/50 hover:bg-slate-800/50'
                }`}
              >
                {/* Category Name and Score */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="font-bold text-white text-sm leading-tight flex-1 line-clamp-2">
                    {formatCategoryName(key)}
                  </div>
                  <div className={`text-2xl font-bold font-mono whitespace-nowrap ${getScoreColor(data.score)}`}>
                    {data.score}%
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`text-xs font-semibold px-2 py-1 rounded mb-3 w-fit ${
                  data.score >= 75 ? 'bg-green-900/40 text-green-300' :
                  data.score >= 60 ? 'bg-blue-900/40 text-blue-300' :
                  data.score >= 45 ? 'bg-yellow-900/40 text-yellow-300' :
                  'bg-red-900/40 text-red-300'
                }`}>
                  {data.status}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 mb-3">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      data.score >= 90 ? 'bg-green-500' :
                      data.score >= 75 ? 'bg-blue-500' :
                      data.score >= 60 ? 'bg-yellow-500' :
                      data.score >= 45 ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, data.score)}%` }}
                  />
                </div>

                {/* Current vs Target */}
                <div className="flex justify-between text-xs text-slate-400 mb-3 bg-slate-800/30 -mx-4 -mb-4 px-4 py-2">
                  <span>Current: <span className="text-slate-200 font-semibold">{typeof data.current === 'number' ? data.current.toFixed(1) : data.current}</span></span>
                  <span>Target: <span className="text-slate-200 font-semibold">{typeof data.target === 'number' ? data.target.toFixed(1) : data.target}</span></span>
                </div>

                {/* Expanded Details */}
                {expandedCategory === key && data && (
                  <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400">Gap to Target:</span>
                      <span className={`font-bold ml-2 ${data.gap > 0 ? 'text-orange-400' : 'text-green-400'}`}>
                        {data.gap > 0 ? `+${data.gap.toFixed(1)}` : data.gap.toFixed(1)}
                      </span>
                    </div>
                    {data.importance && (
                      <div>
                        <span className="text-slate-400">Priority:</span>
                        <span className="font-bold text-purple-300 ml-2">{data.importance}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      {evaluation.keyInsights && evaluation.keyInsights.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-purple-900/30">
          <h3 className="text-2xl font-bold text-white mb-4">💡 KEY INSIGHTS</h3>
          
          <div className="space-y-3">
            {evaluation.keyInsights.map((insight, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-purple-800/30 hover:border-purple-600/50 transition">
                <div className="font-semibold text-purple-200 mb-2 text-sm">{insight.message}</div>
                <div className="text-sm text-slate-300">
                  <span className="text-purple-400 font-semibold">→ </span>{insight.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      {evaluation.nextSteps && evaluation.nextSteps.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-blue-900/30">
          <h3 className="text-2xl font-bold text-white mb-4">🎯 PRIORITY ACTIONS</h3>
          
          <div className="space-y-3">
            {evaluation.nextSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-blue-600 hover:bg-slate-800/50 transition">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-semibold text-blue-200 flex-1">{step.area}</div>
                  <span className="text-xs px-2 py-1 bg-blue-900/50 text-blue-200 rounded font-bold whitespace-nowrap">
                    P{step.priority}
                  </span>
                </div>
                <div className="text-white font-semibold mb-1 text-sm">{step.action}</div>
                <div className="text-sm text-slate-400">→ {step.specific}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal-Aligned Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-orange-900/30">
          <h3 className="text-2xl font-bold text-white mb-4">🚀 GOAL-ALIGNED RECOMMENDATIONS</h3>
          
          <div className="space-y-3">
            {recommendations.slice(0, 5).map((rec, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-orange-800/30 hover:bg-slate-800/50 transition">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-bold text-orange-200 flex-1 text-sm">{rec.goal}</div>
                  <span className={`text-xs px-2.5 py-1 rounded font-bold whitespace-nowrap ${
                    rec.importance === 'CRITICAL' ? 'bg-red-900/50 text-red-200' :
                    rec.importance === 'HIGH' ? 'bg-orange-900/50 text-orange-200' :
                    'bg-yellow-900/50 text-yellow-200'
                  }`}>
                    {rec.importance}
                  </span>
                </div>
                
                <div className="text-xs text-slate-400 mb-2 bg-slate-800/30 -mx-4 -mb-3 px-4 py-2">
                  <span>Current: <span className="text-slate-100 font-semibold">{typeof rec.current === 'number' ? rec.current.toFixed(1) : rec.current}</span></span>
                  <span className="mx-2">•</span>
                  <span>Target: <span className="text-slate-100 font-semibold">{typeof rec.target === 'number' ? rec.target.toFixed(1) : rec.target}</span></span>
                </div>

                <div className="text-sm text-yellow-300 font-semibold mb-2 px-3 py-1 bg-yellow-900/20 rounded">
                  💡 {rec.recommendation}
                </div>

                <div className="text-xs text-slate-500">
                  Gap: <span className="text-orange-400 font-semibold">{rec.gap > 0 ? '+' : ''}{typeof rec.gap === 'number' ? rec.gap.toFixed(1) : rec.gap}</span> 
                  <span className="mx-1">•</span>
                  Behind: <span className="text-orange-400 font-semibold">{rec.percentBehind}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-center text-xs text-slate-600 pb-4">
        Last evaluated: {evaluation.timestamp ? new Date(evaluation.timestamp).toLocaleString() : 'just now'}
      </div>
    </div>
  );
}

export default AdaptiveEvaluation;