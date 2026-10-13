import './entorno.js';

import { Logger, type INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';
import { ContratosService, type ContratoRespuesta } from './contratos/contratos.service.js';
import type { GuardarContratoDto } from './contratos/dto/guardar-contrato.dto.js';
import type { EstadoContrato } from './contratos/entities/contrato.entity.js';
import { variableObligatoria } from './entorno.js';
import type { GuardarPropiedadDto } from './propiedades/dto/guardar-propiedad.dto.js';
import { PropiedadesService } from './propiedades/propiedades.service.js';
import type { GuardarTransaccionDto } from './transacciones/dto/guardar-transaccion.dto.js';
import type { TipoTransaccion } from './transacciones/entities/transaccion.entity.js';
import { TransaccionesService } from './transacciones/transacciones.service.js';
import { UsuariosService } from './usuarios/usuarios.service.js';

/*
 * npm run demo: crea un propietario con un año de datos realistas para la sustentación.
 * Todo pasa por los servicios de la API, así se aplican las mismas reglas de negocio.
 * Si el propietario de demo ya existe, se elimina (sus datos caen en cascada) y se crea de nuevo.
 * Las fechas son relativas a hoy: "meses atrás" 0 es el mes actual y un número negativo, el futuro.
 */

type ClavePropiedad = 'bocagrande' | 'provenza' | 'chapinero' | 'rodadero' | 'laureles';
type IdsPropiedades = Record<ClavePropiedad, number>;
type Inquilino = Pick<
  GuardarContratoDto,
  'inquilinoNombre' | 'inquilinoDocumento' | 'inquilinoCorreo' | 'inquilinoTelefono'
>;

interface ContratoFijo {
  propiedad: ClavePropiedad;
  inquilino: Inquilino;
  desde: number;
  hasta: number;
  canon: number;
  estado: EstadoContrato;
}

interface GastoRecurrente {
  categoria: string;
  descripcion: string;
  dia: number;
  meses: number[];
  montos: Partial<Record<ClavePropiedad, number>>;
}

interface MovimientoPuntual {
  propiedad: ClavePropiedad;
  tipo: TipoTransaccion;
  categoria: string;
  monto: number;
  mesesAtras: number;
  dia: number;
  descripcion: string;
}

const PROPIEDADES: Record<ClavePropiedad, GuardarPropiedadDto> = {
  bocagrande: {
    nombre: 'Apto Bocagrande 1502',
    direccion: 'Cra. 1 #9-120, Bocagrande',
    ciudad: 'Cartagena',
    tipo: 'APARTAMENTO',
    modalidad: 'CORTA',
    latitud: 10.3997,
    longitud: -75.5559,
  },
  provenza: {
    nombre: 'Loft Provenza',
    direccion: 'Cra. 35 #8A-15, El Poblado',
    ciudad: 'Medellín',
    tipo: 'LOFT',
    modalidad: 'CORTA',
    latitud: 6.2088,
    longitud: -75.5676,
  },
  chapinero: {
    nombre: 'Casa Chapinero Alto',
    direccion: 'Cl. 64 #3-40',
    ciudad: 'Bogotá',
    tipo: 'CASA',
    modalidad: 'FIJA',
    latitud: 4.6486,
    longitud: -74.059,
  },
  rodadero: {
    nombre: 'Estudio El Rodadero',
    direccion: 'Cra. 2 #6-50, El Rodadero',
    ciudad: 'Santa Marta',
    tipo: 'ESTUDIO',
    modalidad: 'AMBAS',
    latitud: 11.204,
    longitud: -74.226,
  },
  laureles: {
    nombre: 'Local Laureles',
    direccion: 'Cra. 76 #33A-20, Laureles',
    ciudad: 'Medellín',
    tipo: 'LOCAL',
    modalidad: 'FIJA',
    latitud: 6.2447,
    longitud: -75.5966,
  },
};

// [nombre, documento, correo, teléfono]
const INQUILINOS: Inquilino[] = [
  ['Valentina Ríos', '1020456789', 'valentina.rios@correo.co', '3004561278'],
  ['Santiago Mejía', '1037612345', 'santiago.mejia@correo.co', '3157894512'],
  ['Mariana Ortiz', '52987654', 'mariana.ortiz@correo.co', '3012348899'],
  ['Julián Castaño', '1152698741', 'julian.castano@correo.co', '3206547788'],
  ['Camila Duque', '1001234567', 'camila.duque@correo.co', '3118529634'],
  ['Andrés Gómez', '80123456', 'andres.gomez@correo.co', '3172223344'],
].map(([inquilinoNombre, inquilinoDocumento, inquilinoCorreo, inquilinoTelefono]) => ({
  inquilinoNombre,
  inquilinoDocumento,
  inquilinoCorreo,
  inquilinoTelefono,
}));

const EMPRESA: Inquilino = {
  inquilinoNombre: 'Ferretería Andina S.A.S.',
  inquilinoDocumento: '901234567-8',
  inquilinoCorreo: 'gerencia@ferreteriaandina.co',
  inquilinoTelefono: '6044445566',
};

// Contratos con canon mensual. desde y hasta son "meses atrás" (el día 1 de cada mes).
const CONTRATOS_FIJOS: ContratoFijo[] = [
  {
    propiedad: 'chapinero',
    inquilino: INQUILINOS[2],
    desde: 11,
    hasta: -13,
    canon: 4_800_000,
    estado: 'ACTIVO',
  },
  {
    propiedad: 'laureles',
    inquilino: EMPRESA,
    desde: 8,
    hasta: -16,
    canon: 3_500_000,
    estado: 'ACTIVO',
  },
  {
    propiedad: 'rodadero',
    inquilino: INQUILINOS[3],
    desde: 12,
    hasta: 6,
    canon: 1_900_000,
    estado: 'FINALIZADO',
  },
];

const TARIFA_NOCHE: Partial<Record<ClavePropiedad, number>> = {
  bocagrande: 520_000,
  provenza: 380_000,
  rodadero: 290_000,
};

// Reservas de corta estancia: [propiedad, meses atrás, día de llegada, noches, estado].
const ESTADIAS: [ClavePropiedad, number, number, number, EstadoContrato][] = [
  ['bocagrande', 11, 8, 6, 'FINALIZADO'],
  ['bocagrande', 10, 8, 5, 'FINALIZADO'],
  ['bocagrande', 9, 8, 4, 'FINALIZADO'],
  ['bocagrande', 8, 8, 3, 'FINALIZADO'],
  ['bocagrande', 7, 8, 6, 'FINALIZADO'],
  ['bocagrande', 6, 8, 5, 'FINALIZADO'],
  ['bocagrande', 5, 8, 4, 'FINALIZADO'],
  ['bocagrande', 4, 8, 3, 'FINALIZADO'],
  ['bocagrande', 3, 8, 6, 'FINALIZADO'],
  ['bocagrande', 2, 8, 5, 'FINALIZADO'],
  ['bocagrande', 1, 8, 4, 'FINALIZADO'],
  ['provenza', 10, 15, 3, 'FINALIZADO'],
  ['provenza', 8, 15, 4, 'FINALIZADO'],
  ['provenza', 6, 15, 2, 'FINALIZADO'],
  ['provenza', 4, 15, 3, 'FINALIZADO'],
  ['provenza', 2, 15, 4, 'FINALIZADO'],
  ['provenza', -1, 12, 4, 'PENDIENTE'],
  ['rodadero', 5, 20, 4, 'FINALIZADO'],
  ['rodadero', 4, 20, 4, 'FINALIZADO'],
  ['rodadero', 3, 20, 4, 'FINALIZADO'],
  ['rodadero', 2, 20, 4, 'CANCELADO'],
  ['rodadero', 1, 20, 4, 'FINALIZADO'],
  // Estadía de un mes que empezó el día 1: siempre está en curso, se corra el día que se corra.
  ['rodadero', 0, 1, 31, 'ACTIVO'],
];

// Los últimos 12 meses: 0 es el mes actual y 11 el más antiguo.
const MESES = [...Array(12).keys()];

// En las de corta estancia el dueño paga la administración y los servicios; en el local, solo la
// administración; en la casa, ninguno de los dos.
const GASTOS_RECURRENTES: GastoRecurrente[] = [
  {
    categoria: 'Administración',
    descripcion: 'Cuota de administración',
    dia: 5,
    meses: MESES,
    montos: { bocagrande: 680_000, provenza: 520_000, rodadero: 410_000, laureles: 350_000 },
  },
  {
    categoria: 'Servicios públicos',
    descripcion: 'Agua, luz e internet',
    dia: 18,
    meses: MESES,
    montos: { bocagrande: 245_000, provenza: 198_000, rodadero: 176_000 },
  },
  {
    categoria: 'Impuestos y predial',
    descripcion: 'Impuesto predial (cuota semestral)',
    dia: 12,
    meses: [8, 2],
    montos: {
      bocagrande: 930_000,
      provenza: 620_000,
      chapinero: 1_200_000,
      rodadero: 380_000,
      laureles: 750_000,
    },
  },
];

const MOVIMIENTOS_PUNTUALES: MovimientoPuntual[] = [
  {
    propiedad: 'chapinero',
    tipo: 'GASTO',
    categoria: 'Mantenimiento',
    monto: 1_250_000,
    mesesAtras: 9,
    dia: 14,
    descripcion: 'Arreglo de humedad en el baño',
  },
  {
    propiedad: 'bocagrande',
    tipo: 'GASTO',
    categoria: 'Mantenimiento',
    monto: 2_300_000,
    mesesAtras: 4,
    dia: 22,
    descripcion: 'Cambio del aire acondicionado',
  },
  {
    propiedad: 'provenza',
    tipo: 'GASTO',
    categoria: 'Mantenimiento',
    monto: 180_000,
    mesesAtras: 6,
    dia: 3,
    descripcion: 'Reparación de la cerradura',
  },
  {
    propiedad: 'laureles',
    tipo: 'GASTO',
    categoria: 'Mantenimiento',
    monto: 980_000,
    mesesAtras: 2,
    dia: 9,
    descripcion: 'Pintura de la fachada',
  },
  {
    propiedad: 'laureles',
    tipo: 'INGRESO',
    categoria: 'Otros ingresos',
    monto: 450_000,
    mesesAtras: 5,
    dia: 10,
    descripcion: 'Arriendo de la bodega del fondo',
  },
  {
    propiedad: 'chapinero',
    tipo: 'INGRESO',
    categoria: 'Otros ingresos',
    monto: 320_000,
    mesesAtras: 3,
    dia: 16,
    descripcion: 'Reintegro del seguro por el arreglo',
  },
];

const COMISION_PLATAFORMA = 0.15;
const VALOR_ASEO = 95_000;
const CLAVES = Object.keys(PROPIEDADES) as ClavePropiedad[];

const logger = new Logger('Demo');

function aTexto(fecha: Date): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

/** Fecha AAAA-MM-DD de un día de hace `mesesAtras` meses. En el pasado nunca pasa de hoy. */
function fecha(mesesAtras: number, dia: number): string {
  const hoy = new Date();
  const resultado = new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, dia);
  return aTexto(mesesAtras >= 0 && resultado > hoy ? hoy : resultado);
}

function sumarDias(fechaTexto: string, dias: number): string {
  const [anio, mes, dia] = fechaTexto.split('-').map(Number);
  return aTexto(new Date(anio, mes - 1, dia + dias));
}

function nombreMes(mesesAtras: number): string {
  const hoy = new Date();
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, 1);
  return primerDia.toLocaleDateString('es-CO', { month: 'long' });
}

function contratoFijo(fijo: ContratoFijo, ids: IdsPropiedades): GuardarContratoDto {
  return {
    propiedadId: ids[fijo.propiedad],
    ...fijo.inquilino,
    tipo: 'FIJA',
    fechaInicio: fecha(fijo.desde, 1),
    fechaFin: fecha(fijo.hasta, 1),
    valor: fijo.canon,
    estado: fijo.estado,
  };
}

function contratoCorto(
  [propiedad, mesesAtras, dia, noches, estado]: (typeof ESTADIAS)[number],
  ids: IdsPropiedades,
  inquilino: Inquilino,
): GuardarContratoDto {
  const fechaInicio = fecha(mesesAtras, dia);
  return {
    propiedadId: ids[propiedad],
    ...inquilino,
    tipo: 'CORTA',
    fechaInicio,
    fechaFin: sumarDias(fechaInicio, noches),
    valor: noches * (TARIFA_NOCHE[propiedad] ?? 0),
    estado,
  };
}

/** El canon de cada mes en que el contrato estuvo vigente y el depósito al firmarlo. */
function cobrosFijos(fijo: ContratoFijo, contrato: ContratoRespuesta): GuardarTransaccionDto[] {
  const base = {
    propiedadId: contrato.propiedadId,
    contratoId: contrato.id,
    tipo: 'INGRESO' as const,
  };
  const cobros = MESES.filter((mes) => mes <= fijo.desde && mes > fijo.hasta).map((mes) => ({
    ...base,
    categoria: 'Canon de arriendo',
    monto: fijo.canon,
    fecha: fecha(mes, 1),
    descripcion: `Canon de ${nombreMes(mes)}`,
  }));
  if (!MESES.includes(fijo.desde)) return cobros;
  const deposito = { categoria: 'Depósito', monto: fijo.canon, fecha: contrato.fechaInicio };
  return [...cobros, { ...base, ...deposito, descripcion: 'Depósito al firmar el contrato' }];
}

function reserva(contrato: ContratoRespuesta): GuardarTransaccionDto {
  const noches = (Date.parse(contrato.fechaFin) - Date.parse(contrato.fechaInicio)) / 86_400_000;
  return {
    propiedadId: contrato.propiedadId,
    contratoId: contrato.id,
    tipo: 'INGRESO',
    categoria: 'Arriendo corta estancia',
    monto: contrato.valor,
    fecha: contrato.fechaInicio,
    descripcion: `Reserva de ${noches} noches`,
  };
}

function comision(contrato: ContratoRespuesta): GuardarTransaccionDto {
  return {
    propiedadId: contrato.propiedadId,
    contratoId: contrato.id,
    tipo: 'GASTO',
    categoria: 'Comisión plataforma',
    monto: Math.round(contrato.valor * COMISION_PLATAFORMA),
    fecha: contrato.fechaInicio,
    descripcion: 'Comisión de la plataforma de reservas',
  };
}

function aseoDeSalida(contrato: ContratoRespuesta): GuardarTransaccionDto {
  return {
    propiedadId: contrato.propiedadId,
    contratoId: null,
    tipo: 'GASTO',
    categoria: 'Aseo',
    monto: VALOR_ASEO,
    fecha: contrato.fechaFin,
    descripcion: 'Limpieza después de la salida',
  };
}

/** La reserva cobrada, la comisión de la plataforma y, si ya terminó, el aseo de salida. */
function cobrosEstadia(contrato: ContratoRespuesta): GuardarTransaccionDto[] {
  if (contrato.estado === 'FINALIZADO') {
    return [reserva(contrato), comision(contrato), aseoDeSalida(contrato)];
  }
  if (contrato.estado === 'ACTIVO') return [reserva(contrato), comision(contrato)];
  return [];
}

function gastosRecurrentes(ids: IdsPropiedades): GuardarTransaccionDto[] {
  return GASTOS_RECURRENTES.flatMap(({ montos, meses, dia, categoria, descripcion }) =>
    meses.flatMap((mes) =>
      Object.entries(montos).map(([clave, monto]) => ({
        propiedadId: ids[clave as ClavePropiedad],
        contratoId: null,
        tipo: 'GASTO' as const,
        categoria,
        monto,
        fecha: fecha(mes, dia),
        descripcion,
      })),
    ),
  );
}

function movimientosPuntuales(ids: IdsPropiedades): GuardarTransaccionDto[] {
  return MOVIMIENTOS_PUNTUALES.map(({ propiedad, mesesAtras, dia, ...movimiento }) => ({
    ...movimiento,
    propiedadId: ids[propiedad],
    contratoId: null,
    fecha: fecha(mesesAtras, dia),
  }));
}

/** Si el propietario de demo existe lo elimina (sus datos caen en cascada) y lo crea de nuevo. */
async function reiniciarPropietario(
  usuarios: UsuariosService,
  demo: { nombre: string; correo: string; contrasena: string },
): Promise<number> {
  const existente = await usuarios.buscarParaIngreso(demo.correo);
  if (existente && existente.rol !== 'PROPIETARIO') {
    throw new Error(
      `${demo.correo} es de un ${existente.rol}: el demo solo reemplaza a un propietario`,
    );
  }
  // Quien elimina es este script, no un usuario: 0 no coincide con ningún id.
  if (existente) await usuarios.eliminar(existente.id, 0);
  return (await usuarios.crear({ ...demo, rol: 'PROPIETARIO' })).id;
}

async function crearPropiedades(
  servicio: PropiedadesService,
  usuarioId: number,
): Promise<IdsPropiedades> {
  const ids = {} as IdsPropiedades;
  for (const clave of CLAVES) ids[clave] = (await servicio.crear(PROPIEDADES[clave], usuarioId)).id;
  return ids;
}

/** Crea los contratos y después todas las transacciones. Devuelve cuántas transacciones creó. */
async function crearMovimientos(
  app: INestApplicationContext,
  ids: IdsPropiedades,
  usuarioId: number,
): Promise<number> {
  const contratos = app.get(ContratosService);
  const transacciones = [...gastosRecurrentes(ids), ...movimientosPuntuales(ids)];
  for (const fijo of CONTRATOS_FIJOS) {
    const contrato = await contratos.crear(contratoFijo(fijo, ids), usuarioId);
    transacciones.push(...cobrosFijos(fijo, contrato));
  }
  for (const [i, estadia] of ESTADIAS.entries()) {
    const inquilino = INQUILINOS[i % INQUILINOS.length];
    const contrato = await contratos.crear(contratoCorto(estadia, ids, inquilino), usuarioId);
    transacciones.push(...cobrosEstadia(contrato));
  }
  const servicio = app.get(TransaccionesService);
  for (const datos of transacciones) await servicio.crear(datos, usuarioId);
  return transacciones.length;
}

async function cargarDemo(): Promise<void> {
  // Se leen antes de arrancar Nest: si falta una variable, se detiene sin tocar la base.
  const demo = {
    nombre: variableObligatoria('DEMO_NOMBRE'),
    correo: variableObligatoria('DEMO_CORREO'),
    contrasena: variableObligatoria('DEMO_CONTRASENA'),
  };
  // Sin los mensajes de arranque de Nest; solo errores, advertencias y el resumen final.
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  try {
    const usuarioId = await reiniciarPropietario(app.get(UsuariosService), demo);
    const ids = await crearPropiedades(app.get(PropiedadesService), usuarioId);
    const total = await crearMovimientos(app, ids, usuarioId);
    app.useLogger(['log', 'error', 'warn']);
    logger.log(`Listo: ${demo.correo} con ${CLAVES.length} propiedades y ${total} transacciones`);
  } finally {
    await app.close();
  }
}

await cargarDemo();
