import { FiMonitor, FiSmartphone, FiWatch, FiDownload, FiCheckCircle, FiExternalLink } from 'react-icons/fi'

const GITHUB_USER = 'andrescolmenarezj22-crypto'
const REPO_NAME = 'routine-app'
const BASE_URL = `https://${GITHUB_USER}.github.io/${REPO_NAME}`

const features = [
  'Rutinas personalizadas con tareas',
  'Alarmas y recordatorios con notificaciones',
  '1000+ frases motivacionales diarias',
  'Temas claro y oscuro',
  'Personalización completa',
  'Funciona sin conexión a internet',
  'Exportar e importar datos',
  'Interfaz moderna y elegante',
]

const platforms = [
  {
    name: 'Windows',
    icon: FiMonitor,
    description: 'Aplicación de escritorio completa',
    version: '1.0.0',
    size: '~85 MB',
    format: 'Instalador .exe',
    requirements: 'Windows 10 o superior',
    color: '#0078d4',
    link: `${BASE_URL}/RoutineApp-Setup-1.0.0.exe`,
    available: true,
  },
  {
    name: 'Android',
    icon: FiSmartphone,
    description: 'Próximamente en Google Play',
    version: '—',
    size: '~25 MB',
    format: 'APK / Google Play',
    requirements: 'Android 8.0 o superior',
    color: '#34a853',
    link: '#',
    available: false,
  },
  {
    name: 'iOS',
    icon: FiWatch,
    description: 'Próximamente en App Store',
    version: '—',
    size: '~30 MB',
    format: 'App Store',
    requirements: 'iOS 15 o superior',
    color: '#555555',
    link: '#',
    available: false,
  },
]

export default function DownloadPage() {
  return (
    <div className="min-h-full" style={{ background: 'linear-gradient(135deg, #0f0a1a 0%, #1a1030 50%, #0d0d1a 100%)' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
            <FiDownload size={14} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-300">Descarga Gratuita</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Routine<span className="text-purple-400">App</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Organiza tu día con rutinas personalizadas, alarmas, recordatorios y más de 1000 frases motivacionales
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <FiExternalLink size={14} className="text-purple-400" />
            <span className="text-sm text-gray-400 font-mono">{BASE_URL}</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {platforms.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${p.available ? p.color + '40' : 'rgba(255,255,255,0.06)'}`,
              }}
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

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Versión</span><span className="text-white font-medium">{p.version}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tamaño</span><span className="text-white font-medium">{p.size}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Formato</span><span className="text-white font-medium">{p.format}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Requisitos</span><span className="text-white font-medium">{p.requirements}</span>
                </div>
              </div>

              {p.available ? (
                <a
                  href={p.link}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90"
                  style={{ background: p.color }}
                  download
                >
                  <FiDownload size={16} /> Descargar
                </a>
              ) : (
                <div
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-gray-500"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}
                >
                  Próximamente
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-8 mb-12" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Todo lo que necesitas</h2>
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
          <h2 className="text-xl font-bold text-white mb-4 text-center">Link de descarga permanente</h2>
          <div className="flex items-center justify-center gap-3">
            <code className="px-4 py-2 rounded-lg text-sm font-mono text-purple-300" style={{ background: 'rgba(0,0,0,0.3)' }}>
              {BASE_URL}
            </code>
          </div>
          <p className="text-center text-gray-500 text-xs mt-3">
            Guarda este link. Siempre estara disponible para descargar la ultima version.
          </p>
        </div>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            RoutineApp v1.0.0 &mdash; Hecho con dedicacion para organizar tu vida
          </p>
        </div>
      </div>
    </div>
  )
}
