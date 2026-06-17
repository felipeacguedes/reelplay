import type { Filters } from '../App'

const GENRES = [
  { id: '28', name: 'Ação' },
  { id: '12', name: 'Aventura' },
  { id: '16', name: 'Animação' },
  { id: '35', name: 'Comédia' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentário' },
  { id: '18', name: 'Drama' },
  { id: '14', name: 'Fantasia' },
  { id: '27', name: 'Terror' },
  { id: '9648', name: 'Mistério' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Ficção Científica' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'Guerra' },
  { id: '37', name: 'Faroeste' },
]

interface Props {
  filters: Filters
  onChange: (filters: Filters) => void
}

function FilterPanel({ filters, onChange }: Props) {
  function update(field: keyof Filters, value: string) {
    onChange({ ...filters, [field]: value })
  }

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="genre">Gênero</label>
        <select
          id="genre"
          value={filters.genres}
          onChange={(e) => update('genres', e.target.value)}
        >
          <option value="">Qualquer</option>
          {GENRES.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="minRating">Nota mínima</label>
        <select
          id="minRating"
          value={filters.minRating}
          onChange={(e) => update('minRating', e.target.value)}
        >
          <option value="">Qualquer</option>
          <option value="5">5+</option>
          <option value="6">6+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="yearFrom">Ano (de)</label>
        <input
          id="yearFrom"
          type="number"
          min="1900"
          max="2025"
          value={filters.yearFrom}
          onChange={(e) => update('yearFrom', e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="yearTo">Ano (até)</label>
        <input
          id="yearTo"
          type="number"
          min="1900"
          max="2025"
          value={filters.yearTo}
          onChange={(e) => update('yearTo', e.target.value)}
        />
      </div>
    </div>
  )
}

export default FilterPanel