import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Contrato } from '../contratos/entities/contrato.entity.js'
import type { TipoTransaccion } from '../transacciones/entities/transaccion.entity.js'
import {
  sumarPorCategoria,
  TransaccionesService,
  type TransaccionRespuesta,
} from '../transacciones/transacciones.service.js'
import type { FiltroTableroDto } from './dto/filtro-tablero.dto.js'

export interface TotalMes {
  /** Formato AAAA-MM. */
  mes: string
  ingresos: number
  gastos: number
}

/** Todo lo que muestra el dashboard. */
export interface ResumenTablero {
  indicadores: { ingresos: number; gastos: number; utilidadNeta: number; contratosActivos: number }
  porMes: TotalMes[]
  gastosPorCategoria: { categoria: string; total: number }[]
  ultimasTransacciones: TransaccionRespuesta[]
}

// Cuántas transacciones muestra la tabla "Últimas transacciones" del dashboard.
const CANTIDAD_ULTIMAS = 6

/** Lista los meses (AAAA-MM) desde el mes de `desde` hasta el mes de `hasta`, ambos incluidos. */
function mesesEntre(desde: string, hasta: string): string[] {
  const meses: string[] = []
  const ultimo = hasta.slice(0, 7)
  let [anio, mes] = desde.slice(0, 7).split('-').map(Number)
  let actual = desde.slice(0, 7)
  while (actual <= ultimo) {
    meses.push(actual)
    mes += 1
    if (mes > 12) {
      mes = 1
      anio += 1
    }
    actual = `${anio}-${String(mes).padStart(2, '0')}`
  }
  return meses
}

function sumar(transacciones: TransaccionRespuesta[], tipo: TipoTransaccion): number {
  return transacciones
    .filter((transaccion) => transaccion.tipo === tipo)
    .reduce((total, transaccion) => total + transaccion.monto, 0)
}

@Injectable()
export class TableroService {
  constructor(
    private readonly transaccionesService: TransaccionesService,
    @InjectRepository(Contrato)
    private readonly contratos: Repository<Contrato>,
  ) {}

  /** Todo lo que muestra el dashboard. Los cálculos se hacen aquí para que el front solo los pinte. */
  async resumen(usuarioId: number, filtros: FiltroTableroDto): Promise<ResumenTablero> {
    if (filtros.hasta < filtros.desde) {
      throw new BadRequestException('La fecha "hasta" debe ser igual o posterior a "desde"')
    }

    const transacciones = await this.transaccionesService.listarEntreFechas(usuarioId, filtros)
    const ingresos = sumar(transacciones, 'INGRESO')
    const gastos = sumar(transacciones, 'GASTO')

    // Los contratos activos no dependen del rango de fechas: son los que están vigentes hoy.
    const contratosActivos = await this.contratos.countBy({
      estado: 'ACTIVO',
      propiedadId: filtros.propiedadId,
      propiedad: { usuarioId },
    })

    return {
      indicadores: { ingresos, gastos, utilidadNeta: ingresos - gastos, contratosActivos },
      porMes: this.totalesPorMes(transacciones, filtros),
      gastosPorCategoria: sumarPorCategoria(transacciones.filter((t) => t.tipo === 'GASTO')).map(
        ({ categoria, total }) => ({ categoria, total }),
      ),
      // Ya vienen ordenadas de la más reciente a la más antigua.
      ultimasTransacciones: transacciones.slice(0, CANTIDAD_ULTIMAS),
    }
  }

  /** Ingresos y gastos de cada mes del rango, también de los meses sin movimientos (en 0). */
  private totalesPorMes(
    transacciones: TransaccionRespuesta[],
    filtros: FiltroTableroDto,
  ): TotalMes[] {
    return mesesEntre(filtros.desde, filtros.hasta).map((mes) => {
      const delMes = transacciones.filter((transaccion) => transaccion.fecha.startsWith(mes))
      return { mes, ingresos: sumar(delMes, 'INGRESO'), gastos: sumar(delMes, 'GASTO') }
    })
  }
}
