import { useState, useEffect } from 'react';
import { NavIcons } from './IconSystem';
import { RecommendationEngine } from '../utils/RecommendationEngine';

function WeeklyReview({ userData, setUserData, addNotification }) {
  const [review, setReview] = useState({
    date: new Date().toISOString().split('T')[0],
    wins: '',
    metrics: '',
    gaps: '',
    nextWeek: ''
  });
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    // Generate AI insights for the week
    const engine = new RecommendationEngine(userData);
    const recs = engine.generateRecommendations();
    const predictions = engine.predictGoalAchievement();
    setAiInsights({ recommendations: recs, predictions });
  }, [userData]);

  const saveReview = () => {
    setUserData(prev => ({
      ...prev,
      weeklyReviews: [...prev.weeklyReviews, { ...review, timestamp: new Date().toISOString() }]
    }));
    addNotification('Weekly review saved! 📝', 'success');
    setReview({
      date: new Date().toISOString().split('T')[0],
      wins: '',
      metrics: '',
      gaps: '',
      nextWeek: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Weekly Insights */}
      {aiInsights && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-600/30 rounded-lg p-4">
          <h3 className="text-lg font-bold text-blue-300 mb-3">🤖 AI Weekly Analysis</h3>
          <div className="space-y-3 text-sm">
            {/* Performance Summary */}
            {aiInsights.predictions && (
              <div className="bg-blue-900/10 border border-blue-500/30 rounded p-2">
                <div className="font-semibold text-blue-300 mb-2">📊 This Week's Performance:</div>
                <div className="space-y-1 text-blue-200/80">
                  {aiInsights.predictions.daily && (
                    <div>• Daily Score: {aiInsights.predictions.daily.current}/10 ({aiInsights.predictions.daily.confidence.toFixed(0)}% confidence to reach 8/10)</div>
                  )}
                  {aiInsights.predictions.career && (
                    <div>• Career Applications: {aiInsights.predictions.career.current}/15 target</div>
                  )}
                  {aiInsights.predictions.health && (
                    <div>• Workouts: {aiInsights.predictions.health.current}/6 this week</div>
                  )}
                </div>
              </div>
            )}

            {/* Key Recommendations */}
            <div className="bg-yellow-900/10 border border-yellow-500/30 rounded p-2">
              <div className="font-semibold text-yellow-300 mb-2">🎯 Focus Areas for Next Week:</div>
              <ul className="space-y-1 text-yellow-200/80">
                {aiInsights.recommendations
                  .filter(r => r.type !== 'insight')
                  .slice(0, 3)
                  .map((rec, idx) => (
                    <li key={idx}>• {rec.title}</li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="framework-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <NavIcons.Weekly />
          </div>
          <h2 className="text-2xl font-bold text-white">WEEKLY REVIEW</h2>
        </div>
        <p className="text-slate-300 text-sm mb-6">Reflect on your week using the Life Structure & Discipline Framework. Every Sunday morning.</p>

        <div className="space-y-6">
          <div>
            <label className="block text-red-400 font-semibold mb-2">🏆 Top 3 Wins This Week</label>
            <textarea
              value={review.wins}
              onChange={(e) => setReview(prev => ({ ...prev, wins: e.target.value }))}
              className="textarea-field w-full"
              placeholder="1. Sent 20 job applications&#10;2. Completed portfolio project&#10;3. Hit 8+ daily score 5 days"
            />
          </div>

          <div>
            <label className="block text-red-400 font-semibold mb-2">📈 Key Metrics</label>
            <textarea
              value={review.metrics}
              onChange={(e) => setReview(prev => ({ ...prev, metrics: e.target.value }))}
              className="textarea-field w-full"
              placeholder="Applications: 20 | Interviews: 2 | Trading P&L: +2.3% | Workouts: 6/6"
            />
          </div>

          <div>
            <label className="block text-red-400 font-semibold mb-2">⚠️ Gaps & Improvements</label>
            <textarea
              value={review.gaps}
              onChange={(e) => setReview(prev => ({ ...prev, gaps: e.target.value }))}
              className="textarea-field w-full"
              placeholder="Fell short on sleep 2 nights | Networking follow-ups weak | Trading discipline needs work"
            />
          </div>

          <div>
            <label className="block text-red-400 font-semibold mb-2">🎯 Next Week's Top 3 Priorities</label>
            <textarea
              value={review.nextWeek}
              onChange={(e) => setReview(prev => ({ ...prev, nextWeek: e.target.value }))}
              className="textarea-field w-full"
              placeholder="1. Close 1 interview into offer | 2. Hit 15+ job applications | 3. Achieve 8+ daily score 5/7 days"
            />
          </div>

          <button
            onClick={saveReview}
            className="btn-primary w-full py-4"
          >
            💾 SAVE WEEKLY REVIEW
          </button>
        </div>
      </div>

      {/* Past Reviews */}
      {userData.weeklyReviews.length > 0 && (
        <div className="framework-card">
          <h2 className="section-title">📚 PAST REVIEWS</h2>
          <div className="space-y-3">
            {userData.weeklyReviews.slice(-8).reverse().map((rev, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-red-900/30">
                <div className="text-red-400 text-sm font-semibold mb-2">
                  {new Date(rev.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
                <div className="text-slate-300 text-sm">
                  <strong className="text-white">Wins:</strong> {rev.wins.substring(0, 120)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeeklyReview;
