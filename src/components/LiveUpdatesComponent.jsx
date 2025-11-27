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
      addNotification('🔴 Live Updates Started - Updates every 2 hours', 'success');
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
      {/* Premium Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-purple-600/10 pointer-events-none" />
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`text-4xl ${isRunning ? 'animate-pulse' : ''}`}>
                  <span className="inline-block animate-spin" style={{ animationDuration: '2s' }}>📡</span>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Live Updates Intelligence
                  </h1>
                  <p className="text-slate-300 mt-1">Real-time market & life insights • Updated every 2 hours</p>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col gap-2">
              <div className={`text-xl font-bold px-4 py-2 rounded-lg ${
                isRunning 
                  ? 'bg-red-500/20 border border-red-500 text-red-300' 
                  : 'bg-green-500/20 border border-green-500 text-green-300'
              }`}>
                {isRunning ? '🔴 LIVE' : '🟢 PAUSED'}
              </div>
              <button
                onClick={toggleLiveUpdates}
                className={`px-6 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                  isRunning
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg'
                    : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg'
                }`}
              >
                {isRunning ? '⏹ Stop' : '▶ Start'}
              </button>
            </div>
          </div>

          {/* Sophisticated Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* Total Updates */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-3xl font-bold text-cyan-400">{stats.totalUpdatesProcessed}</div>
                <div className="text-xs text-slate-400 mt-1">📊 Total Updates</div>
              </div>
            </div>

            {/* Active Monitors */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-3xl font-bold text-green-400">{stats.activeListeners}</div>
                <div className="text-xs text-slate-400 mt-1">🎯 Active Monitors</div>
              </div>
            </div>

            {/* System Status */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-3xl font-bold text-purple-400">{isRunning ? '✓' : '✗'}</div>
                <div className="text-xs text-slate-400 mt-1">⚙️ System Status</div>
              </div>
            </div>

            {/* Next Update */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-sm font-bold text-yellow-400">{stats.nextUpdateIn}</div>
                <div className="text-xs text-slate-400 mt-1">⏱️ Next Check</div>
              </div>
            </div>

            {/* Manual Update */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <button
                  onClick={triggerManualUpdate}
                  disabled={loading}
                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white text-xs font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳ Updating...' : '⚡ Manual Update'}
                </button>
                <div className="text-xs text-slate-400 mt-2">🔄 Force Refresh</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updates Summary - Premium Card */}
      {updates && updates.summary && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-700 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-600/5 to-yellow-600/5 pointer-events-none" />
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-6">
              📊 Update Summary Highlights
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Critical */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-red-600/30 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:blur-xl" />
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-red-400">{updates.summary.criticalActions}</div>
                  <div className="text-sm text-slate-400 mt-2">🔴 Critical Actions</div>
                </div>
              </div>
              {/* High Priority */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-orange-600/30 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:blur-xl" />
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-orange-400">{updates.summary.highPriorityActions}</div>
                  <div className="text-sm text-slate-400 mt-2">🟠 High Priority</div>
                </div>
              </div>
              {/* Total Insights */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-blue-600/30 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:blur-xl" />
                <div className="relative z-10">
                  <div className="text-4xl font-bold text-blue-400">{updates.summary.totalUpdates}</div>
                  <div className="text-sm text-slate-400 mt-2">📈 Total Insights</div>
                </div>
              </div>
            </div>
            {/* Main Highlight */}
            {updates.summary.mainHighlight && (
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600/10 to-red-600/5 border border-red-500/50 p-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-red-300 text-lg">{updates.summary.mainHighlight.title}</h3>
                      <p className="text-white mt-2">{updates.summary.mainHighlight.insight}</p>
                      <p className="text-slate-400 text-sm mt-2 pl-3 border-l border-red-500">→ {updates.summary.mainHighlight.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Selection - Sophisticated */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['Discipline', 'Career', 'Trading', 'Health', 'Finance'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`group relative overflow-hidden rounded-xl p-5 transition-all transform hover:scale-105 font-semibold border-2 ${
              selectedCategory === cat
                ? `border-cyan-400 bg-gradient-to-br ${getCategoryColor(cat)} text-white shadow-lg shadow-cyan-500/50`
                : 'border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-slate-500 text-slate-200'
            }`}
          >
            <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl ${
              selectedCategory === cat 
                ? 'bg-white/20' 
                : 'bg-slate-600/10 group-hover:bg-slate-500/20'
            }`} />
            <div className="relative z-10">
              <div className="text-3xl mb-2">
                {cat === 'Discipline' && '🎯'}
                {cat === 'Career' && '👔'}
                {cat === 'Trading' && '💹'}
                {cat === 'Health' && '💪'}
                {cat === 'Finance' && '💰'}
              </div>
              <div className="text-sm font-semibold">{cat}</div>
              {selectedCategory === cat && (
                <div className="mt-2 text-xs opacity-90">Selected ✓</div>
              )}
            </div>
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
          <p className="text-slate-500 text-sm mt-2">New updates arrive every 2 hours automatically</p>
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
