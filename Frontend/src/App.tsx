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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">🎬</h1>
      </header>

      <main className="main">
        {/* Props cast to any to match FilterPanel props shape in external file */}
        <FilterPanel {...({ filters, onChange: setFilters } as any)} />

        <button
          className="spin-btn"
          onClick={fetchRandomMovie}
          disabled={loading}
        >
          {loading ? 'Sorteando...' : '🎲 Sortear filme'}
        </button>

        {error && <p className="error">{error}</p>}

        {movie && !loading && <MovieCard movie={movie} />}
      </main>
    </div>
  )
}

export default App
