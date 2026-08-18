export interface RoutineTask {
  id: string
  name: string
  duration: number
  completed: boolean
  note: string
}

export interface RoutineAlarm {
  id: string
  time: string
  label: string
  enabled: boolean
  days: string[]
}

export interface RoutineReminder {
  id: string
  message: string
  time: string
  date: string
  enabled: boolean
  triggered: boolean
}

export interface Routine {
  id: string
  name: string
  description: string
  color: string
  icon: string
  tasks: RoutineTask[]
  alarms: RoutineAlarm[]
  reminders: RoutineReminder[]
  createdAt: string
  updatedAt: string
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'midnight' | 'forest' | 'ocean' | 'sunset' | 'custom'
  accentColor: string
  fontSize: 'small' | 'medium' | 'large'
  notificationsEnabled: boolean
  soundEnabled: boolean
  language: 'es' | 'en'
  sidebarCollapsed: boolean
  customBg: string
}

export type View = 'dashboard' | 'routines' | 'alarms' | 'reminders' | 'quotes' | 'downloads' | 'settings'
