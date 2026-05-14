import { useState } from 'react'
import useCharacters from '../hooks/useCharacters.js'
import CharacterCard from '../components/CharacterCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './FilterPage.css'

/*
  FilterPage.jsx — Página de filtrado por especie

  Muestra un selector de especies. Cuando el usuario elige una,
  construye dinámicamente la URL de la API con el parámetro de especie
  y la pasa al hook useCharacters para hacer el fetch.

  La API de Rick & Morty soporta filtrado por query string:
    https://rickandmortyapi.com/api/character/?species=Human
    https://rickandmortyapi.com/api/character/?species=Alien
  
  Ruta en la app: /filter
*/

// Lista de especies disponibles para el filtro
// Definida fuera del componente: es una constante que nunca cambia,
// no necesita estar dentro del componente ni en el estado.
const SPECIES_OPTIONS = [
  { value: 'Human',                label: '🧑 Humano' },
  { value: 'Alien',                label: '👽 Alienígena' },
  { value: 'Robot',                label: '🤖 Robot' },
  { value: 'Mythological Creature',label: '🐉 Criatura Mitológica' },
  { value: 'Animal',               label: '🐾 Animal' },
  { value: 'Humanoid',             label: '🧬 Humanoide' },
  { value: 'Cronenberg',           label: '🦠 Cronenberg' },
  { value: 'unknown',              label: '❓ Desconocido' },
]

const API_BASE = 'https://rickandmortyapi.com/api/character'

function FilterPage() {
  /*
    Estado local para la especie seleccionada.
    Inicia en 'Human' para que la página no esté vacía al cargar.
  */
  const [selectedSpecies, setSelectedSpecies] = useState('Human')

  /*
    Construimos la URL dinámicamente usando template literals (ES6).
    Cada vez que selectedSpecies cambie, esta URL cambia,
    y useCharacters detecta ese cambio (está en su array [url])
    y lanza un nuevo fetch automáticamente.

    encodeURIComponent es necesario para "Mythological Creature"
    porque el espacio se codifica como %20 en una URL.
  */
  const apiUrl = `${API_BASE}/?species=${encodeURIComponent(selectedSpecies)}`

  const { characters, loading, error } = useCharacters(apiUrl)

  // Manejador del cambio del selector
  // e.target.value contiene el value de la <option> seleccionada
  function handleSpeciesChange(e) {
    setSelectedSpecies(e.target.value)
  }

  return (
    <section className="filter-page">
      {/* Encabezado con selector */}
      <div className="filter-page__header">
        <h1 className="filter-page__title">Filtrar por especie</h1>

        <div className="filter-page__controls">
          {/*
            <select> HTML nativo + onChange de React.
            value={selectedSpecies} lo hace un "controlled component":
            React controla su valor (en lugar del DOM), lo que mantiene
            el estado sincronizado con la UI de manera predecible.
          */}
          <select
            className="filter-page__select"
            value={selectedSpecies}
            onChange={handleSpeciesChange}
            aria-label="Seleccionar especie"
          >
            {/*
              Mapeamos el array de especies a elementos <option>.
              key es obligatorio en listas; usamos value como clave única.
            */}
            {SPECIES_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Contador de resultados (solo visible cuando no está cargando) */}
          {!loading && !error && (
            <span className="filter-page__count">
              {characters.length} personaje{characters.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Botones rápidos de especies populares */}
      <div className="filter-page__quickfilters">
        {SPECIES_OPTIONS.map(opt => (
          <button
            key={opt.value}
            className={`quickfilter-btn ${selectedSpecies === opt.value ? 'quickfilter-btn--active' : ''}`}
            onClick={() => setSelectedSpecies(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Renderizado condicional ── */}
      {loading && <LoadingSpinner />}

      {error && (
        <div className="error-banner">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <div className="filter-page__empty">
          <p>No se encontraron personajes de especie <strong>{selectedSpecies}</strong>.</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <div className="characters-grid">
          {characters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </section>
  )
}

export default FilterPage
