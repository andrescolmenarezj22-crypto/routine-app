import { useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import { useAuth } from '../contexts/AuthContext'

export function useApplyCustomizations(theme: 'dark' | 'light') {
  const { customizations } = useAdmin()
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    const root = document.documentElement
    const c = customizations

    if (theme === 'dark') {
      root.style.setProperty('--accent', c.darkAccent)
      root.style.setProperty('--bg-primary', c.darkBgPrimary)
      root.style.setProperty('--bg-secondary', c.darkBgSecondary)
      root.style.setProperty('--bg-tertiary', c.darkBgTertiary)
      root.style.setProperty('--bg-card', c.darkBgCard)
      root.style.setProperty('--bg-sidebar', c.darkBgSidebar)
      root.style.setProperty('--text-primary', c.darkTextPrimary)
      root.style.setProperty('--text-secondary', c.darkTextSecondary)
      root.style.setProperty('--text-muted', c.darkTextMuted)
      root.style.setProperty('--border-color', c.darkBorderColor)
    } else {
      root.style.setProperty('--accent', c.lightAccent)
      root.style.setProperty('--bg-primary', c.lightBgPrimary)
      root.style.setProperty('--bg-secondary', c.lightBgSecondary)
      root.style.setProperty('--bg-tertiary', c.lightBgTertiary)
      root.style.setProperty('--bg-card', c.lightBgCard)
      root.style.setProperty('--bg-sidebar', c.lightBgSidebar)
      root.style.setProperty('--text-primary', c.lightTextPrimary)
      root.style.setProperty('--text-secondary', c.lightTextSecondary)
      root.style.setProperty('--text-muted', c.lightTextMuted)
      root.style.setProperty('--border-color', c.lightBorderColor)
    }

    // Clear inline overrides when not logged in
    return () => {
      root.style.removeProperty('--accent')
      root.style.removeProperty('--bg-primary')
      root.style.removeProperty('--bg-secondary')
      root.style.removeProperty('--bg-tertiary')
      root.style.removeProperty('--bg-card')
      root.style.removeProperty('--bg-sidebar')
      root.style.removeProperty('--text-primary')
      root.style.removeProperty('--text-secondary')
      root.style.removeProperty('--text-muted')
      root.style.removeProperty('--border-color')
    }
  }, [customizations, theme, user])
}
