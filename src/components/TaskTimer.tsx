import { useState, useEffect, useRef, useCallback } from 'react'
import { FiPlay, FiPause, FiRotateCcw, FiCheck } from 'react-icons/fi'

interface Props {
  durationMinutes: number
  taskName: string
  accentColor: string
  onComplete: () => void
}

export default function TaskTimer({ durationMinutes, taskName, accentColor, onComplete }: Props) {
  const totalSeconds = Math.max(5, Math.min(durationMinutes * 60, 900))
  const [remaining, setRemaining] = useState(totalSeconds)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const progress = ((totalSeconds - remaining) / totalSeconds) * 100
  const pct = remaining / totalSeconds
  const barColor = pct > 0.5 ? accentColor : pct > 0.2 ? '#f59e0b' : '#ef4444'

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    stop()
    setRemaining(totalSeconds)
    setFinished(false)
  }, [stop, totalSeconds])

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            stop()
            setFinished(true)
            onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, remaining, stop, onComplete])

  useEffect(() => { reset() }, [totalSeconds, reset])

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium truncate flex-1 mr-3" style={{ color: 'var(--text-primary)' }}>
          {taskName}
        </span>
        <span
          className="text-2xl font-mono font-bold tabular-nums"
          style={{ color: finished ? '#10b981' : barColor, minWidth: 80, textAlign: 'right' }}
        >
          {formatTime(remaining)}
        </span>
      </div>

      <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-linear"
          style={{
            width: `${progress}%`,
            background: finished ? '#10b981' : barColor,
            boxShadow: running ? `0 0 10px ${barColor}50` : 'none',
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        {!finished ? (
          <>
            <button
              onClick={() => setRunning(!running)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
              style={{ background: running ? '#f59e0b' : accentColor }}
            >
              {running ? <><FiPause size={14} /> Pausar</> : <><FiPlay size={14} /> Iniciar</>}
            </button>
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
            >
              <FiRotateCcw size={14} /> Reset
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
            <FiCheck size={15} /> Completado
          </div>
        )}

        <span className="ml-auto text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {formatTime(totalSeconds)} total
        </span>
      </div>
    </div>
  )
}
