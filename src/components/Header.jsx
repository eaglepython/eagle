export function Header({ currentTime }) {
  return (
    <div className="glass rounded-xl md:rounded-2xl p-3 md:p-6 mb-4 md:mb-6 border-b-2 md:border-b-4 border-red-900">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white mb-1 break-words">⚡ LIFE EXCELLENCE TRACKER</h1>
          <p className="text-xs md:text-sm lg:text-base text-slate-300 truncate">Joseph Bidias | Life Optimization</p>
          <p className="text-red-400 text-xs md:text-sm font-semibold mt-1 line-clamp-2">📋 v1.0 | Discipline = Freedom</p>
        </div>
        <div className="text-right bg-slate-800 rounded-lg md:rounded-xl p-2 md:p-4 border border-red-900/50 flex-shrink-0">
          <div className="text-lg md:text-3xl lg:text-4xl font-bold text-white font-mono whitespace-nowrap">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-red-400 text-xs md:text-sm truncate">{currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>
    </div>
  );
}

export default Header;
