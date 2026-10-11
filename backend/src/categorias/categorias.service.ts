import {
  ConflictException,
  Injectable,
  NotFoundException,
  type OnApplicationBootstrap,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Not, Repository } from 'typeorm'

import { Transaccion } from '../transacciones/entities/transaccion.entity.js'
import type { GuardarCategoriaDto } from './dto/guardar-categoria.dto.js'
import { Categoria, type TipoTransaccion } from './entities/categoria.entity.js'

// Las categorías con las que arranca KeyRing. Son configuración, no datos de ejemplo:
// sin ellas no se podría registrar ninguna transacción hasta que un ADMIN las creara.
const CATEGORIAS_INICIALES: GuardarCategoriaDto[] = [
  { nombre: 'Arriendo corta estancia', tipo: 'INGRESO' },
  { nombre: 'Canon de arriendo', tipo: 'INGRESO' },
  { nombre: 'Depósito', tipo: 'INGRESO' },
  { nombre: 'Otros ingresos', tipo: 'INGRESO' },
  { nombre: 'Administración', tipo: 'GASTO' },
  { nombre: 'Mantenimiento', tipo: 'GASTO' },
  { nombre: 'Servicios públicos', tipo: 'GASTO' },
  { nombre: 'Comisión plataforma', tipo: 'GASTO' },
  { nombre: 'Aseo', tipo: 'GASTO' },
  { nombre: 'Impuestos y predial', tipo: 'GASTO' },
]

@Injectable()
export class CategoriasService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Categoria)
    private readonly categorias: Repository<Categoria>,
    @InjectRepository(Transaccion)
    private readonly transacciones: Repository<Transaccion>,
  ) {}

  /** La primera vez que arranca la API (tabla vacía), crea las categorías iniciales. */
  async onApplicationBootstrap(): Promise<void> {
    if ((await this.categorias.count()) > 0) return
    await this.categorias.save(this.categorias.create(CATEGORIAS_INICIALES))
  }

  listar(tipo?: TipoTransaccion): Promise<Categoria[]> {
    return this.categorias.find({ where: { tipo }, order: { tipo: 'ASC', nombre: 'ASC' } })
  }

  async buscar(id: number): Promise<Categoria> {
    const categoria = await this.categorias.findOneBy({ id })
    if (!categoria) throw new NotFoundException('La categoría no existe')
    return categoria
  }

  async crear(datos: GuardarCategoriaDto): Promise<Categoria> {
    await this.validarNombreLibre(datos.nombre)
    return this.categorias.save(this.categorias.create(datos))
  }

  async actualizar(id: number, datos: GuardarCategoriaDto): Promise<Categoria> {
    const categoria = await this.buscar(id)
    await this.validarNombreLibre(datos.nombre, id)
    return this.categorias.save(this.categorias.merge(categoria, datos))
  }

  /** No se elimina una categoría que ya usan transacciones: se perdería su clasificación. */
  async eliminar(id: number): Promise<void> {
    await this.buscar(id)
    if (await this.transacciones.existsBy({ categoriaId: id })) {
      throw new ConflictException('Hay transacciones con esta categoría; no se puede eliminar')
    }
    await this.categorias.delete({ id })
  }

  /** El nombre no se puede repetir. `idActual` es la categoría que se está editando (se ignora). */
  private async validarNombreLibre(nombre: string, idActual?: number): Promise<void> {
    const repetida = await this.categorias.existsBy({
      nombre: nombre.trim(),
      id: idActual === undefined ? undefined : Not(idActual),
    })
    if (repetida) throw new ConflictException('Ya existe una categoría con ese nombre')
  }
}
