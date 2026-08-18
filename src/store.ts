import { Routine, AppSettings, RoutineTask, RoutineAlarm, RoutineReminder } from './types'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'routine-app-data'
const SETTINGS_KEY = 'routine-app-settings'

const defaultSettings: AppSettings = {
  theme: 'dark',
  accentColor: '#7c3aed',
  fontSize: 'medium',
  notificationsEnabled: true,
  soundEnabled: true,
  language: 'es',
  sidebarCollapsed: false,
  customBg: '',
}

export function loadSettings(): AppSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadRoutines(): Routine[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : getSampleRoutines()
  } catch {
    return getSampleRoutines()
  }
}

export function saveRoutines(routines: Routine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(routines))
}

export function createRoutine(data: Partial<Routine>): Routine {
  return {
    id: uuidv4(),
    name: data.name || 'Nueva Rutina',
    description: data.description || '',
    color: data.color || '#7c3aed',
    icon: data.icon || 'FiClock',
    tasks: data.tasks || [],
    alarms: data.alarms || [],
    reminders: data.reminders || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function createTask(data: Partial<RoutineTask>): RoutineTask {
  return {
    id: uuidv4(),
    name: data.name || 'Nueva tarea',
    duration: data.duration || 5,
    completed: false,
    note: data.note || '',
  }
}

export function createAlarm(data: Partial<RoutineAlarm>): RoutineAlarm {
  return {
    id: uuidv4(),
    time: data.time || '08:00',
    label: data.label || 'Alarma',
    enabled: data.enabled ?? true,
    days: data.days || ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
  }
}

export function createReminder(data: Partial<RoutineReminder>): RoutineReminder {
  return {
    id: uuidv4(),
    message: data.message || 'Recordatorio',
    time: data.time || '09:00',
    date: data.date || new Date().toISOString().split('T')[0],
    enabled: data.enabled ?? true,
    triggered: false,
  }
}

function getSampleRoutines(): Routine[] {
  return [
    {
      id: uuidv4(),
      name: 'Rutina Matutina',
      description: 'Mi rutina para empezar el día con energía',
      color: '#f59e0b',
      icon: 'FiSunrise',
      tasks: [
        { id: uuidv4(), name: 'Despertar y estirar', duration: 5, completed: false, note: '' },
        { id: uuidv4(), name: 'Beber agua', duration: 2, completed: false, note: '1 vaso grande' },
        { id: uuidv4(), name: 'Meditar', duration: 10, completed: false, note: 'App de meditación' },
        { id: uuidv4(), name: 'Ejercicio', duration: 20, completed: false, note: 'Rutina de cardio' },
        { id: uuidv4(), name: 'Ducharse', duration: 10, completed: false, note: '' },
        { id: uuidv4(), name: 'Desayunar', duration: 15, completed: false, note: 'Proteína + carbohidratos' },
      ],
      alarms: [
        { id: uuidv4(), time: '06:30', label: 'Despertar', enabled: true, days: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'] },
      ],
      reminders: [
        { id: uuidv4(), message: 'Preparar la ropa del día anterior', time: '22:00', date: '', enabled: true, triggered: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Rutina Nocturna',
      description: 'Relajarme antes de dormir',
      color: '#6366f1',
      icon: 'FiMoon',
      tasks: [
        { id: uuidv4(), name: 'Apagar pantallas', duration: 0, completed: false, note: '1 hora antes' },
        { id: uuidv4(), name: 'Lectura', duration: 20, completed: false, note: 'Libro físico' },
        { id: uuidv4(), name: 'Journaling', duration: 10, completed: false, note: 'Escribir 3 cosas positivas' },
        { id: uuidv4(), name: 'Apreparar té', duration: 5, completed: false, note: 'Manzanilla' },
      ],
      alarms: [
        { id: uuidv4(), time: '22:00', label: 'Prepararse para dormir', enabled: true, days: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'] },
      ],
      reminders: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}
