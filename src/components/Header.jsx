export function Header({ currentTime }) {
  return (
    <div className="glass rounded-2xl p-6 mb-6 border-b-4 border-red-900">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">⚡ LIFE EXCELLENCE TRACKER</h1>
          <p className="text-slate-300 text-lg">Joseph Bidias | Quantitative Life Optimization System</p>
          <p className="text-red-400 text-sm font-semibold mt-1">📋 Framework v1.0 | Discipline = Freedom | Structure = Creativity | Measurement = Improvement</p>
        </div>
        <div className="text-right bg-slate-800 rounded-xl p-4 border border-red-900/50">
          <div className="text-4xl font-bold text-white font-mono">{currentTime.toLocaleTimeString()}</div>
          <div className="text-red-400 text-sm">{currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
