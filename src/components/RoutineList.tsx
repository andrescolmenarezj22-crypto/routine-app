import { Routine } from '../types'
import { FiPlus, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiBell } from 'react-icons/fi'

interface Props {
  routines: Routine[]
  onEdit: (routine: Routine) => void
  onDelete: (id: string) => void
  onNew: () => void
  onToggleTask: (routineId: string, taskId: string) => void
}

export default function RoutineList({ routines, onEdit, onDelete, onNew, onToggleTask }: Props) {
  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Mis Rutinas</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{routines.length} rutinas creadas</p>
        </div>
        <button
          onClick={onNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <FiPlus size={16} /> Nueva Rutina
        </button>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-20 rounded-xl glass" style={{ border: '1px solid var(--border-color)' }}>
          <FiClock size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>No hay rutinas</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Crea tu primera rutina para organizar tu día</p>
          <button
            onClick={onNew}
            className="mt-4 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: 'var(--accent)' }}
          >
            <FiPlus className="inline mr-1" /> Crear Rutina
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {routines.map((routine, i) => {
            const done = routine.tasks.filter((t) => t.completed).length
            const total = routine.tasks.length
            const pct = total > 0 ? Math.round((done / total) * 100) : 0

            return (
              <div
                key={routine.id}
                className="rounded-xl glass overflow-hidden animate-slideIn"
                style={{ border: '1px solid var(--border-color)', animationDelay: `${i * 50}ms` }}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                        style={{ background: routine.color }}
                      >
                        {routine.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{routine.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{routine.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(routine)}
                        className="p-2 rounded-lg transition-colors hover:bg-white/10"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => { if (confirm('¿Eliminar esta rutina?')) onDelete(routine.id) }}
                        className="p-2 rounded-lg transition-colors hover:bg-red-500/20 text-red-400"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {total} tareas</span>
                    <span className="flex items-center gap-1"><FiClock size={12} /> {routine.alarms.filter(a => a.enabled).length} alarmas</span>
                    <span className="flex items-center gap-1"><FiBell size={12} /> {routine.reminders.filter(r => r.enabled).length} recordatorios</span>
                  </div>

                  {total > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        <span>Progreso</span>
                        <span style={{ color: routine.color }}>{done}/{total} ({pct}%)</span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: routine.color }} />
                      </div>
                    </div>
                  )}

                  {routine.tasks.length > 0 && (
                    <div className="space-y-1.5">
                      {routine.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(routine.id, task.id)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                        >
                          <div
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0"
                            style={{
                              borderColor: task.completed ? routine.color : 'var(--border-color)',
                              background: task.completed ? routine.color : 'transparent',
                            }}
                          >
                            {task.completed && <FiCheckCircle size={12} className="text-white" />}
                          </div>
                          <span
                            className="text-sm flex-1 transition-all"
                            style={{
                              color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                              textDecoration: task.completed ? 'line-through' : 'none',
                            }}
                          >
                            {task.name}
                          </span>
                          {task.duration > 0 && (
                            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                              {task.duration} min
                            </span>
                          )}
                        </div>
                      ))}
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
