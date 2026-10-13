import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contrato } from '../contratos/entities/contrato.entity.js';
import { Propiedad } from '../propiedades/entities/propiedad.entity.js';
import { Transaccion } from '../transacciones/entities/transaccion.entity.js';
import type { Usuario } from '../usuarios/entities/usuario.entity.js';
import { UsuariosService } from '../usuarios/usuarios.service.js';

/** Los números del negocio de un propietario. */
export interface FilaReporte {
  /** Id del propietario. */
  id: number;
  nombre: string;
  correo: string;
  propiedades: number;
  contratosActivos: number;
  ingresos: number;
  gastos: number;
  utilidad: number;
}

/** Lo que muestra la página de administración "Reporte global". */
export interface ReporteGlobal {
  totales: Omit<FilaReporte, 'id' | 'nombre' | 'correo'>;
  propietarios: FilaReporte[];
}

function filaVacia({ id, nombre, correo }: Usuario): FilaReporte {
  return {
    id,
    nombre,
    correo,
    propiedades: 0,
    contratosActivos: 0,
    ingresos: 0,
    gastos: 0,
    utilidad: 0,
  };
}

function sumarTotales(filas: FilaReporte[]): ReporteGlobal['totales'] {
  const totales = { propiedades: 0, contratosActivos: 0, ingresos: 0, gastos: 0, utilidad: 0 };
  for (const fila of filas) {
    totales.propiedades += fila.propiedades;
    totales.contratosActivos += fila.contratosActivos;
    totales.ingresos += fila.ingresos;
    totales.gastos += fila.gastos;
    totales.utilidad += fila.utilidad;
  }
  return totales;
}

@Injectable()
export class ReporteService {
  constructor(
    private readonly usuariosService: UsuariosService,
    @InjectRepository(Propiedad)
    private readonly propiedades: Repository<Propiedad>,
    @InjectRepository(Contrato)
    private readonly contratos: Repository<Contrato>,
    @InjectRepository(Transaccion)
    private readonly transacciones: Repository<Transaccion>,
  ) {}

  /** Una fila por propietario (de mayor a menor utilidad) y el total del negocio. */
  async generar(): Promise<ReporteGlobal> {
    const [propietarios, propiedades, contratosActivos, transacciones] = await Promise.all([
      this.usuariosService.listar('PROPIETARIO'),
      this.propiedades.find({ select: { id: true, usuarioId: true } }),
      this.contratos.find({ select: { propiedadId: true }, where: { estado: 'ACTIVO' } }),
      this.transacciones.find({ select: { propiedadId: true, tipo: true, monto: true } }),
    ]);

    const filas = new Map(propietarios.map((usuario) => [usuario.id, filaVacia(usuario)]));
    // Contratos y transacciones conocen su propiedad, no su dueño: se busca por la propiedad.
    const duenoDe = new Map(propiedades.map((propiedad) => [propiedad.id, propiedad.usuarioId]));
    const filaDe = (propiedadId: number): FilaReporte | undefined =>
      filas.get(duenoDe.get(propiedadId) ?? 0);

    for (const { usuarioId } of propiedades) {
      const fila = filas.get(usuarioId);
      if (fila) fila.propiedades += 1;
    }
    for (const { propiedadId } of contratosActivos) {
      const fila = filaDe(propiedadId);
      if (fila) fila.contratosActivos += 1;
    }
    for (const { propiedadId, tipo, monto } of transacciones) {
      const fila = filaDe(propiedadId);
      if (fila) fila[tipo === 'INGRESO' ? 'ingresos' : 'gastos'] += monto;
    }

    const lista = [...filas.values()]
      .map((fila) => ({ ...fila, utilidad: fila.ingresos - fila.gastos }))
      .sort((a, b) => b.utilidad - a.utilidad);
    return { totales: sumarTotales(lista), propietarios: lista };
  }
}
