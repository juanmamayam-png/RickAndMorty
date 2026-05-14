import { NavLink } from 'react-router-dom'
import './Navbar.css'

/*
  Navbar.jsx — Barra de navegación principal

  Usa <NavLink> en lugar de <Link> porque NavLink agrega automáticamente
  la clase CSS "active" al enlace cuya ruta coincide con la URL actual.
  Esto nos permite estilizar visualmente cuál es la página activa.

  { end } en el primer NavLink significa:
    → Solo marcar como "active" cuando la URL sea EXACTAMENTE "/"
    → Sin "end", "/" también sería activo en "/filter" porque "/" es prefijo de todo.
*/
function Navbar() {
  return (
    <header className="navbar">
      {/* Logo / marca de la app */}
      <div className="navbar__brand">
        <span className="navbar__portal">⬤</span>
        <span className="navbar__title">Rick & Morty</span>
        <span className="navbar__subtitle">Explorer</span>
      </div>

      {/* Menú de navegación */}
      <nav className="navbar__nav">
        {/*
          NavLink recibe una función en className para poder
          agregar clases condicionales según si está activo o no.
          ({ isActive }) es desestructuración del objeto que NavLink nos pasa.
        */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
          }
        >
          🏠 Todos
        </NavLink>

        <NavLink
          to="/filter"
          className={({ isActive }) =>
            isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
          }
        >
          🔬 Filtrar
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
