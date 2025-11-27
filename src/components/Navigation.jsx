import { NavIcons } from './IconSystem';

export function Navigation({ currentView, setCurrentView, views }) {
  const iconMap = {
    dashboard: NavIcons.Dashboard,
    daily: NavIcons.Daily,
    weekly: NavIcons.Weekly,
    career: NavIcons.Career,
    trading: NavIcons.Trading,
    health: NavIcons.Health,
    finance: NavIcons.Finance,
    goals: NavIcons.Goals,
    reminders: NavIcons.Reminders,
    resources: NavIcons.Resources,
    live: NavIcons.LiveUpdates
  };

  return (
    <div className="glass rounded-xl md:rounded-2xl p-2 md:p-4 mb-4 md:mb-6 border border-red-900/50 overflow-x-auto">
      <div className="flex gap-1 md:gap-2 min-w-min md:flex-wrap">
        {Object.keys(views).map(view => {
          const IconComponent = iconMap[view];
          return (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold transition-all flex items-center gap-1 md:gap-2 text-xs md:text-sm whitespace-nowrap flex-shrink-0 ${
                currentView === view
                  ? 'bg-red-900 text-white shadow-lg border border-red-700'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
              }`}
            >
              <div className="w-4 md:w-5 h-4 md:h-5 flex items-center justify-center flex-shrink-0" style={{ stroke: 'currentColor' }}>
                <IconComponent />
              </div>
              <span className="hidden sm:inline">{view.charAt(0).toUpperCase() + view.slice(1)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Navigation;
