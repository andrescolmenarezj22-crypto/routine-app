import { useState } from 'react'
import { Routine } from '../types'
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiBell, FiPlay } from 'react-icons/fi'
import TaskTimer from './TaskTimer'

interface Props {
  routines: Routine[]
  onEdit: (routine: Routine) => void
  onDelete: (id: string) => void
  onNew: () => void
  onToggleTask: (routineId: string, taskId: string) => void
}

export default function RoutineList({ routines, onEdit, onDelete, onNew, onToggleTask }: Props) {
  const [activeTimers, setActiveTimers] = useState<Record<string, boolean>>({})

  const toggleTimer = (taskId: string) => {
    setActiveTimers((prev) => ({ ...prev, [taskId]: !prev[taskId] }))
  }

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Mis Rutinas</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>{routines.length} rutinas creadas</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <FiPlus size={16} /> Nueva Rutina
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-24 rounded-2xl glass" style={{ border: '1px solid var(--border-color)' }}>
          <FiClock size={52} className="mx-auto mb-5" style={{ color: 'var(--text-muted)' }} />
          <p className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>No hay rutinas</p>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Crea tu primera rutina para organizar tu dia</p>
          <button
            onClick={onNew}
            className="mt-6 px-7 py-3 rounded-xl text-white text-sm font-medium"
            style={{ background: 'var(--accent)' }}
          >
            <FiPlus className="inline mr-1" /> Crear Rutina
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {routines.map((routine, i) => {
            const done = routine.tasks.filter((t) => t.completed).length
            const total = routine.tasks.length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            return (
              <div
                key={routine.id}
                className="rounded-2xl glass overflow-hidden animate-slideIn"
                style={{ border: '1px solid var(--border-color)', animationDelay: `${i * 60}ms` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                        style={{ background: routine.color }}
                      >
                        {routine.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{routine.name}</h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{routine.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(routine)}
                        className="p-2.5 rounded-xl transition-colors"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => { if (confirm('Eliminar esta rutina?')) onDelete(routine.id) }}
                        className="p-2.5 rounded-xl transition-colors hover:bg-red-500/20 text-red-400"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 mb-5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1.5"><FiClock size={13} /> {total} tareas</span>
                    <span className="flex items-center gap-1.5"><FiClock size={13} /> {routine.alarms.filter(a => a.enabled).length} alarmas</span>
                    <span className="flex items-center gap-1.5"><FiBell size={13} /> {routine.reminders.filter(r => r.enabled).length} recordatorios</span>
                  </div>

                  {total > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                        <span>Progreso</span>
                        <span style={{ color: routine.color }}>{done}/{total} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: routine.color }} />
                      </div>
                    </div>
                  )}

                  {routine.tasks.length > 0 && (
                    <div className="space-y-4">
                      {routine.tasks.map((task) => {
                        const timerActive = activeTimers[task.id]
                        return (
                          <div
                            key={task.id}
                            className="rounded-xl p-4 transition-all"
                            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                onClick={() => onToggleTask(routine.id, task.id)}
                                className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                                style={{
                                  borderColor: task.completed ? routine.color : 'var(--border-color)',
                                  background: task.completed ? routine.color : 'transparent',
                                }}
                              >
                                {task.completed && <FiCheckCircle size={13} className="text-white" />}
                              </div>
                              <span
                                className="text-sm flex-1 transition-all font-medium"
                                style={{
                                  color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                                  textDecoration: task.completed ? 'line-through' : 'none',
                                }}
                              >
                                {task.name}
                              </span>
                              {task.duration > 0 && (
                                <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{ background: routine.color + '20', color: routine.color }}>
                                  {task.duration} min
                                </span>
                              )}
                              {task.duration > 0 && (
                                <button
                                  onClick={() => toggleTimer(task.id)}
                                  className="p-2 rounded-lg transition-all"
                                  style={{
                                    background: timerActive ? routine.color + '20' : 'var(--bg-secondary)',
                                    color: timerActive ? routine.color : 'var(--text-muted)',
                                    border: `1px solid ${timerActive ? routine.color + '40' : 'var(--border-color)'}`,
                                  }}
                                >
                                  <FiPlay size={16} />
                                </button>
                              )}
                            </div>

                            {timerActive && task.duration > 0 && (
                              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
                                <TaskTimer
                                  durationMinutes={task.duration}
                                  taskName={task.name}
                                  accentColor={routine.color}
                                  onComplete={() => onToggleTask(routine.id, task.id)}
                                />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
