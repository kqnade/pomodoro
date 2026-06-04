import { useState } from 'react';
import { usePomodoroTimer } from './hooks/usePomodoroTimer';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import SessionIndicator from './components/SessionIndicator';
import PhaseBadge from './components/PhaseBadge';
import StatsPanel from './components/StatsPanel';
import SettingsPanel from './components/SettingsPanel';
import './App.css';

const DEFAULT_CONFIG = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

function App() {
  const timer = usePomodoroTimer();
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const handleUpdateConfig = (newConfig: Partial<typeof DEFAULT_CONFIG>) => {
    const updated = { ...config, ...newConfig };
    setConfig(updated);
    timer.updateConfig(newConfig);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">
          <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Cozy Timer
        </h1>
      </header>

      <main className="app-main">
        <PhaseBadge phase={timer.phase} />

        <TimerDisplay
          timeLeft={timer.timeLeft}
          totalTime={timer.totalTime}
          phase={timer.phase}
          isRunning={timer.isRunning}
        />

        <SessionIndicator
          sessionCount={timer.sessionCount}
          sessionsBeforeLongBreak={config.sessionsBeforeLongBreak}
        />

        <TimerControls
          isRunning={timer.isRunning}
          onStart={timer.start}
          onPause={timer.pause}
          onReset={timer.reset}
          onSkip={timer.skip}
        />

        <StatsPanel
          todayFocusMinutes={timer.todayFocusMinutes}
          weekFocusMinutes={timer.weekFocusMinutes}
          totalFocusMinutes={timer.totalFocusMinutes}
          cycles={timer.cycles}
        />

        <SettingsPanel
          focusDuration={config.focusDuration}
          shortBreakDuration={config.shortBreakDuration}
          longBreakDuration={config.longBreakDuration}
          sessionsBeforeLongBreak={config.sessionsBeforeLongBreak}
          onUpdateConfig={handleUpdateConfig}
        />
      </main>
    </div>
  );
}

export default App;
