import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Like, Repository, type FindOptionsWhere } from 'typeorm'

import { Contrato } from '../contratos/entities/contrato.entity.js'
import { PropiedadesService } from '../propiedades/propiedades.service.js'
import type { FiltroTransaccionesDto } from './dto/filtro-transacciones.dto.js'
import type { GuardarTransaccionDto } from './dto/guardar-transaccion.dto.js'
import { CATEGORIAS, Transaccion, type TipoTransaccion } from './entities/transaccion.entity.js'

/** Así sale una transacción por la API: sin los objetos relacionados, solo con el nombre de su propiedad. */
export type TransaccionRespuesta = Omit<Transaccion, 'propiedad' | 'contrato'> & {
  propiedadNombre: string
}

export interface TotalCategoria {
  categoria: string
  tipo: TipoTransaccion
  total: number
}

function aRespuesta({ propiedad, contrato: _, ...transaccion }: Transaccion): TransaccionRespuesta {
  return { ...transaccion, propiedadNombre: propiedad.nombre }
}

/** Suma los montos por categoría, de mayor a menor total. La usan este servicio y el tablero. */
export function sumarPorCategoria(transacciones: TransaccionRespuesta[]): TotalCategoria[] {
  const totales = new Map<string, TotalCategoria>()
  for (const { categoria, tipo, monto } of transacciones) {
    const fila = totales.get(categoria) ?? { categoria, tipo, total: 0 }
    fila.total += monto
    totales.set(categoria, fila)
  }
  return [...totales.values()].sort((a, b) => b.total - a.total)
}

@Injectable()
export class TransaccionesService {
  constructor(
    @InjectRepository(Transaccion)
    private readonly transacciones: Repository<Transaccion>,
    @InjectRepository(Contrato)
    private readonly contratos: Repository<Contrato>,
    private readonly propiedadesService: PropiedadesService,
  ) {}

  /** Transacciones de las propiedades del usuario con los filtros de la lista. */
  listar(usuarioId: number, filtros: FiltroTransaccionesDto): Promise<TransaccionRespuesta[]> {
    return this.buscarVarias({
      propiedadId: filtros.propiedadId,
      tipo: filtros.tipo,
      categoria: filtros.categoria,
      // Las fechas son texto AAAA-MM-DD, así que "todo septiembre" es "2026-09-%".
      fecha: filtros.mes ? Like(`${filtros.mes}-%`) : undefined,
      propiedad: { usuarioId },
    })
  }

  /** Transacciones entre dos fechas (incluidas). La usa el tablero. */
  listarEntreFechas(
    usuarioId: number,
    rango: { propiedadId?: number; desde: string; hasta: string },
  ): Promise<TransaccionRespuesta[]> {
    return this.buscarVarias({
      propiedadId: rango.propiedadId,
      fecha: Between(rango.desde, rango.hasta),
      propiedad: { usuarioId },
    })
  }

  async resumenPorCategoria(usuarioId: number, filtros: FiltroTransaccionesDto) {
    return sumarPorCategoria(await this.listar(usuarioId, filtros))
  }

  async buscar(id: number, usuarioId: number): Promise<TransaccionRespuesta> {
    const [transaccion] = await this.buscarVarias({ id, propiedad: { usuarioId } })
    if (!transaccion) throw new NotFoundException('La transacción no existe')
    return transaccion
  }

  async crear(datos: GuardarTransaccionDto, usuarioId: number): Promise<TransaccionRespuesta> {
    await this.validar(datos, usuarioId)
    const guardada = await this.transacciones.save(this.transacciones.create(datos))
    return this.buscar(guardada.id, usuarioId)
  }

  async actualizar(
    id: number,
    datos: GuardarTransaccionDto,
    usuarioId: number,
  ): Promise<TransaccionRespuesta> {
    await this.buscar(id, usuarioId)
    await this.validar(datos, usuarioId)
    await this.transacciones.update({ id }, { ...datos, contratoId: datos.contratoId ?? null })
    return this.buscar(id, usuarioId)
  }

  async eliminar(id: number, usuarioId: number): Promise<void> {
    await this.buscar(id, usuarioId)
    await this.transacciones.delete({ id })
  }

  /** Única consulta de lectura: siempre trae los nombres y ordena de la más reciente a la más antigua. */
  private async buscarVarias(
    condiciones: FindOptionsWhere<Transaccion>,
  ): Promise<TransaccionRespuesta[]> {
    const transacciones = await this.transacciones.find({
      where: condiciones,
      relations: { propiedad: true },
      order: { fecha: 'DESC', id: 'DESC' },
    })
    return transacciones.map(aRespuesta)
  }

  /** Reglas de negocio que el DTO no puede revisar porque necesitan la base de datos. */
  private async validar(datos: GuardarTransaccionDto, usuarioId: number): Promise<void> {
    await this.propiedadesService.buscar(datos.propiedadId, usuarioId)

    const categoria = CATEGORIAS.find(({ nombre }) => nombre === datos.categoria)
    if (categoria?.tipo !== datos.tipo) {
      throw new BadRequestException('La categoría no corresponde al tipo de la transacción')
    }

    const contratoId = datos.contratoId ?? null
    if (contratoId === null) return
    const contratoDeLaPropiedad = await this.contratos.existsBy({
      id: contratoId,
      propiedadId: datos.propiedadId,
    })
    if (!contratoDeLaPropiedad) {
      throw new BadRequestException('El contrato no pertenece a la propiedad elegida')
    }
  }
}
