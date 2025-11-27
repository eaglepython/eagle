/* Sophisticated SVG Icon System for Life Tracker */

export const MetricIcons = {
  Score: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M12 2v20M2 12h20M7 7l10 10M17 7l-10 10" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Trend: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Applications: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="17" y2="12" />
      <line x1="7" y1="16" x2="17" y2="16" />
    </svg>
  ),
  Workouts: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <line x1="6" y1="9" x2="6" y2="20" />
      <line x1="12" y1="5" x2="12" y2="20" />
      <line x1="18" y1="8" x2="18" y2="20" />
      <path d="M4 9h16" strokeLinecap="round" />
      <circle cx="6" cy="5" r="2" />
      <circle cx="12" cy="2" r="2" />
      <circle cx="18" cy="4" r="2" />
    </svg>
  ),
  PnL: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M12 2v20M2 12h20M6 6v12M12 8v10M18 6v12" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="21 6 18 9 15 6" />
    </svg>
  ),
  WinRate: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  NetWorth: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a4.5 4.5 0 0 0 0 9H12m0 0a4.5 4.5 0 0 1 0 9H9m6-9h2.5a4.5 4.5 0 0 0 0-9H17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Savings: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M8 12h8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="9" x2="16" y2="9" />
    </svg>
  ),
  Time: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Duration: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M9 11l3 3L22 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const NavIcons = {
  Dashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Daily: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4" strokeLinecap="round" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  ),
  Weekly: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M3 12h18M12 3v18M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  Career: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M16 11h6M16 14h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Trading: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="2" y1="2" x2="22" y2="22" strokeDasharray="5,5" opacity="0.5" />
    </svg>
  ),
  Health: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M12 2a10 10 0 0 0-10 10v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8a10 10 0 0 0-10-10z" />
      <path d="M12 6v12M6 12h12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Finance: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M12 1v22M17 5H9.5a4.5 4.5 0 0 0 0 9H12m0 0a4.5 4.5 0 0 1 0 9H9m6-9h2.5a4.5 4.5 0 0 0 0-9H17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Goals: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M6 12h12M12 2a10 10 0 100 20 10 10 0 000-20z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const CategoryIcons = {
  Morning: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  DeepWork: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4h16v11H4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9h6M9 13h4" strokeLinecap="round" />
    </svg>
  ),
  Exercise: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <line x1="6" y1="9" x2="6" y2="20" />
      <line x1="12" y1="5" x2="12" y2="20" />
      <line x1="18" y1="8" x2="18" y2="20" />
      <path d="M4 9h16" strokeLinecap="round" />
      <circle cx="6" cy="5" r="2" />
      <circle cx="12" cy="2" r="2" />
      <circle cx="18" cy="4" r="2" />
    </svg>
  ),
  Trading: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 6 23 6 23 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Learning: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v10H6.5z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 5h8M6 8h8" strokeLinecap="round" />
    </svg>
  ),
  Nutrition: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M12 5v14M5.64 5.64l9.9 9.9M18.36 5.64l-9.9 9.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Sleep: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="9" r="1" />
      <circle cx="18" cy="8" r="1" />
    </svg>
  ),
  Social: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  MIT: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export const StatusIcons = {
  Success: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Pending: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Failed: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="8" x2="16" y2="16" />
      <line x1="16" y1="8" x2="8" y2="16" />
    </svg>
  ),
  Warning: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
    </svg>
  ),
};

export const ActionIcons = {
  Add: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Edit: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Delete: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="17 21 17 13 7 13 7 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Close: () => (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

// Icon Wrapper Component for consistent styling
export const IconWrapper = ({ children, variant = 'default', size = 'medium', onClick = null, className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12',
  };

  const variantClasses = {
    default: 'stroke-red-600 hover:stroke-red-500',
    success: 'stroke-green-500 hover:stroke-green-400',
    warning: 'stroke-yellow-500 hover:stroke-yellow-400',
    info: 'stroke-blue-500 hover:stroke-blue-400',
    danger: 'stroke-red-600 hover:stroke-red-500',
  };

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} ${variantClasses[variant]} transition-all duration-200 cursor-pointer flex items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
};

// Quick utility to render metric icon with label
export const MetricIconDisplay = ({ icon: IconComponent, label, value, className = '' }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="icon-container mb-3">
      <IconComponent />
    </div>
    {label && <div className="text-slate-300 text-sm mb-1">{label}</div>}
    {value !== undefined && <div className="text-2xl font-bold text-orange-400">{value}</div>}
  </div>
);

// Batch export for convenience
export default {
  MetricIcons,
  NavIcons,
  CategoryIcons,
  StatusIcons,
  ActionIcons,
  IconWrapper,
  MetricIconDisplay,
};
