import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
import { db } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

export interface ThemeCustomizations {
  // Branding
  appName: string
  appTagline: string
  logoUrl: string
  faviconUrl: string
  // Loading screen
  loadingTitle: string
  loadingSubtitle: string
  loadingBgUrl: string
  // Colors (dark)
  darkAccent: string
  darkBgPrimary: string
  darkBgSecondary: string
  darkBgTertiary: string
  darkBgCard: string
  darkBgSidebar: string
  darkTextPrimary: string
  darkTextSecondary: string
  darkTextMuted: string
  darkBorderColor: string
  // Colors (light)
  lightAccent: string
  lightBgPrimary: string
  lightBgSecondary: string
  lightBgTertiary: string
  lightBgCard: string
  lightBgSidebar: string
  lightTextPrimary: string
  lightTextSecondary: string
  lightTextMuted: string
  lightBorderColor: string
  // Cover image
  coverUrl: string
}

const defaultCustomizations: ThemeCustomizations = {
  appName: 'RoutineApp',
  appTagline: 'Organiza tu dia, transforma tu vida',
  logoUrl: '',
  faviconUrl: '',
  loadingTitle: 'RoutineApp',
  loadingSubtitle: 'Cargando...',
  loadingBgUrl: '',
  darkAccent: '#7c3aed',
  darkBgPrimary: '#0d0d0d',
  darkBgSecondary: '#111111',
  darkBgTertiary: '#1a1a1a',
  darkBgCard: '#151515',
  darkBgSidebar: '#0a0a0a',
  darkTextPrimary: '#f5f5f5',
  darkTextSecondary: '#a3a3a3',
  darkTextMuted: '#525252',
  darkBorderColor: '#262626',
  lightAccent: '#7c3aed',
  lightBgPrimary: '#ffffff',
  lightBgSecondary: '#f9fafb',
  lightBgTertiary: '#f3f4f6',
  lightBgCard: '#ffffff',
  lightBgSidebar: '#f3f4f6',
  lightTextPrimary: '#111827',
  lightTextSecondary: '#6b7280',
  lightTextMuted: '#9ca3af',
  lightBorderColor: '#e5e7eb',
  coverUrl: '',
}

interface AdminContextType {
  isAdmin: boolean
  customizations: ThemeCustomizations
  updateCustomizations: (partial: Partial<ThemeCustomizations>) => void
  saveCustomizations: (target: 'dark' | 'light' | 'both') => Promise<void>
  loading: boolean
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType)

const ADMIN_EMAIL = 'zyro1788@gmail.com'

export function useAdmin() {
  return useContext(AdminContext)
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [customizations, setCustomizations] = useState<ThemeCustomizations>(defaultCustomizations)
  const [loading, setLoading] = useState(true)
  const isAdmin = user?.email === ADMIN_EMAIL

  useEffect(() => {
    if (!user) { setLoading(false); return }
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'customizations', 'global'))
        if (snap.exists()) {
          setCustomizations({ ...defaultCustomizations, ...snap.data() } as ThemeCustomizations)
        }
      } catch (e) { console.error('Error loading customizations', e) }
      setLoading(false)
    }
    load()
  }, [user])

  const updateCustomizations = (partial: Partial<ThemeCustomizations>) => {
    setCustomizations((prev) => ({ ...prev, ...partial }))
  }

  const saveCustomizations = async (target: 'dark' | 'light' | 'both') => {
    const data: any = { ...customizations }
    if (target === 'dark') {
      delete data.lightAccent
      delete data.lightBgPrimary
      delete data.lightBgSecondary
      delete data.lightBgTertiary
      delete data.lightBgCard
      delete data.lightBgSidebar
      delete data.lightTextPrimary
      delete data.lightTextSecondary
      delete data.lightTextMuted
      delete data.lightBorderColor
    } else if (target === 'light') {
      delete data.darkAccent
      delete data.darkBgPrimary
      delete data.darkBgSecondary
      delete data.darkBgTertiary
      delete data.darkBgCard
      delete data.darkBgSidebar
      delete data.darkTextPrimary
      delete data.darkTextSecondary
      delete data.darkTextMuted
      delete data.darkBorderColor
    }
    await setDoc(doc(db, 'customizations', 'global'), data, { merge: true })
  }

  return (
    <AdminContext.Provider value={{ isAdmin, customizations, updateCustomizations, saveCustomizations, loading }}>
      {children}
    </AdminContext.Provider>
  )
}
