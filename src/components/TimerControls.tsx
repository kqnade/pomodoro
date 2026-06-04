interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function TimerControls({ isRunning, onStart, onPause, onReset, onSkip }: TimerControlsProps) {
  return (
    <div className="timer-controls">
      {isRunning ? (
        <button
          type="button"
          className="control-btn primary"
          onClick={onPause}
          aria-label="Pause timer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
          Pause
        </button>
      ) : (
        <button
          type="button"
          className="control-btn primary"
          onClick={onStart}
          aria-label="Start timer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Start
        </button>
      )}
      <button
        type="button"
        className="control-btn secondary"
        onClick={onReset}
        aria-label="Reset timer"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
        </svg>
        Reset
      </button>
      <button
        type="button"
        className="control-btn secondary"
        onClick={onSkip}
        aria-label="Skip phase"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
        Skip
      </button>
    </div>
  );
}
