import { useState, useEffect } from 'react'
import { FiMonitor, FiSmartphone, FiWatch, FiDownload, FiCheckCircle, FiExternalLink, FiRefreshCw } from 'react-icons/fi'

const BASE_URL = 'https://andrescolmenarezj22-crypto.github.io/routine-app'

const features = [
  'Rutinas personalizadas con tareas',
  'Alarmas y recordatorios con notificaciones',
  '1000+ frases motivacionales diarias',
  'Temas oscuro y claro',
  'Personalizacion completa',
  'Funciona sin conexion a internet',
  'Exportar e importar datos',
  'Interfaz moderna y elegante',
  'Se actualiza automaticamente',
  'Datos sincronizados localmente',
]

const platforms = [
  {
    name: 'Windows',
    icon: FiMonitor,
    description: 'Instala desde tu navegador',
    color: '#0078d4',
    steps: [
      'Abre Chrome o Edge',
      'Haz clic en los tres puntos > Instalar RoutineApp',
      'O busca el icono de instalar en la barra de direcciones',
    ],
  },
  {
    name: 'Android',
    icon: FiSmartphone,
    description: 'Instala desde Chrome',
    color: '#34a853',
    steps: [
      'Abre Chrome en tu celular',
      'Toca los tres puntos > Instalar app',
      'O busca "Agregar a pantalla de inicio"',
    ],
  },
  {
    name: 'iOS',
    icon: FiWatch,
    description: 'Instala desde Safari',
    color: '#888888',
    steps: [
      'Abre Safari en tu iPhone/iPad',
      'Toca el boton de compartir',
      'Selecciona "Agregar a pantalla de inicio"',
    ],
  },
]

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => setIsInstalled(e.matches))
    setIsInstalled(window.matchMedia('(display-mode: standalone)').matches)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setIsInstalled(true)
  }

  return (
    <div className="min-h-full" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <FiDownload size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>PWA - Multiplataforma</span>
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Routine<span style={{ color: 'var(--accent)' }}>App</span>
          </h1>
          <p className="text-lg max-w-xl mx-auto mb-6" style={{ color: 'var(--text-secondary)' }}>
            Una sola app que funciona en Windows, Android e iOS. Siempre actualizada, siempre sincronizada.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <FiExternalLink size={14} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>{BASE_URL}</span>
          </div>
        </div>

        {isInstalled ? (
          <div className="mb-12 p-6 rounded-2xl text-center" style={{ background: 'var(--color-success-bg)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <FiCheckCircle size={40} className="mx-auto mb-3" style={{ color: 'var(--color-success)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-success)' }}>App Instalada</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>RoutineApp esta instalada en tu dispositivo. Abrela desde tu pantalla de inicio.</p>
          </div>
        ) : deferredPrompt ? (
          <div className="mb-12 p-8 rounded-2xl text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
            <FiDownload size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Instalar RoutineApp</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Instala la app en tu dispositivo para acceso rapido y uso sin conexion.</p>
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold transition-all hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'var(--text-on-accent)', boxShadow: '0 4px 30px rgba(124,58,237,0.4)' }}
            >
              <FiDownload size={20} /> Instalar Ahora
            </button>
          </div>
        ) : null}

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
              style={{ background: 'var(--bg-card)', border: `1px solid ${p.color}40` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.color + '20' }}>
                  <p.icon size={24} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{p.name}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                </div>
              </div>
              <ol className="space-y-2">
                {p.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: p.color, color: 'var(--text-on-accent)' }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--text-primary)' }}>Todo incluido</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                <FiCheckCircle size={18} className="shrink-0" style={{ color: 'var(--accent)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
          <h2 className="text-xl font-bold mb-3 text-center" style={{ color: 'var(--text-primary)' }}>Una sola app, todas las plataformas</h2>
          <p className="text-sm text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
            RoutineApp es una Progressive Web App (PWA). Se instala como una app nativa en cualquier dispositivo
            y se actualiza automaticamente. Los mismos datos, la misma experiencia, en todas partes.
          </p>
          <div className="flex items-center justify-center gap-2" style={{ color: 'var(--accent)' }}>
            <FiRefreshCw size={16} />
            <span className="text-sm font-medium">Actualizaciones automaticas en todas las plataformas</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            RoutineApp v1.0.0 &mdash; PWA Multiplataforma
          </p>
        </div>
      </div>
    </div>
  )
}
