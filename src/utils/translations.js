/*
  translations.js — Traducciones de inglés a español

  La API de Rick & Morty devuelve los datos en inglés.
  Este archivo centraliza todas las traducciones para mostrar
  la información en español en la UI.
*/

// Traducción de estados
const statusMap = {
  'Alive':   'Vivo',
  'Dead':    'Muerto',
  'unknown': 'Desconocido',
}

// Traducción de especies
const speciesMap = {
  'Human':                 'Humano',
  'Alien':                 'Alienígena',
  'Robot':                 'Robot',
  'Mythological Creature': 'Criatura Mitológica',
  'Animal':                'Animal',
  'Humanoid':              'Humanoide',
  'Cronenberg':            'Cronenberg',
  'Poopybutthole':         'Poopybutthole',
  'Disease':               'Enfermedad',
  'Planet':                'Planeta',
  'unknown':               'Desconocido',
}

// Traducción de género
const genderMap = {
  'Male':       'Masculino',
  'Female':     'Femenino',
  'Genderless': 'Sin género',
  'unknown':    'Desconocido',
}

// Funciones de traducción (devuelven el original si no hay traducción)
export function translateStatus(status) {
  return statusMap[status] || status
}

export function translateSpecies(species) {
  return speciesMap[species] || species
}

export function translateGender(gender) {
  return genderMap[gender] || gender
}
