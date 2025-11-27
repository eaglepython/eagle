import React, { useState, useEffect } from 'react';
import LiveUpdateAgent from '../utils/LiveUpdateAgent';

const LiveUpdatesComponent = ({ userData, addNotification }) => {
  const [liveAgent] = useState(() => new LiveUpdateAgent());
  const [updates, setUpdates] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isRunning, setIsRunning] = useState(liveAgent.isSystemRunning());
  const [stats, setStats] = useState(liveAgent.getUpdateStats());
  const [expandedUpdate, setExpandedUpdate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Start live updates on component mount
  useEffect(() => {
    const handleUpdate = (newUpdates) => {
      setUpdates(newUpdates);
      setStats(liveAgent.getUpdateStats());
      addNotification(`📡 Live Updates Received - ${newUpdates.summary.totalUpdates} new insights!`, 'info');
    };

    // Start the 6-hour update cycle
    liveAgent.startLiveUpdates(userData, handleUpdate);
    
    // Get current updates
    const currentUpdates = liveAgent.getLastUpdates();
    if (Object.keys(currentUpdates).length > 0) {
      setUpdates(currentUpdates);
    }

    setIsRunning(true);

    return () => {
      // Cleanup on unmount - keep running in background
    };
  }, []);

  const toggleLiveUpdates = () => {
    if (isRunning) {
      liveAgent.stopLiveUpdates();
      setIsRunning(false);
      addNotification('🟢 Live Updates Stopped', 'info');
    } else {
      const handleUpdate = (newUpdates) => {
        setUpdates(newUpdates);
        setStats(liveAgent.getUpdateStats());
        addNotification(`📡 Live Updates Resumed - ${newUpdates.summary.totalUpdates} insights!`, 'info');
      };
      liveAgent.startLiveUpdates(userData, handleUpdate);
      setIsRunning(true);
      addNotification('🔴 Live Updates Started - Updates every 6 hours', 'success');
    }
  };

  const triggerManualUpdate = async () => {
    setLoading(true);
    const newUpdates = await liveAgent.manualUpdate(userData, (updatedData) => {
      setUpdates(updatedData);
      setStats(liveAgent.getUpdateStats());
    });
    setLoading(false);
    addNotification('⚡ Manual update completed!', 'success');
  };

  const getCategoryColor = (category) => {
    const colors = {
      Discipline: 'from-purple-600 to-purple-800',
      Career: 'from-blue-600 to-blue-800',
      Trading: 'from-green-600 to-green-800',
      Health: 'from-red-600 to-red-800',
      Finance: 'from-yellow-600 to-yellow-800'
    };
    return colors[category] || 'from-slate-600 to-slate-800';
  };

  const getRelevanceColor = (relevance) => {
    const colors = {
      CRITICAL: 'bg-red-500/20 border-red-500 text-red-200',
      HIGH: 'bg-orange-500/20 border-orange-500 text-orange-200',
      MEDIUM: 'bg-yellow-500/20 border-yellow-500 text-yellow-200'
    };
    return colors[relevance] || 'bg-slate-500/20 border-slate-500 text-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <span className={`text-2xl ${isRunning ? 'animate-pulse' : ''}`}>📡</span>
              Live Updates Agent
            </h1>
            <p className="text-slate-400 mt-2">Real-time insights & opportunities every 6 hours</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white mb-2">
              {isRunning ? '🔴 LIVE' : '🟢 PAUSED'}
            </div>
            <button
              onClick={toggleLiveUpdates}
              className={`px-4 py-2 rounded font-semibold transition ${
                isRunning
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isRunning ? '⏹ Stop Updates' : '▶ Start Updates'}
            </button>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-slate-900 rounded p-3 border border-slate-700">
            <div className="text-2xl font-bold text-blue-400">{stats.totalUpdatesProcessed}</div>
            <div className="text-xs text-slate-400">Total Updates</div>
          </div>
          <div className="bg-slate-900 rounded p-3 border border-slate-700">
            <div className="text-2xl font-bold text-green-400">{stats.activeListeners}</div>
            <div className="text-xs text-slate-400">Active Monitors</div>
          </div>
          <div className="bg-slate-900 rounded p-3 border border-slate-700">
            <div className="text-2xl font-bold text-yellow-400">{isRunning ? '✓' : '✗'}</div>
            <div className="text-xs text-slate-400">System Status</div>
          </div>
          <div className="bg-slate-900 rounded p-3 border border-slate-700">
            <div className="text-sm font-semibold text-purple-400">{stats.nextUpdateIn}</div>
            <div className="text-xs text-slate-400">Next Update</div>
          </div>
          <div className="bg-slate-900 rounded p-3 border border-slate-700">
            <button
              onClick={triggerManualUpdate}
              disabled={loading}
              className="text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium disabled:opacity-50"
            >
              {loading ? '...' : '⚡ Manual'}
            </button>
            <div className="text-xs text-slate-400 mt-1">Update Now</div>
          </div>
        </div>
      </div>

      {/* Updates Summary */}
      {updates && updates.summary && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">📊 Latest Update Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded p-4 border border-slate-700">
              <div className="text-3xl font-bold text-red-400">{updates.summary.criticalActions}</div>
              <div className="text-sm text-slate-400">🔴 Critical Actions</div>
            </div>
            <div className="bg-slate-900 rounded p-4 border border-slate-700">
              <div className="text-3xl font-bold text-orange-400">{updates.summary.highPriorityActions}</div>
              <div className="text-sm text-slate-400">🟠 High Priority</div>
            </div>
            <div className="bg-slate-900 rounded p-4 border border-slate-700">
              <div className="text-3xl font-bold text-blue-400">{updates.summary.totalUpdates}</div>
              <div className="text-sm text-slate-400">📈 Total Insights</div>
            </div>
          </div>
          {updates.summary.mainHighlight && (
            <div className="mt-4 bg-slate-900 rounded p-4 border border-red-600/30">
              <h3 className="font-semibold text-red-400 mb-2">🎯 Top Priority Update</h3>
              <p className="text-white font-semibold">{updates.summary.mainHighlight.title}</p>
              <p className="text-sm text-slate-300 mt-1">{updates.summary.mainHighlight.insight}</p>
              <p className="text-xs text-slate-400 mt-2">→ {updates.summary.mainHighlight.action}</p>
            </div>
          )}
        </div>
      )}

      {/* Category Selection */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {['Discipline', 'Career', 'Trading', 'Health', 'Finance'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`p-4 rounded-lg border-2 transition transform hover:scale-105 font-semibold ${
              selectedCategory === cat
                ? `border-blue-400 bg-gradient-to-br ${getCategoryColor(cat)} text-white`
                : 'border-slate-600 bg-slate-800 hover:border-slate-500 text-slate-200'
            }`}
          >
            <div className="text-xl mb-1">
              {cat === 'Discipline' && '🎯'}
              {cat === 'Career' && '👔'}
              {cat === 'Trading' && '💹'}
              {cat === 'Health' && '💪'}
              {cat === 'Finance' && '💰'}
            </div>
            <div className="text-xs">{cat}</div>
          </button>
        ))}
      </div>

      {/* Updates Display */}
      {selectedCategory && updates && updates[selectedCategory.toLowerCase()] && (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            {updates[selectedCategory.toLowerCase()].icon} {selectedCategory} Updates
          </h2>

          <div className="space-y-3">
            {updates[selectedCategory.toLowerCase()].updates.map((update, idx) => (
              <div
                key={idx}
                className="bg-slate-900 rounded p-4 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
                onClick={() => setExpandedUpdate(expandedUpdate === idx ? null : idx)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{update.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded border ${getRelevanceColor(update.relevance)}`}>
                        {update.relevance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{update.source}</p>
                  </div>
                  <span className="text-xl">{expandedUpdate === idx ? '▼' : '▶'}</span>
                </div>

                {expandedUpdate === idx && (
                  <div className="mt-3 pt-3 border-t border-slate-700 space-y-2">
                    <div className="text-sm text-slate-300">
                      <strong>💡 Insight:</strong> {update.insight}
                    </div>
                    <div className="text-sm text-slate-300">
                      <strong>✅ Action:</strong> {update.action}
                    </div>
                    <a
                      href={update.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                    >
                      🔗 Read More
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Category Stats */}
          {updates[selectedCategory.toLowerCase()].stats && (
            <div className="mt-6 bg-slate-900 rounded p-4 border border-slate-700">
              <h4 className="font-semibold text-white mb-3">📊 Category Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(updates[selectedCategory.toLowerCase()].stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-lg font-bold text-blue-400">{value}</div>
                    <div className="text-xs text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Check Time */}
          <div className="mt-4 text-xs text-slate-500 text-center">
            Next check: {updates[selectedCategory.toLowerCase()].nextCheck}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedCategory && (
        <div className="text-center py-12 bg-slate-800/30 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-lg">👆 Select a category to view live updates</p>
          <p className="text-slate-500 text-sm mt-2">New updates arrive every 6 hours automatically</p>
        </div>
      )}

      {/* Update History */}
      <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-white mb-3">📜 Update History</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {liveAgent.getUpdateHistory().slice().reverse().map((history, idx) => (
            <div key={idx} className="bg-slate-900 rounded p-3 border border-slate-700 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">{new Date(history.timestamp).toLocaleString()}</span>
                <span className="text-blue-400 font-semibold">{history.summary.totalUpdates} updates</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveUpdatesComponent;
