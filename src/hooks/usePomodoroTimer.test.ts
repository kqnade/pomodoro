import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { usePomodoroTimer } from './usePomodoroTimer'

const LOCAL_STORAGE_KEY = 'pomodoro_stats'

function mockLocalStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
  }
}

function createStorageData(overrides?: Record<string, unknown>) {
  return JSON.stringify({
    totalFocusMinutes: 100,
    todayFocusMinutes: 30,
    weekFocusMinutes: 80,
    lastDate: new Date().toISOString().split('T')[0],
    lastWeek: getWeekKey(new Date()),
    ...overrides,
  })
}

function getWeekKey(d: Date): string {
  const year = d.getFullYear()
  const week = Math.floor((d.getTime() - new Date(year, 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
  return `${year}-W${week}`
}

describe('usePomodoroTimer', () => {
  let storage: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    vi.useFakeTimers()
    storage = mockLocalStorage()
    Object.defineProperty(window, 'localStorage', { value: storage, writable: true })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('has correct initial state', () => {
    const { result } = renderHook(() => usePomodoroTimer())
    expect(result.current.phase).toBe('focus')
    expect(result.current.timeLeft).toBe(25 * 60)
    expect(result.current.totalTime).toBe(25 * 60)
    expect(result.current.isRunning).toBe(false)
    expect(result.current.sessionCount).toBe(0)
    expect(result.current.cycles).toBe(0)
  })

  it('starts and pauses timer', () => {
    const { result } = renderHook(() => usePomodoroTimer())
    act(() => result.current.start())
    expect(result.current.isRunning).toBe(true)
    act(() => result.current.pause())
    expect(result.current.isRunning).toBe(false)
  })

  it('counts down every second', () => {
    const { result } = renderHook(() => usePomodoroTimer())
    act(() => result.current.start())
    expect(result.current.timeLeft).toBe(25 * 60)
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.timeLeft).toBe(25 * 60 - 1)
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.timeLeft).toBe(25 * 60 - 6)
  })

  it('transitions from focus to short break', () => {
    const { result } = renderHook(() => usePomodoroTimer({ focusDuration: 1, shortBreakDuration: 1 }))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(60 * 1000))
    expect(result.current.phase).toBe('shortBreak')
    expect(result.current.timeLeft).toBe(60)
    expect(result.current.sessionCount).toBe(1)
  })

  it('transitions from short break back to focus', () => {
    const { result } = renderHook(() => usePomodoroTimer({ focusDuration: 1, shortBreakDuration: 1 }))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(60 * 1000)) // focus ends
    act(() => vi.advanceTimersByTime(60 * 1000)) // short break ends
    expect(result.current.phase).toBe('focus')
    expect(result.current.sessionCount).toBe(1)
  })

  it('transitions to long break after N sessions', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ focusDuration: 1, shortBreakDuration: 1, longBreakDuration: 2, sessionsBeforeLongBreak: 2 })
    )
    act(() => result.current.start())
    // Session 1: focus 1min + short break 1min
    act(() => vi.advanceTimersByTime(60 * 1000))
    expect(result.current.phase).toBe('shortBreak')
    act(() => vi.advanceTimersByTime(60 * 1000))
    // Session 2: focus 1min -> should go to long break
    act(() => vi.advanceTimersByTime(60 * 1000))
    expect(result.current.phase).toBe('longBreak')
    expect(result.current.timeLeft).toBe(2 * 60)
  })

  it('tracks focus minutes when focus ends', () => {
    const { result } = renderHook(() => usePomodoroTimer({ focusDuration: 5 }))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5 * 60 * 1000))
    expect(result.current.todayFocusMinutes).toBe(5)
    expect(result.current.totalFocusMinutes).toBe(5)
  })

  it('resets to current phase duration', () => {
    const { result } = renderHook(() => usePomodoroTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.pause())
    act(() => result.current.reset())
    expect(result.current.isRunning).toBe(false)
    expect(result.current.timeLeft).toBe(25 * 60)
  })

  it('skips to next phase', () => {
    const { result } = renderHook(() => usePomodoroTimer())
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(5000))
    act(() => result.current.skip())
    expect(result.current.phase).toBe('shortBreak')
    expect(result.current.isRunning).toBe(false)
  })

  it('updates config and adjusts timer', () => {
    const { result } = renderHook(() => usePomodoroTimer())
    act(() => result.current.updateConfig({ focusDuration: 45 }))
    expect(result.current.timeLeft).toBe(45 * 60)
    expect(result.current.totalTime).toBe(45 * 60)
  })

  it('loads stats from localStorage', () => {
    storage.getItem.mockReturnValue(createStorageData())
    const { result } = renderHook(() => usePomodoroTimer())
    expect(result.current.totalFocusMinutes).toBe(100)
    expect(result.current.todayFocusMinutes).toBe(30)
    expect(result.current.weekFocusMinutes).toBe(80)
  })

  it('saves stats to localStorage when focus ends', () => {
    const { result } = renderHook(() => usePomodoroTimer({ focusDuration: 1 }))
    act(() => result.current.start())
    act(() => vi.advanceTimersByTime(60 * 1000))
    expect(storage.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEY,
      expect.stringContaining('"todayFocusMinutes":1')
    )
  })

  it('resets today stats on new day', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    storage.getItem.mockReturnValue(createStorageData({
      todayFocusMinutes: 30,
      lastDate: yesterday.toISOString().split('T')[0],
    }))
    const { result } = renderHook(() => usePomodoroTimer())
    expect(result.current.todayFocusMinutes).toBe(0)
    expect(result.current.totalFocusMinutes).toBe(100)
  })

  it('resets week stats on new week', () => {
    const lastWeekDate = new Date()
    lastWeekDate.setDate(lastWeekDate.getDate() - 8)
    storage.getItem.mockReturnValue(createStorageData({
      weekFocusMinutes: 80,
      lastWeek: getWeekKey(lastWeekDate),
    }))
    const { result } = renderHook(() => usePomodoroTimer())
    expect(result.current.weekFocusMinutes).toBe(0)
    expect(result.current.totalFocusMinutes).toBe(100)
  })

  it('cycles count increments after each focus+break pair', () => {
    const { result } = renderHook(() =>
      usePomodoroTimer({ focusDuration: 1, shortBreakDuration: 1, sessionsBeforeLongBreak: 4 })
    )
    act(() => result.current.start())
    // Complete 1 full cycle (focus + short break)
    act(() => vi.advanceTimersByTime(60 * 1000)) // focus ends
    act(() => vi.advanceTimersByTime(60 * 1000)) // break ends
    expect(result.current.cycles).toBe(1)
  })
})
