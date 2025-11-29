import { useState, useEffect } from 'react';

export function Header({ currentTime }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [todayFormula, setTodayFormula] = useState('');

  // Formula database
  const formulas = [
    { name: 'Brownian Motion', symbol: 'dW_t', formula: '√dt · N(0,1)', category: 'paths' },
    { name: 'Black-Scholes', symbol: 'C = S₀N(d₁)', formula: '- Ke^(-rT)N(d₂)', category: 'finance' },
    { name: 'Vasicek Model', symbol: 'dr_t', formula: 'a(b-r_t)dt + σdW_t', category: 'finance' },
    { name: 'MLP Forward Pass', symbol: 'h = σ(Wx + b)', formula: 'activation(weight·input + bias)', category: 'dl' },
    { name: 'Backpropagation', symbol: '∂L/∂W', formula: '∂L/∂h · ∂h/∂W', category: 'dl' },
    { name: 'Q-Learning', symbol: 'Q(s,a)', formula: 'r + γ·max(Q(s\',a\'))', category: 'ml' },
    { name: 'Entropy', symbol: 'H(X)', formula: '-Σ p(x)·log(p(x))', category: 'ml' },
    { name: 'Quantum Superposition', symbol: '|ψ⟩', formula: 'α|0⟩ + β|1⟩', category: 'quantum' },
    { name: 'Schrodinger Equation', symbol: 'iℏ∂ψ/∂t', formula: 'Ĥψ', category: 'quantum' },
    { name: 'Wiener Process', symbol: 'W(t)', formula: 'continuous path, N(0,t)', category: 'paths' }
  ];

  useEffect(() => {
    // Rotate formula every load
    const randomFormula = formulas[Math.floor(Math.random() * formulas.length)];
    setTodayFormula(randomFormula);

    // Get upcoming events
    const events = [
      { date: new Date(2025, 11, 25), name: 'Christmas Day', emoji: '🎄' },
      { date: new Date(2025, 11, 31), name: 'New Year\'s Eve', emoji: '🎉' },
      { date: new Date(2026, 0, 1), name: 'New Year 2026', emoji: '🎆' },
      { date: new Date(2026, 0, 15), name: 'MLK Day', emoji: '🇺🇸' },
      { date: new Date(2026, 1, 14), name: 'Valentine\'s Day', emoji: '💕' },
      { date: new Date(2026, 2, 17), name: 'St. Patrick\'s Day', emoji: '🍀' },
      { date: new Date(2026, 4, 25), name: 'Memorial Day', emoji: '🇺🇸' },
      { date: new Date(2026, 6, 4), name: 'Independence Day', emoji: '🎆' },
      { date: new Date(2026, 8, 7), name: 'Labor Day', emoji: '💼' },
      { date: new Date(2026, 10, 26), name: 'Thanksgiving', emoji: '🦃' },
      { date: new Date(2026, 11, 25), name: 'Christmas 2026', emoji: '🎄' }
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 2);

    setUpcomingEvents(upcoming);
  }, []);

  // Calculate days until event
  const daysUntilEvent = (eventDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    target.setHours(0, 0, 0, 0);
    const diff = target - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getFormulaColor = (category) => {
    switch(category) {
      case 'finance': return 'from-green-900/30 to-emerald-900/30 border-green-600/30';
      case 'dl': return 'from-orange-900/30 to-amber-900/30 border-orange-600/30';
      case 'ml': return 'from-purple-900/30 to-violet-900/30 border-purple-600/30';
      case 'quantum': return 'from-indigo-900/30 to-blue-900/30 border-indigo-600/30';
      case 'paths': return 'from-pink-900/30 to-rose-900/30 border-pink-600/30';
      default: return 'from-slate-900/30 to-slate-800/30 border-slate-600/30';
    }
  };

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="glass rounded-xl md:rounded-2xl p-3 md:p-6 mb-4 md:mb-6 border-b-2 md:border-b-4 border-red-900 space-y-3 md:space-y-4">
      {/* Top Row: Title and Time */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 break-words">⚡ LIFE EXCELLENCE TRACKER</h1>
          <p className="text-xs md:text-sm lg:text-base text-slate-300 truncate">Joseph Bidias | Life Optimization</p>
          <p className="text-red-400 text-xs md:text-sm font-semibold mt-1 line-clamp-2">📋 v1.0 | Discipline = Freedom</p>
        </div>

        {/* Time with Seconds & Date */}
        <div className="text-right bg-slate-800 rounded-lg md:rounded-xl p-2 md:p-4 border border-red-900/50 flex-shrink-0">
          <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-white font-mono whitespace-nowrap">
            {timeStr}
          </div>
          <div className="text-red-400 text-xs md:text-sm truncate">{dateStr}</div>
        </div>
      </div>

      {/* Bottom Row: Formulas & Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-3">
        {/* Daily Formula */}
        {todayFormula && (
          <div className={`bg-gradient-to-br ${getFormulaColor(todayFormula.category)} rounded-lg p-2 md:p-3 border hover:border-opacity-100 transition`}>
            <span className="text-2xl md:text-3xl flex-shrink-0">📐</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs md:text-sm text-slate-300">{todayFormula.name}</div>
              <div className="text-xs md:text-sm font-mono text-white">{todayFormula.symbol}</div>
              <div className="text-xs text-slate-400 line-clamp-1">{todayFormula.formula}</div>
            </div>
          </div>
        )}

        {/* Upcoming Event 1 */}
        {upcomingEvents.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-lg p-2 md:p-3 border border-purple-600/30 flex items-center gap-2 hover:border-purple-500/50 transition">
            <span className="text-2xl md:text-3xl flex-shrink-0">{upcomingEvents[0].emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs md:text-sm text-slate-300 truncate">{upcomingEvents[0].name}</div>
              <div className="text-base md:text-lg font-semibold text-white">{daysUntilEvent(upcomingEvents[0].date)}d</div>
              <div className="text-xs text-slate-400">away</div>
            </div>
          </div>
        )}

        {/* Upcoming Event 2 */}
        {upcomingEvents.length > 1 && (
          <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-2 md:p-3 border border-blue-600/30 flex items-center gap-2 hover:border-blue-500/50 transition">
            <span className="text-2xl md:text-3xl flex-shrink-0">{upcomingEvents[1].emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-xs md:text-sm text-slate-300 truncate">{upcomingEvents[1].name}</div>
              <div className="text-base md:text-lg font-semibold text-white">{daysUntilEvent(upcomingEvents[1].date)}d</div>
              <div className="text-xs text-slate-400">away</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
