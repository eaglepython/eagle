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
    <div className="glass rounded-2xl p-4 mb-6 border border-red-900/50">
      <div className="flex flex-wrap gap-2">
        {Object.keys(views).map(view => {
          const IconComponent = iconMap[view];
          return (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentView === view
                  ? 'bg-red-900 text-white shadow-lg border border-red-700'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center" style={{ stroke: 'currentColor' }}>
                <IconComponent />
              </div>
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Navigation;
