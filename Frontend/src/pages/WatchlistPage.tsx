import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clapperboard, Bookmark, Trash2 } from 'lucide-react'
import { API } from '../App'
import { showToast } from '../components/Toast'

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
      showToast('Removido da watchlist.')
    } catch {
      showToast('Erro ao remover da watchlist.', 'error')
    }
  }

  if (loading) return <main className="main"><p className="tagline">Carregando...</p></main>

  return (
    <main className="main">
      <h2 className="section-title"><Bookmark size={20} /> Minha Watchlist</h2>

      {watchlist.length === 0 ? (
        <p className="empty-msg">Sua watchlist está vazia. Sorteie alguns filmes!</p>
      ) : (
        <div className="shelf-grid">
          {watchlist.map((entry) => (
            <div key={entry.id} className="shelf-item">
              <a
                href={`https://www.themoviedb.org/movie/${entry.tmdbId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shelf-poster-link"
              >
                {entry.posterPath ? (
                  <img
                    src={`${POSTER_BASE}${entry.posterPath}`}
                    alt={entry.title}
                    className="shelf-poster"
                    loading="lazy"
                  />
                ) : (
                  <div className="shelf-poster-placeholder"><Clapperboard size={24} /></div>
                )}
              </a>
              <p className="shelf-title">{entry.title}</p>
              <button
                className="shelf-remove"
                onClick={() => removeFromWatchlist(entry.tmdbId)}
                title="Remover"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}

export default WatchlistPage
