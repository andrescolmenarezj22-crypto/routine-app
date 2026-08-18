import { useState, useEffect, useRef, useCallback } from 'react'
import { Routine, RoutineTask } from '../types'
import { FiX, FiPlay, FiPause, FiSkipForward, FiCheckCircle, FiRotateCcw, FiVolume2, FiVolumeX } from 'react-icons/fi'

interface Props {
  routine: Routine
  onExit: () => void
  onComplete: () => void
}

export default function RoutineRunner({ routine, onExit, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [finished, setFinished] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const pendingTasks = routine.tasks.filter((t) => !t.completed && t.duration > 0)
  const currentTask = pendingTasks[currentIndex]
  const totalTasks = pendingTasks.length
  const progress = totalTasks > 0 ? ((currentIndex) / totalTasks) * 100 : 0

  useEffect(() => {
    synthRef.current = window.speechSynthesis || null
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit() }
    window.addEventListener('keydown', handleKey)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      synthRef.current?.cancel()
      window.removeEventListener('keydown', handleKey)
    }
  }, [onExit])

  useEffect(() => {
    if (currentTask) {
      const secs = Math.max(5, Math.min(currentTask.duration * 60, 900))
      setRemaining(secs)
      setTotalTime(secs)
      setRunning(false)
      if (voiceEnabled && synthRef.current) {
        speak(currentTask.name)
      }
    }
  }, [currentIndex, currentTask, voiceEnabled])

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !voiceEnabled) return
    synthRef.current.cancel()
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'es-ES'
    utter.rate = 0.9
    utter.pitch = 1.1
    const voices = synthRef.current.getVoices()
    const femaleVoice = voices.find((v) => v.lang.startsWith('es') && v.name.toLowerCase().includes('female'))
      || voices.find((v) => v.lang.startsWith('es') && (v.name.includes('Paulina') || v.name.includes('Helena') || v.name.includes('Google') || v.name.includes('Mónica') || v.name.includes('Monica')))
      || voices.find((v) => v.lang.startsWith('es'))
    if (femaleVoice) utter.voice = femaleVoice
    synthRef.current.speak(utter)
  }, [voiceEnabled])

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            setRunning(false)
            if (voiceEnabled) speak('Tiempo completado. Siguiente tarea.')
            return 0
          }
          if (prev === 10 && voiceEnabled) speak('Quedan diez segundos')
          return prev - 1
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null } }
  }, [running, remaining, voiceEnabled, speak])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const pct = totalTime > 0 ? ((totalTime - remaining) / totalTime) * 100 : 0
  const barColor = pct > 80 ? '#10b981' : pct > 50 ? routine.color : pct > 20 ? '#f59e0b' : '#ef4444'

  const goNext = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    setRunning(false)
    if (currentIndex < totalTasks - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setFinished(true)
      if (voiceEnabled) speak('Felicidades. Has completado todas las tareas.')
    }
  }

  const restart = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
    setCurrentIndex(0)
    setFinished(false)
    setRunning(false)
  }

  const toggleVoice = () => {
    if (voiceEnabled) synthRef.current?.cancel()
    setVoiceEnabled(!voiceEnabled)
  }

  if (pendingTasks.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center space-y-6">
          <FiCheckCircle size={80} className="mx-auto" style={{ color: 'var(--color-success)' }} />
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>Sin tareas pendientes</h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No hay tareas con temporizador en esta rutina</p>
          <button onClick={onExit} className="px-8 py-3 rounded-xl text-lg font-semibold" style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}>
            Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: 'var(--bg-primary)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: routine.color }}>
            <span className="text-lg font-bold" style={{ color: 'var(--text-on-accent)' }}>{routine.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{routine.name}</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Tarea {Math.min(currentIndex + 1, totalTasks)} de {totalTasks}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleVoice} className="p-3 rounded-xl transition-all" style={{ background: 'var(--bg-tertiary)', color: voiceEnabled ? 'var(--accent)' : 'var(--text-muted)' }}>
            {voiceEnabled ? <FiVolume2 size={20} /> : <FiVolumeX size={20} />}
          </button>
          <button onClick={onExit} className="p-3 rounded-xl transition-all" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
            <FiX size={20} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5" style={{ background: 'var(--bg-tertiary)' }}>
        <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: routine.color }} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {!finished && currentTask ? (
          <div className="w-full max-w-2xl space-y-12">

            {/* Task name */}
            <div className="text-center space-y-3">
              <p className="text-sm font-medium uppercase tracking-widest" style={{ color: routine.color }}>
                Tarea {currentIndex + 1}
              </p>
              <h1 className="text-5xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
                {currentTask.name}
              </h1>
              {currentTask.note && (
                <p className="text-lg mt-4" style={{ color: 'var(--text-secondary)' }}>{currentTask.note}</p>
              )}
            </div>

            {/* Timer */}
            <div className="text-center space-y-6">
              <div className="text-8xl font-mono font-bold tabular-nums tracking-tight" style={{ color: barColor }}>
                {formatTime(remaining)}
              </div>

              {/* Bar */}
              <div className="relative w-full h-4 rounded-full overflow-hidden" style={{ background: 'var(--bg-tertiary)' }}>
                <div
                  className="h-full rounded-full transition-[width] duration-1000 ease-linear"
                  style={{
                    width: `${pct}%`,
                    background: barColor,
                    boxShadow: running ? `0 0 20px ${barColor}60` : 'none',
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => setRunning(!running)}
                  className="flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:opacity-90"
                  style={{ background: running ? '#f59e0b' : routine.color, color: 'var(--text-on-accent)' }}
                >
                  {running ? <><FiPause size={22} /> Pausar</> : <><FiPlay size={22} /> Iniciar</>}
                </button>

                <button
                  onClick={goNext}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                >
                  <FiSkipForward size={20} /> Siguiente
                </button>
              </div>
            </div>

            {/* Timeline dots */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {pendingTasks.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width: i === currentIndex ? 32 : 10,
                    height: 10,
                    background: i < currentIndex ? routine.color : i === currentIndex ? barColor : 'var(--bg-tertiary)',
                    opacity: i > currentIndex ? 0.4 : 1,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Completed */
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center" style={{ background: 'var(--color-success-bg)' }}>
              <FiCheckCircle size={64} style={{ color: 'var(--color-success)' }} />
            </div>
            <h1 className="text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>Rutina Completada</h1>
            <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
              Has completado las {totalTasks} tareas de <strong style={{ color: routine.color }}>{routine.name}</strong>
            </p>
            <div className="flex items-center justify-center gap-5 pt-4">
              <button
                onClick={restart}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold transition-all"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
              >
                <FiRotateCcw size={20} /> Repetir
              </button>
              <button
                onClick={() => { onComplete(); onExit() }}
                className="flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all hover:opacity-90"
                style={{ background: 'var(--color-success)', color: 'var(--text-on-accent)' }}
              >
                <FiCheckCircle size={20} /> Finalizar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom hint */}
      <div className="text-center pb-6">
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Presiona ESC para salir
        </p>
      </div>
    </div>
  )
}
