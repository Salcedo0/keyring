import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Contrato } from '../contratos/entities/contrato.entity.js'
import { Transaccion } from '../transacciones/entities/transaccion.entity.js'
import type { GuardarPropiedadDto } from './dto/guardar-propiedad.dto.js'
import { Propiedad } from './entities/propiedad.entity.js'

@Injectable()
export class PropiedadesService {
  constructor(
    @InjectRepository(Propiedad)
    private readonly propiedades: Repository<Propiedad>,
    @InjectRepository(Contrato)
    private readonly contratos: Repository<Contrato>,
    @InjectRepository(Transaccion)
    private readonly transacciones: Repository<Transaccion>,
  ) {}

  listar(usuarioId: number): Promise<Propiedad[]> {
    return this.propiedades.find({ where: { usuarioId }, order: { nombre: 'ASC' } })
  }

  /**
   * Trae una propiedad solo si es del usuario. Si es de otro, responde igual que si no existiera,
   * para no revelar qué ids tienen los demás. Contratos y transacciones también lo usan.
   */
  async buscar(id: number, usuarioId: number): Promise<Propiedad> {
    const propiedad = await this.propiedades.findOneBy({ id, usuarioId })
    if (!propiedad) throw new NotFoundException('La propiedad no existe')
    return propiedad
  }

  crear(datos: GuardarPropiedadDto, usuarioId: number): Promise<Propiedad> {
    return this.propiedades.save(this.propiedades.create({ ...datos, usuarioId }))
  }

  async actualizar(id: number, datos: GuardarPropiedadDto, usuarioId: number): Promise<Propiedad> {
    const propiedad = await this.buscar(id, usuarioId)
    return this.propiedades.save(this.propiedades.merge(propiedad, datos))
  }

  /** Una propiedad con historial (contratos o transacciones) no se elimina: se perdería ese historial. */
  async eliminar(id: number, usuarioId: number): Promise<void> {
    await this.buscar(id, usuarioId)

    const tieneHistorial =
      (await this.contratos.existsBy({ propiedadId: id })) ||
      (await this.transacciones.existsBy({ propiedadId: id }))
    if (tieneHistorial) {
      throw new ConflictException(
        'La propiedad tiene contratos o transacciones registradas; no se puede eliminar',
      )
    }
    await this.propiedades.delete({ id })
  }
}
