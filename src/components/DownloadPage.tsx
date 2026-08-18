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
    <div className="min-h-full" style={{ background: 'linear-gradient(135deg, #0f0a1a 0%, #1a1030 50%, #0d0d1a 100%)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <FiDownload size={14} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-300">PWA - Multiplataforma</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Routine<span className="text-purple-400">App</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-6">
            Una sola app que funciona en Windows, Android e iOS. Siempre actualizada, siempre sincronizada.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <FiExternalLink size={14} className="text-purple-400" />
            <span className="text-sm text-gray-400 font-mono">{BASE_URL}</span>
          </div>
        </div>

        {isInstalled ? (
          <div className="mb-12 p-6 rounded-2xl text-center" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <FiCheckCircle size={40} className="mx-auto mb-3 text-green-400" />
            <h2 className="text-xl font-bold text-green-400 mb-2">App Instalada</h2>
            <p className="text-sm text-gray-400">RoutineApp esta instalada en tu dispositivo. Abrela desde tu pantalla de inicio.</p>
          </div>
        ) : deferredPrompt ? (
          <div className="mb-12 p-8 rounded-2xl text-center" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <FiDownload size={40} className="mx-auto mb-4 text-purple-400" />
            <h2 className="text-xl font-bold text-white mb-2">Instalar RoutineApp</h2>
            <p className="text-sm text-gray-400 mb-6">Instala la app en tu dispositivo para acceso rapido y uso sin conexion.</p>
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-white text-lg font-bold transition-all hover:opacity-90"
              style={{ background: '#7c3aed', boxShadow: '0 4px 30px rgba(124,58,237,0.4)' }}
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
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${p.color}40` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: p.color + '20' }}>
                  <p.icon size={24} style={{ color: p.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  <p className="text-xs text-gray-500">{p.description}</p>
                </div>
              </div>
              <ol className="space-y-2">
                {p.steps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: p.color }}>
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Todo incluido</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.05)' }}>
                <FiCheckCircle size={18} className="text-purple-400 shrink-0" />
                <span className="text-sm text-gray-300">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <h2 className="text-xl font-bold text-white mb-3 text-center">Una sola app, todas las plataformas</h2>
          <p className="text-sm text-gray-400 text-center mb-4">
            RoutineApp es una Progressive Web App (PWA). Se instala como una app nativa en cualquier dispositivo
            y se actualiza automaticamente. Los mismos datos, la misma experiencia, en todas partes.
          </p>
          <div className="flex items-center justify-center gap-2 text-purple-300">
            <FiRefreshCw size={16} />
            <span className="text-sm font-medium">Actualizaciones automaticas en todas las plataformas</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            RoutineApp v1.0.0 &mdash; PWA Multiplataforma
          </p>
        </div>
      </div>
    </div>
  )
}
