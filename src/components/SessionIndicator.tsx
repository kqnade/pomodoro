interface SessionIndicatorProps {
  sessionCount: number;
  sessionsBeforeLongBreak: number;
}

export default function SessionIndicator({ sessionCount, sessionsBeforeLongBreak }: SessionIndicatorProps) {
  const currentCycleIndex = sessionCount % sessionsBeforeLongBreak;

  return (
    <div className="session-indicator" aria-label="Session progress">
      {Array.from({ length: sessionsBeforeLongBreak }).map((_, i) => (
        <span
          key={i}
          className={`session-dot ${i < currentCycleIndex ? 'completed' : ''} ${i === currentCycleIndex ? 'active' : ''}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
