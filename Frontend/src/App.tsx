import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { Dices, Clapperboard, Plus, ChevronDown } from 'lucide-react'
import { apiFetch, onUnauthorized } from './api'
import FilterPanel from './components/FilterPanel'
import MovieCard from './components/MovieCard'
import Header from './components/Header'
import Toast, { showToast } from './components/Toast'
import WatchlistPage from './pages/WatchlistPage'
import LoginPage from './pages/LoginPage'
import './App.css'

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
}

export interface Filters {
  genres: string
  decade: string
  minRating: string
}

export interface AuthUser {
  id: string
  name: string | null
}

export const API = import.meta.env.VITE_API_URL || ''

function HomePage({ user, token, onMovieChange }: { user: AuthUser | null; token: string | null; onMovieChange: (v: boolean) => void }) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pullDist, setPullDist] = useState(0)
  const [snapping, setSnapping] = useState(false)
  const touchRef = useRef({ startY: 0, pulling: false, dist: 0 })

  function handleTouchStart(e: React.TouchEvent) {
    if (window.scrollY > 0 || loading) return
    touchRef.current.startY = e.touches[0].clientY
    touchRef.current.pulling = true
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchRef.current.pulling || loading) return
    const dist = Math.min((e.touches[0].clientY - touchRef.current.startY) * 0.4, 100)
    if (dist > 0) {
      touchRef.current.dist = dist
      setPullDist(dist)
    }
  }

  function handleTouchEnd() {
    if (touchRef.current.pulling && touchRef.current.dist >= 60) {
      setSnapping(true)
      setPullDist(0)
      setTimeout(() => {
        setSnapping(false)
        fetchRandomMovie()
      }, 300)
    } else {
      setSnapping(true)
      setPullDist(0)
      setTimeout(() => setSnapping(false), 300)
    }
    touchRef.current.pulling = false
    touchRef.current.dist = 0
  }

  const [filters, setFilters] = useState<Filters>({
    genres: '',
    decade: '',
    minRating: '',
  })

  const hasMovie = movie && !loading

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.code === 'Space' && !loading) {
        e.preventDefault()
        fetchRandomMovie()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [loading])

  async function fetchRandomMovie() {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (filters.genres) params.append('genres', filters.genres)
    if (filters.decade) {
      const from = filters.decade
      const to = String(Number(filters.decade) + 9)
      params.append('yearFrom', from)
      params.append('yearTo', to)
    }
    if (filters.minRating) params.append('minRating', filters.minRating)

    try {
      const res = await fetch(`${API}/random?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }
      const data = await res.json() as Movie
      setMovie(data)
      onMovieChange(true)

      if (token) {
        await apiFetch(`${API}/history`, {
          method: 'POST',
          token,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tmdbId: data.id,
            title: data.title,
            posterPath: data.poster_path,
          }),
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  async function addToWatchlist() {
    if (!movie || !token) return

    try {
      const res = await apiFetch(`${API}/watchlist`, {
        method: 'POST',
        token,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      })

      if (res.status === 409) {
        showToast('Filme já está na sua watchlist.', 'error')
        return
      }

      showToast('Adicionado à watchlist!')
    } catch {
      showToast('Erro ao adicionar à watchlist.', 'error')
    }
  }

  const [showFilters, setShowFilters] = useState(false)

  return (
    <main
      className={`main ${!hasMovie ? 'main--empty' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`pull-indicator ${pullDist > 0 || snapping ? 'pull-indicator--visible' : ''} ${pullDist >= 60 ? 'pull-indicator--ready' : ''} ${snapping ? 'pull-indicator--snap' : ''}`}
        style={{ transform: `translateX(-50%) translateY(${pullDist - 40}px) scale(${pullDist > 0 || snapping ? 1 : 0.9})` }}
      >
        ↓ Puxe para sortear
      </div>
      {error && <p className="error">{error}</p>}

      {hasMovie && (
        <MovieCard movie={movie}>
          {user && (
            <button className="watchlist-btn" onClick={addToWatchlist}>
              <Plus size={16} /> Watchlist
            </button>
          )}
        </MovieCard>
      )}

      {!hasMovie && (
        <Link to="/" className="logo-link">
          <h1 className="logo logo--center"><Clapperboard size={40} /> Reelplay</h1>
        </Link>
      )}

      <button
        className="spin-btn"
        onClick={fetchRandomMovie}
        disabled={loading}
      >
        {loading ? 'Sorteando...' : <><Dices size={20} /> Sortear filme</>}
      </button>
      <span className="spin-hint spin-hint--space">(Space)</span>
      <span className="spin-hint spin-hint--pull">(↓ Puxe)</span>

      <button
        className="filters-toggle"
        onClick={() => setShowFilters((v) => !v)}
      >
        Filtros
        <ChevronDown
          size={16}
          className={`chevron ${showFilters ? 'chevron--up' : ''}`}
        />
      </button>

      <div className={`filters-wrapper ${showFilters ? 'filters-wrapper--open' : ''}`}>
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>
    </main>
  )
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [hasMovie, setHasMovie] = useState(false)
  const [homeKey, setHomeKey] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const savedToken = localStorage.getItem('reelplay_token')
    const savedUser = localStorage.getItem('reelplay_user')
    if (savedToken && savedUser && savedUser !== 'undefined') {
      setToken(savedToken)
      setUser(JSON.parse(savedUser) as AuthUser)
    }
  }, [])

  useEffect(() => {
    return onUnauthorized(() => {
      setUser(null)
      setToken(null)
      localStorage.removeItem('reelplay_token')
      localStorage.removeItem('reelplay_user')
      showToast('Sessão expirada. Faça login novamente.', 'error')
      navigate('/login')
    })
  }, [navigate])

  function handleLogin(newUser: AuthUser, newToken: string) {
    setUser(newUser)
    setToken(newToken)
    localStorage.setItem('reelplay_token', newToken)
    localStorage.setItem('reelplay_user', JSON.stringify(newUser))
  }

  function handleLogout() {
    setUser(null)
    setToken(null)
    localStorage.removeItem('reelplay_token')
    localStorage.removeItem('reelplay_user')
  }

  function handleGoHome() {
    setHasMovie(false)
    setHomeKey((k) => k + 1)
    navigate('/')
  }

  return (
    <div className="app">
      <Toast />
      <Header user={user} token={token} logout={handleLogout} hasMovie={hasMovie} onHome={handleGoHome} />
      <Routes>
        <Route path="/" element={<HomePage key={homeKey} user={user} token={token} onMovieChange={setHasMovie} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/watchlist" element={<WatchlistPage token={token} />} />
      </Routes>
    </div>
  )
}

export default App