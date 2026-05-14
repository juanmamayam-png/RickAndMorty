import { Link } from 'react-router-dom'
import './ErrorPage.css'

/*
  ErrorPage.jsx — Página de error 404

  Se renderiza cuando ninguna ruta definida en App.jsx hace match.
  Esto lo controla la ruta path="*" (wildcard) en App.jsx.

  Es un componente completamente estático: no necesita hooks ni estado.
  Solo muestra un mensaje y un link para volver al inicio.
*/
function ErrorPage() {
  return (
    <div className="error-page">
      {/* Decoración visual: portal roto */}
      <div className="error-page__portal">
        <span className="error-page__code">404</span>
      </div>

      <h1 className="error-page__title">Dimensión no encontrada</h1>
      <p className="error-page__message">
        Parece que este portal te llevó a una dimensión que no existe.
        Prueba con otra URL o vuelve al inicio.
      </p>

      {/*
        <Link> de react-router-dom: navegación del lado del cliente.
        NO recarga la página (a diferencia de <a href="...">).
        La diferencia: Link usa el History API, <a> hace un GET HTTP nuevo.
      */}
      <Link to="/" className="error-page__btn">
        🏠 Volver al inicio
      </Link>
    </div>
  )
}

export default ErrorPage
