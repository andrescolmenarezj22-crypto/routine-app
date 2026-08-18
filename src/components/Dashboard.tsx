import { Routine, View } from '../types'
import { FiTrendingUp, FiClock, FiCheckCircle, FiPlus, FiArrowRight } from 'react-icons/fi'

interface Props {
  routines: Routine[]
  onNavigate: (view: View) => void
  onEditRoutine: (routine: Routine) => void
  onToggleTask: (routineId: string, taskId: string) => void
}

export default function Dashboard({ routines, onNavigate, onEditRoutine, onToggleTask }: Props) {
  const totalTasks = routines.reduce((acc, r) => acc + r.tasks.length, 0)
  const completedTasks = routines.reduce((acc, r) => acc + r.tasks.filter((t) => t.completed).length, 0)
  const totalAlarms = routines.reduce((acc, r) => acc + r.alarms.filter((a) => a.enabled).length, 0)
  const totalReminders = routines.reduce((acc, r) => acc + r.reminders.filter((r) => r.enabled).length, 0)
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const stats = [
    { label: 'Rutinas', value: routines.length, icon: FiTrendingUp, color: '#7c3aed' },
    { label: 'Tareas Completadas', value: `${completedTasks}/${totalTasks}`, icon: FiCheckCircle, color: '#10b981' },
    { label: 'Alarmas Activas', value: totalAlarms, icon: FiClock, color: '#f59e0b' },
    { label: 'Recordatorios', value: totalReminders, icon: FiTrendingUp, color: '#3b82f6' },
  ]

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>Resumen de tu día</p>
        </div>
        <button
          onClick={() => onNavigate('routines')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <FiPlus size={16} /> Nueva Rutina
        </button>
      </div>

      <div className="grid grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl glass"
            style={{ border: '1px solid var(--border-color)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}20` }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalTasks > 0 && (
        <div className="p-5 rounded-xl glass" style={{ border: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Progreso General</span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{progress}%</span>
          </div>
          <div className="w-full h-3 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'var(--accent)' }}
            />
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>Tus Rutinas</h2>
          <button
            onClick={() => onNavigate('routines')}
            className="flex items-center gap-1 text-sm font-medium transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            Ver todo <FiArrowRight size={14} />
          </button>
        </div>

        {routines.length === 0 ? (
          <div className="text-center py-16 rounded-xl glass" style={{ border: '1px solid var(--border-color)' }}>
            <FiClock size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
            <p className="text-lg" style={{ color: 'var(--text-muted)' }}>No hay rutinas aún</p>
            <button
              onClick={() => onNavigate('routines')}
              className="mt-5 px-6 py-3 rounded-xl text-white text-sm font-medium"
              style={{ background: 'var(--accent)' }}
            >
              Crear primera rutina
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {routines.map((routine) => {
              const done = routine.tasks.filter((t) => t.completed).length
              const total = routine.tasks.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0

              return (
                <div
                  key={routine.id}
                  onClick={() => onEditRoutine(routine)}
                  className="p-5 rounded-xl glass cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ border: '1px solid var(--border-color)' }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${routine.color}30` }}>
                      <FiClock size={20} style={{ color: routine.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate" style={{ color: 'var(--text-primary)' }}>{routine.name}</h3>
                      <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-muted)' }}>{routine.description}</p>
                    </div>
                  </div>

                  {total > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span>{done}/{total} tareas</span>
                        <span style={{ color: routine.color }}>{pct}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: routine.color }} />
                      </div>
                    </div>
                  )}

                  {routine.tasks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {routine.tasks.slice(0, 3).map((task) => (
                        <div
                          key={task.id}
                          onClick={(e) => { e.stopPropagation(); onToggleTask(routine.id, task.id) }}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0"
                            style={{
                              borderColor: task.completed ? routine.color : 'var(--border-color)',
                              background: task.completed ? routine.color : 'transparent',
                            }}
                          >
                            {task.completed && <FiCheckCircle size={11} className="text-white" />}
                          </div>
                          <span
                            className="text-xs transition-all"
                            style={{
                              color: task.completed ? 'var(--text-muted)' : 'var(--text-secondary)',
                              textDecoration: task.completed ? 'line-through' : 'none',
                            }}
                          >
                            {task.name}
                          </span>
                        </div>
                      ))}
                      {routine.tasks.length > 3 && (
                        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                          +{routine.tasks.length - 3} más
                        </p>
                      )}
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
}
