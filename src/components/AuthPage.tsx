import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FiMail, FiLock, FiUser, FiActivity, FiEye, FiEyeOff } from 'react-icons/fi'

export default function AuthPage() {
  const { login, register, loginWithGoogle } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Las contrasenas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contrasena debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password)
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') setError('Usuario no encontrado')
      else if (err.code === 'auth/wrong-password') setError('Contrasena incorrecta')
      else if (err.code === 'auth/email-already-in-use') setError('Este correo ya esta registrado')
      else if (err.code === 'auth/invalid-email') setError('Correo invalido')
      else if (err.code === 'auth/popup-closed-by-user') setError('Se cerro la ventana de Google')
      else setError('Error: ' + (err.message || 'Intenta de nuevo'))
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await loginWithGoogle()
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') setError('Se cerro la ventana de Google')
      else setError('Error con Google: ' + (err.message || 'Intenta de nuevo'))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="w-full max-w-md space-y-8 animate-fadeIn">

        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <FiActivity size={40} style={{ color: 'var(--text-on-accent)' }} />
          </div>
          <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>RoutineApp</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Organiza tu dia, transforma tu vida</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-2xl glass" style={{ border: '1px solid var(--border-color)' }}>
          <h2 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
            {isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
          </h2>

          {error && (
            <div className="p-3 rounded-xl text-sm text-center" style={{ background: 'var(--color-danger-bg)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Correo electronico</label>
            <div className="relative">
              <FiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Contrasena</label>
            <div className="relative">
              <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                placeholder="Minimo 6 caracteres"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Confirmar contrasena</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  placeholder="Repite tu contrasena"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'var(--text-on-accent)' }}
          >
            {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesion' : 'Crear Cuenta'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>o</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-color)' }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          {/* Toggle */}
          <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'No tienes cuenta? ' : 'Ya tienes cuenta? '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError('') }}
              className="font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {isLogin ? 'Registrate' : 'Inicia sesion'}
            </button>
          </p>
        </form>

        <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Tus datos se sincronizan de forma segura en la nube
        </p>
      </div>
    </div>
  )
}
