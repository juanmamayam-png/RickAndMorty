# Rick & Morty Explorer

Aplicación web SPA construida con React que consume la API pública de Rick and Morty.

## Tecnologías

- React 19
- Vite 8
- react-router-dom 7
- CSS personalizado

## Funcionalidades

- Ver todos los personajes de la serie
- Buscar personajes por nombre
- Filtrar personajes por especie
- Ver detalle individual de cada personaje
- Página 404 para rutas inexistentes
- Diseño responsivo (móvil, tablet, escritorio)
- Manejo de estados de carga y errores

## Rutas

| Ruta | Vista |
|------|-------|
| `/` | Listado de todos los personajes |
| `/filter` | Filtrado por especie |
| `/character/:id` | Detalle de un personaje |
| `*` | Página 404 |

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

La aplicación estará disponible en `http://localhost:5173`.

## API utilizada

[The Rick and Morty API](https://rickandmortyapi.com/) — API pública y gratuita.
