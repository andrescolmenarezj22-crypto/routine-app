import { useState } from 'react'
import { useAdmin, ThemeCustomizations } from '../contexts/AdminContext'
import { FiX, FiSave, FiImage, FiType, FiDroplet, FiMonitor, FiSun, FiMoon, FiUpload, FiCheck } from 'react-icons/fi'

interface Props {
  onClose: () => void
}

type Tab = 'branding' | 'loading' | 'dark' | 'light' | 'cover'

export default function AdminEditor({ onClose }: Props) {
  const { customizations, updateCustomizations, saveCustomizations } = useAdmin()
  const [tab, setTab] = useState<Tab>('branding')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (target: 'dark' | 'light' | 'both') => {
    setSaving(true)
    try {
      await saveCustomizations(target)
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowSaveDialog(false) }, 1500)
    } catch (e) { console.error(e) }
    setSaving(false)
  }

  const colorField = (label: string, key: keyof ThemeCustomizations, value: string) => (
    <div className="space-y-2">
      <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => updateCustomizations({ [key]: e.target.value })}
          className="w-10 h-10 rounded-lg cursor-pointer border-0"
          style={{ background: 'transparent' }}
        />
        <input
          value={value}
          onChange={(e) => updateCustomizations({ [key]: e.target.value })}
          className="flex-1 px-3 py-2 rounded-lg text-sm font-mono outline-none"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        />
      </div>
    </div>
  )

  const textField = (label: string, key: keyof ThemeCustomizations, value: string, placeholder?: string) => (
    <div className="space-y-2">
      <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <input
        value={value}
        onChange={(e) => updateCustomizations({ [key]: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        placeholder={placeholder || ''}
      />
    </div>
  )

  const imageField = (label: string, key: keyof ThemeCustomizations, value: string) => (
    <div className="space-y-2">
      <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <input
        value={value}
        onChange={(e) => updateCustomizations({ [key]: e.target.value })}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
        placeholder="URL de la imagen (https://...)"
      />
      {value && (
        <div className="mt-2 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-color)' }}>
          <img src={value} alt="" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        </div>
      )}
    </div>
  )

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'branding', label: 'Marca', icon: FiType },
    { id: 'loading', label: 'Pantalla de carga', icon: FiMonitor },
    { id: 'cover', label: 'Portada', icon: FiImage },
    { id: 'dark', label: 'Tema Oscuro', icon: FiMoon },
    { id: 'light', label: 'Tema Claro', icon: FiSun },
  ]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col animate-fadeIn glass" style={{ border: '1px solid var(--border-color)' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <FiDroplet size={18} style={{ color: 'var(--text-on-accent)' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Editor de Administrador</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Personaliza la apariencia de la app</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
            >
              <FiSave size={16} /> Guardar
            </button>
            <button onClick={onClose} className="p-2.5 rounded-xl transition-colors" style={{ color: 'var(--text-muted)' }}>
              <FiX size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 mx-5 mt-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: tab === t.id ? 'var(--accent)' : 'transparent',
                color: tab === t.id ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              }}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {tab === 'branding' && (
            <>
              {textField('Nombre de la App', 'appName', customizations.appName, 'RoutineApp')}
              {textField('Subtitulo', 'appTagline', customizations.appTagline, 'Organiza tu dia...')}
              {imageField('Logo (URL)', 'logoUrl', customizations.logoUrl)}
              {imageField('Favicon (URL)', 'faviconUrl', customizations.faviconUrl)}
            </>
          )}

          {tab === 'loading' && (
            <>
              {textField('Titulo', 'loadingTitle', customizations.loadingTitle, 'RoutineApp')}
              {textField('Subtitulo', 'loadingSubtitle', customizations.loadingSubtitle, 'Cargando...')}
              {imageField('Fondo de pantalla de carga (URL)', 'loadingBgUrl', customizations.loadingBgUrl)}
            </>
          )}

          {tab === 'cover' && (
            <>
              {imageField('Imagen de portada (URL)', 'coverUrl', customizations.coverUrl)}
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Esta imagen se muestra en la pagina de descargas y en el dashboard</p>
            </>
          )}

          {tab === 'dark' && (
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Colores de fondo</h3>
                {colorField('Fondo Principal', 'darkBgPrimary', customizations.darkBgPrimary)}
                {colorField('Fondo Secundario', 'darkBgSecondary', customizations.darkBgSecondary)}
                {colorField('Fondo Terciario', 'darkBgTertiary', customizations.darkBgTertiary)}
                {colorField('Fondo Tarjetas', 'darkBgCard', customizations.darkBgCard)}
                {colorField('Fondo Sidebar', 'darkBgSidebar', customizations.darkBgSidebar)}
              </div>
              <div className="space-y-5">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Colores de texto y acento</h3>
                {colorField('Color de Acento', 'darkAccent', customizations.darkAccent)}
                {colorField('Texto Principal', 'darkTextPrimary', customizations.darkTextPrimary)}
                {colorField('Texto Secundario', 'darkTextSecondary', customizations.darkTextSecondary)}
                {colorField('Texto Deshabilitado', 'darkTextMuted', customizations.darkTextMuted)}
                {colorField('Bordes', 'darkBorderColor', customizations.darkBorderColor)}
              </div>
            </div>
          )}

          {tab === 'light' && (
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-5">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Colores de fondo</h3>
                {colorField('Fondo Principal', 'lightBgPrimary', customizations.lightBgPrimary)}
                {colorField('Fondo Secundario', 'lightBgSecondary', customizations.lightBgSecondary)}
                {colorField('Fondo Terciario', 'lightBgTertiary', customizations.lightBgTertiary)}
                {colorField('Fondo Tarjetas', 'lightBgCard', customizations.lightBgCard)}
                {colorField('Fondo Sidebar', 'lightBgSidebar', customizations.lightBgSidebar)}
              </div>
              <div className="space-y-5">
                <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Colores de texto y acento</h3>
                {colorField('Color de Acento', 'lightAccent', customizations.lightAccent)}
                {colorField('Texto Principal', 'lightTextPrimary', customizations.lightTextPrimary)}
                {colorField('Texto Secundario', 'lightTextSecondary', customizations.lightTextSecondary)}
                {colorField('Texto Deshabilitado', 'lightTextMuted', customizations.lightTextMuted)}
                {colorField('Bordes', 'lightBorderColor', customizations.lightBorderColor)}
              </div>
            </div>
          )}
        </div>

        {/* Save Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="w-full max-w-sm rounded-2xl p-6 space-y-5 animate-fadeIn glass" style={{ border: '1px solid var(--border-color)' }}>
              {saved ? (
                <div className="text-center py-6 space-y-3">
                  <FiCheck size={48} className="mx-auto" style={{ color: 'var(--color-success)' }} />
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Guardado!</h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Los cambios se aplicaron correctamente</p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-center" style={{ color: 'var(--text-primary)' }}>Aplicar cambios a:</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => handleSave('dark')}
                      disabled={saving}
                      className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-90"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                    >
                      <FiMoon size={20} style={{ color: 'var(--text-primary)' }} />
                      <div className="text-left">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Solo Modo Oscuro</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cambios solo para el tema oscuro</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSave('light')}
                      disabled={saving}
                      className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-90"
                      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                    >
                      <FiSun size={20} style={{ color: 'var(--text-primary)' }} />
                      <div className="text-left">
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Solo Modo Claro</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Cambios solo para el tema claro</p>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSave('both')}
                      disabled={saving}
                      className="w-full flex items-center gap-3 p-4 rounded-xl transition-all hover:opacity-90"
                      style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
                    >
                      <FiMonitor size={20} />
                      <div className="text-left">
                        <p className="text-sm font-bold">Ambos Temas</p>
                        <p className="text-xs opacity-80">Aplicar a modo oscuro y claro</p>
                      </div>
                    </button>
                  </div>
                  <button onClick={() => setShowSaveDialog(false)} className="w-full text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                    Cancelar
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
