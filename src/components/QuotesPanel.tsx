import { useState, useEffect } from 'react'
import { quotes, Quote } from '../quotes'
import { FiRefreshCw, FiHeart, FiShare2, FiBookmark, FiCalendar, FiFilter } from 'react-icons/fi'

const CATEGORIES = ['todas', ...Array.from(new Set(quotes.map((q) => q.category)))]

function getTodayQuote(): Quote {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return quotes[seed % quotes.length]
}

function getRandomQuote(exclude: string): Quote {
  const filtered = quotes.filter((q) => q.text !== exclude)
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export default function QuotesPanel() {
  const [currentQuote, setCurrentQuote] = useState<Quote>(getTodayQuote)
  const [category, setCategory] = useState('todas')
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('quote-favorites') || '[]') } catch { return [] }
  })
  const [history, setHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('quote-history') || '[]') } catch { return [] }
  })
  const [view, setView] = useState<'daily' | 'browse'>('daily')
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => { localStorage.setItem('quote-favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem('quote-history', JSON.stringify(history)) }, [history])

  const nextQuote = () => {
    setIsAnimating(true)
    setTimeout(() => {
      const q = category === 'todas' ? getRandomQuote(currentQuote.text) : (() => {
        const filtered = quotes.filter((c) => c.category === category && c.text !== currentQuote.text)
        return filtered[Math.floor(Math.random() * filtered.length)] || getRandomQuote(currentQuote.text)
      })()
      setCurrentQuote(q)
      setHistory((prev) => [...new Set([q.text, ...prev])].slice(0, 100))
      setIsAnimating(false)
    }, 200)
  }

  const toggleFavorite = (text: string) => {
    setFavorites((prev) => prev.includes(text) ? prev.filter((t) => t !== text) : [...prev, text])
  }

  const isFav = favorites.includes(currentQuote.text)

  const filteredQuotes = category === 'todas' ? quotes : quotes.filter((q) => q.category === category)

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Frases Motivacionales</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{quotes.length}+ frases para inspirarte cada día</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('daily')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: view === 'daily' ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: view === 'daily' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <FiCalendar size={14} /> Frase del Día
          </button>
          <button
            onClick={() => setView('browse')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: view === 'browse' ? 'var(--accent)' : 'var(--bg-tertiary)',
              color: view === 'browse' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            <FiFilter size={14} /> Explorar
          </button>
        </div>
      </div>

      {view === 'daily' && (
        <div className="space-y-6">
          <div
            className="relative p-10 rounded-2xl glass text-center transition-all duration-300"
            style={{
              border: '1px solid var(--border-color)',
              opacity: isAnimating ? 0 : 1,
              transform: isAnimating ? 'translateY(8px)' : 'translateY(0)',
            }}
          >
            <div className="absolute top-4 left-6 text-6xl font-serif opacity-10" style={{ color: 'var(--accent)' }}>"</div>
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6 relative z-10" style={{ color: 'var(--text-primary)' }}>
              {currentQuote.text}
            </p>
            <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: 'var(--accent)' }}>
              — {currentQuote.author}
            </p>
            <span
              className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: 'var(--accent)' + '20', color: 'var(--accent)' }}
            >
              {currentQuote.category}
            </span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => toggleFavorite(currentQuote.text)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: isFav ? '#ef444420' : 'var(--bg-tertiary)',
                color: isFav ? '#ef4444' : 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >
              <FiHeart size={18} fill={isFav ? '#ef4444' : 'none'} />
            </button>
            <button
              onClick={nextQuote}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <FiRefreshCw size={18} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ title: 'Frase motivacional', text: `"${currentQuote.text}" — ${currentQuote.author}` })
                else navigator.clipboard?.writeText(`"${currentQuote.text}" — ${currentQuote.author}`)
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}
            >
              <FiShare2 size={18} />
            </button>
          </div>

          {history.length > 1 && (
            <div className="p-4 rounded-xl glass" style={{ border: '1px solid var(--border-color)' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Historial reciente</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {history.slice(1, 8).map((text, i) => {
                  const q = quotes.find((x) => x.text === text)
                  if (!q) return null
                  return (
                    <div key={i} className="flex items-center gap-2 text-xs py-1.5" style={{ color: 'var(--text-secondary)' }}>
                      <FiBookmark size={10} style={{ color: 'var(--accent)' }} />
                      <span className="truncate flex-1">{q.text}</span>
                      <span style={{ color: 'var(--text-muted)' }}>— {q.author}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'browse' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: category === cat ? 'var(--accent)' : 'var(--bg-tertiary)',
                  color: category === cat ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${category === cat ? 'var(--accent)' : 'var(--border-color)'}`,
                }}
              >
                {cat} ({cat === 'todas' ? quotes.length : quotes.filter((q) => q.category === cat).length})
              </button>
            ))}
          </div>

          <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
            {filteredQuotes.map((q, i) => (
              <div
                key={i}
                className="p-4 rounded-xl glass transition-all hover:scale-[1.005] cursor-pointer"
                style={{ border: '1px solid var(--border-color)' }}
                onClick={() => toggleFavorite(q.text)}
              >
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>"{q.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--accent)' }}>— {q.author}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}
                    >
                      {q.category}
                    </span>
                    <FiHeart
                      size={14}
                      fill={favorites.includes(q.text) ? '#ef4444' : 'none'}
                      style={{ color: favorites.includes(q.text) ? '#ef4444' : 'var(--text-muted)' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
