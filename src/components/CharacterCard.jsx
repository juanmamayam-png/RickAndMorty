import { Link } from 'react-router-dom'
import { translateStatus, translateSpecies, translateGender } from '../utils/translations.js'
import './CharacterCard.css'

/*
  CharacterCard.jsx — Tarjeta de un personaje

  Recibe por PROPS un objeto "character" con la estructura que devuelve la API:
  {
    id:      number   → identificador único
    name:    string   → nombre del personaje
    image:   string   → URL de la imagen
    status:  string   → "Alive" | "Dead" | "unknown"
    species: string   → "Human" | "Alien" | etc.
    gender:  string   → "Male" | "Female" | "Genderless" | "unknown"
  }

  Props en React:
  ───────────────
  Los props son datos que el componente PADRE le pasa al componente HIJO.
  Son de solo lectura (el hijo no puede modificarlos).
  Se desestructuran directamente en los parámetros: ({ character })
*/
function CharacterCard({ character }) {
  /*
    Función auxiliar para determinar el color del badge de estado.
    Usamos un objeto como "mapa" en lugar de múltiples if/else.
    statusColors['Alive'] devuelve 'status--alive', etc.
    Si el status no existe en el mapa, devuelve 'status--unknown'.
  */
  const statusColors = {
    Alive:   'status--alive',
    Dead:    'status--dead',
    unknown: 'status--unknown',
  }
  const statusClass = statusColors[character.status] || 'status--unknown'

  return (
    /*
      <Link to={...}> de react-router-dom hace navegación del lado del cliente
      (sin recargar la página) hacia la ruta de detalle del personaje.
      La URL se construye dinámicamente con el id: /character/1, /character/2, etc.
    */
    <Link to={`/character/${character.id}`} className="card">

      {/* Imagen del personaje */}
      <div className="card__image-wrapper">
        <img
          src={character.image}
          alt={`Imagen de ${character.name}`}
          className="card__image"
          /*
            loading="lazy" le dice al navegador que solo descargue la imagen
            cuando esté cerca del viewport (optimización de rendimiento)
          */
          loading="lazy"
        />
      </div>

      {/* Información del personaje */}
      <div className="card__body">
        <h3 className="card__name">{character.name}</h3>

        {/* Badge de estado con color dinámico */}
        <span className={`card__status ${statusClass}`}>
          {translateStatus(character.status)}
        </span>

        <div className="card__details">
          {/* Cada detalle tiene un label y un valor */}
          <div className="card__detail">
            <span className="card__label">Especie</span>
            <span className="card__value">{translateSpecies(character.species)}</span>
          </div>
          <div className="card__detail">
            <span className="card__label">Género</span>
            <span className="card__value">{translateGender(character.gender)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CharacterCard
