import { useState, useCallback, useEffect, useRef } from 'react'

export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak'

export interface TimerConfig {
  focusDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
}

export interface TimerState {
  phase: TimerPhase
  timeLeft: number
  totalTime: number
  isRunning: boolean
  sessionCount: number
  totalFocusMinutes: number
  todayFocusMinutes: number
  weekFocusMinutes: number
  cycles: number
}

export interface UsePomodoroTimerReturn extends TimerState {
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  updateConfig: (config: Partial<TimerConfig>) => void
}

const DEFAULT_CONFIG: TimerConfig = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
}

const STORAGE_KEY = 'pomodoro_stats'

interface PersistedStats {
  totalFocusMinutes: number
  todayFocusMinutes: number
  weekFocusMinutes: number
  lastDate: string
  lastWeek: string
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
}

function getWeekKey(): string {
  const d = new Date()
  const year = d.getFullYear()
  const start = new Date(year, 0, 1)
  const days = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
  const week = Math.floor(days / 7)
  return `${year}-W${week}`
}

function loadStats(): PersistedStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedStats
      const today = getTodayKey()
      const week = getWeekKey()
      return {
        totalFocusMinutes: parsed.totalFocusMinutes || 0,
        todayFocusMinutes: parsed.lastDate === today ? parsed.todayFocusMinutes || 0 : 0,
        weekFocusMinutes: parsed.lastWeek === week ? parsed.weekFocusMinutes || 0 : 0,
        lastDate: today,
        lastWeek: week,
      }
    }
  } catch {
    // ignore parse errors
  }
  return {
    totalFocusMinutes: 0,
    todayFocusMinutes: 0,
    weekFocusMinutes: 0,
    lastDate: getTodayKey(),
    lastWeek: getWeekKey(),
  }
}

function saveStats(stats: PersistedStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // ignore storage errors
  }
}

function getDuration(phase: TimerPhase, config: TimerConfig): number {
  switch (phase) {
    case 'focus': return config.focusDuration * 60
    case 'shortBreak': return config.shortBreakDuration * 60
    case 'longBreak': return config.longBreakDuration * 60
  }
}

export function usePomodoroTimer(initialConfig: Partial<TimerConfig> = {}): UsePomodoroTimerReturn {
  const [initialConfigValue] = useState<TimerConfig>(() => ({ ...DEFAULT_CONFIG, ...initialConfig }))
  const configRef = useRef<TimerConfig>(initialConfigValue)
  const [initialStats] = useState<PersistedStats>(() => loadStats())
  const statsRef = useRef<PersistedStats>(initialStats)
  const phaseRef = useRef<TimerPhase>('focus')
  const initialDuration = getDuration('focus', initialConfigValue)
  const timeLeftRef = useRef<number>(initialDuration)
  const totalTimeRef = useRef<number>(initialDuration)
  const isRunningRef = useRef<boolean>(false)
  const sessionCountRef = useRef<number>(0)
  const cyclesRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [phase, setPhase] = useState<TimerPhase>('focus')
  const [timeLeft, setTimeLeft] = useState<number>(initialDuration)
  const [totalTime, setTotalTime] = useState<number>(initialDuration)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [sessionCount, setSessionCount] = useState<number>(0)
  const [cycles, setCycles] = useState<number>(0)
  const [totalFocusMinutes, setTotalFocusMinutes] = useState<number>(initialStats.totalFocusMinutes)
  const [todayFocusMinutes, setTodayFocusMinutes] = useState<number>(initialStats.todayFocusMinutes)
  const [weekFocusMinutes, setWeekFocusMinutes] = useState<number>(initialStats.weekFocusMinutes)

  const syncState = useCallback(() => {
    setPhase(phaseRef.current)
    setTimeLeft(timeLeftRef.current)
    setTotalTime(totalTimeRef.current)
    setIsRunning(isRunningRef.current)
    setSessionCount(sessionCountRef.current)
    setCycles(cyclesRef.current)
    setTotalFocusMinutes(statsRef.current.totalFocusMinutes)
    setTodayFocusMinutes(statsRef.current.todayFocusMinutes)
    setWeekFocusMinutes(statsRef.current.weekFocusMinutes)
  }, [])

  const transitionPhase = useCallback(() => {
    const currentPhase = phaseRef.current
    if (currentPhase === 'focus') {
      const nextSessionCount = sessionCountRef.current + 1
      sessionCountRef.current = nextSessionCount
      const sbl = configRef.current.sessionsBeforeLongBreak
      if (nextSessionCount % sbl === 0) {
        phaseRef.current = 'longBreak'
      } else {
        phaseRef.current = 'shortBreak'
      }
    } else {
      phaseRef.current = 'focus'
      cyclesRef.current += 1
    }
    const duration = getDuration(phaseRef.current, configRef.current)
    timeLeftRef.current = duration
    totalTimeRef.current = duration
    syncState()
  }, [syncState])

  const tick = useCallback(() => {
    timeLeftRef.current -= 1
    if (timeLeftRef.current <= 0) {
      if (phaseRef.current === 'focus') {
        const minutes = Math.floor(totalTimeRef.current / 60)
        statsRef.current.totalFocusMinutes += minutes
        statsRef.current.todayFocusMinutes += minutes
        statsRef.current.weekFocusMinutes += minutes
        saveStats(statsRef.current)
      }
      transitionPhase()
    } else {
      setTimeLeft(timeLeftRef.current)
    }
  }, [transitionPhase])

  useEffect(() => {
    if (isRunningRef.current) {
      intervalRef.current = setInterval(tick, 1000)
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, tick])

  const start = useCallback(() => {
    if (!isRunningRef.current) {
      isRunningRef.current = true
      setIsRunning(true)
    }
  }, [])

  const pause = useCallback(() => {
    if (isRunningRef.current) {
      isRunningRef.current = false
      setIsRunning(false)
    }
  }, [])

  const reset = useCallback(() => {
    isRunningRef.current = false
    setIsRunning(false)
    const duration = getDuration(phaseRef.current, configRef.current)
    timeLeftRef.current = duration
    totalTimeRef.current = duration
    setTimeLeft(duration)
    setTotalTime(duration)
  }, [])

  const skip = useCallback(() => {
    isRunningRef.current = false
    setIsRunning(false)
    if (phaseRef.current === 'focus') {
      const nextSessionCount = sessionCountRef.current + 1
      sessionCountRef.current = nextSessionCount
      const sbl = configRef.current.sessionsBeforeLongBreak
      if (nextSessionCount % sbl === 0) {
        phaseRef.current = 'longBreak'
      } else {
        phaseRef.current = 'shortBreak'
      }
    } else {
      phaseRef.current = 'focus'
      cyclesRef.current += 1
    }
    const duration = getDuration(phaseRef.current, configRef.current)
    timeLeftRef.current = duration
    totalTimeRef.current = duration
    syncState()
  }, [syncState])

  const updateConfig = useCallback((newConfig: Partial<TimerConfig>) => {
    configRef.current = { ...configRef.current, ...newConfig }
    const duration = getDuration(phaseRef.current, configRef.current)
    timeLeftRef.current = duration
    totalTimeRef.current = duration
    setTimeLeft(duration)
    setTotalTime(duration)
  }, [])

  return {
    phase,
    timeLeft,
    totalTime,
    isRunning,
    sessionCount,
    totalFocusMinutes,
    todayFocusMinutes,
    weekFocusMinutes,
    cycles,
    start,
    pause,
    reset,
    skip,
    updateConfig,
  }
}
