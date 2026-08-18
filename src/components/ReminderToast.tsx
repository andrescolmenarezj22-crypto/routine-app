import { FiX, FiBell } from 'react-icons/fi'

interface Props {
  message: string
  onClose: () => void
}

export default function ReminderToast({ message, onClose }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <div
        className="flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl max-w-sm glass"
        style={{ border: '1px solid var(--accent)' }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center animate-pulse-glow" style={{ background: 'var(--accent)' }}>
          <FiBell size={18} style={{ color: 'var(--text-on-accent)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Recordatorio</p>
          <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{message}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--text-muted)' }}>
          <FiX size={14} />
        </button>
      </div>
    </div>
  )
}
