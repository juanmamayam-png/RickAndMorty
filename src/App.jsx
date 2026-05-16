import { useState, useMemo, useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { animate, stagger } from 'animejs'
import 'animate.css'
import './App.css'

// ── Traducciones ──────────────────────────────────────────────────────────────
const STATUS_MAP  = { Alive: 'Vivo', Dead: 'Muerto', unknown: 'Desconocido' }
const SPECIES_MAP = {
  Human: 'Humano', Alien: 'Alienígena', Robot: 'Robot',
  'Mythological Creature': 'Criatura Mitológica', Animal: 'Animal',
  Humanoid: 'Humanoide', Cronenberg: 'Cronenberg',
  Poopybutthole: 'Poopybutthole', Disease: 'Enfermedad',
  Planet: 'Planeta', unknown: 'Desconocido',
}
const GENDER_MAP  = {
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

// ── useGridEntrance — anime.js stagger for card grids ─────────────────────────
function useGridEntrance(gridRef, trigger) {
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('.card')
    if (!cards.length) return
    animate(cards, {
      opacity:    [0, 1],
      translateY: [32, 0],
      scale:      [0.94, 1],
      delay:      stagger(45),
      duration:   480,
      ease:       'outBack(1.1)',
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])
}

// ── useCountUp — anime.js number counter ──────────────────────────────────────
function useCountUp(ref, target) {
  useEffect(() => {
    if (!ref.current || !target) return
    const obj = { n: 0 }
    animate(obj, {
      n:        target,
      duration: 900,
      ease:     'outExpo',
      onUpdate: () => {
        if (ref.current) ref.current.textContent = Math.round(obj.n)
      },
    })
  }, [target])
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
function CharacterCard({ character }) {
  const navigate = useNavigate()
  const statusClass = {
    Alive: 'status--alive', Dead: 'status--dead', unknown: 'status--unknown',
  }[character.status] || 'status--unknown'

  return (
    <div
      className="card"
      onClick={() => navigate(`/character/${character.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/character/${character.id}`)}
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
function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="navbar animate__animated animate__slideInDown">
      <div
        className="navbar__brand"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        <span className="navbar__portal">🌀</span>
        <span className="navbar__title">Rick & Morty</span>
        <span className="navbar__subtitle">Wiki</span>
      </div>
      <div className="navbar__nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `navbar__link${isActive ? ' navbar__link--active' : ''}`
          }
        >
          Personajes
        </NavLink>
        <NavLink
          to="/filter"
          className={({ isActive }) =>
            `navbar__link${isActive ? ' navbar__link--active' : ''}`
          }
        >
          Filtrar
        </NavLink>
      </div>
    </nav>
  )
}

// ── HomeView ──────────────────────────────────────────────────────────────────
const API_BASE = 'https://rickandmortyapi.com/api/character'

function HomeView() {
  const [query, setQuery] = useState('')
  const { characters, loading, error } = useCharacters(API_BASE)
  const gridRef  = useRef(null)
  const countRef = useRef(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return characters
    const q = query.toLowerCase()
    return characters.filter(c => c.name.toLowerCase().includes(q))
  }, [characters, query])

  useGridEntrance(gridRef, filtered)
  useCountUp(countRef, filtered.length)

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="error-banner">
      <span className="error-banner__icon">⚠️</span>
      <p>{error}</p>
    </div>
  )

  return (
    <section className="home animate__animated animate__fadeIn">
      <div className="home__header">
        <h1 className="home__title animate__animated animate__slideInLeft">
          Todos los personajes
          <span className="home__count"> (<span ref={countRef}>0</span>)</span>
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
        <div className="characters-grid" ref={gridRef}>
          {filtered.map(c => (
            <CharacterCard key={c.id} character={c} />
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

function FilterView() {
  const [selectedSpecies, setSelectedSpecies] = useState('Human')
  const apiUrl = `${API_BASE}/?species=${encodeURIComponent(selectedSpecies)}`
  const { characters, loading, error } = useCharacters(apiUrl)
  const gridRef = useRef(null)

  useGridEntrance(gridRef, characters)

  return (
    <section className="filter-page animate__animated animate__fadeIn">
      <div className="filter-page__header">
        <h1 className="filter-page__title animate__animated animate__slideInLeft">Filtrar por especie</h1>
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
        <div className="characters-grid" ref={gridRef}>
          {characters.map(c => (
            <CharacterCard key={c.id} character={c} />
          ))}
        </div>
      )}
    </section>
  )
}

// ── DetailView ────────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Alive:   { color: '#00e676', label: 'Vivo' },
  Dead:    { color: '#ef5350', label: 'Muerto' },
  unknown: { color: '#9e9e9e', label: 'Desconocido' },
}

function DetailView() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [character, setCharacter] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const attrsRef = useRef(null)

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

  useEffect(() => {
    if (!attrsRef.current || !character) return
    animate(attrsRef.current.querySelectorAll('.detail__attr-row'), {
      translateX: ['-18px', '0px'],
      opacity:    [0, 1],
      delay:      stagger(75),
      duration:   380,
      ease:       'outCubic',
    })
  }, [character])

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="detail-error">
      <p>⚠️ {error}</p>
      <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  const sc = STATUS_CONFIG[character.status] || STATUS_CONFIG.unknown

  return (
    <article className="detail animate__animated animate__fadeIn">
      <button className="btn-back animate__animated animate__slideInLeft" onClick={() => navigate(-1)}>← Volver</button>

      <div className="detail__card animate__animated animate__zoomIn" style={{ animationDelay: '0.1s' }}>
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

          <dl className="detail__attrs" ref={attrsRef}>
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
function NotFoundView() {
  const navigate = useNavigate()
  return (
    <div className="error-page animate__animated animate__fadeInUp">
      <div className="error-page__portal animate__animated animate__rotateIn" style={{ animationDelay: '0.2s' }}>
        <div className="error-page__portal-inner">
          <span className="error-page__code">404</span>
        </div>
      </div>
      <h1 className="error-page__title">Dimensión no encontrada</h1>
      <p className="error-page__message">
        Parece que este portal te llevó a una dimensión que no existe.
        Prueba con otra sección o vuelve al inicio.
      </p>
      <button className="error-page__btn" onClick={() => navigate('/')}>
        🏠 Volver al inicio
      </button>
    </div>
  )
}

// ── BackgroundEffects ─────────────────────────────────────────────────────────
const PORTALS = [
  { size: 320, top: '8%',  left: '-6%',  duration: 18, delay: 0,  opacity: 0.18 },
  { size: 200, top: '55%', right: '-4%', duration: 24, delay: 4,  opacity: 0.13 },
  { size: 140, top: '75%', left: '15%',  duration: 14, delay: 2,  opacity: 0.10 },
  { size: 260, top: '20%', right: '8%',  duration: 20, delay: 7,  opacity: 0.12 },
  { size: 100, top: '40%', left: '45%',  duration: 12, delay: 10, opacity: 0.08 },
]

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id:       i,
  size:     2 + (i * 7.3 % 3),
  top:      `${(i * 13.7) % 100}%`,
  left:     `${(i * 19.3) % 100}%`,
  duration: 6 + (i * 3.7 % 14),
  delay:    (i * 2.3) % 10,
  drift:    ((i % 7) - 3) * 20,
}))

function BackgroundEffects() {
  return (
    <div className="bg-effects" aria-hidden="true">
      {PORTALS.map((p, i) => (
        <div
          key={i}
          className="bg-portal"
          style={{
            width:    p.size,
            height:   p.size,
            top:      p.top,
            left:     p.left  ?? 'unset',
            right:    p.right ?? 'unset',
            opacity:  p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        >
          <div className="bg-portal__ring bg-portal__ring--1" />
          <div className="bg-portal__ring bg-portal__ring--2" />
          <div className="bg-portal__ring bg-portal__ring--3" />
          <div className="bg-portal__core" />
        </div>
      ))}

      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="bg-particle"
          style={{
            width:    p.size,
            height:   p.size,
            top:      p.top,
            left:     p.left,
            '--drift': `${p.drift}px`,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <BackgroundEffects />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"              element={<HomeView />} />
            <Route path="/filter"        element={<FilterView />} />
            <Route path="/character/:id" element={<DetailView />} />
            <Route path="*"              element={<NotFoundView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
