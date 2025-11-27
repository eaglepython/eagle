/**
 * Intelligent Agent System
 * Provides real-time guidance, adaptive suggestions, and contextual support
 */

import React, { useState, useEffect } from 'react';
import { NavIcons, StatusIcons } from './IconSystem';

export function IntelligentAgent({ recommendations, predictions, nudges, currentCategory }) {
  const [expandedRec, setExpandedRec] = useState(null);
  const [showAnimated, setShowAnimated] = useState(false);

  useEffect(() => {
    setShowAnimated(true);
  }, [recommendations]);

  const getTypeColor = (type) => {
    const colors = {
      urgent: 'bg-red-900/20 border-red-600 text-red-200',
      warning: 'bg-yellow-900/20 border-yellow-600 text-yellow-200',
      insight: 'bg-blue-900/20 border-blue-600 text-blue-200'
    };
    return colors[type] || colors.insight;
  };

  const getTypeIcon = (type) => {
    if (type === 'urgent') return '🚨';
    if (type === 'warning') return '⚠️';
    return 'ℹ️';
  };

  const getPriorityLevel = (priority) => {
    const levels = {
      high: '🔴',
      medium: '🟡',
      low: '🟢'
    };
    return levels[priority] || '🟢';
  };

  return (
    <div className="space-y-4">
      {/* Urgent Recommendations Section */}
      {recommendations.filter(r => r.type === 'urgent').length > 0 && (
        <div className="bg-red-900/10 border-2 border-red-600/50 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🚨</span>
            <h3 className="text-lg font-bold text-red-300">Priority Actions Required</h3>
          </div>
          <div className="space-y-2">
            {recommendations
              .filter(r => r.type === 'urgent')
              .map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-red-800/20 border border-red-500/50 rounded-lg p-3 cursor-pointer hover:bg-red-800/30 transition-all"
                  onClick={() => setExpandedRec(expandedRec === idx ? null : idx)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-red-300">{rec.title}</div>
                      <div className="text-sm text-red-200/80 mt-1">{rec.message}</div>
                    </div>
                    <span className="text-xl ml-2">→</span>
                  </div>
                  {expandedRec === idx && (
                    <div className="mt-3 pt-3 border-t border-red-500/30">
                      <button className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold transition-all">
                        {rec.action}
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Main Recommendations Grid */}
      <div className="space-y-3">
        {recommendations
          .filter(r => r.type !== 'urgent')
          .slice(0, 5)
          .map((rec, idx) => (
            <div
              key={idx}
              className={`border rounded-lg p-3 transition-all cursor-pointer hover:shadow-lg ${getTypeColor(rec.type)}`}
              onClick={() => setExpandedRec(expandedRec === `warn-${idx}` ? null : `warn-${idx}`)}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{getTypeIcon(rec.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{rec.title}</div>
                  <div className="text-xs opacity-80 mt-1 line-clamp-2">{rec.message}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-black/20 rounded">
                      {rec.category.toUpperCase()}
                    </span>
                    <span>{getPriorityLevel(rec.priority)}</span>
                  </div>
                </div>
              </div>
              {expandedRec === `warn-${idx}` && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <button className="text-sm font-semibold px-3 py-1 bg-white/10 hover:bg-white/20 rounded transition-all">
                    {rec.action}
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Current Nudge/Motivation */}
      {nudges.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{nudges[0].emoji}</span>
            <div>
              <div className="font-semibold text-purple-300">Time to act!</div>
              <div className="text-sm text-purple-200/80 mt-1">{nudges[0].message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Predictions */}
      {predictions && Object.keys(predictions).length > 0 && (
        <div className="bg-green-900/10 border border-green-600/50 rounded-lg p-4">
          <h4 className="font-bold text-green-300 mb-3">📈 Achievement Forecast</h4>
          <div className="space-y-2 text-sm">
            {predictions.daily && (
              <div className="flex items-center justify-between">
                <span className="text-green-200">Daily Score Trajectory</span>
                <span className="font-mono text-green-300">
                  {predictions.daily.current}/10 → {predictions.daily.timeline}
                </span>
              </div>
            )}
            {predictions.career && (
              <div className="flex items-center justify-between">
                <span className="text-green-200">Career Applications</span>
                <span className="font-mono text-green-300">
                  {predictions.career.current}/15
                </span>
              </div>
            )}
            {predictions.health && (
              <div className="flex items-center justify-between">
                <span className="text-green-200">Workout Completion</span>
                <span className="font-mono text-green-300">
                  {predictions.health.current}/6
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Adaptive Coach Component
 * Provides personalized coaching, warnings, and smart nudges
 */
export function AdaptiveCoach({ userData, metrics }) {
  const [coachingTip, setCoachingTip] = useState(null);

  useEffect(() => {
    if (metrics) {
      generateCoachingTip();
    }
  }, [metrics]);

  const generateCoachingTip = () => {
    const tips = [
      { text: '🎯 Master one habit at a time. Small wins compound.', type: 'tip' },
      { text: '📊 Review your data weekly. What gets measured gets managed.', type: 'insight' },
      { text: '💪 Consistency beats intensity. Show up daily.', type: 'motivational' },
      { text: '⚡ Your biggest leverage point is usually your weakest category.', type: 'strategic' },
      { text: '🔄 Adapt your strategy based on patterns, not moods.', type: 'strategic' },
      { text: '🧠 Track: Decision → Result → Learning. This is your feedback loop.', type: 'educational' }
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setCoachingTip(randomTip);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-600/30 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-3xl">🧠</span>
        <div>
          <h4 className="font-bold text-blue-300 mb-2">Coach's Insight</h4>
          {coachingTip && (
            <p className="text-sm text-slate-300 leading-relaxed">{coachingTip.text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Performance Insights Panel
 * Displays key metrics and actionable insights
 */
export function PerformanceInsights({ metrics, recommendations }) {
  if (!metrics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Quick Wins */}
      <div className="bg-green-900/10 border border-green-600/30 rounded-lg p-3">
        <div className="text-sm font-bold text-green-400 mb-2">💚 Quick Wins</div>
        <ul className="text-xs space-y-1 text-green-200/80">
          <li>✓ Log 3 more workouts for perfect week</li>
          <li>✓ Submit 5 more applications today</li>
          <li>✓ Improve sleep category by 1 point</li>
        </ul>
      </div>

      {/* Risk Areas */}
      <div className="bg-red-900/10 border border-red-600/30 rounded-lg p-3">
        <div className="text-sm font-bold text-red-400 mb-2">⚠️ Risk Areas</div>
        <ul className="text-xs space-y-1 text-red-200/80">
          <li>✗ Consistency below 70%</li>
          <li>✗ Trading win rate declining</li>
          <li>✗ Deep work hours lower than target</li>
        </ul>
      </div>
    </div>
  );
}

export default IntelligentAgent;
