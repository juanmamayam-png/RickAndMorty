import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { translateStatus, translateSpecies, translateGender } from '../utils/translations.js'
import './CharacterDetail.css'

// Función auxiliar para reintentar fetch si falla la conexión
async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      return response
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, delay))
    }
  }
}

/*
  CharacterDetail.jsx — Página de detalle individual (punto extra)
  
  Ruta: /character/:id
  
  useParams() extrae los parámetros de la URL.
  Si la URL es /character/42, entonces useParams() devuelve { id: '42' }.
  
  Este componente hace su propio fetch individual porque necesita datos
  extras (origen, ubicación, episodios) que no vienen en el listado.
  
  useNavigate() nos da la función navigate() para navegar programáticamente
  (sin que el usuario haga click en un Link), útil para el botón "Volver".
*/
function CharacterDetail() {
  const { id }         = useParams()     // Extrae :id de la URL
  const navigate       = useNavigate()   // Para navegación programática

  const [character, setCharacter] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    /*
      Cada vez que "id" cambie (el usuario navega a otro personaje),
      este efecto se re-ejecuta y trae los datos del nuevo id.
    */
    async function fetchCharacter() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetchWithRetry(`https://rickandmortyapi.com/api/character/${id}`)

        if (!response.ok) {
          throw new Error(response.status === 404
            ? 'Personaje no encontrado'
            : `Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        setCharacter(data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCharacter()
  }, [id]) // Dependencia: re-fetch si cambia el id

  // ── Mapa de colores para el badge de estado ──
  const statusConfig = {
    Alive:   { color: '#00c853', emoji: '💚', label: 'Vivo' },
    Dead:    { color: '#ef5350', emoji: '💀', label: 'Muerto' },
    unknown: { color: '#9e9e9e', emoji: '❓', label: 'Desconocido' },
  }

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="detail-error">
      <p>⚠️ {error}</p>
      {/*
        onClick={() => navigate(-1)} navega una página atrás en el historial
        del navegador, como el botón "Atrás".
      */}
      <button className="btn-back" onClick={() => navigate(-1)}>← Volver</button>
    </div>
  )

  const sc = statusConfig[character.status] || statusConfig.unknown

  return (
    <article className="detail">
      {/* Botón volver */}
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="detail__card">
        {/* Imagen grande */}
        <div className="detail__image-col">
          <img
            src={character.image}
            alt={character.name}
            className="detail__image"
          />
        </div>

        {/* Información */}
        <div className="detail__info-col">
          <h1 className="detail__name">{character.name}</h1>

          {/* Badge de estado */}
          <span className="detail__status" style={{ color: sc.color, borderColor: sc.color }}>
            {sc.emoji} {sc.label}
          </span>

          {/* Tabla de atributos */}
          <dl className="detail__attrs">
            <DetailRow label="Especie"    value={translateSpecies(character.species)} />
            <DetailRow label="Género"     value={translateGender(character.gender)} />
            <DetailRow label="Tipo"       value={character.type || 'N/A'} />
            <DetailRow label="Origen"     value={character.origin?.name} />
            <DetailRow label="Ubicación"  value={character.location?.name} />
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

/*
  Subcomponente auxiliar para cada fila de atributos.
  <dl> (Description List), <dt> (Description Term), <dd> (Description Detail)
  son elementos HTML semánticos para pares clave-valor.
*/
function DetailRow({ label, value }) {
  return (
    <div className="detail__attr-row">
      <dt className="detail__attr-label">{label}</dt>
      <dd className="detail__attr-value">{value || 'N/A'}</dd>
    </div>
  )
}

export default CharacterDetail
