import { Routine } from '../types'
import { FiBell, FiPlus, FiTrash2, FiCheck, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { createReminder } from '../store'

interface Props {
  routines: Routine[]
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>
}

export default function ReminderPanel({ routines, setRoutines }: Props) {
  const toggleReminder = (routineId: string, reminderId: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, reminders: r.reminders.map((rem) => (rem.id === reminderId ? { ...rem, enabled: !rem.enabled } : rem)) }
          : r
      )
    )
  }

  const updateReminder = (routineId: string, reminderId: string, partial: { message?: string; time?: string; date?: string }) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, reminders: r.reminders.map((rem) => (rem.id === reminderId ? { ...rem, ...partial } : rem)) }
          : r
      )
    )
  }

  const addReminderToRoutine = (routineId: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, reminders: [...r.reminders, createReminder({})] } : r))
    )
  }

  const removeReminder = (routineId: string, reminderId: string) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === routineId ? { ...r, reminders: r.reminders.filter((rem) => rem.id !== reminderId) } : r))
    )
  }

  const inputStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Recordatorios</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Recuerda tus tareas importantes</p>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-20 rounded-xl glass" style={{ border: '1px solid var(--border-color)' }}>
          <FiBell size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Crea una rutina primero para agregar recordatorios</p>
        </div>
      ) : (
        <div className="space-y-6">
          {routines.map((routine) => (
            <div key={routine.id} className="rounded-xl glass overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: routine.color }} />
                  <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{routine.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                    {routine.reminders.length} recordatorios
                  </span>
                </div>
                <button
                  onClick={() => addReminderToRoutine(routine.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: routine.color }}
                >
                  <FiPlus size={12} /> Recordatorio
                </button>
              </div>

              {routine.reminders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sin recordatorios configurados</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {routine.reminders.map((rem) => (
                    <div
                      key={rem.id}
                      className="flex items-center gap-3 p-4 rounded-lg transition-all"
                      style={{
                        background: 'var(--bg-tertiary)',
                        opacity: rem.triggered ? 0.5 : 1,
                      }}
                    >
                      {rem.triggered && (
                        <FiCheck size={16} className="shrink-0" style={{ color: routine.color }} />
                      )}
                      <input
                        value={rem.message}
                        onChange={(e) => updateReminder(routine.id, rem.id, { message: e.target.value })}
                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                        style={inputStyle}
                        placeholder="Mensaje"
                      />
                      <input
                        type="date"
                        value={rem.date}
                        onChange={(e) => updateReminder(routine.id, rem.id, { date: e.target.value })}
                        className="px-3 py-2 rounded-lg text-sm outline-none"
                        style={inputStyle}
                      />
                      <input
                        type="time"
                        value={rem.time}
                        onChange={(e) => updateReminder(routine.id, rem.id, { time: e.target.value })}
                        className="px-3 py-2 rounded-lg text-sm outline-none"
                        style={inputStyle}
                      />
                      <button
                        onClick={() => toggleReminder(routine.id, rem.id)}
                        className="text-2xl transition-colors"
                        style={{ color: rem.enabled ? routine.color : 'var(--text-muted)' }}
                      >
                        {rem.enabled ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                      <button
                        onClick={() => removeReminder(routine.id, rem.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
