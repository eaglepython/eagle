import { useState, useEffect } from 'react';
import { NavIcons } from './IconSystem';
import { TradingJournalAgent } from '../utils/TradingJournalAgent';

function TradingJournal({ userData, setUserData, addNotification }) {
  const [trade, setTrade] = useState({
    date: new Date().toISOString().split('T')[0],
    asset: '',
    type: 'Long',
    entry: '',
    exit: '',
    pnl: '',
    notes: ''
  });

  const [agentInsights, setAgentInsights] = useState(null);

  useEffect(() => {
    const agent = new TradingJournalAgent(userData);
    const recommendations = agent.generateTradingRecommendations();
    const monthlyStats = agent.getMonthlyStats();
    
    setAgentInsights({
      recommendations,
      monthlyStats
    });
  }, [userData]);

  const addTrade = () => {
    if (!trade.asset || !trade.entry) {
      addNotification('Please fill in asset and entry price', 'warning');
      return;
    }

    setUserData(prev => {
      const updatedData = {
        ...prev,
        tradingJournal: [...prev.tradingJournal, { ...trade, id: Date.now() }]
      };

      // Track interaction
      if (!updatedData.interactions) updatedData.interactions = [];
      updatedData.interactions.push({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'trade_executed',
        component: 'trading',
        data: trade,
        goalAlignment: 'Trading Goal - $500K AUM with 20% returns by 2026'
      });

      return updatedData;
    });

    addNotification(`Trade logged: ${trade.asset} 📊`, 'success');
    setTrade({
      date: new Date().toISOString().split('T')[0],
      asset: '',
      type: 'Long',
      entry: '',
      exit: '',
      pnl: '',
      notes: ''
    });
  };

  const calculateStats = () => {
    const trades = userData.tradingJournal.filter(t => t.pnl);
    const wins = trades.filter(t => parseFloat(t.pnl) > 0).length;
    const losses = trades.filter(t => parseFloat(t.pnl) < 0).length;
    const totalPnL = trades.reduce((sum, t) => sum + parseFloat(t.pnl || 0), 0);
    const avgPnL = trades.length > 0 ? totalPnL / trades.length : 0;
    const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0;
    const avgWin = wins > 0 ? trades.filter(t => parseFloat(t.pnl) > 0).reduce((sum, t) => sum + parseFloat(t.pnl), 0) / wins : 0;
    const avgLoss = losses > 0 ? trades.filter(t => parseFloat(t.pnl) < 0).reduce((sum, t) => sum + parseFloat(t.pnl), 0) / losses : 0;
    const profitFactor = Math.abs(avgLoss) > 0 ? (avgWin * wins) / (Math.abs(avgLoss) * losses) : 0;

    return { totalPnL, avgPnL, winRate, totalTrades: trades.length, wins, losses, avgWin, avgLoss, profitFactor };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* AI Agent Insights Panel */}
      {agentInsights?.recommendations && agentInsights.recommendations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-green-900/50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🤖</span>
            <h3 className="text-xl font-bold text-white">TRADE PATTERN ANALYSIS</h3>
          </div>
          
          <div className="space-y-3">
            {agentInsights.recommendations.slice(0, 2).map((rec, idx) => (
              <div key={idx} className="bg-slate-900 rounded-lg p-4 border border-green-800/50">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold text-green-200">{rec.title}</div>
                  <span className="text-xs px-2 py-1 rounded bg-green-900/50 text-green-200">
                    {rec.type === 'urgent' ? '🔴 CRITICAL' : rec.type === 'warning' ? '⚠️ WARNING' : '✅ STRENGTH'}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-300">
                  {rec.current && <div>{rec.current}</div>}
                  {rec.problem && <div className="text-red-300">{rec.problem}</div>}
                  {rec.solution && Array.isArray(rec.solution) && (
                    <div className="text-green-300 text-xs">{rec.solution[0]}</div>
                  )}
                  {rec.insight && <div className="text-yellow-300">{rec.insight}</div>}
                </div>
              </div>
            ))}
          </div>

          {agentInsights.monthlyStats && (
            <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-300">
              <div className="font-bold text-white">Monthly Status: {agentInsights.monthlyStats.status}</div>
              <div className="text-xs text-slate-400 mt-1">
                {agentInsights.monthlyStats.trajectory}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="glass rounded-2xl p-6 border border-red-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="icon-container">
            <NavIcons.Trading />
          </div>
          <h2 className="text-2xl font-bold text-white">TRADING JOURNAL</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Total P&L</div>
            <div className={`text-2xl font-bold font-mono ${stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats.totalPnL.toFixed(2)}
            </div>
          </div>
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Win Rate</div>
            <div className="text-2xl font-bold text-blue-400">{stats.winRate.toFixed(1)}%</div>
          </div>
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Avg P&L</div>
            <div className={`text-2xl font-bold font-mono ${stats.avgPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${stats.avgPnL.toFixed(2)}
            </div>
          </div>
          <div className="stat-box">
            <div className="text-slate-300 text-sm">Trades</div>
            <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          <div className="stat-box text-sm">
            <div className="text-green-400">Wins: {stats.wins}</div>
            <div className="text-red-400">Losses: {stats.losses}</div>
          </div>
          <div className="stat-box text-sm">
            <div className="text-slate-300">Avg Win</div>
            <div className="text-green-400 font-bold">${stats.avgWin.toFixed(2)}</div>
          </div>
          <div className="stat-box text-sm">
            <div className="text-slate-300">Profit Factor</div>
            <div className="text-blue-400 font-bold">{stats.profitFactor.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Add Trade Form */}
      <div className="framework-card">
        <h3 className="text-xl font-bold text-white mb-4">➕ LOG NEW TRADE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Asset (e.g., EUR/USD)"
            value={trade.asset}
            onChange={(e) => setTrade(prev => ({ ...prev, asset: e.target.value }))}
            className="input-field"
          />
          <select
            value={trade.type}
            onChange={(e) => setTrade(prev => ({ ...prev, type: e.target.value }))}
            className="input-field"
          >
            <option value="Long">📈 Long</option>
            <option value="Short">📉 Short</option>
          </select>
          <input
            type="number"
            step="0.0001"
            placeholder="Entry Price"
            value={trade.entry}
            onChange={(e) => setTrade(prev => ({ ...prev, entry: e.target.value }))}
            className="input-field"
          />
          <input
            type="number"
            step="0.0001"
            placeholder="Exit Price"
            value={trade.exit}
            onChange={(e) => setTrade(prev => ({ ...prev, exit: e.target.value }))}
            className="input-field"
          />
          <input
            type="number"
            step="0.01"
            placeholder="P&L ($)"
            value={trade.pnl}
            onChange={(e) => setTrade(prev => ({ ...prev, pnl: e.target.value }))}
            className="input-field"
          />
          <input
            type="date"
            value={trade.date}
            onChange={(e) => setTrade(prev => ({ ...prev, date: e.target.value }))}
            className="input-field"
          />
        </div>
        <textarea
          placeholder="Trade notes and lessons learned..."
          value={trade.notes}
          onChange={(e) => setTrade(prev => ({ ...prev, notes: e.target.value }))}
          className="textarea-field w-full mb-4"
        />

        <button
          onClick={addTrade}
          className="btn-primary w-full py-3"
        >
          ➕ LOG TRADE
        </button>
      </div>

      {/* Recent Trades */}
      {userData.tradingJournal.length > 0 && (
        <div className="framework-card">
          <h3 className="section-title">📋 RECENT TRADES</h3>
          <div className="space-y-3">
            {userData.tradingJournal.slice(-12).reverse().map(t => (
              <div key={t.id} className="bg-slate-900/50 rounded-lg p-4 border border-red-900/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">{t.asset}</span>
                    <span className={`text-xs px-2 py-1 rounded font-semibold ${
                      t.type === 'Long' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>{t.type}</span>
                  </div>
                  <div className={`font-bold font-mono ${parseFloat(t.result) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {t.result ? `$${parseFloat(t.result).toFixed(2)}` : 'Open'}
                  </div>
                </div>
                {t.notes && <div className="text-slate-400 text-sm mb-2">📝 {t.notes.substring(0, 100)}</div>}
                <div className="text-slate-500 text-xs">{new Date(t.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Framework Notes */}
      <div className="glass rounded-2xl p-4 border border-slate-700 text-sm text-slate-300">
        <div className="font-semibold text-white mb-2">📌 TRADING PROTOCOL:</div>
        <p>Execute your strategy daily. Journal all trades immediately. Target: $500K AUM with 20%+ annual returns by end 2026. Document decision-making, risk management, and lessons for continuous improvement.</p>
      </div>
    </div>
  );
}

export default TradingJournal;
