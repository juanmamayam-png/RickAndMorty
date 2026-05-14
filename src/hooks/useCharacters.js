import { useState, useEffect } from 'react'

/*
  useCharacters.js — CUSTOM HOOK de React

  ¿Qué es un Custom Hook?
  ───────────────────────
  Es una función de JavaScript cuyo nombre empieza por "use" y que
  puede llamar a otros hooks de React (useState, useEffect, etc.).
  Su propósito es EXTRAER y REUTILIZAR lógica entre componentes.
  Sin este hook, cada página (Home, FilterPage) tendría que repetir
  el mismo código de fetch + estados de carga + manejo de errores.

  Parámetros:
    - url: string → la URL completa de la API que se va a consumir

  Retorna un objeto con tres valores:
    - characters: array de personajes obtenidos de la API
    - loading: boolean → true mientras se espera la respuesta
    - error: string|null → mensaje de error si algo falla
*/
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

function useCharacters(url) {
  /*
    useState(valor_inicial) devuelve [estado, función_para_actualizar_estado]

    characters → empieza vacío ([]) porque aún no hemos pedido datos
    loading    → empieza true porque al montar el componente, la primera
                 acción es ir a buscar datos
    error      → empieza null porque no hay error todavía
  */
  const [characters, setCharacters] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  /*
    useEffect(función, [dependencias])
    ───────────────────────────────────
    Ejecuta la función DESPUÉS de que React renderice el componente.
    El array de dependencias [url] significa:
      → Ejecutar este efecto la PRIMERA vez que el componente monta
      → Volver a ejecutarlo cada vez que "url" cambie
    Si el array estuviera vacío [], solo se ejecutaría una vez al montar.
    Si no hubiera array, se ejecutaría en CADA renderizado (peligroso).
  */
  useEffect(() => {
    /*
      La API de Rick & Morty devuelve los personajes PAGINADOS:
      cada página trae 20 personajes y un objeto "info" con:
        - count: total de personajes
        - pages: total de páginas
        - next: URL de la siguiente página (o null si es la última)
        - prev: URL de la página anterior (o null si es la primera)

      Para mostrar TODOS los personajes necesitamos recorrer TODAS las páginas.
      Esta función fetchAllPages hace eso de forma recursiva acumulando resultados.
    */
    async function fetchAllPages(pageUrl, accumulated = []) {
      const response = await fetchWithRetry(pageUrl)

      /*
        fetch() no lanza error automáticamente en respuestas 4xx/5xx.
        response.ok es true solo si el status HTTP es 200-299.
        Si species no existe, la API devuelve 404 → lanzamos error manualmente.
      */
      if (!response.ok) {
        if (response.status === 404) {
          // La especie no existe en la API → devolvemos array vacío (no es error crítico)
          return []
        }
        throw new Error(`Error HTTP: ${response.status}`)
      }

      /*
        response.json() parsea el cuerpo de la respuesta de texto JSON
        a un objeto JavaScript. Es asíncrono porque puede ser un body grande.
      */
      const data = await response.json()

      // Combinamos los personajes de esta página con los acumulados anteriores
      const allSoFar = [...accumulated, ...data.results]

      /*
        Si hay más páginas (data.info.next no es null), llamamos
        recursivamente con la URL de la siguiente página.
        Si no hay más, retornamos el array completo acumulado.
      */
      if (data.info.next) {
        return fetchAllPages(data.info.next, allSoFar)
      }
      return allSoFar
    }

    /*
      Función interna async para poder usar await dentro de useEffect.
      (useEffect no puede ser directamente async, solo su función interna)
    */
    async function loadCharacters() {
      try {
        setLoading(true)  // Activa el spinner de carga
        setError(null)    // Limpia errores previos

        const allCharacters = await fetchAllPages(url)
        setCharacters(allCharacters)  // Guarda los personajes en el estado

      } catch (err) {
        /*
          Si fetch falla (sin conexión, error del servidor, etc.)
          guardamos el mensaje de error para mostrarlo en la UI.
          err.message es la propiedad estándar del objeto Error.
        */
        setError(err.message || 'Error al cargar los personajes')
        setCharacters([])
      } finally {
        /*
          "finally" se ejecuta SIEMPRE, haya habido error o no.
          Aquí apagamos el spinner de carga.
        */
        setLoading(false)
      }
    }

    loadCharacters()

  }, [url]) // 👈 Se re-ejecuta cada vez que cambia la URL (p.ej. al cambiar especie)

  // Exponemos los tres valores para que el componente que use este hook los consuma
  return { characters, loading, error }
}

export default useCharacters
