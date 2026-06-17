import type { Movie } from '../App'

interface Props {
  movie: Movie
}

const POSTER_BASE = 'https://image.tmdb.org/t/p/w342'

function MovieCard({ movie }: Props) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '—'

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
          {movie.overview || 'Sinopse não disponível.'}
        </p>

        <a
          className="movie-link"
          href={`https://www.themoviedb.org/movie/${movie.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver no TMDB →
        </a>
      </div>
    </div>
  )
}

export default MovieCard
