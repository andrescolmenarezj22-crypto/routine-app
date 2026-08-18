import { useState, useEffect, useCallback } from 'react'
import { Routine, AppSettings, View } from './types'
import { loadRoutines, saveRoutines, loadSettings, saveSettings } from './store'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { AdminProvider, useAdmin } from './contexts/AdminContext'
import { useApplyCustomizations } from './hooks/useApplyCustomizations'
import TitleBar from './components/TitleBar'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import RoutineList from './components/RoutineList'
import RoutineForm from './components/RoutineForm'
import AlarmPanel from './components/AlarmPanel'
import ReminderPanel from './components/ReminderPanel'
import SettingsPanel from './components/SettingsPanel'
import ReminderToast from './components/ReminderToast'
import QuotesPanel from './components/QuotesPanel'
import DownloadPage from './components/DownloadPage'
import AuthPage from './components/AuthPage'
import AdminEditor from './components/AdminEditor'

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void
      maximize: () => void
      close: () => void
      sendNotification: (title: string, body: string) => Promise<boolean>
    }
  }
}

function LoadingScreen() {
  return (
    <div className="h-full flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center animate-pulse" style={{ background: 'var(--accent)' }}>
          <span className="text-2xl font-bold" style={{ color: 'var(--text-on-accent)' }}>R</span>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Cargando...</p>
      </div>
    </div>
  )
}

function AppContent() {
  const { user, loading: authLoading, logout } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [settings, setSettings] = useState<AppSettings>(loadSettings())
  useApplyCustomizations(settings.theme as 'dark' | 'light')

  const [routines, setRoutines] = useState<Routine[]>(loadRoutines())
  const [view, setView] = useState<View>('dashboard')
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showAdminEditor, setShowAdminEditor] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings.theme])

  useEffect(() => { saveRoutines(routines) }, [routines])
  useEffect(() => { saveSettings(settings) }, [settings])

  const checkReminders = useCallback(() => {
    if (!settings.notificationsEnabled) return
    const now = new Date()
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const currentDate = now.toISOString().split('T')[0]

    routines.forEach((routine) => {
      routine.reminders.forEach((reminder) => {
        if (reminder.enabled && !reminder.triggered && reminder.time === currentTime && reminder.date === currentDate) {
          setToastMessage(reminder.message)
          window.electronAPI?.sendNotification('Recordatorio', reminder.message)
          setTimeout(() => setToastMessage(null), 8000)
          setRoutines((prev) =>
            prev.map((r) => ({
              ...r,
              reminders: r.reminders.map((rem) => rem.id === reminder.id ? { ...rem, triggered: true } : rem),
            }))
          )
        }
      })
      routine.alarms.forEach((alarm) => {
        if (alarm.enabled && alarm.time === currentTime) {
          const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']
          const todayDay = dayNames[now.getDay()]
          if (alarm.days.includes(todayDay)) {
            setToastMessage(`Alarma: ${alarm.label}`)
            window.electronAPI?.sendNotification(`Alarma - ${routine.name}`, alarm.label)
            setTimeout(() => setToastMessage(null), 8000)
          }
        }
      })
    })
  }, [routines, settings.notificationsEnabled])

  useEffect(() => {
    const interval = setInterval(checkReminders, 30000)
    checkReminders()
    return () => clearInterval(interval)
  }, [checkReminders])

  const handleSaveRoutine = (routine: Routine) => {
    const exists = routines.find((r) => r.id === routine.id)
    if (exists) {
      setRoutines((prev) => prev.map((r) => (r.id === routine.id ? { ...routine, updatedAt: new Date().toISOString() } : r)))
    } else {
      setRoutines((prev) => [...prev, routine])
    }
    setShowForm(false)
    setEditingRoutine(null)
  }

  const handleDeleteRoutine = (id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id))
  }

  const handleEditRoutine = (routine: Routine) => {
    setEditingRoutine(routine)
    setShowForm(true)
  }

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings)
  }

  const handleToggleTask = (routineId: string, taskId: string) => {
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === routineId
          ? { ...r, tasks: r.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) }
          : r
      )
    )
  }

  if (authLoading || adminLoading) return <LoadingScreen />
  if (!user) return <AuthPage />

  const fontSizeClass = settings.fontSize === 'small' ? 'text-sm' : settings.fontSize === 'large' ? 'text-lg' : 'text-base'

  return (
    <div className={`h-full flex flex-col ${fontSizeClass}`} style={{ color: 'var(--text-primary)' }}>
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          view={view}
          onNavigate={setView}
          collapsed={settings.sidebarCollapsed}
          onToggleCollapse={() => handleUpdateSettings({ ...settings, sidebarCollapsed: !settings.sidebarCollapsed })}
          isAdmin={isAdmin}
          onOpenAdmin={() => setShowAdminEditor(true)}
          onLogout={() => logout()}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {view === 'dashboard' && (
            <Dashboard routines={routines} onNavigate={setView} onEditRoutine={handleEditRoutine} onToggleTask={handleToggleTask} />
          )}
          {view === 'routines' && (
            <RoutineList routines={routines} onEdit={handleEditRoutine} onDelete={handleDeleteRoutine} onNew={() => { setEditingRoutine(null); setShowForm(true) }} onToggleTask={handleToggleTask} />
          )}
          {view === 'alarms' && <AlarmPanel routines={routines} setRoutines={setRoutines} />}
          {view === 'reminders' && <ReminderPanel routines={routines} setRoutines={setRoutines} />}
          {view === 'quotes' && <QuotesPanel />}
          {view === 'downloads' && <DownloadPage />}
          {view === 'settings' && <SettingsPanel settings={settings} onUpdate={handleUpdateSettings} />}
        </main>
      </div>

      {showForm && (
        <RoutineForm routine={editingRoutine} onSave={handleSaveRoutine} onClose={() => { setShowForm(false); setEditingRoutine(null) }} />
      )}
      {toastMessage && <ReminderToast message={toastMessage} onClose={() => setToastMessage(null)} />}
      {showAdminEditor && <AdminEditor onClose={() => setShowAdminEditor(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </AuthProvider>
  )
}
