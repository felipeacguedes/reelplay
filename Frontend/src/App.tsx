import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Link } from 'react-router-dom'
import { Dices, Clapperboard, Plus, ChevronDown } from 'lucide-react'
import FilterPanel from './components/FilterPanel'
import MovieCard from './components/MovieCard'
import Header from './components/Header'
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

export const API = 'http://localhost:3333'

function HomePage({ user, token, onMovieChange }: { user: AuthUser | null; token: string | null; onMovieChange: (v: boolean) => void }) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    genres: '',
    decade: '',
    minRating: '6',
  })

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
        await fetch(`${API}/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
      const res = await fetch(`${API}/watchlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tmdbId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      })

      if (res.status === 409) {
        alert('Filme já está na sua watchlist.')
        return
      }

      alert('Adicionado à watchlist!')
    } catch {
      alert('Erro ao adicionar à watchlist.')
    }
  }

  const hasMovie = movie && !loading
  const [showFilters, setShowFilters] = useState(false)

  return (
    <main className={`main ${!hasMovie ? 'main--empty' : ''}`}>
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
          <h1 className="logo"><Clapperboard size={40} /> Reelplay</h1>
        </Link>
      )}

      <button
        className="spin-btn"
        onClick={fetchRandomMovie}
        disabled={loading}
      >
        {loading ? 'Sorteando...' : <><Dices size={20} /> Sortear filme</>}
      </button>

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

      {showFilters && (
        <FilterPanel filters={filters} onChange={setFilters} />
      )}
    </main>
  )
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [hasMovie, setHasMovie] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const savedToken = localStorage.getItem('reelplay_token')
    const savedUser = localStorage.getItem('reelplay_user')
    if (savedToken && savedUser && savedUser !== 'undefined') {
      setToken(savedToken)
      setUser(JSON.parse(savedUser) as AuthUser)
    }
  }, [])

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
    navigate('/')
  }

  return (
    <div className="app">
      <Header user={user} token={token} logout={handleLogout} hasMovie={hasMovie} onHome={handleGoHome} />
      <Routes>
        <Route path="/" element={<HomePage user={user} token={token} onMovieChange={setHasMovie} />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/watchlist" element={<WatchlistPage token={token} />} />
      </Routes>
    </div>
  )
}

export default App