import { FiMinimize, FiMaximize2, FiX, FiActivity } from 'react-icons/fi'

export default function TitleBar() {
  return (
    <div
      className="drag-region h-9 flex items-center justify-between px-3 select-none shrink-0"
      style={{ background: 'var(--bg-titlebar)', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="flex items-center gap-2">
        <FiActivity className="text-[var(--accent)]" size={16} />
        <span className="text-sm font-semibold tracking-wide" style={{ color: 'var(--text-primary)' }}>
          RoutineApp
        </span>
      </div>

      <div className="no-drag flex items-center gap-0.5">
        <button
          onClick={() => window.electronAPI?.minimize()}
          className="w-8 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiMinimize size={13} />
        </button>
        <button
          onClick={() => window.electronAPI?.maximize()}
          className="w-8 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiMaximize2 size={13} />
        </button>
        <button
          onClick={() => window.electronAPI?.close()}
          className="w-8 h-7 flex items-center justify-center rounded transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiX size={14} />
        </button>
      </div>
    </div>
  )
}
