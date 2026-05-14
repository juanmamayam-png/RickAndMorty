import './LoadingSpinner.css'

/*
  LoadingSpinner.jsx — Indicador de carga

  Componente puramente visual sin lógica interna.
  Se muestra mientras loading === true en los hooks.
  El "portal" giratorio temáticamente coincide con el universo de Rick & Morty.
*/
function LoadingSpinner() {
  return (
    <div className="spinner-wrapper">
      {/* El portal giratorio: tres anillos con velocidades distintas */}
      <div className="spinner">
        <div className="spinner__ring spinner__ring--outer" />
        <div className="spinner__ring spinner__ring--middle" />
        <div className="spinner__ring spinner__ring--inner" />
        <div className="spinner__core" />
      </div>
      <p className="spinner__text">Abriendo portal...</p>
    </div>
  )
}

export default LoadingSpinner
