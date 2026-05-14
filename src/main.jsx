import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/index.css'

/*
  main.jsx es el PUNTO DE ENTRADA de toda la aplicación React.

  ReactDOM.createRoot(document.getElementById('root'))
    → Busca el <div id="root"> en index.html
    → Crea un "root" de React 18 (nueva API con Concurrent Mode)
    → Todo lo que React renderice vivirá dentro de ese div

  .render(...) monta el árbol de componentes.

  <BrowserRouter>
    → Habilita el sistema de rutas de react-router-dom
    → Usa la History API del navegador (URLs reales sin #)
    → Debe envolver TODA la app para que <Routes> y <Link> funcionen

  <React.StrictMode>
    → Solo activo en desarrollo
    → Detecta efectos secundarios inesperados
    → Renderiza los componentes DOS veces para encontrar bugs
    → No afecta la build de producción
*/
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
