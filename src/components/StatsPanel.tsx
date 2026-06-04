interface StatsPanelProps {
  todayFocusMinutes: number;
  weekFocusMinutes: number;
  totalFocusMinutes: number;
  cycles: number;
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function StatsPanel({ todayFocusMinutes, weekFocusMinutes, totalFocusMinutes, cycles }: StatsPanelProps) {
  const stats = [
    { label: 'Today', value: formatMinutes(todayFocusMinutes) },
    { label: 'This Week', value: formatMinutes(weekFocusMinutes) },
    { label: 'Total', value: formatMinutes(totalFocusMinutes) },
    { label: 'Cycles', value: String(cycles) },
  ];

  return (
    <div className="stats-panel">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
