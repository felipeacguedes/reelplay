import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Movie } from '../App'

interface Props {
  movie: Movie
  children?: ReactNode
}

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500'
const MAX_LENGTH = 150

function MovieCard({ movie, children }: Props) {
  const [expanded, setExpanded] = useState(false)
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—'
  const overview = movie.overview || 'Sinopse não disponível.'
  const isLong = overview.length > MAX_LENGTH
  const displayText = expanded || !isLong ? overview : overview.slice(0, MAX_LENGTH).trimEnd() + '…'

  return (
    <div className="movie-card">
      {movie.poster_path ? (
        <img
          className="movie-poster"
          src={`${POSTER_BASE}${movie.poster_path}`}
          alt={`Poster de ${movie.title}`}
        />
      ) : (
        <div className="movie-poster-placeholder">🎬</div>
      )}

      <div className="movie-info">
        <h2 className="movie-title">{movie.title}</h2>

        <div className="movie-meta">
          <span>📅 {year}</span>
          <span className="movie-rating">⭐ {rating}</span>
          <span>🗳️ {movie.vote_count.toLocaleString()} votos</span>
        </div>

        <p className="movie-overview">
          {displayText}
        </p>

        {isLong && (
          <button className="read-more-btn" onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'Mostrar menos' : 'Ler mais'}
          </button>
        )}

        <div className="movie-actions">
          <a
            className="movie-link"
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver no TMDB →
          </a>
          {children}
        </div>
      </div>
    </div>
  )
}

export default MovieCard
