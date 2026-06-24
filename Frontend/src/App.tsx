import { useState } from 'react'
import FilterPanel from './components/FilterPanel'
import MovieCard from './components/MovieCard'
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

function App() {
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
      const res = await fetch(`http://localhost:3333/random?${params.toString()}`)
      if (!res.ok) {
        const data = await res.json() as { error: string }
        throw new Error(data.error)
      }
      const data = await res.json() as Movie
      setMovie(data)

      // Salva no histórico se estiver logado
      const token = await getToken()
      if (token) {
        await fetch('http://localhost:3333/history', {
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
    if (!movie) return
    const token = await getToken()
    if (!token) return

    try {
      const res = await fetch('http://localhost:3333/watchlist', {
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
    <div className="app">
      <header className="header">
        <div className="header-top">
          <h1 className="logo">🎬 Reelplay</h1>
          <div className="auth-area">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="auth-btn">Entrar</button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
        <p className="tagline">Seu próximo filme favorito, sorteado.</p>
      </header>

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
            <Show when="signed-in">
              <button className="watchlist-btn" onClick={addToWatchlist}>
                + Watchlist
              </button>
            </Show>
          </MovieCard>
        )}
      </main>
    </div>
  )
}

export default App
