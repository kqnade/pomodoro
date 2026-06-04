import type { TimerPhase } from '../hooks/usePomodoroTimer';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  phase: TimerPhase;
  isRunning: boolean;
}

const PHASE_COLORS: Record<TimerPhase, string> = {
  focus: '#7A9E7E',
  shortBreak: '#D4A373',
  longBreak: '#8FA8B8',
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TimerDisplay({ timeLeft, totalTime, phase, isRunning }: TimerDisplayProps) {
  const radius = 120;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = totalTime > 0 ? timeLeft / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;
  const color = PHASE_COLORS[phase];

  return (
    <div className="timer-display">
      <svg
        height={radius * 2}
        width={radius * 2}
        className={`timer-ring ${isRunning ? 'running' : ''}`}
      >
        <circle
          stroke="#E8E2D9"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s linear' }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
      </svg>
      <div className="timer-text">
        <span className="timer-time">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
}
