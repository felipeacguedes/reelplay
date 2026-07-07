import { Star } from 'lucide-react'
import type { Filters } from '../App'
import Select from './Select'

const GENRES = [
  { value: '', label: 'Qualquer' },
  { value: '28', label: 'Ação' },
  { value: '12', label: 'Aventura' },
  { value: '16', label: 'Animação' },
  { value: '35', label: 'Comédia' },
  { value: '80', label: 'Crime' },
  { value: '99', label: 'Documentário' },
  { value: '18', label: 'Drama' },
  { value: '14', label: 'Fantasia' },
  { value: '27', label: 'Terror' },
  { value: '9648', label: 'Mistério' },
  { value: '10749', label: 'Romance' },
  { value: '878', label: 'Ficção Científica' },
  { value: '53', label: 'Thriller' },
  { value: '10752', label: 'Guerra' },
  { value: '37', label: 'Faroeste' },
]

const RATINGS = [
  { value: '', label: 'Qualquer' },
  { value: '5', label: '5+' },
  { value: '6', label: '6+' },
  { value: '7', label: '7+' },
  { value: '8', label: '8+' },
]

const DECADES = [
  { value: '', label: 'Qualquer' },
  { value: '1930', label: "30's" },
  { value: '1940', label: "40's" },
  { value: '1950', label: "50's" },
  { value: '1960', label: "60's" },
  { value: '1970', label: "70's" },
  { value: '1980', label: "80's" },
  { value: '1990', label: "90's" },
  { value: '2000', label: '2000s' },
  { value: '2010', label: '2010s' },
  { value: '2020', label: '2020s' },
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
        <label>Gênero</label>
        <Select
          value={filters.genres}
          options={GENRES}
          onChange={(v) => update('genres', v)}
          placeholder="Selecionar"
        />
      </div>

      <div className="filter-group">
        <label>Nota mínima</label>
        <Select
          value={filters.minRating}
          options={RATINGS}
          onChange={(v) => update('minRating', v)}
          placeholder="Selecionar"
          renderValue={(label) => {
            if (label === 'Qualquer') return label
            const n = Number(label.replace('+', ''))
            return <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Star size={14} fill="#f5c518" color="#f5c518" /> {n}+</span>
          }}
          renderOption={(opt, selected) => {
            if (opt.value === '') return <>{opt.label}</>
            const n = Number(opt.label.replace('+', ''))
            return (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} fill={selected ? '#f5c518' : 'transparent'} color={selected ? '#f5c518' : '#555'} />
                {n}+
              </span>
            )
          }}
        />
      </div>

      <div className="filter-group">
        <label>Década</label>
        <Select
          value={filters.decade}
          options={DECADES}
          onChange={(v) => update('decade', v)}
          placeholder="Selecionar"
        />
      </div>
    </div>
  )
}

export default FilterPanel