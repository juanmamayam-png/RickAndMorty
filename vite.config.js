import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// defineConfig le dice a Vite cómo compilar el proyecto.
// El plugin de React habilita JSX y el Fast Refresh (hot reload).
export default defineConfig({
  plugins: [react()],
})
