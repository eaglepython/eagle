import React, { useState, useEffect } from 'react';
import OnlineResourceAgent from '../utils/OnlineResourceAgent';

const ResourceRecommendations = ({ userData, addNotification }) => {
  const [recommendations, setRecommendations] = useState({});
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedResource, setExpandedResource] = useState(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const agent = new OnlineResourceAgent();
      const recs = await agent.getAllRecommendations(userData);
      setRecommendations(recs);
      addNotification('✅ Recommendations loaded for all goals', 'success');
    } catch (error) {
      console.error('Error loading recommendations:', error);
      addNotification('Failed to load recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getGoalColor = (category) => {
    const colors = {
      discipline: 'from-purple-600 to-purple-800',
      career: 'from-blue-600 to-blue-800',
      trading: 'from-green-600 to-green-800',
      health: 'from-red-600 to-red-800',
      finance: 'from-yellow-600 to-yellow-800'
    };
    return colors[category.toLowerCase()] || 'from-slate-600 to-slate-800';
  };

  const getRelevanceColor = (relevance) => {
    const colors = {
      CRITICAL: 'bg-red-500/20 border-red-500 text-red-200',
      HIGH: 'bg-orange-500/20 border-orange-500 text-orange-200',
      MEDIUM: 'bg-yellow-500/20 border-yellow-500 text-yellow-200'
    };
    return colors[relevance] || 'bg-slate-500/20 border-slate-500 text-slate-200';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      CRITICAL: '🔴',
      HIGH: '🟠',
      MEDIUM: '🟡'
    };
    return icons[priority] || '⚪';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin mb-4">🔄</div>
          <p className="text-slate-300">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  const goals = userData.goals || [];
  const goalRecommendations = selectedGoal ? recommendations[selectedGoal.id] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <h1 className="text-3xl font-bold text-white mb-2">🎯 Goal-Based Resource Recommendations</h1>
        <p className="text-slate-400">Online resources, strategies, and actionable steps for each goal</p>
        <button
          onClick={loadRecommendations}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium transition"
        >
          🔄 Refresh Recommendations
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map(goal => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal)}
            className={`p-4 rounded-lg border-2 transition transform hover:scale-105 ${
              selectedGoal?.id === goal.id
                ? `border-blue-400 bg-gradient-to-br ${getGoalColor(goal.category)}`
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className="text-left">
              <div className="text-sm text-slate-300 mb-1">{goal.category.toUpperCase()}</div>
              <div className="font-semibold text-white text-sm">{goal.name}</div>
              <div className="text-xs text-slate-400 mt-2">
                Target: {goal.target}{goal.category === 'finance' || goal.category === 'trading' ? '$' : ''}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recommendations Detail View */}
      {goalRecommendations && (
        <div className="space-y-6">
          {/* Overview */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h2 className="text-2xl font-bold text-white mb-4">{goalRecommendations.goal}</h2>

            {/* Impact Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-900 rounded p-4 border border-slate-700">
                <div className="text-2xl font-bold text-blue-400">{goalRecommendations.estimatedImpact.resourcesAvailable}</div>
                <div className="text-xs text-slate-400">Total Resources</div>
              </div>
              <div className="bg-slate-900 rounded p-4 border border-slate-700">
                <div className="text-2xl font-bold text-green-400">{goalRecommendations.estimatedImpact.highRelevanceResources}</div>
                <div className="text-xs text-slate-400">High Relevance</div>
              </div>
              <div className="bg-slate-900 rounded p-4 border border-slate-700">
                <div className="text-2xl font-bold text-yellow-400">{goalRecommendations.estimatedImpact.successProbability}</div>
                <div className="text-xs text-slate-400">Success Rate</div>
              </div>
              <div className="bg-slate-900 rounded p-4 border border-slate-700">
                <div className="text-sm font-semibold text-purple-400">{goalRecommendations.estimatedImpact.estimatedTimeline}</div>
                <div className="text-xs text-slate-400">Timeline</div>
              </div>
            </div>

            {/* Key Success Factors */}
            <div className="bg-slate-900/50 rounded p-4 border border-slate-700">
              <h3 className="font-semibold text-white mb-3">🎯 Key Success Factors</h3>
              <ul className="grid grid-cols-2 gap-2">
                {goalRecommendations.estimatedImpact.keySuccessFactors.map((factor, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-center">
                    <span className="mr-2">✓</span>{factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategies */}
          {goalRecommendations.strategies.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">📋 Top Strategies</h3>
              <div className="space-y-4">
                {goalRecommendations.strategies.map((strategy, idx) => (
                  <div key={idx} className="bg-slate-900 rounded p-4 border border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-white">{strategy.strategy}</h4>
                      <span className="text-xs px-2 py-1 bg-blue-500/30 text-blue-300 rounded">
                        {strategy.timeline}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{strategy.description}</p>
                    <div className="text-xs text-slate-400">
                      <strong>Steps:</strong>
                      <ol className="mt-2 space-y-1 pl-4 list-decimal">
                        {strategy.implementation?.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Items */}
          {goalRecommendations.actionItems.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">✅ Immediate Actions</h3>
              <div className="space-y-3">
                {goalRecommendations.actionItems.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 rounded p-4 border border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl mt-1">{getPriorityIcon(item.priority)}</span>
                        <div>
                          <p className="font-semibold text-white">{item.action}</p>
                          <p className="text-xs text-slate-400 mt-1">Due: {item.deadline}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-medium ${
                        item.priority === 'CRITICAL' ? 'bg-red-500/30 text-red-300' :
                        item.priority === 'HIGH' ? 'bg-orange-500/30 text-orange-300' :
                        'bg-yellow-500/30 text-yellow-300'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Online Resources */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">📚 Online Resources</h3>
            <div className="space-y-3">
              {goalRecommendations.resources.map((resource, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 rounded p-4 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                  onClick={() => setExpandedResource(expandedResource === idx ? null : idx)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{resource.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded border ${getRelevanceColor(resource.relevance)}`}>
                          {resource.relevance}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{resource.source}</p>
                    </div>
                    <span className="text-xl">{expandedResource === idx ? '▼' : '▶'}</span>
                  </div>

                  {expandedResource === idx && (
                    <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                      <p className="text-sm text-slate-300">{resource.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.tags?.map(tag => (
                          <span key={tag} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                      >
                        🔗 Visit Resource
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-slate-500 text-right">
            Last updated: {new Date(goalRecommendations.lastUpdated).toLocaleDateString()}
          </div>
        </div>
      )}

      {/* No Goal Selected */}
      {!selectedGoal && (
        <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
          <p className="text-slate-400">👆 Select a goal to see personalized recommendations</p>
        </div>
      )}
    </div>
  );
};

export default ResourceRecommendations;
