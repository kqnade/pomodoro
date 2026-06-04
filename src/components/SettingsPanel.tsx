import { useState } from 'react';

interface SettingsPanelProps {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
  onUpdateConfig: (config: Partial<{
    focusDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsBeforeLongBreak: number;
  }>) => void;
}

export default function SettingsPanel({
  focusDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsBeforeLongBreak,
  onUpdateConfig,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="settings-panel">
      <button
        type="button"
        className="settings-toggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84a.484.484 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.488.488 0 0 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.27.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
        Settings
      </button>
      {isOpen && (
        <div className="settings-content">
          <div className="setting-row">
            <label htmlFor="focus-duration">Focus duration (min)</label>
            <input
              id="focus-duration"
              type="range"
              min={5}
              max={60}
              step={1}
              value={focusDuration}
              onChange={(e) => onUpdateConfig({ focusDuration: Number(e.target.value) })}
            />
            <span className="setting-value">{focusDuration}</span>
          </div>
          <div className="setting-row">
            <label htmlFor="short-break">Short break (min)</label>
            <input
              id="short-break"
              type="range"
              min={1}
              max={15}
              step={1}
              value={shortBreakDuration}
              onChange={(e) => onUpdateConfig({ shortBreakDuration: Number(e.target.value) })}
            />
            <span className="setting-value">{shortBreakDuration}</span>
          </div>
          <div className="setting-row">
            <label htmlFor="long-break">Long break (min)</label>
            <input
              id="long-break"
              type="range"
              min={5}
              max={30}
              step={1}
              value={longBreakDuration}
              onChange={(e) => onUpdateConfig({ longBreakDuration: Number(e.target.value) })}
            />
            <span className="setting-value">{longBreakDuration}</span>
          </div>
          <div className="setting-row">
            <label htmlFor="sessions">Sessions before long break</label>
            <input
              id="sessions"
              type="range"
              min={2}
              max={8}
              step={1}
              value={sessionsBeforeLongBreak}
              onChange={(e) => onUpdateConfig({ sessionsBeforeLongBreak: Number(e.target.value) })}
            />
            <span className="setting-value">{sessionsBeforeLongBreak}</span>
          </div>
        </div>
      )}
    </div>
  );
}
