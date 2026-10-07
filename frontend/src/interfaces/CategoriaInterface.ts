import type { TipoTransaccion } from './TransaccionInterface'

export interface Categoria {
  id: number
  nombre: string
  tipo: TipoTransaccion
}
