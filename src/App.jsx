import { useState, useMemo, useEffect } from 'react'
import './App.css'

// ── Traducciones ──────────────────────────────────────────────────────────────
const STATUS_MAP = { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' }
const SPECIES_MAP = {
  Human: 'Humano', Alien: 'Alienígena', Robot: 'Robot',
  'Mythological Creature': 'Criatura Mitológica', Animal: 'Animal',
  Humanoid: 'Humanoide', Cronenberg: 'Cronenberg',
  Poopybutthole: 'Poopybutthole', Disease: 'Enfermedad',
  Planet: 'Planeta', unknown: 'Desconocido',
}
const GENDER_MAP = {
  Male: 'Masculino', Female: 'Femenino',
  Genderless: 'Sin género', unknown: 'Desconocido',
}
const t = {
  status:  s => STATUS_MAP[s]  || s,
  species: s => SPECIES_MAP[s] || s,
  gender:  g => GENDER_MAP[g]  || g,
}

// ── Fetch helper ──────────────────────────────────────────────────────────────
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

// ── useCharacters ─────────────────────────────────────────────────────────────
function useCharacters(url) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  useEffect(() => {
    async function fetchAllPages(pageUrl, acc = []) {
      const res = await fetchWithRetry(pageUrl)
      if (!res.ok) {
        if (res.status === 404) return []
        throw new Error(`Error HTTP: ${res.status}`)
      }
      const data = await res.json()
      const all  = [...acc, ...data.results]
      return data.info.next ? fetchAllPages(data.info.next, all) : all
    }

    async function load() {
      try {
        setLoading(true)
        setError(null)
        setCharacters(await fetchAllPages(url))
      } catch (err) {
        setError(err.message || 'Error al cargar los personajes')
        setCharacters([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [url])

  return { characters, loading, error }
}

// ── LoadingSpinner ────────────────────────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner">
        <div className="spinner__ring spinner__ring--outer" />
        <div className="spinner__ring spinner__ring--middle" />
        <div className="spinner__ring spinner__ring--inner" />
        <div className="spinner__core" />
      </div>
      <span className="spinner__text">Cargando...</span>
    </div>
  )
}

// ── CharacterCard ─────────────────────────────────────────────────────────────
function CharacterCard({ character, index = 0, navigate }) {
  const statusClass = {
    Alive: 'status--alive', Dead: 'status--dead', unknown: 'status--unknown',
  }[character.status] || 'status--unknown'

  return (
    <div
      className="card"
      style={{ '--i': Math.min(index, 20) }}
      onClick={() => navigate('detail', character.id)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate('detail', character.id)}
    >
      <div className="card__image-wrapper">
        <img
          src={character.image}
          alt={`Imagen de ${character.name}`}
          className="card__image"
          loading="lazy"
        />
      </div>
      <div className="card__body">
        <h3 className="card__name">{character.name}</h3>
        <span className={`card__status ${statusClass}`}>
          {t.status(character.status)}
        </span>
        <div className="card__details">
          <div className="card__detail">
            <span className="card__label">Especie</span>
            <span className="card__value">{t.species(character.species)}</span>
          </div>
          <div className="card__detail">
            <span className="card__label">Género</span>
            <span className="card__value">{t.gender(character.gender)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ view, navigate }) {
  return (
    <nav className="navbar">
      <div
        className="navbar__brand"
        onClick={() => navigate('home')}
        style={{ cursor: 'pointer' }}
      >
        <span className="navbar__portal">🌀</span>
        <span className="navbar__title">Rick & Morty</span>
        <span className="navbar__subtitle">Wiki</span>
      </div>
      <div className="navbar__nav">
        <button
          className={`navbar__link ${view === 'home' ? 'navbar__link--active' : ''}`}
          onClick={() => navigate('home')}
        >
          Personajes
        </button>
        <button
          className={`navbar__link ${view === 'filter' ? 'navbar__link--active' : ''}`}
          onClick={() => navigate('filter')}
        >
          Filtrar
        </button>
      </div>
    </nav>
  )
}

// ── HomeView ──────────────────────────────────────────────────────────────────
const API_BASE = 'https://rickandmortyapi.com/api/character'

function HomeView({ navigate }) {
  const [query, setQuery] = useState('')
  const { characters, loading, error } = useCharacters(API_BASE)

  const filtered = useMemo(() => {
    if (!query.trim()) return characters
    const q = query.toLowerCase()
    return characters.filter(c => c.name.toLowerCase().includes(q))
  }, [characters, query])

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="error-banner">
      <span className="error-banner__icon">⚠️</span>
      <p>{error}</p>
    </div>
  )

  return (
    <section className="home">
      <div className="home__header">
        <h1 className="home__title">
          Todos los personajes
          <span className="home__count"> ({filtered.length})</span>
        </h1>
        <input
          type="search"
          className="home__search"
          placeholder="🔍 Buscar personaje..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Buscar personaje por nombre"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="home__empty">
          <p>No se encontró ningún personaje con ese nombre.</p>
        </div>
      ) : (
        <div className="characters-grid">
          {filtered.map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} navigate={navigate} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── FilterView ────────────────────────────────────────────────────────────────
const SPECIES_OPTIONS = [
  { value: 'Human',                 label: '🧑 Humano' },
  { value: 'Alien',                 label: '👽 Alienígena' },
  { value: 'Robot',                 label: '🤖 Robot' },
  { value: 'Mythological Creature', label: '🐉 Criatura Mitológica' },
  { value: 'Animal',                label: '🐾 Animal' },
  { value: 'Humanoid',              label: '🧬 Humanoide' },
  { value: 'Cronenberg',            label: '🦠 Cronenberg' },
  { value: 'unknown',               label: '❓ Desconocido' },
]

function FilterView({ navigate }) {
  const [selectedSpecies, setSelectedSpecies] = useState('Human')
  const apiUrl = `${API_BASE}/?species=${encodeURIComponent(selectedSpecies)}`
  const { characters, loading, error } = useCharacters(apiUrl)

  return (
    <section className="filter-page">
      <div className="filter-page__header">
        <h1 className="filter-page__title">Filtrar por especie</h1>
        <div className="filter-page__controls">
          <select
            className="filter-page__select"
            value={selectedSpecies}
            onChange={e => setSelectedSpecies(e.target.value)}
            aria-label="Seleccionar especie"
          >
            {SPECIES_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {!loading && !error && (
            <span className="filter-page__count">
              {characters.length} personaje{characters.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

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
          {characters.map((c, i) => (
            <CharacterCard key={c.id} character={c} index={i} navigate={navigate} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── DetailView ────────────────────────────────────────────────────────────────
function DetailView({ id, navigate }) {
  const [character, setCharacter] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    async function fetchCharacter() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetchWithRetry(
          `https://rickandmortyapi.com/api/character/${id}`
        )
        if (!res.ok) throw new Error(
          res.status === 404 ? 'Personaje no encontrado' : `Error HTTP: ${res.status}`
        )
        setCharacter(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCharacter()
  }, [id])

  const STATUS_CONFIG = {
    Alive:   { color: '#00e676', label: 'Vivo' },
    Dead:    { color: '#ef5350', label: 'Muerto' },
    unknown: { color: '#9e9e9e', label: 'Desconocido' },
  }

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="detail-error">
      <p>⚠️ {error}</p>
      <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  const sc = STATUS_CONFIG[character.status] || STATUS_CONFIG.unknown

  return (
    <article className="detail">
      <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>

      <div className="detail__card">
        <div className="detail__image-wrapper">
          <img
            src={character.image}
            alt={character.name}
            className="detail__image"
          />
        </div>

        <div className="detail__info-col">
          <h1 className="detail__name">{character.name}</h1>

          <span
            className="detail__status"
            style={{ color: sc.color, borderColor: sc.color }}
          >
            {sc.label}
          </span>

          <dl className="detail__attrs">
            <DetailRow label="Especie"   value={t.species(character.species)} />
            <DetailRow label="Género"    value={t.gender(character.gender)} />
            <DetailRow label="Tipo"      value={character.type || 'N/A'} />
            <DetailRow label="Origen"    value={character.origin?.name} />
            <DetailRow label="Ubicación" value={character.location?.name} />
            <DetailRow
              label="Episodios"
              value={`Aparece en ${character.episode?.length} episodios`}
            />
          </dl>
        </div>
      </div>
    </article>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className="detail__attr-row">
      <dt className="detail__attr-label">{label}</dt>
      <dd className="detail__attr-value">{value || 'N/A'}</dd>
    </div>
  )
}

// ── NotFoundView ──────────────────────────────────────────────────────────────
function NotFoundView({ navigate }) {
  return (
    <div className="error-page">
      <div className="error-page__portal">
        <div className="error-page__portal-inner">
          <span className="error-page__code">404</span>
        </div>
      </div>
      <h1 className="error-page__title">Dimensión no encontrada</h1>
      <p className="error-page__message">
        Parece que este portal te llevó a una dimensión que no existe.
        Prueba con otra sección o vuelve al inicio.
      </p>
      <button className="error-page__btn" onClick={() => navigate('home')}>
        🏠 Volver al inicio
      </button>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [nav, setNav] = useState({ view: 'home', id: null, history: [] })

  function navigate(view, id = null) {
    if (view === -1) {
      setNav(prev => {
        if (prev.history.length === 0) return { ...prev, view: 'home', id: null }
        const history = [...prev.history]
        const last    = history.pop()
        return { view: last.view, id: last.id, history }
      })
    } else {
      setNav(prev => ({
        view,
        id,
        history: [...prev.history, { view: prev.view, id: prev.id }],
      }))
    }
  }

  const { view, id } = nav

  return (
    <div className="app-wrapper">
      <Navbar view={view} navigate={navigate} />
      <main className="main-content">
        {view === 'home'   && <HomeView   navigate={navigate} />}
        {view === 'filter' && <FilterView navigate={navigate} />}
        {view === 'detail' && <DetailView id={id} navigate={navigate} />}
        {view === '404'    && <NotFoundView navigate={navigate} />}
      </main>
    </div>
  )
}
