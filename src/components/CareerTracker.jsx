import { useState, useEffect } from 'react';
import { CareerTrackerAgent } from '../utils/CareerTrackerAgent';

function CareerTracker({ userData, setUserData, addNotification }) {
  const [app, setApp] = useState({
    date: new Date().toISOString().split('T')[0],
    company: '',
    position: '',
    status: 'Applied',
    tier: 'Tier 3'
  });

  const [agentInsights, setAgentInsights] = useState(null);

  useEffect(() => {
    const agent = new CareerTrackerAgent(userData);
    const recommendations = agent.generateTierRecommendations();
    const weeklyTarget = agent.getWeeklyTarget();
    const pipeline = agent.getInterviewPipeline();
    
    setAgentInsights({
      recommendations,
      weeklyTarget,
      pipeline
    });
  }, [userData]);

  const addApplication = () => {
    if (!app.company || !app.position) {
      addNotification('Please fill in company and position', 'warning');
      return;
    }

    setUserData(prev => {
      const updatedData = {
        ...prev,
        jobApplications: [...prev.jobApplications, { ...app, id: Date.now() }]
      };

      // Track interaction
      if (!updatedData.interactions) updatedData.interactions = [];
      updatedData.interactions.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'application_logged',
        component: 'career',
        data: app,
        goalAlignment: 'Career Goal - Quant Researcher by 2026'
      });

      return updatedData;
    });

    addNotification(`Application logged: ${app.company} 💼`, 'success');
    setApp({
      date: new Date().toISOString().split('T')[0],
      company: '',
      position: '',
      status: 'Applied',
      tier: 'Tier 3'
    });
  };

  const thisWeek = userData.jobApplications.filter(a => {
    const appDate = new Date(a.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return appDate >= weekAgo;
  });

  const statusCounts = {
    applied: userData.jobApplications.filter(a => a.status === 'Applied').length,
    phoneScreen: userData.jobApplications.filter(a => a.status === 'Phone Screen').length,
    interview: userData.jobApplications.filter(a => a.status === 'Interview').length,
    offer: userData.jobApplications.filter(a => a.status === 'Offer').length
  };

  return (
    <div className="space-y-6">
      {/* AI Agent Insights Panel */}
      {agentInsights?.recommendations && agentInsights.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-blue-900/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-bold text-white">TIER-SPECIFIC ANALYSIS</h3>
          </div>
          
          <div className="space-y-3">
            {agentInsights.recommendations.slice(0, 2).map((rec, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-blue-800/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-blue-200">{rec.title}</div>
                  <span className="text-xs px-2 py-1 rounded bg-blue-900/50 text-blue-200">
                    {rec.type === 'urgent' ? '🔴 URGENT' : rec.type === 'warning' ? '⚠️ WARNING' : '💡 INSIGHT'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-300">
                  {rec.current && <div>Current: {rec.current}</div>}
                  {rec.target && <div className="text-blue-300">Target: {rec.target}</div>}
                  {rec.problem && <div className="text-red-300">{rec.problem}</div>}
                  {rec.solution && Array.isArray(rec.solution) && (
                    <div className="text-green-300 text-xs">{rec.solution[0]}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {agentInsights.weeklyTarget && (
            <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-300">
              <div className="font-bold text-white mb-1">Weekly Target Status:</div>
              <div>{agentInsights.weeklyTarget.status}</div>
              <div className="text-xs text-slate-400 mt-1">
                Complete: {agentInsights.weeklyTarget.completed}/{agentInsights.weeklyTarget.target}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Header with Stats */}
      <div className="glass rounded-2xl p-6 border border-red-900/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">💼 CAREER TRACKER</h2>
          <div className="text-right bg-slate-800 rounded-xl p-4 border border-red-900/50">
            <div className="text-slate-300 text-sm">This Week</div>
            <div className={`text-4xl font-bold font-mono ${thisWeek.length >= 15 ? 'text-green-400' : 'text-yellow-400'}`}>
              {thisWeek.length}/15
            </div>
            <div className="text-xs text-slate-400 mt-1">Target: 15 applications</div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-sm">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-blue-400 font-semibold">{statusCounts.applied}</div>
            <div className="text-slate-400 text-xs">Applied</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-yellow-400 font-semibold">{statusCounts.phoneScreen}</div>
            <div className="text-slate-400 text-xs">Phone</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-orange-400 font-semibold">{statusCounts.interview}</div>
            <div className="text-slate-400 text-xs">Interview</div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-green-400 font-semibold">{statusCounts.offer}</div>
            <div className="text-slate-400 text-xs">Offer</div>
          </div>
        </div>
      </div>

      {/* Add Application Form */}
      <div className="framework-card">
        <h3 className="text-xl font-bold text-white mb-4">➕ LOG NEW APPLICATION</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Company Name"
            value={app.company}
            onChange={(e) => setApp(prev => ({ ...prev, company: e.target.value }))}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Position Title"
            value={app.position}
            onChange={(e) => setApp(prev => ({ ...prev, position: e.target.value }))}
            className="input-field"
          />
          <select
            value={app.tier}
            onChange={(e) => setApp(prev => ({ ...prev, tier: e.target.value }))}
            className="input-field"
          >
            <option value="Tier 1">⭐ Tier 1 (Dream)</option>
            <option value="Tier 2">🌟 Tier 2 (Excellent)</option>
            <option value="Tier 3">✨ Tier 3 (Strong)</option>
            <option value="Tier 4">💼 Tier 4 (Backup)</option>
          </select>
          <select
            value={app.status}
            onChange={(e) => setApp(prev => ({ ...prev, status: e.target.value }))}
            className="input-field"
          >
            <option value="Applied">Applied</option>
            <option value="Phone Screen">Phone Screen</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <button
          onClick={addApplication}
          className="btn-primary w-full py-3"
        >
          ➕ ADD APPLICATION
        </button>
      </div>

      {/* Recent Applications */}
      {userData.jobApplications.length > 0 && (
        <div className="framework-card">
          <h3 className="section-title">📋 RECENT APPLICATIONS</h3>
          <div className="space-y-3">
            {userData.jobApplications.slice(-15).reverse().map(application => (
              <div key={application.id} className="bg-slate-900/50 rounded-lg p-4 border border-red-900/30">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-semibold">{application.company}</div>
                    <div className="text-slate-400 text-sm">{application.position}</div>
                    <div className="text-slate-500 text-xs mt-1">{new Date(application.date).toLocaleDateString()}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold px-3 py-1 rounded-full mb-2 ${
                      application.tier === 'Tier 1' ? 'bg-yellow-900 text-yellow-200' :
                      application.tier === 'Tier 2' ? 'bg-blue-900 text-blue-200' :
                      application.tier === 'Tier 3' ? 'bg-purple-900 text-purple-200' :
                      'bg-slate-700 text-slate-200'
                    }`}>
                      {application.tier}
                    </div>
                    <div className={`text-xs font-semibold px-2 py-1 rounded ${
                      application.status === 'Offer' ? 'bg-green-900 text-green-200' :
                      application.status === 'Interview' ? 'bg-orange-900 text-orange-200' :
                      application.status === 'Phone Screen' ? 'bg-yellow-900 text-yellow-200' :
                      application.status === 'Rejected' ? 'bg-red-900 text-red-200' :
                      'bg-slate-700 text-slate-200'
                    }`}>
                      {application.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Framework Notes */}
      <div className="glass rounded-2xl p-4 border border-slate-700 text-sm text-slate-300">
        <div className="font-semibold text-white mb-2">📌 FRAMEWORK TARGET:</div>
        <p>15 tailored applications per week to Tier 1-3 companies. Deep dive on each: 30 min research, 20 min resume customization, 30 min cover letter, 10 min submission + 10 min follow-up = 90 min per quality application.</p>
      </div>
    </div>
  );
}

export default CareerTracker;
