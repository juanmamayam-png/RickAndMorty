import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import FilterPage from './pages/FilterPage.jsx'
import CharacterDetail from './pages/CharacterDetail.jsx'
import ErrorPage from './pages/ErrorPage.jsx'

/*
  App.jsx es el COMPONENTE RAÍZ de la aplicación.
  Su responsabilidad es definir la ESTRUCTURA DE RUTAS.

  ¿Cómo funciona react-router-dom v6?
  ────────────────────────────────────
  <Routes>
    → Contenedor de rutas. Evalúa cuál ruta coincide con la URL actual.
    → Solo renderiza la primera ruta que haga match (no necesita "exact").

  <Route path="/" element={<Home />} />
    → path: el patrón de URL que activa esta ruta
    → element: el componente JSX que se renderiza cuando hay match

  Rutas especiales:
    path="/"        → Página principal (todos los personajes)
    path="/filter"  → Filtrado por especie
    path="/character/:id"
                    → ":id" es un PARÁMETRO DINÁMICO.
                      Si la URL es /character/1, entonces id = "1"
                      Se accede con el hook useParams() dentro del componente
    path="*"        → Wildcard: captura cualquier URL que no haya hecho
                      match con las rutas anteriores → página 404

  La <Navbar> está FUERA de <Routes>, por eso aparece en TODAS las páginas.
*/
function App() {
  return (
    <div className="app-wrapper">
      {/* Navbar siempre visible, independiente de la ruta */}
      <Navbar />

      {/* Área de contenido que cambia según la ruta */}
      <main className="main-content">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/filter"         element={<FilterPage />} />
          <Route path="/character/:id"  element={<CharacterDetail />} />
          <Route path="*"               element={<ErrorPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
