import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../App'

interface WatchlistEntry {
  id: string
  tmdbId: number
  title: string
  posterPath: string | null
  addedAt: string
}

const POSTER_BASE = 'https://image.tmdb.org/t/p/w185'

interface Props {
  token: string | null
}

function WatchlistPage({ token }: Props) {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate('/')
      return
    }
    fetchWatchlist()
  }, [token])

  async function fetchWatchlist() {
    try {
      const res = await fetch(`${API}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json() as WatchlistEntry[]
      setWatchlist(data)
    } catch {
      console.error('Erro ao carregar watchlist.')
    } finally {
      setLoading(false)
    }
  }

  async function removeFromWatchlist(tmdbId: number) {
    try {
      await fetch(`${API}/watchlist/${tmdbId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setWatchlist((prev) => prev.filter((e) => e.tmdbId !== tmdbId))
    } catch {
      alert('Erro ao remover da watchlist.')
    }
  }

  if (loading) return <main className="main"><p className="tagline">Carregando...</p></main>

  return (
    <main className="main">
      <h2 className="section-title">📋 Minha Watchlist</h2>

      {watchlist.length === 0 ? (
        <p className="empty-msg">Sua watchlist está vazia. Sorteie alguns filmes!</p>
      ) : (
        <div className="watchlist-grid">
          {watchlist.map((entry) => (
            <div key={entry.id} className="watchlist-item">
              {entry.posterPath ? (
                <img
                  src={`${POSTER_BASE}${entry.posterPath}`}
                  alt={entry.title}
                  className="watchlist-poster"
                />
              ) : (
                <div className="watchlist-poster-placeholder">🎬</div>
              )}
              <div className="watchlist-info">
                <p className="watchlist-title">{entry.title}</p>
                <a
                  href={`https://www.themoviedb.org/movie/${entry.tmdbId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-link"
                >
                  Ver no TMDB →
                </a>
                <button
                  className="remove-btn"
                  onClick={() => removeFromWatchlist(entry.tmdbId)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default WatchlistPage