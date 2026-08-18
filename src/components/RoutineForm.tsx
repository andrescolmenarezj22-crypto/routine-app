import { useState } from 'react'
import { Routine, RoutineTask, RoutineAlarm, RoutineReminder } from '../types'
import { createRoutine, createTask, createAlarm, createReminder } from '../store'
import { FiX, FiPlus, FiTrash2, FiClock, FiBell, FiSave } from 'react-icons/fi'

const COLORS = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6']
const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

interface Props {
  routine: Routine | null
  onSave: (routine: Routine) => void
  onClose: () => void
}

export default function RoutineForm({ routine, onSave, onClose }: Props) {
  const [data, setData] = useState<Routine>(
    routine || createRoutine({})
  )
  const [tab, setTab] = useState<'tasks' | 'alarms' | 'reminders'>('tasks')

  const update = (partial: Partial<Routine>) => setData((p) => ({ ...p, ...partial }))

  const addTask = () => update({ tasks: [...data.tasks, createTask({})] })
  const updateTask = (id: string, partial: Partial<RoutineTask>) =>
    update({ tasks: data.tasks.map((t) => (t.id === id ? { ...t, ...partial } : t)) })
  const removeTask = (id: string) => update({ tasks: data.tasks.filter((t) => t.id !== id) })

  const addAlarm = () => update({ alarms: [...data.alarms, createAlarm({})] })
  const updateAlarm = (id: string, partial: Partial<RoutineAlarm>) =>
    update({ alarms: data.alarms.map((a) => (a.id === id ? { ...a, ...partial } : a)) })
  const removeAlarm = (id: string) => update({ alarms: data.alarms.filter((a) => a.id !== id) })

  const addReminder = () => update({ reminders: [...data.reminders, createReminder({})] })
  const updateReminder = (id: string, partial: Partial<RoutineReminder>) =>
    update({ reminders: data.reminders.map((r) => (r.id === id ? { ...r, ...partial } : r)) })
  const removeReminder = (id: string) => update({ reminders: data.reminders.filter((r) => r.id !== id) })

  const inputStyle = {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full max-w-2xl max-h-[85vh] rounded-2xl glass overflow-hidden flex flex-col animate-fadeIn"
        style={{ border: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
            {routine ? 'Editar Rutina' : 'Nueva Rutina'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: 'var(--text-muted)' }}>
            <FiX size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Nombre</label>
              <input
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={inputStyle}
                placeholder="Nombre de la rutina"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Descripción</label>
              <input
                value={data.description}
                onChange={(e) => update({ description: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={inputStyle}
                placeholder="Breve descripción"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => update({ color: c })}
                  className="w-8 h-8 rounded-full transition-all"
                  style={{
                    background: c,
                    outline: data.color === c ? '2px solid var(--text-primary)' : 'none',
                    outlineOffset: '2px',
                    transform: data.color === c ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
            {([
              { id: 'tasks' as const, label: 'Tareas', icon: FiClock, count: data.tasks.length },
              { id: 'alarms' as const, label: 'Alarmas', icon: FiClock, count: data.alarms.length },
              { id: 'reminders' as const, label: 'Recordatorios', icon: FiBell, count: data.reminders.length },
            ]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all"
                style={{
                  background: tab === t.id ? 'var(--accent)' : 'transparent',
                  color: tab === t.id ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                }}
              >
                <t.icon size={14} /> {t.label} ({t.count})
              </button>
            ))}
          </div>

          {tab === 'tasks' && (
            <div className="space-y-3">
              {data.tasks.map((task, idx) => (
                <div key={task.id} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <span className="text-xs font-bold w-6 text-center" style={{ color: 'var(--text-muted)' }}>{idx + 1}</span>
                  <input
                    value={task.name}
                    onChange={(e) => updateTask(task.id, { name: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-md text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    placeholder="Nombre de la tarea"
                  />
                  <input
                    type="number"
                    value={task.duration}
                    onChange={(e) => updateTask(task.id, { duration: Number(e.target.value) })}
                    className="w-20 px-3 py-2 rounded-md text-sm outline-none text-center"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    min={0}
                    placeholder="min"
                  />
                  <input
                    value={task.note}
                    onChange={(e) => updateTask(task.id, { note: e.target.value })}
                    className="w-36 px-3 py-2 rounded-md text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    placeholder="Nota (opcional)"
                  />
                  <button onClick={() => removeTask(task.id)} className="p-2 rounded-md" style={{ color: 'var(--color-danger)' }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addTask}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-2 border-dashed transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
              >
                <FiPlus size={14} /> Agregar Tarea
              </button>
            </div>
          )}

          {tab === 'alarms' && (
            <div className="space-y-3">
              {data.alarms.map((alarm) => (
                <div key={alarm.id} className="p-4 rounded-lg space-y-3" style={{ background: 'var(--bg-tertiary)' }}>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={alarm.time}
                      onChange={(e) => updateAlarm(alarm.id, { time: e.target.value })}
                      className="px-3 py-2 rounded-md text-sm outline-none"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    />
                    <input
                      value={alarm.label}
                      onChange={(e) => updateAlarm(alarm.id, { label: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-md text-sm outline-none"
                      style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                      placeholder="Etiqueta de alarma"
                    />
                    <button
                      onClick={() => updateAlarm(alarm.id, { enabled: !alarm.enabled })}
                      className="px-3 py-2 rounded-md text-xs font-medium transition-all"
                      style={{
                        background: alarm.enabled ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: alarm.enabled ? 'var(--text-on-accent)' : 'var(--text-muted)',
                      }}
                    >
                      {alarm.enabled ? 'Activa' : 'Inactiva'}
                    </button>
                    <button onClick={() => removeAlarm(alarm.id)} className="p-2 rounded-md" style={{ color: 'var(--color-danger)' }}>
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    {DAYS.map((day) => {
                      const active = alarm.days.includes(day)
                      return (
                        <button
                          key={day}
                          onClick={() => {
                            updateAlarm(alarm.id, {
                              days: active ? alarm.days.filter((d) => d !== day) : [...alarm.days, day],
                            })
                          }}
                          className="px-2.5 py-1 rounded text-xs font-medium transition-all"
                          style={{
                            background: active ? 'var(--accent)' : 'var(--bg-secondary)',
                            color: active ? 'var(--text-on-accent)' : 'var(--text-muted)',
                          }}
                        >
                          {day}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
              <button
                onClick={addAlarm}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-2 border-dashed transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
              >
                <FiPlus size={14} /> Agregar Alarma
              </button>
            </div>
          )}

          {tab === 'reminders' && (
            <div className="space-y-3">
              {data.reminders.map((rem) => (
                <div key={rem.id} className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--bg-tertiary)' }}>
                  <input
                    value={rem.message}
                    onChange={(e) => updateReminder(rem.id, { message: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-md text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                    placeholder="Mensaje del recordatorio"
                  />
                  <input
                    type="date"
                    value={rem.date}
                    onChange={(e) => updateReminder(rem.id, { date: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  />
                  <input
                    type="time"
                    value={rem.time}
                    onChange={(e) => updateReminder(rem.id, { time: e.target.value })}
                    className="px-3 py-2 rounded-md text-sm outline-none"
                    style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                  />
                  <button
                    onClick={() => updateReminder(rem.id, { enabled: !rem.enabled })}
                    className="px-3 py-2 rounded-md text-xs font-medium transition-all"
                    style={{
                      background: rem.enabled ? 'var(--accent)' : 'var(--bg-secondary)',
                      color: rem.enabled ? 'var(--text-on-accent)' : 'var(--text-muted)',
                    }}
                  >
                    {rem.enabled ? 'On' : 'Off'}
                  </button>
                    <button onClick={() => removeReminder(rem.id)} className="p-2 rounded-md" style={{ color: 'var(--color-danger)' }}>
                      <FiTrash2 size={14} />
                    </button>
                </div>
              ))}
              <button
                onClick={addReminder}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-2 border-dashed transition-colors hover:border-[var(--accent)]"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
              >
                <FiPlus size={14} /> Agregar Recordatorio
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-tertiary)' }}
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(data)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
          >
            <FiSave size={14} /> {routine ? 'Guardar Cambios' : 'Crear Rutina'}
          </button>
        </div>
      </div>
    </div>
  )
}
