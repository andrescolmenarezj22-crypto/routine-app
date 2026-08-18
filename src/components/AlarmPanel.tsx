import { Routine } from '../types'
import { FiClock, FiPlus, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { createAlarm } from '../store'

const DAYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom']

interface Props {
  routines: Routine[]
  setRoutines: React.Dispatch<React.SetStateAction<Routine[]>>
}

export default function AlarmPanel({ routines, setRoutines }: Props) {
  const toggleAlarm = (routineId: string, alarmId: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, alarms: r.alarms.map((a) => (a.id === alarmId ? { ...a, enabled: !a.enabled } : a)) }
          : r
      )
    )
  }

  const updateAlarm = (routineId: string, alarmId: string, time: string, label: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, alarms: r.alarms.map((a) => (a.id === alarmId ? { ...a, time, label } : a)) }
          : r
      )
    )
  }

  const toggleDay = (routineId: string, alarmId: string, day: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? {
              ...r,
              alarms: r.alarms.map((a) =>
                a.id === alarmId
                  ? { ...a, days: a.days.includes(day) ? a.days.filter((d) => d !== day) : [...a.days, day] }
                  : a
              ),
            }
          : r
      )
    )
  }

  const addAlarmToRoutine = (routineId: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId ? { ...r, alarms: [...r.alarms, createAlarm({})] } : r
      )
    )
  }

  const removeAlarm = (routineId: string, alarmId: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId ? { ...r, alarms: r.alarms.filter((a) => a.id !== alarmId) } : r
      )
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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Alarmas</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Gestiona las alarmas de cada rutina</p>
      </div>

      {routines.length === 0 ? (
        <div className="text-center py-20 rounded-xl glass" style={{ border: '1px solid var(--border-color)' }}>
          <FiClock size={48} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Crea una rutina primero para agregar alarmas</p>
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
                    {routine.alarms.length} alarmas
                  </span>
                </div>
                <button
                  onClick={() => addAlarmToRoutine(routine.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                  style={{ background: routine.color }}
                >
                  <FiPlus size={12} /> Alarma
                </button>
              </div>

              {routine.alarms.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sin alarmas configuradas</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {routine.alarms.map((alarm) => (
                    <div key={alarm.id} className="p-4 rounded-lg space-y-3" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="flex items-center gap-3">
                        <input
                          type="time"
                          value={alarm.time}
                          onChange={(e) => updateAlarm(routine.id, alarm.id, e.target.value, alarm.label)}
                          className="px-3 py-2 rounded-lg text-lg font-mono font-bold outline-none"
                          style={inputStyle}
                        />
                        <input
                          value={alarm.label}
                          onChange={(e) => updateAlarm(routine.id, alarm.id, alarm.time, e.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                          style={inputStyle}
                          placeholder="Etiqueta"
                        />
                        <button
                          onClick={() => toggleAlarm(routine.id, alarm.id)}
                          className="text-2xl transition-colors"
                          style={{ color: alarm.enabled ? routine.color : 'var(--text-muted)' }}
                        >
                          {alarm.enabled ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                        <button
                          onClick={() => removeAlarm(routine.id, alarm.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>

                      <div className="flex gap-1.5">
                        {DAYS.map((day) => {
                          const active = alarm.days.includes(day)
                          return (
                            <button
                              key={day}
                              onClick={() => toggleDay(routine.id, alarm.id, day)}
                              className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
                              style={{
                                background: active ? routine.color + '30' : 'var(--bg-secondary)',
                                color: active ? routine.color : 'var(--text-muted)',
                                border: `1px solid ${active ? routine.color + '50' : 'var(--border-color)'}`,
                              }}
                            >
                              {day}
                            </button>
                          )
                        })}
                      </div>
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
