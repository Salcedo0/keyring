import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PropiedadesService } from '../propiedades/propiedades.service.js'
import type { FiltroContratosDto } from './dto/filtro-contratos.dto.js'
import type { GuardarContratoDto } from './dto/guardar-contrato.dto.js'
import { Contrato } from './entities/contrato.entity.js'

/** Así sale un contrato por la API: sin el objeto propiedad completo, solo con su nombre. */
export type ContratoRespuesta = Omit<Contrato, 'propiedad'> & { propiedadNombre: string }

function aRespuesta({ propiedad, ...contrato }: Contrato): ContratoRespuesta {
  return { ...contrato, propiedadNombre: propiedad.nombre }
}

@Injectable()
export class ContratosService {
  constructor(
    @InjectRepository(Contrato)
    private readonly contratos: Repository<Contrato>,
    private readonly propiedadesService: PropiedadesService,
  ) {}

  /** Contratos de las propiedades del usuario, del más reciente al más antiguo. */
  async listar(usuarioId: number, filtros: FiltroContratosDto): Promise<ContratoRespuesta[]> {
    const contratos = await this.contratos.find({
      where: { propiedadId: filtros.propiedadId, estado: filtros.estado, propiedad: { usuarioId } },
      relations: { propiedad: true },
      order: { fechaInicio: 'DESC' },
    })
    return contratos.map(aRespuesta)
  }

  async buscar(id: number, usuarioId: number): Promise<ContratoRespuesta> {
    const contrato = await this.contratos.findOne({
      where: { id, propiedad: { usuarioId } },
      relations: { propiedad: true },
    })
    if (!contrato) throw new NotFoundException('El contrato no existe')
    return aRespuesta(contrato)
  }

  async crear(datos: GuardarContratoDto, usuarioId: number): Promise<ContratoRespuesta> {
    await this.validar(datos, usuarioId)
    const guardado = await this.contratos.save(this.contratos.create(datos))
    return this.buscar(guardado.id, usuarioId)
  }

  async actualizar(
    id: number,
    datos: GuardarContratoDto,
    usuarioId: number,
  ): Promise<ContratoRespuesta> {
    await this.buscar(id, usuarioId)
    await this.validar(datos, usuarioId)
    await this.contratos.update({ id }, datos)
    return this.buscar(id, usuarioId)
  }

  /** Las transacciones ligadas al contrato no se borran: quedan sin contrato (ON DELETE SET NULL). */
  async eliminar(id: number, usuarioId: number): Promise<void> {
    await this.buscar(id, usuarioId)
    await this.contratos.delete({ id })
  }

  /** La propiedad debe ser del usuario y las fechas deben tener sentido. */
  private async validar(datos: GuardarContratoDto, usuarioId: number): Promise<void> {
    await this.propiedadesService.buscar(datos.propiedadId, usuarioId)
    if (datos.fechaFin <= datos.fechaInicio) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la de inicio')
    }
  }
}
