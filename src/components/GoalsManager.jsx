import { useState } from 'react';
import { NavIcons } from './IconSystem';
import { generateDemoData } from '../utils/demoData';

function GoalsManager({ userData, setUserData, addNotification }) {
  const [goal, setGoal] = useState({
    title: '',
    category: 'Career',
    deadline: '',
    status: 'In Progress'
  });

  const addGoal = () => {
    if (!goal.title) {
      addNotification('Please enter a goal title', 'warning');
      return;
    }

    setUserData(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: Date.now(), createdAt: new Date().toISOString() }]
    }));

    addNotification(`Goal added: ${goal.title} 🎯`, 'success');
    setGoal({ title: '', category: 'Career', deadline: '', status: 'In Progress' });
  };

  const toggleGoalStatus = (goalId) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId
          ? { ...g, status: g.status === 'Completed' ? 'In Progress' : 'Completed' }
          : g
      )
    }));
  };

  const deleteGoal = (goalId) => {
    setUserData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
    addNotification('Goal deleted', 'info');
  };

  const loadDemoData = () => {
    const demo = generateDemoData();
    setUserData(prev => ({
      ...prev,
      dailyScores: demo.dailyScores,
      jobApplications: demo.careerApplications,
      tradingJournal: demo.tradingEntries,
      workouts: demo.workouts,
      expenses: demo.expenses,
      interactions: demo.interactions,
      careerData: { ...prev.careerData, ...demo.careerData },
      healthData: { ...prev.healthData, ...demo.healthData },
      financeData: { ...prev.financeData, ...demo.financeData },
      tradingData: { ...prev.tradingData, ...demo.tradingData }
    }));
    addNotification('Demo data loaded! 30 days of realistic data added. 🎉', 'success');
  };

  const categoryEmojis = {
    Career: '💼',
    Financial: '💰',
    Health: '💪',
    Learning: '📚',
    Personal: '🎯'
  };

  const categories = Object.keys(categoryEmojis);

  return (
    <div className="space-y-6">
      {/* Add Goal Form */}
      <div className="framework-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <NavIcons.Goals />
          </div>
          <h2 className="text-2xl font-bold text-white">GOALS MANAGER</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Goal Title"
            value={goal.title}
            onChange={(e) => setGoal(prev => ({ ...prev, title: e.target.value }))}
            className="input-field md:col-span-2"
          />
          <select
            value={goal.category}
            onChange={(e) => setGoal(prev => ({ ...prev, category: e.target.value }))}
            className="input-field"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{categoryEmojis[cat]} {cat}</option>
            ))}
          </select>
          <input
            type="date"
            value={goal.deadline}
            onChange={(e) => setGoal(prev => ({ ...prev, deadline: e.target.value }))}
            className="input-field"
          />
        </div>

        <button
          onClick={addGoal}
          className="btn-primary w-full py-3"
        >
          ➕ ADD GOAL
        </button>

        <button
          onClick={loadDemoData}
          className="w-full mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          📊 LOAD DEMO DATA (30 DAYS)
        </button>
      </div>

      {/* Goals by Status */}
      <div className="space-y-6">
        {['In Progress', 'Completed'].map(status => {
          const filteredGoals = userData.goals.filter(g => g.status === status);
          if (filteredGoals.length === 0) return null;

          return (
            <div key={status} className="framework-card">
              <h3 className="section-title">
                {status === 'Completed' ? '✅ COMPLETED GOALS' : '🔄 IN PROGRESS GOALS'}
              </h3>
              <div className="space-y-3">
                {filteredGoals.map(g => {
                  const daysRemaining = g.deadline ? Math.ceil((new Date(g.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                  const isOverdue = daysRemaining && daysRemaining < 0;

                  return (
                    <div
                      key={g.id}
                      className={`bg-slate-900/50 rounded-lg p-4 border ${
                        g.status === 'Completed' ? 'border-green-600/50 opacity-75' : 'border-red-900/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className={`font-semibold text-lg ${
                            g.status === 'Completed' ? 'text-green-400 line-through' : 'text-white'
                          }`}>
                            {categoryEmojis[g.category]} {g.title}
                          </div>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs px-2 py-1 bg-slate-700 rounded text-slate-200">
                              {g.category}
                            </span>
                            {g.deadline && (
                              <span className={`text-xs px-2 py-1 rounded ${
                                isOverdue ? 'bg-red-900/50 text-red-200' : 'bg-blue-900/50 text-blue-200'
                              }`}>
                                {isOverdue ? '⏰ Overdue' : `📅 ${new Date(g.deadline).toLocaleDateString()}`}
                                {daysRemaining && !isOverdue && ` (${daysRemaining}d)`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleGoalStatus(g.id)}
                            className="btn-accent"
                            title={g.status === 'Completed' ? 'Mark incomplete' : 'Mark complete'}
                          >
                            {g.status === 'Completed' ? '↩️' : '✅'}
                          </button>
                          <button
                            onClick={() => deleteGoal(g.id)}
                            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-3 rounded-lg transition-all"
                            title="Delete goal"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Statistics */}
      {userData.goals.length > 0 && (
        <div className="glass rounded-2xl p-4 border border-slate-700">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-slate-300 text-sm">Total Goals</div>
              <div className="text-2xl font-bold text-white">{userData.goals.length}</div>
            </div>
            <div>
              <div className="text-slate-300 text-sm">In Progress</div>
              <div className="text-2xl font-bold text-yellow-400">{userData.goals.filter(g => g.status === 'In Progress').length}</div>
            </div>
            <div>
              <div className="text-slate-300 text-sm">Completed</div>
              <div className="text-2xl font-bold text-green-400">{userData.goals.filter(g => g.status === 'Completed').length}</div>
            </div>
          </div>
        </div>
      )}

      {/* Framework Notes */}
      <div className="glass rounded-2xl p-4 border border-slate-700 text-sm text-slate-300">
        <div className="font-semibold text-white mb-2">📌 GOAL SETTING:</div>
        <p>Set SMART goals across 5 categories: Career (target: senior quant role by Q2 2026), Financial ($2M net worth by 2030), Health (12% body fat, marathons), Learning (publish research), Personal (meaningful relationships). Review and adjust quarterly.</p>
      </div>
    </div>
  );
}

export default GoalsManager;
