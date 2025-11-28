import React, { useState, useEffect } from 'react';
import LiveUpdateAgent from '../utils/LiveUpdateAgent';
import { AudioNotifications } from '../utils/AudioNotifications';

const LiveUpdatesComponent = ({ userData, addNotification }) => {
  const [liveAgent] = useState(() => new LiveUpdateAgent());
  const [audioNotifications] = useState(() => new AudioNotifications());
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
      // Play update sound notification
      audioNotifications.playUpdateSound();
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
              <div className={`text-sm md:text-lg font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg ${
                isRunning 
                  ? 'bg-red-500/20 border border-red-500 text-red-300' 
                  : 'bg-green-500/20 border border-green-500 text-green-300'
              }`}>
                {isRunning ? '🔴 LIVE' : '🟢 PAUSED'}
              </div>
              <button
                onClick={toggleLiveUpdates}
                className={`px-3 md:px-6 py-1.5 md:py-2 rounded-lg font-semibold transition-all transform hover:scale-105 text-sm md:text-base ${
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
            {/* Total Updates */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-2 md:p-4 border border-slate-700 hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
              <div className="absolute top-0 right-0 w-12 md:w-20 h-12 md:h-20 bg-cyan-500/10 rounded-full blur-xl md:blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-lg md:text-3xl font-bold text-cyan-400">{stats.totalUpdatesProcessed}</div>
                <div className="text-xs md:text-xs text-slate-400 mt-1">📊 Updates</div>
              </div>
            </div>

            {/* Active Monitors */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-2 md:p-4 border border-slate-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <div className="absolute top-0 right-0 w-12 md:w-20 h-12 md:h-20 bg-green-500/10 rounded-full blur-xl md:blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-lg md:text-3xl font-bold text-green-400">{stats.activeListeners}</div>
                <div className="text-xs md:text-xs text-slate-400 mt-1">🎯 Monitors</div>
              </div>
            </div>

            {/* System Status */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-2 md:p-4 border border-slate-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute top-0 right-0 w-12 md:w-20 h-12 md:h-20 bg-purple-500/10 rounded-full blur-xl md:blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-lg md:text-3xl font-bold text-purple-400">{isRunning ? '✓' : '✗'}</div>
                <div className="text-xs md:text-xs text-slate-400 mt-1">⚙️ Status</div>
              </div>
            </div>

            {/* Next Update */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-2 md:p-4 border border-slate-700 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
              <div className="absolute top-0 right-0 w-12 md:w-20 h-12 md:h-20 bg-yellow-500/10 rounded-full blur-xl md:blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <div className="text-xs md:text-sm font-bold text-yellow-400 line-clamp-1">{stats.nextUpdateIn}</div>
                <div className="text-xs md:text-xs text-slate-400 mt-1">⏱️ Next</div>
              </div>
            </div>

            {/* Manual Update */}
            <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-2 md:p-4 border border-slate-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
              <div className="absolute top-0 right-0 w-12 md:w-20 h-12 md:h-20 bg-blue-500/10 rounded-full blur-xl md:blur-2xl group-hover:blur-xl" />
              <div className="relative z-10">
                <button
                  onClick={triggerManualUpdate}
                  disabled={loading}
                  className="w-full px-2 md:px-3 py-1.5 md:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white text-xs font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '⏳' : '⚡'}
                </button>
                <div className="text-xs md:text-xs text-slate-400 mt-1 truncate">Refresh</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Updates Summary - Premium Card */}
      {updates && updates.summary && (
        <div className="relative overflow-hidden rounded-lg md:rounded-2xl border border-slate-700 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-600/5 to-yellow-600/5 pointer-events-none" />
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-3 md:p-6">
            <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4 md:mb-6">
              📊 Summary
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
              {/* Critical */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-3 md:p-5 border border-red-600/30 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20">
                <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-red-500/10 rounded-full blur-lg md:blur-2xl group-hover:blur-xl" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-bold text-red-400">{updates.summary.criticalActions}</div>
                  <div className="text-xs md:text-sm text-slate-400 mt-2">🔴 Critical</div>
                </div>
              </div>
              {/* High Priority */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-3 md:p-5 border border-orange-600/30 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
                <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-orange-500/10 rounded-full blur-lg md:blur-2xl group-hover:blur-xl" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-bold text-orange-400">{updates.summary.highPriorityActions}</div>
                  <div className="text-xs md:text-sm text-slate-400 mt-2">🟠 High</div>
                </div>
              </div>
              {/* Total Insights */}
              <div className="group relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-3 md:p-5 border border-blue-600/30 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-blue-500/10 rounded-full blur-lg md:blur-2xl group-hover:blur-xl" />
                <div className="relative z-10">
                  <div className="text-2xl md:text-4xl font-bold text-blue-400">{updates.summary.totalUpdates}</div>
                  <div className="text-xs md:text-sm text-slate-400 mt-2">📈 Insights</div>
                </div>
              </div>
            </div>
            {/* Main Highlight */}
            {updates.summary.mainHighlight && (
              <div className="relative overflow-hidden rounded-lg md:rounded-xl bg-gradient-to-r from-red-600/10 to-red-600/5 border border-red-500/50 p-3 md:p-5">
                <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-red-500/10 rounded-full blur-2xl md:blur-3xl" />
                <div className="relative z-10">
                  <div className="flex items-start gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl flex-shrink-0">🎯</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-red-300 text-sm md:text-lg line-clamp-1">{updates.summary.mainHighlight.title}</h3>
                      <p className="text-white text-xs md:text-base mt-1 md:mt-2 line-clamp-2">{updates.summary.mainHighlight.insight}</p>
                      <p className="text-slate-400 text-xs md:text-sm mt-1 md:mt-2 pl-2 md:pl-3 border-l border-red-500 line-clamp-2">→ {updates.summary.mainHighlight.action}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Selection - Sophisticated */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
        {['Discipline', 'Career', 'Trading', 'Health', 'Finance'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            className={`group relative overflow-hidden rounded-lg md:rounded-xl p-3 md:p-5 transition-all transform hover:scale-105 font-semibold border-2 text-xs md:text-base ${
              selectedCategory === cat
                ? `border-cyan-400 bg-gradient-to-br ${getCategoryColor(cat)} text-white shadow-lg shadow-cyan-500/50`
                : 'border-slate-600 bg-gradient-to-br from-slate-800 to-slate-900 hover:border-slate-500 text-slate-200'
            }`}
          >
            <div className={`absolute top-0 right-0 w-16 md:w-28 h-16 md:h-28 rounded-full blur-lg md:blur-2xl ${
              selectedCategory === cat 
                ? 'bg-white/20' 
                : 'bg-slate-600/10 group-hover:bg-slate-500/20'
            }`} />
            <div className="relative z-10">
              <div className="text-xl md:text-3xl mb-2">
                {cat === 'Discipline' && '🎯'}
                {cat === 'Career' && '👔'}
                {cat === 'Trading' && '💹'}
                {cat === 'Health' && '💪'}
                {cat === 'Finance' && '💰'}
              </div>
              <div className="text-xs md:text-sm font-semibold">{cat}</div>
              {selectedCategory === cat && (
                <div className="mt-1 text-xs opacity-90">✓</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Updates Display */}
      {selectedCategory && updates && updates[selectedCategory.toLowerCase()] && (
        <div className="bg-slate-800/50 rounded-lg md:rounded-lg p-3 md:p-6 border border-slate-700">
          <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">
            {updates[selectedCategory.toLowerCase()].icon} {selectedCategory}
          </h2>

          <div className="space-y-2 md:space-y-3">
            {updates[selectedCategory.toLowerCase()].updates.map((update, idx) => (
              <div
                key={idx}
                className="bg-slate-900 rounded p-2 md:p-4 border border-slate-700 hover:border-slate-600 transition cursor-pointer text-xs md:text-base"
                onClick={() => setExpandedUpdate(expandedUpdate === idx ? null : idx)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-white line-clamp-1">{update.title}</h3>
                      <span className={`text-xs px-2 py-0.5 md:py-1 rounded border flex-shrink-0 ${getRelevanceColor(update.relevance)}`}>
                        {update.relevance}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{update.source}</p>
                  </div>
                  <span className="text-lg flex-shrink-0">{expandedUpdate === idx ? '▼' : '▶'}</span>
                </div>

                {expandedUpdate === idx && (
                  <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-slate-700 space-y-1.5 md:space-y-2">
                    <div className="text-xs md:text-sm text-slate-300">
                      <strong>💡 Insight:</strong> {update.insight}
                    </div>
                    <div className="text-xs md:text-sm text-slate-300">
                      <strong>✅ Action:</strong> {update.action}
                    </div>
                    <a
                      href={update.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-1 md:mt-2 px-2 md:px-3 py-1 md:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
                    >
                      🔗 More
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Category Stats */}
          {updates[selectedCategory.toLowerCase()].stats && (
            <div className="mt-4 md:mt-6 bg-slate-900 rounded p-3 md:p-4 border border-slate-700">
              <h4 className="font-semibold text-white mb-2 md:mb-3 text-sm md:text-base">📊 Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 md:gap-2">
                {Object.entries(updates[selectedCategory.toLowerCase()].stats).map(([key, value]) => (
                  <div key={key} className="text-center text-xs md:text-base">
                    <div className="text-base md:text-lg font-bold text-blue-400">{value}</div>
                    <div className="text-xs text-slate-400 capitalize truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Check Time */}
          <div className="mt-2 md:mt-4 text-xs text-slate-500 text-center">
            Next: {updates[selectedCategory.toLowerCase()].nextCheck}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedCategory && (
        <div className="text-center py-8 md:py-12 bg-slate-800/30 rounded-lg border border-slate-700">
          <p className="text-slate-400 text-sm md:text-lg">👆 Select category</p>
          <p className="text-slate-500 text-xs md:text-sm mt-2">Updates every 2 hours</p>
        </div>
      )}

      {/* Update History */}
      <div className="bg-slate-800/50 rounded-lg p-3 md:p-6 border border-slate-700">
        <h3 className="text-base md:text-lg font-bold text-white mb-3">📜 History</h3>
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
