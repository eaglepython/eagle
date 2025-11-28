import React, { useState, useEffect } from 'react';
import { PsychologyCoachAgent } from '../utils/PsychologyCoachAgent';
import { MasterIntegrationAgent } from '../utils/MasterIntegrationAgent';

/**
 * PsychologyCoachPanel.jsx
 * 
 * Beautiful component displaying psychology coaching insights and master system integration
 * Shows brain enhancement strategies, mind management tips, and unified recommendations
 */

export function PsychologyCoachPanel({ userData }) {
  const [psychologyCoaching, setPsychologyCoaching] = useState(null);
  const [masterAnalysis, setMasterAnalysis] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [showMasterAnalysis, setShowMasterAnalysis] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLoading(true);

      // Generate psychology coaching
      const coach = new PsychologyCoachAgent(userData);
      const coaching = coach.getMasterPsychologyCoaching();
      setPsychologyCoaching(coaching);

      // Generate master integration analysis
      const master = new MasterIntegrationAgent(userData);
      const analysis = master.getMasterAnalysis();
      setMasterAnalysis(analysis);

      setLoading(false);
    } catch (error) {
      console.error('Error generating coaching:', error);
      setLoading(false);
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-indigo-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-purple-200 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!psychologyCoaching || !masterAnalysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* MASTER INTEGRATION SECTION */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 border-2 border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-amber-900 flex items-center gap-2">
            🚀 Master System Integration
          </h2>
          <button
            onClick={() => setShowMasterAnalysis(!showMasterAnalysis)}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition text-sm font-semibold"
          >
            {showMasterAnalysis ? 'Hide' : 'View Full'} Analysis
          </button>
        </div>

        {/* Executive Summary */}
        <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-amber-500">
          <p className="text-lg text-gray-800 font-semibold">
            {masterAnalysis.executiveSummary}
          </p>
        </div>

        {/* System Health & Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <div className="text-sm text-gray-600">Health Score</div>
            <div className="text-2xl font-bold text-amber-600">
              {masterAnalysis.healthScore.score.toFixed(1)}/10
            </div>
            <div className="text-xs text-gray-500">{masterAnalysis.healthScore.status}</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <div className="text-sm text-gray-600">Trend</div>
            <div className="text-2xl font-bold text-orange-600">
              {masterAnalysis.systemState.trend > 0 ? '📈' : '📉'}
            </div>
            <div className="text-xs text-gray-500">{masterAnalysis.systemState.momentum}</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <div className="text-sm text-gray-600">Bottlenecks</div>
            <div className="text-2xl font-bold text-red-600">
              {masterAnalysis.bottlenecks.length}
            </div>
            <div className="text-xs text-gray-500">Needs fix</div>
          </div>

          <div className="bg-white p-3 rounded-lg border border-amber-200">
            <div className="text-sm text-gray-600">Opportunities</div>
            <div className="text-2xl font-bold text-green-600">
              {masterAnalysis.opportunities.length}
            </div>
            <div className="text-xs text-gray-500">Quick wins</div>
          </div>
        </div>

        {/* Bottlenecks */}
        {masterAnalysis.bottlenecks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-red-900 mb-3">🚨 Critical Issues</h3>
            <div className="space-y-2">
              {masterAnalysis.bottlenecks.slice(0, 3).map((bottleneck, idx) => (
                <div key={idx} className="bg-white p-2 rounded border-l-2 border-red-500">
                  <div className="font-semibold text-red-700">{bottleneck.domain}</div>
                  <div className="text-sm text-gray-700">{bottleneck.description}</div>
                  <div className="text-xs text-red-600 mt-1">Impact: {bottleneck.impact}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {masterAnalysis.opportunities.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-3">💡 Opportunities</h3>
            <div className="space-y-2">
              {masterAnalysis.opportunities.slice(0, 3).map((opp, idx) => (
                <div key={idx} className="bg-white p-2 rounded border-l-2 border-green-500">
                  <div className="font-semibold text-green-700">{opp.title}</div>
                  <div className="text-sm text-gray-700">{opp.description}</div>
                  <div className="text-xs text-green-600 mt-1">Leverage: {opp.leverage}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Analysis */}
        {showMasterAnalysis && (
          <div className="mt-4 bg-white rounded-lg p-4 border border-amber-200">
            <h3 className="font-bold mb-3">Detailed Analysis</h3>

            {/* Master Plan */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-amber-900 mb-3">📋 Master Plan</h4>
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded border-l-2 border-blue-500">
                  <div className="font-semibold text-blue-900">{masterAnalysis.masterPlan.phase1.name}</div>
                  <div className="text-sm text-gray-700 mt-1">{masterAnalysis.masterPlan.phase1.duration}</div>
                </div>
                <div className="bg-purple-50 p-3 rounded border-l-2 border-purple-500">
                  <div className="font-semibold text-purple-900">{masterAnalysis.masterPlan.phase2.name}</div>
                  <div className="text-sm text-gray-700 mt-1">{masterAnalysis.masterPlan.phase2.duration}</div>
                </div>
                <div className="bg-pink-50 p-3 rounded border-l-2 border-pink-500">
                  <div className="font-semibold text-pink-900">{masterAnalysis.masterPlan.phase3.name}</div>
                  <div className="text-sm text-gray-700 mt-1">{masterAnalysis.masterPlan.phase3.duration}</div>
                </div>
              </div>
            </div>

            {/* Top Actions */}
            <div className="mb-6">
              <h4 className="font-semibold text-lg text-amber-900 mb-3">⚡ Top Priority Actions</h4>
              <div className="space-y-2">
                {masterAnalysis.prioritizedActions.slice(0, 5).map((action, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border border-gray-200">
                    <div className="flex items-start gap-2">
                      <span className={`font-bold text-lg ${
                        action.priority === 'CRITICAL' ? 'text-red-600' :
                        action.priority === 'HIGH' ? 'text-orange-600' :
                        'text-blue-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{action.action}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          ⏱️ {action.timeline} | 📈 {action.impact}
                        </div>
                        <div className="text-xs text-purple-600 mt-1">From: {action.source}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Strategy */}
            <div>
              <h4 className="font-semibold text-lg text-amber-900 mb-3">📅 This Week's Focus</h4>
              <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                <div className="font-semibold text-indigo-900 mb-2">Focus: {masterAnalysis.weeklyStrategy.focus}</div>
                <div className="text-sm text-gray-700 mb-3">Psychology Module: {masterAnalysis.weeklyStrategy.psychologyFocus}</div>
                <div className="text-sm text-gray-700">
                  <div className="font-semibold mb-2">Success Metrics:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {masterAnalysis.weeklyStrategy.successMetrics.map((metric, idx) => (
                      <li key={idx}>{metric}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PSYCHOLOGY COACHING MODULES */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border-2 border-indigo-200">
        <h2 className="text-2xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
          🧠 Psychology Coach - Brain Enhancement & Mind Management
        </h2>

        <p className="text-gray-700 mb-6">
          8 specialized coaching modules for neuroplasticity, motivation, habits, focus, energy, emotions, goals, and growth mindset.
          Click any module to see detailed coaching insights.
        </p>

        {/* Module Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {psychologyCoaching.allModules.map((module, idx) => (
            <button
              key={idx}
              onClick={() => setActiveModule(idx)}
              className={`p-4 rounded-lg border-2 transition transform hover:scale-105 ${
                activeModule === idx
                  ? 'bg-indigo-500 text-white border-indigo-600'
                  : 'bg-white text-gray-900 border-indigo-200 hover:border-indigo-400'
              }`}
            >
              <div className="text-2xl mb-2">{module.icon}</div>
              <div className="font-semibold text-sm line-clamp-2">{module.name}</div>
              <div className={`text-xs mt-2 ${activeModule === idx ? 'text-indigo-100' : 'text-gray-600'}`}>
                {module.insightCount} insights
              </div>
            </button>
          ))}
        </div>

        {/* Module Details */}
        {activeModule !== null && psychologyCoaching.allModules[activeModule] && (
          <div className="bg-white rounded-lg p-6 border-2 border-indigo-300">
            {(() => {
              const coach = new PsychologyCoachAgent(userData);
              let moduleData;

              switch (activeModule) {
                case 0: moduleData = coach.getNeuroplasticityCoaching(); break;
                case 1: moduleData = coach.getMotivationCoaching(); break;
                case 2: moduleData = coach.getHabitCoaching(); break;
                case 3: moduleData = coach.getFocusCoaching(); break;
                case 4: moduleData = coach.getEnergyManagementCoaching(); break;
                case 5: moduleData = coach.getEmotionalIntelligenceCoaching(); break;
                case 6: moduleData = coach.getGoalAlignedCoaching(); break;
                case 7: moduleData = coach.getProgressMindsetCoaching(); break;
                default: return null;
              }

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl">{moduleData.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-indigo-900">{moduleData.module}</h3>
                      <p className="text-xs text-gray-600">Science: {moduleData.scienceBase}</p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-3">💡 Insights</h4>
                    <div className="space-y-2">
                      {moduleData.insights.slice(0, 3).map((insight, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg border-l-4 ${
                            insight.type === 'critical'
                              ? 'bg-red-50 border-red-500'
                              : insight.type === 'success'
                              ? 'bg-green-50 border-green-500'
                              : insight.type === 'opportunity'
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-gray-50 border-gray-500'
                          }`}
                        >
                          <div className="font-semibold text-gray-900">{insight.title}</div>
                          <div className="text-sm text-gray-700 mt-1">{insight.message}</div>
                          {insight.science && (
                            <div className="text-xs text-gray-600 mt-2 italic">
                              📚 {insight.science}
                            </div>
                          )}
                          {insight.insight && (
                            <div className="text-xs text-gray-800 mt-2 font-semibold">
                              💡 {insight.insight}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-3">✅ Action Items</h4>
                    <div className="space-y-2">
                      {moduleData.actionItems.slice(0, 2).map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-indigo-50 border border-indigo-200"
                        >
                          <div className="flex items-start gap-2">
                            <span className={`font-bold text-sm px-2 py-1 rounded ${
                              item.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
                              item.priority === 'HIGH' ? 'bg-orange-500 text-white' :
                              'bg-blue-500 text-white'
                            }`}>
                              {item.priority}
                            </span>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{item.action}</div>
                              <div className="text-sm text-gray-700 mt-1">
                                ⏱️ {item.timeline} | 📈 {item.impact}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Critical Issues Summary */}
        {psychologyCoaching.criticalIssues.length > 0 && (
          <div className="mt-6 bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-900 mb-3">🚨 Critical Psychology Issues</h3>
            <div className="space-y-2">
              {psychologyCoaching.criticalIssues.slice(0, 3).map((issue, idx) => (
                <div key={idx} className="bg-white p-2 rounded border-l-2 border-red-500">
                  <div className="font-semibold text-red-700">{issue.module}</div>
                  <div className="text-sm text-gray-700">{issue.insight}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Priorities */}
        <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <h3 className="font-bold text-yellow-900 mb-3">⭐ Top Priorities This Week</h3>
          <div className="space-y-2">
            {psychologyCoaching.topPriorities.slice(0, 3).map((priority, idx) => (
              <div key={idx} className="bg-white p-3 rounded border border-yellow-200">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-yellow-600">{idx + 1}.</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{priority.action}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {priority.module} | {priority.timeline}
                    </div>
                    <div className="text-xs text-yellow-600 font-semibold mt-1">
                      Impact: {priority.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PsychologyCoachPanel;
