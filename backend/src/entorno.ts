import { existsSync } from 'node:fs'

/*
 * Carga las variables del archivo .env (si existe) antes que cualquier otro módulo.
 * Por eso main.ts lo importa de primero. En el servidor las variables vienen de Docker y no hay .env.
 */
if (existsSync('.env')) process.loadEnvFile('.env')

/** Lee una variable de entorno obligatoria; si falta, la API no arranca y dice cuál es. */
export function variableObligatoria(nombre: string): string {
  const valor = process.env[nombre]
  if (!valor) throw new Error(`Falta la variable de entorno ${nombre}. Revisa el archivo .env.`)
  return valor
}
