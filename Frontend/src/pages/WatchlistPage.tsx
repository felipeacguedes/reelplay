import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clapperboard, Star } from 'lucide-react'
import { API } from '../App'
import { showToast } from '../components/Toast'

interface WatchlistEntry {
  id: string
  tmdbId: number
  title: string
  posterPath: string | null
  voteAverage: number | null
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

  if (loading) return <main className="main"><p className="tagline">Carregando...</p></main>

  return (
    <main className="main">
      <h2 className="section-title"><Clapperboard size={20} /> Minha Watchlist</h2>

      {watchlist.length === 0 ? (
        <p className="empty-msg">Sua watchlist está vazia. Sorteie alguns filmes!</p>
      ) : (
        <div className="shelf-grid">
          {watchlist.map((entry) => (
            <a
              key={entry.id}
              className="shelf-item"
              href={`https://www.themoviedb.org/movie/${entry.tmdbId}`}
              target="_blank"
              rel="noopener noreferrer"
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
              <p className="shelf-title">{entry.title}</p>
              {entry.voteAverage && (
                <span className="shelf-rating"><Star size={10} fill="#f5c518" color="#f5c518" /> {entry.voteAverage.toFixed(1)}</span>
              )}
            </a>
          ))}
        </div>
      )}
    </main>
  )
}

export default WatchlistPage
