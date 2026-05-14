import { useState, useMemo } from 'react'
import useCharacters from '../hooks/useCharacters.js'
import CharacterCard from '../components/CharacterCard.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import './Home.css'

/*
  Home.jsx — Página principal

  Muestra TODOS los personajes con un buscador por nombre (funcionalidad extra).
  
  Flujo de datos:
  1. useCharacters obtiene los personajes de la API (con loading y error)
  2. El estado local "query" guarda el texto del buscador
  3. useMemo filtra los personajes en memoria según el query
  4. Se renderizan las tarjetas filtradas

  API URL: https://rickandmortyapi.com/api/character
  → Trae los personajes paginados. El hook recorre todas las páginas.
*/

// La URL de la API se define fuera del componente para que no cambie
// en cada render (evitamos que useEffect se dispare innecesariamente)
const API_BASE = 'https://rickandmortyapi.com/api/character'

function Home() {
  /*
    useState para el campo de búsqueda.
    query: lo que el usuario ha escrito
    setQuery: función para actualizarlo
  */
  const [query, setQuery] = useState('')

  // Traemos todos los personajes usando nuestro custom hook
  const { characters, loading, error } = useCharacters(API_BASE)

  /*
    useMemo optimiza el filtrado.
    Sin useMemo: el filtrado se recalcula en CADA renderizado del componente
    Con useMemo: solo se recalcula cuando cambia "characters" o "query"
    
    [characters, query] son las dependencias: si no cambian, devuelve
    el resultado memorizade (en caché) sin ejecutar la función otra vez.
  */
  const filtered = useMemo(() => {
    if (!query.trim()) return characters // Sin búsqueda → todos los personajes
    const q = query.toLowerCase()
    // Array.filter retorna solo los elementos que cumplan la condición
    return characters.filter(c =>
      c.name.toLowerCase().includes(q)
    )
  }, [characters, query])

  // ── Renderizado condicional ──────────────────────────────────────────
  // React evalúa estas condiciones de arriba a abajo y retorna lo primero
  // que sea verdadero, igual que un if/else pero en JSX.

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="error-banner">
      <span className="error-banner__icon">⚠️</span>
      <p>{error}</p>
    </div>
  )

  return (
    <section className="home">
      {/* Encabezado */}
      <div className="home__header">
        <h1 className="home__title">
          Todos los personajes
          <span className="home__count"> ({filtered.length})</span>
        </h1>

        {/*
          Buscador por nombre (punto extra del entregable).
          onChange se dispara en cada tecla que el usuario escribe.
          e.target.value es el valor actual del input.
        */}
        <input
          type="search"
          className="home__search"
          placeholder="🔍 Buscar personaje..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar personaje por nombre"
        />
      </div>

      {/*
        Renderizado condicional inline con operador ternario:
        condición ? <si_verdadero> : <si_falso>
        
        Si no hay resultados mostramos un mensaje, si hay → las tarjetas.
      */}
      {filtered.length === 0 ? (
        <div className="home__empty">
          <p>No se encontró ningún personaje con ese nombre.</p>
        </div>
      ) : (
        /*
          .map() itera sobre el array y convierte cada objeto personaje
          en un componente <CharacterCard>.
          
          key={character.id}: React necesita una clave ÚNICA en cada
          elemento de una lista para saber cuál actualizar eficientemente.
          Sin key, React no puede optimizar el re-render de listas.
        */
        <div className="characters-grid">
          {filtered.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Home
