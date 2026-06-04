import type { ReactNode } from 'react';
import type { TimerPhase } from '../hooks/usePomodoroTimer';

interface PhaseBadgeProps {
  phase: TimerPhase;
}

const PHASE_CONFIG: Record<TimerPhase, { label: string; icon: ReactNode; color: string; bg: string }> = {
  focus: {
    label: 'Focus Time',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    color: '#5C7A5C',
    bg: '#E8F0E8',
  },
  shortBreak: {
    label: 'Short Break',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M2 21h19v-3H2v3zM20 8l-2-2-4 4V2H8v8l-4-4-2 2 10 10 10-10z" />
      </svg>
    ),
    color: '#A67C52',
    bg: '#F5EDE0',
  },
  longBreak: {
    label: 'Long Break',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
      </svg>
    ),
    color: '#5C7A8A',
    bg: '#E0EBF0',
  },
};

export default function PhaseBadge({ phase }: PhaseBadgeProps) {
  const config = PHASE_CONFIG[phase];
  return (
    <div
      className="phase-badge"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
