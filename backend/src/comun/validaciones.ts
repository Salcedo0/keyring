import { applyDecorators } from '@nestjs/common';
import { IsISO8601, Length, Matches } from 'class-validator';

/** Fecha en texto AAAA-MM-DD (ej. 2026-09-30), que es como la API guarda y responde las fechas. */
export const EsFecha = (): PropertyDecorator =>
  applyDecorators(IsISO8601({ strict: true }), Length(10, 10));

/** Mes en texto AAAA-MM (ej. 2026-09). */
export const EsMes = (): PropertyDecorator => applyDecorators(Matches(/^\d{4}-(0[1-9]|1[0-2])$/));
