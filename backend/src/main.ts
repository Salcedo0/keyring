import './entorno.js';

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module.js';

// Direcciones del frontend que pueden llamar a la API (lista exacta, nunca "cualquiera").
const origenesPermitidos = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origen) => origen.trim())
  .filter(Boolean);

async function iniciar(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: origenesPermitidos });
  app.setGlobalPrefix('api');

  // Todo lo que llega se valida aquí, con los DTO. Un campo de más o mal escrito responde 400.
  // Los mensajes van en español porque el frontend los muestra tal cual.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errores) =>
        new BadRequestException(
          errores.map((error) => `El campo "${error.property}" no es válido`),
        ),
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

await iniciar();
