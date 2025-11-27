import { useState, useEffect } from 'react';
import { CategoryIcons } from './IconSystem';
import { DailyTrackerAgent } from '../utils/DailyTrackerAgent';

function DailyTracker({ userData, setUserData, addNotification }) {
  const today = new Date().toISOString().split('T')[0];
  const [scores, setScores] = useState(() => {
    const existing = userData.dailyScores.find(s => s.date === today);
    return existing ? existing.scores : {
      morningRoutine: 5,
      deepWork: 5,
      exercise: 5,
      trading: 5,
      learning: 5,
      nutrition: 5,
      sleep: 5,
      social: 5,
      dailyMIT: 5
    };
  });

  const [agentInsights, setAgentInsights] = useState(null);

  useEffect(() => {
    const agent = new DailyTrackerAgent(userData);
    const recommendations = agent.generateCategoryRecommendations();
    const scoreImpact = agent.calculateScoreImpact();
    const todaysPlan = agent.getTodaysPlan();
    
    setAgentInsights({
      recommendations,
      scoreImpact,
      plan: todaysPlan
    });
  }, [userData]);

  const categories = [
    { key: 'morningRoutine', label: 'Morning Routine (before 9 AM)', IconComponent: CategoryIcons.Morning, requirement: 'Wake 5:00 AM, review objectives' },
    { key: 'deepWork', label: 'Deep Work (4+ hours focused)', IconComponent: CategoryIcons.DeepWork, requirement: 'Uninterrupted focus sessions' },
    { key: 'exercise', label: 'Exercise (45+ minutes)', IconComponent: CategoryIcons.Exercise, requirement: 'Strength, cardio, or HIIT' },
    { key: 'trading', label: 'Trading (executed & journaled)', IconComponent: CategoryIcons.Trading, requirement: 'Execute plan, log trades' },
    { key: 'learning', label: 'Learning (60+ minutes)', IconComponent: CategoryIcons.Learning, requirement: 'Courses, reading, skill dev' },
    { key: 'nutrition', label: 'Nutrition (macros + veggies)', IconComponent: CategoryIcons.Nutrition, requirement: 'Hit macros, 3+ veg servings' },
    { key: 'sleep', label: 'Sleep (7-8 hours quality)', IconComponent: CategoryIcons.Sleep, requirement: 'Bed by 10 PM, dark room' },
    { key: 'social', label: 'Social (meaningful connection)', IconComponent: CategoryIcons.Social, requirement: 'Real conversation, value' },
    { key: 'dailyMIT', label: 'Daily MIT (completed)', IconComponent: CategoryIcons.MIT, requirement: 'Most Important Task done' }
  ];

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
  const isExcellent = totalScore >= 8;

  const handleScoreChange = (key, value) => {
    setScores(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const saveDaily = () => {
    const newScore = {
      date: today,
      scores,
      totalScore,
      timestamp: new Date().toISOString()
    };

    setUserData(prev => {
      const updatedData = {
        ...prev,
        dailyScores: [
          ...prev.dailyScores.filter(s => s.date !== today),
          newScore
        ]
      };

      // Track interaction
      if (!updatedData.interactions) updatedData.interactions = [];
      updatedData.interactions.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'daily_score',
        component: 'daily',
        data: newScore,
        goalAlignment: 'Daily Protocol - Foundation for all goals'
      });

      return updatedData;
    });

    addNotification(`Daily score saved: ${totalScore.toFixed(1)}/10 ${isExcellent ? '🎉 EXCELLENT' : ''}`, 
      isExcellent ? 'success' : 'info');
  };

  return (
    <div className="space-y-6">
      {/* AI Agent Insights Panel */}
      {agentInsights?.recommendations && agentInsights.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-purple-900/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-bold text-white">CATEGORY-SPECIFIC INSIGHTS</h3>
          </div>
          
          <div className="space-y-3">
            {agentInsights.recommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-purple-800/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-purple-200">{rec.title}</div>
                  <span className="text-xs px-2 py-1 rounded bg-purple-900/50 text-purple-200">
                    {rec.type === 'urgent' ? '🔴 URGENT' : rec.type === 'warning' ? '⚠️ WARNING' : '💡 INSIGHT'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-300">
                  {rec.specific && <div className="text-slate-100">{rec.specific}</div>}
                  {rec.problem && <div className="text-red-300">Problem: {rec.problem}</div>}
                  {rec.solution && (
                    <div className="text-green-300">
                      Action: {Array.isArray(rec.solution) ? rec.solution[0] : rec.solution}
                    </div>
                  )}
                  {rec.impact && <div className="text-yellow-300 font-semibold">Impact: {rec.impact}</div>}
                </div>
              </div>
            ))}
          </div>

          {agentInsights.scoreImpact && (
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-300">
                <span className="font-bold">Potential Score Gain:</span> {agentInsights.scoreImpact.totalPotentialGain.toFixed(1)} points
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-red-900/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">📅 DAILY SCORECARD</h2>
          <div className="text-right bg-slate-800 rounded-xl p-4 border border-red-900/50">
            <div className="text-slate-300 text-sm">Today's Score</div>
            <div className={`text-4xl font-bold font-mono ${isExcellent ? 'text-green-400' : 'text-orange-400'}`}>
              {totalScore.toFixed(1)}/10
            </div>
            <div className="text-xs text-slate-400 mt-1">{isExcellent ? '✅ ON TRACK' : '⚠️ NEEDS FOCUS'}</div>
          </div>
        </div>
        <p className="text-slate-300 text-sm">Rate each category 1-10. Target: 8+ average for excellence.</p>
      </div>

      {/* Scoring Grid */}
      <div className="space-y-3">
        {categories.map(cat => (
          <div key={cat.key} className="framework-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="icon-container">
                  <cat.IconComponent />
                </div>
                <div>
                  <div className="text-white font-semibold">{cat.label}</div>
                  <div className="text-slate-400 text-sm">{cat.requirement}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-red-400">{scores[cat.key]}</span>
                <div className="text-xs text-slate-400">/10</div>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={scores[cat.key]}
              onChange={(e) => handleScoreChange(cat.key, e.target.value)}
              className="w-full h-3 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-red-700"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>Poor (1)</span>
              <span>Excellent (10)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={saveDaily}
        className="w-full btn-primary text-lg py-4"
      >
        💾 SAVE TODAY'S SCORE
      </button>

      {/* Celebration Box */}
      {isExcellent && (
        <div className="framework-card bg-gradient-to-r from-green-900 to-emerald-900 border-green-700">
          <p className="text-green-200 font-bold text-center text-lg">
            🎉 OUTSTANDING! You're crushing it today! Keep the momentum!
          </p>
        </div>
      )}

      {/* Framework Notes */}
      <div className="glass rounded-2xl p-4 border border-slate-700 text-sm text-slate-300">
        <div className="font-semibold text-white mb-2">📌 Framework Reminder:</div>
        <p>Daily average of 8+ indicates you're executing your Life Structure & Discipline Framework. Consistency compounds over time. 90-day challenge: Maintain 80%+ adherence to system.</p>
      </div>
    </div>
  );
}

export default DailyTracker;
