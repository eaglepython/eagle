import { useState, useEffect } from 'react';
import { NavIcons } from './IconSystem';
import { HealthTrackerAgent } from '../utils/HealthTrackerAgent';

function HealthTracker({ userData, setUserData, addNotification }) {
  const [workout, setWorkout] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Strength',
    duration: '',
    notes: ''
  });

  const [agentInsights, setAgentInsights] = useState(null);

  useEffect(() => {
    const agent = new HealthTrackerAgent(userData);
    const recommendations = agent.generateFitnessRecommendations();
    const schedule = agent.getIdealWeeklySchedule();
    
    setAgentInsights({
      recommendations,
      schedule
    });
  }, [userData]);

  const addWorkout = () => {
    if (!workout.duration) {
      addNotification('Please enter workout duration', 'warning');
      return;
    }

    setUserData(prev => {
      const updatedData = {
        ...prev,
        workouts: [...prev.workouts, { ...workout, id: Date.now() }]
      };

      // Track interaction
      if (!updatedData.interactions) updatedData.interactions = [];
      updatedData.interactions.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'workout_logged',
        component: 'health',
        data: workout,
        goalAlignment: 'Health Goal - 12% body fat by 2026'
      });

      return updatedData;
    });

    addNotification(`Workout logged: ${workout.type} for ${workout.duration} min 💪`, 'success');
    setWorkout({
      date: new Date().toISOString().split('T')[0],
      type: 'Strength',
      duration: '',
      notes: ''
    });
  };

  const thisWeek = userData.workouts.filter(w => {
    const workoutDate = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return workoutDate >= weekAgo;
  });

  const totalMinutes = thisWeek.reduce((sum, w) => sum + parseInt(w.duration || 0), 0);
  const avgDuration = thisWeek.length > 0 ? Math.round(totalMinutes / thisWeek.length) : 0;

  return (
    <div className="space-y-6">
      {/* AI Agent Insights Panel */}
      {agentInsights?.recommendations && agentInsights.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-orange-900/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-bold text-white">WORKOUT OPTIMIZATION</h3>
          </div>
          
          <div className="space-y-3">
            {agentInsights.recommendations.slice(0, 2).map((rec, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-orange-800/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-orange-200">{rec.title}</div>
                  <span className="text-xs px-2 py-1 rounded bg-orange-900/50 text-orange-200">
                    {rec.type === 'urgent' ? '🔴 URGENT' : rec.type === 'warning' ? '⚠️ WARNING' : '💡 TIP'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-300">
                  {rec.current && <div>{rec.current}</div>}
                  {rec.target && <div className="text-orange-300">Target: {rec.target}</div>}
                  {rec.problem && <div className="text-red-300">{rec.problem}</div>}
                  {rec.solution && Array.isArray(rec.solution) && (
                    <div className="text-green-300 text-xs">{rec.solution[0]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Header with Stats */}
      <div className="glass rounded-2xl p-6 border border-red-900/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="icon-container">
              <NavIcons.Health />
            </div>
            <h2 className="text-2xl font-bold text-white">HEALTH TRACKER</h2>
          </div>
          <div className="text-right bg-slate-800 rounded-xl p-4 border border-red-900/50">
            <div className="text-slate-300 text-sm">This Week</div>
            <div className={`text-4xl font-bold font-mono ${thisWeek.length >= 6 ? 'text-green-400' : 'text-yellow-400'}`}>
              {thisWeek.length}/6
            </div>
            <div className="text-xs text-slate-400 mt-1">Target: 6 workouts</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Total Minutes</div>
            <div className="text-3xl font-bold text-blue-400">{totalMinutes}</div>
          </div>
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Avg Duration</div>
            <div className="text-3xl font-bold text-purple-400">{avgDuration} min</div>
          </div>
        </div>
      </div>

      {/* Add Workout Form */}
      <div className="framework-card">
        <h3 className="text-xl font-bold text-white mb-4">➕ LOG NEW WORKOUT</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <select
            value={workout.type}
            onChange={(e) => setWorkout(prev => ({ ...prev, type: e.target.value }))}
            className="input-field"
          >
            <option value="Strength">💪 Strength Training</option>
            <option value="Cardio">🏃 Cardio</option>
            <option value="HIIT">⚡ HIIT</option>
            <option value="Yoga">🧘 Yoga/Stretching</option>
            <option value="Sport">⚽ Sport</option>
            <option value="Active Recovery">🚴 Active Recovery</option>
          </select>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={workout.duration}
            onChange={(e) => setWorkout(prev => ({ ...prev, duration: e.target.value }))}
            className="input-field"
          />
        </div>
        <textarea
          placeholder="Workout notes (exercises, sets, reps, how you felt, etc.)"
          value={workout.notes}
          onChange={(e) => setWorkout(prev => ({ ...prev, notes: e.target.value }))}
          className="textarea-field w-full mb-4"
        />

        <button
          onClick={addWorkout}
          className="btn-primary w-full py-3"
        >
          ➕ LOG WORKOUT
        </button>
      </div>

      {/* Recent Workouts */}
      {userData.workouts.length > 0 && (
        <div className="framework-card">
          <h3 className="section-title">📋 RECENT WORKOUTS</h3>
          <div className="space-y-3">
            {userData.workouts.slice(-12).reverse().map(w => (
              <div key={w.id} className="bg-slate-900/50 rounded-lg p-4 border border-red-900/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-white font-semibold">{w.type}</span>
                    <span className="text-slate-400 text-sm ml-2">({w.duration} min)</span>
                  </div>
                  <div className="text-slate-500 text-xs">{new Date(w.date).toLocaleDateString()}</div>
                </div>
                {w.notes && <div className="text-slate-400 text-sm">📝 {w.notes.substring(0, 100)}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Framework Notes */}
      <div className="glass rounded-2xl p-4 border border-slate-700 text-sm text-slate-300">
        <div className="font-semibold text-white mb-2">📌 HEALTH PROTOCOL:</div>
        <p>Target: 6 workouts per week. Monday: Upper body | Tuesday: HIIT + abs | Wednesday: Lower body | Thursday: Cardio (45 min) | Friday: Full body/Sport | Saturday: Long cardio (60-90 min) | Sunday: Rest/Yoga. Goal: 12% body fat, half-marathon sub-1:45 by 2026.</p>
      </div>
    </div>
  );
}

export default HealthTracker;
