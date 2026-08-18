import { useState, useEffect } from 'react'
import { AppSettings } from '../types'
import { FiMonitor, FiMoon, FiSun, FiType, FiVolume2, FiVolumeX, FiBell, FiBellOff, FiSliders, FiDownload, FiSmartphone } from 'react-icons/fi'

interface Props {
  settings: AppSettings
  onUpdate: (s: AppSettings) => void
}

const themes = [
  { id: 'dark' as const, label: 'Oscuro', icon: FiMoon, desc: 'Centro gris oscuro, bordes negro' },
  { id: 'light' as const, label: 'Claro', icon: FiSun, desc: 'Fondo blanco limpio' },
]

const accentColors = ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#8b5cf6']

export default function SettingsPanel({ settings, onUpdate }: Props) {
  const update = (partial: Partial<AppSettings>) => onUpdate({ ...settings, ...partial })
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => setIsInstalled(e.matches))
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallPWA = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') { setIsInstalled(true); setDeferredPrompt(null) }
  }

  return (
    <div className="animate-fadeIn space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Configuración</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Personaliza tu aplicación</p>
      </div>

      {/* Theme */}
      <section className="p-5 rounded-xl glass space-y-4" style={{ border: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <FiSliders size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Tema</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ theme: t.id })}
              className="p-4 rounded-xl text-left transition-all"
              style={{
                background: settings.theme === t.id ? 'var(--accent)' + '20' : 'var(--bg-tertiary)',
                border: `2px solid ${settings.theme === t.id ? 'var(--accent)' : 'var(--border-color)'}`,
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <t.icon size={16} style={{ color: settings.theme === t.id ? 'var(--accent)' : 'var(--text-muted)' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{t.label}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Accent Color */}
      <section className="p-5 rounded-xl glass space-y-4" style={{ border: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <FiMonitor size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Color de Acento</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {accentColors.map((c) => (
            <button
              key={c}
              onClick={() => update({ accentColor: c })}
              className="w-10 h-10 rounded-full transition-all"
              style={{
                background: c,
                outline: settings.accentColor === c ? '2px solid var(--text-primary)' : 'none',
                outlineOffset: '3px',
                transform: settings.accentColor === c ? 'scale(1.2)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </section>

      {/* Font Size */}
      <section className="p-5 rounded-xl glass space-y-4" style={{ border: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <FiType size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Tamaño de Texto</h2>
        </div>
        <div className="flex gap-2">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => update({ fontSize: size })}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: settings.fontSize === size ? 'var(--accent)' : 'var(--bg-tertiary)',
                color: settings.fontSize === size ? 'var(--text-on-accent)' : 'var(--text-secondary)',
                border: `1px solid ${settings.fontSize === size ? 'var(--accent)' : 'var(--border-color)'}`,
              }}
            >
              {size === 'small' ? 'Pequeño' : size === 'medium' ? 'Mediano' : 'Grande'}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="p-5 rounded-xl glass space-y-4" style={{ border: '1px solid var(--border-color)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Notificaciones y Sonido</h2>
        <div className="space-y-3">
          <button
            onClick={() => update({ notificationsEnabled: !settings.notificationsEnabled })}
            className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center gap-3">
              {settings.notificationsEnabled ? <FiBell size={18} style={{ color: 'var(--accent)' }} /> : <FiBellOff size={18} style={{ color: 'var(--text-muted)' }} />}
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Notificaciones</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Recibir alertas de alarmas y recordatorios</p>
              </div>
            </div>
            <div
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: settings.notificationsEnabled ? 'var(--accent)' : 'var(--bg-secondary)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                style={{ background: 'var(--toggle-knob)', left: settings.notificationsEnabled ? '26px' : '2px' }}
              />
            </div>
          </button>

          <button
            onClick={() => update({ soundEnabled: !settings.soundEnabled })}
            className="w-full flex items-center justify-between p-4 rounded-xl transition-all"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? <FiVolume2 size={18} style={{ color: 'var(--accent)' }} /> : <FiVolumeX size={18} style={{ color: 'var(--text-muted)' }} />}
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Sonido</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Reproducir sonido en alarmas</p>
              </div>
            </div>
            <div
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: settings.soundEnabled ? 'var(--accent)' : 'var(--bg-secondary)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
                style={{ background: 'var(--toggle-knob)', left: settings.soundEnabled ? '26px' : '2px' }}
              />
            </div>
          </button>
        </div>
      </section>

      {/* PWA Install */}
      <section className="p-5 rounded-xl glass space-y-4" style={{ border: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2">
          <FiSmartphone size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Instalar RoutineApp</h2>
        </div>
        {isInstalled ? (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'var(--color-success-bg)' }}>
            <FiDownload size={18} style={{ color: 'var(--color-success)' }} />
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--color-success)' }}>La app ya esta instalada</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>RoutineApp se ejecuta como aplicacion independiente</p>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Instala RoutineApp en tu dispositivo para acceso rapido y funcionamiento sin conexion.
            </p>
            <button
              onClick={handleInstallPWA}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
            >
              <FiDownload size={16} /> Instalar App (PWA)
            </button>
            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Funciona en Chrome, Edge, Safari y Firefox
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Para instalar la PWA, usa tu navegador:
            </p>
            <div className="space-y-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <p><strong className="text-[var(--text-secondary)]">Chrome/Edge:</strong> Haz clic en el icono de instalar en la barra de direcciones, o ve a menu &rarr; "Instalar RoutineApp"</p>
              <p><strong className="text-[var(--text-secondary)]">Safari (iOS):</strong> Toca "Compartir" &rarr; "Agregar a pantalla de inicio"</p>
              <p><strong className="text-[var(--text-secondary)]">Firefox:</strong> Haz clic en los tres puntos &rarr; "Instalar"</p>
            </div>
          </div>
        )}
      </section>

      {/* Data */}
      <section className="p-5 rounded-xl glass space-y-4" style={{ border: '1px solid var(--border-color)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Datos</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              const data = localStorage.getItem('routine-app-data') || '[]'
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url; a.download = 'routine-app-backup.json'; a.click()
              URL.revokeObjectURL(url)
            }}
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            Exportar Datos
          </button>
          <label
            className="flex-1 py-3 rounded-xl text-sm font-medium transition-all text-center cursor-pointer"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            Importar Datos
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = () => {
                    try {
                      localStorage.setItem('routine-app-data', reader.result as string)
                      window.location.reload()
                    } catch { alert('Archivo inválido') }
                  }
                  reader.readAsText(file)
                }
              }}
            />
          </label>
        </div>
        <button
          onClick={() => { if (confirm('¿Borrar todos los datos?')) { localStorage.clear(); window.location.reload() } }}
          className="w-full py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: 'var(--color-danger)', border: '1px solid var(--border-color)' }}
        >
          Borrar Todos los Datos
        </button>
      </section>
    </div>
  )
}
