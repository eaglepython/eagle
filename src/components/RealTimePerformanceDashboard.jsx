import React, { useState, useEffect } from 'react';
import { PerformanceMonitorAgent } from '../utils/PerformanceMonitorAgent';

/**
 * RealTimePerformanceDashboard.jsx
 * 
 * Live performance metrics showing:
 * - Consistency streak & neuroplasticity level
 * - Productivity metrics
 * - Focus quality
 * - Energy/burnout risk
 * - Goal velocity
 * - Habit automation progress
 * - Sleep impact
 * - Stress resilience
 */

export function RealTimePerformanceDashboard({ userData }) {
  const [metrics, setMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);
      const monitor = new PerformanceMonitorAgent(userData);
      setMetrics(monitor.getPerformanceDashboard());
      setLoading(false);
    } catch (error) {
      console.error('Performance monitoring error:', error);
      setLoading(false);
    }
  }, [userData]);

  if (loading || !metrics) {
    return (
      <div className="bg-slate-900/50 rounded-lg p-8 text-center">
        <div className="animate-pulse text-slate-400">Loading live metrics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* OVERVIEW TAB */}
      <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-lg p-6 border-2 border-green-500/50">
        <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
          📊 REAL-TIME PERFORMANCE MONITOR
        </h2>

        {/* Overall Score - BIG METRIC */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 mb-6 text-white">
          <div className="text-sm opacity-90">Overall Optimization Score</div>
          <div className="text-5xl font-bold mt-2">{metrics.overallScore.overall}/100</div>
          <div className="text-lg mt-2">{metrics.overallScore.status}</div>
          <div className="text-sm mt-3 opacity-90">
            {metrics.overallScore.status === 'Excellent' && '🎉 Peak performance - maintain systems'}
            {metrics.overallScore.status === 'Good' && '✅ On track - minor optimizations needed'}
            {metrics.overallScore.status === 'Fair' && '⚠️ Room for improvement - implement changes'}
            {metrics.overallScore.status === 'Poor' && '🚨 Critical - urgent action needed'}
          </div>
        </div>

        {/* Quick Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Consistency */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/30">
            <div className="text-sm text-slate-400">Consistency Streak</div>
            <div className="text-3xl font-bold text-green-400 mt-2">
              {metrics.consistency.streak}d
            </div>
            <div className="text-xs text-slate-300 mt-2">{metrics.consistency.phase}</div>
            <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ width: `${metrics.consistency.neuroplasticityLevel}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {metrics.consistency.neuroplasticityLevel.toFixed(0)}% to automation
            </div>
          </div>

          {/* Productivity */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/30">
            <div className="text-sm text-slate-400">Productivity</div>
            <div className="text-3xl font-bold text-blue-400 mt-2">
              {metrics.productivity.last7DayAverage}/10
            </div>
            <div className="text-xs text-slate-300 mt-2">{metrics.productivity.trend}</div>
            <div className="mt-3 text-xs text-slate-300">
              {metrics.productivity.status === 'excellent' && '🎯 Peak performance'}
              {metrics.productivity.status === 'good' && '✅ On track'}
              {metrics.productivity.status === 'fair' && '⚠️ Below target'}
              {metrics.productivity.status === 'needs-work' && '🚨 Critical'}
            </div>
          </div>

          {/* Focus Quality */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
            <div className="text-sm text-slate-400">Focus Quality</div>
            <div className="text-3xl font-bold text-purple-400 mt-2">
              {metrics.focus.focusQuality}
            </div>
            <div className="text-xs text-slate-300 mt-2">
              {metrics.focus.status === 'excellent' && '✅ Excellent'}
              {metrics.focus.status === 'good' && '✅ Good'}
              {metrics.focus.status === 'needs-improvement' && '⚠️ Needs work'}
            </div>
            {metrics.focus.timeWastedToDistraction && (
              <div className="mt-2 text-xs text-red-400">
                Wasted: {metrics.focus.timeWastedToDistraction}
              </div>
            )}
          </div>

          {/* Energy Level */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-yellow-500/30">
            <div className="text-sm text-slate-400">Energy Status</div>
            <div className="text-3xl font-bold mt-2">
              <span className={
                metrics.energy.burnoutRisk === 'LOW' ? 'text-green-400' :
                metrics.energy.burnoutRisk === 'MODERATE' ? 'text-yellow-400' :
                'text-red-400'
              }>
                {metrics.energy.energyTrend}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-2">
              Burnout: {metrics.energy.burnoutRisk}
            </div>
            {metrics.energy.burnoutRisk !== 'LOW' && (
              <div className="mt-2 text-xs text-red-400">⚠️ Recovery needed</div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex gap-2 flex-wrap">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'velocity', label: '🚀 Velocity', icon: '🚀' },
            { id: 'habits', label: '🔗 Habits', icon: '🔗' },
            { id: 'sleep', label: '😴 Sleep', icon: '😴' },
            { id: 'stress', label: '💪 Resilience', icon: '💪' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* DETAILED VIEWS */}
      {activeTab === 'velocity' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-blue-400 mb-4">🚀 Goal Progress Velocity</h3>
          
          {/* Daily Score */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-blue-500/30">
            <div className="font-bold text-blue-400 mb-2">Daily Score</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400">Current</div>
                <div className="text-2xl font-bold text-blue-400">{metrics.goalVelocity.dailyScore.current}/10</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Target</div>
                <div className="text-2xl font-bold text-green-400">{metrics.goalVelocity.dailyScore.target}/10</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-400">Velocity</div>
                <div className="text-lg text-yellow-400">{metrics.goalVelocity.dailyScore.velocity}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-400">Weeks to Target</div>
                <div className="text-lg font-bold">
                  {metrics.goalVelocity.dailyScore.weeksToTarget === 0 
                    ? '✅ Target reached!' 
                    : `${metrics.goalVelocity.dailyScore.weeksToTarget} weeks`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Career */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
            <div className="font-bold text-purple-400 mb-2">Career Applications</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-slate-400">This Week</div>
                <div className="text-2xl font-bold text-purple-400">{metrics.goalVelocity.careerApps.current}</div>
              </div>
              <div>
                <div className="text-sm text-slate-400">Target</div>
                <div className="text-2xl font-bold text-green-400">{metrics.goalVelocity.careerApps.target}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-slate-400">Weeks to Target</div>
                <div className="text-lg font-bold">
                  {metrics.goalVelocity.careerApps.weeksToTarget === 0 
                    ? '✅ On pace!' 
                    : `${metrics.goalVelocity.careerApps.weeksToTarget} weeks`
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Trading */}
          <div className="bg-slate-900/50 p-4 rounded-lg border border-green-500/30">
            <div className="font-bold text-green-400 mb-2">Trading Performance</div>
            <div className="text-sm text-slate-300">{metrics.goalVelocity.trading.velocity}</div>
            <div className="mt-2 text-xs text-slate-400">
              Target: 50%+ win rate, scale trades
            </div>
          </div>
        </div>
      )}

      {activeTab === 'habits' && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-pink-500/30">
          <h3 className="text-xl font-bold text-pink-400 mb-4">🔗 Habit Automation</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Automation Level</span>
                <span className="text-pink-400 font-bold">{metrics.habitAutomation.automationLevel.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-pink-500"
                  style={{ width: `${metrics.habitAutomation.automationLevel}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-400 mb-2">Willpower Savings</div>
              <div className="text-2xl font-bold text-green-400">
                {metrics.habitAutomation.willpowerSavingsPercent.toFixed(0)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {metrics.habitAutomation.impact}
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-300 mb-2 font-semibold">Automated Habits</div>
              <ul className="space-y-1">
                {metrics.habitAutomation.habitsAutomated.map((habit, idx) => (
                  <li key={idx} className="text-sm text-slate-300">✅ {habit}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-400">Next Milestone</div>
              <div className="text-lg font-bold text-yellow-400 mt-1">
                {metrics.habitAutomation.nextMilestone}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sleep' && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-indigo-500/30">
          <h3 className="text-xl font-bold text-indigo-400 mb-4">😴 Sleep Impact Analysis</h3>
          
          <div className="space-y-4">
            <div className="bg-indigo-900/30 p-4 rounded">
              <div className="text-sm text-slate-400 mb-2">Estimated Sleep Quality</div>
              <div className="flex items-end gap-2">
                <div className="text-4xl font-bold text-indigo-400">
                  {metrics.sleepImpact.estimatedSleepQuality}
                </div>
                <div className="text-sm text-slate-400 mb-2">of 100%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-sm text-slate-400">Cognitive Function</div>
                <div className="text-xl font-bold text-green-400 mt-1">
                  {metrics.sleepImpact.cognitiveFunctionImpact}
                </div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-sm text-slate-400">Productivity</div>
                <div className="text-xl font-bold text-blue-400 mt-1">
                  {metrics.sleepImpact.productivityImpact}
                </div>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded">
              <div className="text-sm text-yellow-300 font-semibold mb-2">💡 Recommendation</div>
              <div className="text-sm text-slate-300">{metrics.sleepImpact.recommendation}</div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-300 font-semibold mb-2">Sleep Optimization Protocol</div>
              <ul className="space-y-1">
                {metrics.sleepImpact.sleepOptimizationProtocol.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-300">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stress' && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-red-500/30">
          <h3 className="text-xl font-bold text-red-400 mb-4">💪 Stress Resilience</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-900/30 p-4 rounded">
                <div className="text-sm text-slate-400">Stress Level</div>
                <div className="text-3xl font-bold text-red-400 mt-2">
                  {metrics.stressResilience.stressLevel}
                </div>
                <div className="text-xs text-slate-400 mt-1">out of 100</div>
              </div>
              <div className="bg-green-900/30 p-4 rounded">
                <div className="text-sm text-slate-400">Resilience</div>
                <div className="text-3xl font-bold text-green-400 mt-2">
                  {metrics.stressResilience.resilience}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-300 font-semibold mb-2">Status: {metrics.stressResilience.status.toUpperCase()}</div>
              <div className="text-xs text-slate-400">{metrics.stressResilience.recommendation}</div>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-300 font-semibold mb-2">Quick Stress Reduction</div>
              <ul className="space-y-1">
                {metrics.stressResilience.stressReductionTechniques.map((tech, idx) => (
                  <li key={idx} className="text-sm text-slate-300">• {tech}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-800/50 p-3 rounded">
              <div className="text-sm text-slate-300 font-semibold mb-2">Emotional Regulation Tips</div>
              <ul className="space-y-1">
                {metrics.stressResilience.emotionalRegulationTips.map((tip, idx) => (
                  <li key={idx} className="text-sm text-slate-300">• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Trend */}
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
        <h3 className="text-lg font-bold text-slate-300 mb-3">📈 Weekly Trend</h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-800/50 p-3 rounded text-center">
            <div className="text-sm text-slate-400">Week 1</div>
            <div className="text-2xl font-bold text-blue-400 mt-1">{metrics.weeklyTrend.week1Average}</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded text-center">
            <div className="text-sm text-slate-400">Week 2</div>
            <div className="text-2xl font-bold text-green-400 mt-1">{metrics.weeklyTrend.week2Average}</div>
          </div>
          <div className="bg-slate-800/50 p-3 rounded text-center col-span-2">
            <div className="text-sm text-slate-400">Trend</div>
            <div className="text-2xl font-bold text-yellow-400 mt-1">{metrics.weeklyTrend.trend}</div>
          </div>
        </div>
      </div>

      {/* Monthly Projection */}
      {metrics.predictedMonthlyScore !== 'Insufficient data' && (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-bold text-purple-400 mb-3">🔮 Monthly Projection</h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-purple-900/30 p-3 rounded text-center">
              <div className="text-sm text-slate-400">Conservative</div>
              <div className="text-2xl font-bold text-orange-400 mt-1">{metrics.predictedMonthlyScore.scenario.conservative}</div>
            </div>
            <div className="bg-purple-900/30 p-3 rounded text-center">
              <div className="text-sm text-slate-400">Projected</div>
              <div className="text-2xl font-bold text-green-400 mt-1">{metrics.predictedMonthlyScore.projected}</div>
            </div>
            <div className="bg-purple-900/30 p-3 rounded text-center">
              <div className="text-sm text-slate-400">Optimistic</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">{metrics.predictedMonthlyScore.scenario.optimistic}</div>
            </div>
            <div className="bg-purple-900/30 p-3 rounded text-center">
              <div className="text-sm text-slate-400">Confidence</div>
              <div className="text-lg font-bold text-purple-300 mt-1">{metrics.predictedMonthlyScore.confidence}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RealTimePerformanceDashboard;
