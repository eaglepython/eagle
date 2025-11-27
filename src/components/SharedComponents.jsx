export function CircularProgress({ percentage, size = 60 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="4"
      />
      <circle
        className="progress-ring"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="14"
        fontWeight="bold"
        fill="white"
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
}

export function MetricCard({ label, value, target, color, icon }) {
  const percentage = (parseFloat(value) / parseFloat(target)) * 100;
  const isGood = percentage >= 80;

  return (
    <div className={`metric-card glass rounded-2xl p-6 bg-gradient-to-br ${color}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-4xl">{icon}</span>
        <CircularProgress percentage={Math.min(percentage, 100)} size={60} />
      </div>
      <h3 className="text-white text-sm font-medium mb-1">{label}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        <span className="text-sm text-white opacity-70">/ {target}</span>
      </div>
      <div className={`mt-2 text-xs font-semibold ${isGood ? 'text-green-200' : 'text-yellow-200'}`}>
        {isGood ? '✅ On Track' : '⚠️ Needs Focus'}
      </div>
    </div>
  );
}

export function QuickActionButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-xl p-4 transition-all text-center"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-white text-sm font-medium">{label}</div>
    </button>
  );
}
