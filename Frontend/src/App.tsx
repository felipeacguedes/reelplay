import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import FilterPanel from './components/FilterPanel'
import MovieCard from './components/MovieCard'
import Header from './components/Header.tsx'
import WatchlistPage from './pages/WatchlistPage.tsx'
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
  yearFrom: string
  yearTo: string
  minRating: string
}

export interface AuthUser {
  id: string
  name: string | null
}

const API = 'http://localhost:3333'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('reelplay_token')
    const savedUser = localStorage.getItem('reelplay_user')
    if (savedToken && savedUser && savedUser !== 'undefined') {
      setToken(savedToken)
      setUser(JSON.parse(savedUser) as AuthUser)
    }
  }, [])

  async function login(username: string) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    })
    const data = await res.json() as { token: string; user: AuthUser }
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('reelplay_token', data.token)
    localStorage.setItem('reelplay_user', JSON.stringify(data.user))
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('reelplay_token')
    localStorage.removeItem('reelplay_user')
  }

  return { user, token, login, logout }
}

export { API }

function HomePage({ user, token }: { user: AuthUser | null; token: string | null }) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<Filters>({
    genres: '',
    yearFrom: '1990',
    yearTo: '2024',
    minRating: '6',
  })

  async function fetchRandomMovie() {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (filters.genres) params.append('genres', filters.genres)
    if (filters.yearFrom) params.append('yearFrom', filters.yearFrom)
    if (filters.yearTo) params.append('yearTo', filters.yearTo)
    if (filters.minRating) params.append('minRating', filters.minRating)

    try {
      const res = await fetch(`${API}/random?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }
      const data = await res.json() as Movie
      setMovie(data)

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

  return (
    <main className="main">
      <FilterPanel filters={filters} onChange={setFilters} />

      <button
        className="spin-btn"
        onClick={fetchRandomMovie}
        disabled={loading}
      >
        {loading ? 'Sorteando...' : '🎲 Sortear filme'}
      </button>

      {error && <p className="error">{error}</p>}

      {movie && !loading && (
        <MovieCard movie={movie}>
          {user && (
            <button className="watchlist-btn" onClick={addToWatchlist}>
              + Watchlist
            </button>
          )}
        </MovieCard>
      )}
    </main>
  )
}

function App() {
  const auth = useAuth()

  return (
    <div className="app">
      <Header user={auth.user} token={auth.token} login={auth.login} logout={auth.logout} />
      <Routes>
        <Route path="/" element={<HomePage user={auth.user} token={auth.token} />} />
        <Route path="/watchlist" element={<WatchlistPage token={auth.token} />} />
      </Routes>
    </div>
  )
}

export default App