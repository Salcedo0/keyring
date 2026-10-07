/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Dirección del backend, sin '/api' al final. Ej: http://localhost:3000 */
  readonly VITE_API_BASE_URL?: string
}
