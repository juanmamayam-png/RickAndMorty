# Rick & Morty Explorer 🛸

Aplicación web SPA (Single Page Application) desarrollada en **React + Vite** que consume la [API pública de Rick and Morty](https://rickandmortyapi.com/).

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 18 | Framework UI con hooks |
| React Router DOM v6 | Navegación entre vistas |
| Vite | Bundler y servidor de desarrollo |
| CSS Variables | Sistema de diseño / temas |

## Estructura del Proyecto

```
rick-morty-app/
├── index.html              # Punto de entrada HTML
├── vite.config.js          # Configuración de Vite
├── package.json
└── src/
    ├── main.jsx            # Montaje de React + BrowserRouter
    ├── App.jsx             # Definición de rutas
    ├── styles/
    │   └── index.css       # Variables CSS y estilos globales
    ├── hooks/
    │   └── useCharacters.js # Custom hook para consumir la API
    ├── components/
    │   ├── Navbar.jsx / .css
    │   ├── CharacterCard.jsx / .css
    │   └── LoadingSpinner.jsx / .css
    └── pages/
        ├── Home.jsx / .css         # Todos los personajes + búsqueda
        ├── FilterPage.jsx / .css   # Filtro por especie
        ├── CharacterDetail.jsx / .css  # Detalle de personaje
        └── ErrorPage.jsx / .css        # Página 404
```

## Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:5173
```

## Build para producción

```bash
npm run build
npm run preview
```

## Funcionalidades

- ✅ Listado de todos los personajes (con paginación automática)
- ✅ Búsqueda por nombre en tiempo real
- ✅ Filtro por especie (Human, Alien, Robot, etc.)
- ✅ Detalle individual de personaje
- ✅ Navegación con React Router DOM v6
- ✅ Diseño responsivo (móvil, tablet, desktop)
- ✅ Manejo de estados de carga y errores
- ✅ Página 404 personalizada

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Todos los personajes |
| `/filter` | Filtrar por especie |
| `/character/:id` | Detalle del personaje |
| `/*` | Página 404 |

## API Utilizada

Base URL: `https://rickandmortyapi.com/api/character`

- Todos los personajes: `GET /character`
- Filtrar por especie: `GET /character/?species=Human`
- Personaje por ID: `GET /character/{id}`
