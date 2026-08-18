import { View } from '../types'
import {
  FiHome, FiList, FiClock, FiBell, FiSettings,
  FiChevronLeft, FiChevronRight, FiMessageCircle, FiDownload, FiDroplet, FiLogOut
} from 'react-icons/fi'
import { IconType } from 'react-icons'

interface NavItem {
  id: View
  label: string
  icon: IconType
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome },
  { id: 'routines', label: 'Rutinas', icon: FiList },
  { id: 'alarms', label: 'Alarmas', icon: FiClock },
  { id: 'reminders', label: 'Recordatorios', icon: FiBell },
  { id: 'quotes', label: 'Frases', icon: FiMessageCircle },
  { id: 'downloads', label: 'Descargas', icon: FiDownload },
  { id: 'settings', label: 'Configuración', icon: FiSettings },
]

interface Props {
  view: View
  onNavigate: (view: View) => void
  collapsed: boolean
  onToggleCollapse: () => void
  isAdmin: boolean
  onOpenAdmin: () => void
  onLogout: () => void
}

export default function Sidebar({ view, onNavigate, collapsed, onToggleCollapse, isAdmin, onOpenAdmin, onLogout }: Props) {
  return (
    <aside
      className="flex flex-col shrink-0 transition-all duration-300"
      style={{
        width: collapsed ? 64 : 220,
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      <nav className="flex-1 py-3 px-2 space-y-1">
        {navItems.map((item) => {
          const active = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
              style={{
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? 'var(--text-on-accent)' : 'var(--text-secondary)',
              }}
            >
              <item.icon size={18} />
              {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
            </button>
          )
        })}

        {isAdmin && (
          <button
            onClick={onOpenAdmin}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 mt-4"
            style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)20' }}
          >
            <FiDroplet size={18} />
            {!collapsed && <span className="text-sm font-semibold truncate">Editor Admin</span>}
          </button>
        )}
      </nav>

      <div className="px-2 pb-3 space-y-1">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <FiLogOut size={16} />
          {!collapsed && <span className="text-xs">Cerrar sesion</span>}
        </button>
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
          {!collapsed && <span className="text-xs">Colapsar</span>}
        </button>
      </div>
    </aside>
  )
}
