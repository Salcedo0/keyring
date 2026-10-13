import { MigrationInterface, QueryRunner } from 'typeorm';

export class Inicial1791874734927 implements MigrationInterface {
  name = 'Inicial1791874734927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "usuario" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nombre" varchar(100) NOT NULL, "correo" varchar(150) NOT NULL, "contrasenaHash" varchar(100) NOT NULL, "rol" varchar(20) NOT NULL DEFAULT ('PROPIETARIO'), CONSTRAINT "UQ_349ecb64acc4355db443ca17cbd" UNIQUE ("correo"), CONSTRAINT "CHK_d42cc1b3be96c2f8ab2c84df95" CHECK ("rol" IN ('ADMIN', 'PROPIETARIO')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "propiedad" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nombre" varchar(100) NOT NULL, "direccion" varchar(200) NOT NULL, "ciudad" varchar(100) NOT NULL, "tipo" varchar(15) NOT NULL, "modalidad" varchar(10) NOT NULL, "latitud" real NOT NULL, "longitud" real NOT NULL, "usuarioId" integer NOT NULL, CONSTRAINT "CHK_6822130009bd7f6a528ce31bba" CHECK ("modalidad" IN ('CORTA', 'FIJA', 'AMBAS')), CONSTRAINT "CHK_ff3ae8681204b784a8fdd8c3b6" CHECK ("tipo" IN ('APARTAMENTO', 'CASA', 'LOFT', 'ESTUDIO', 'LOCAL')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contrato" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "propiedadId" integer NOT NULL, "inquilinoNombre" varchar(100) NOT NULL, "inquilinoDocumento" varchar(30) NOT NULL, "inquilinoCorreo" varchar(150) NOT NULL, "inquilinoTelefono" varchar(30) NOT NULL DEFAULT (''), "tipo" varchar(5) NOT NULL, "fechaInicio" varchar(10) NOT NULL, "fechaFin" varchar(10) NOT NULL, "valor" integer NOT NULL, "estado" varchar(12) NOT NULL DEFAULT ('PENDIENTE'), CONSTRAINT "CHK_5ae82bb88b5244eae98d719bb1" CHECK ("valor" > 0), CONSTRAINT "CHK_7c8bf74434834e9a887bdcd75d" CHECK ("fechaFin" > "fechaInicio"), CONSTRAINT "CHK_05b86ca761f4381ee1bffb92c9" CHECK ("estado" IN ('ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO')), CONSTRAINT "CHK_90943da7e9de2bab8457dafb53" CHECK ("tipo" IN ('CORTA', 'FIJA')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaccion" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "propiedadId" integer NOT NULL, "contratoId" integer, "tipo" varchar(10) NOT NULL, "categoria" varchar(60) NOT NULL, "monto" integer NOT NULL, "fecha" varchar(10) NOT NULL, "descripcion" varchar(200) NOT NULL DEFAULT (''), CONSTRAINT "CHK_52a19076fa23d5abfd84d3f911" CHECK ("monto" > 0), CONSTRAINT "CHK_a3e2165a57087969f447a92c67" CHECK ("tipo" IN ('INGRESO', 'GASTO')))`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_propiedad" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nombre" varchar(100) NOT NULL, "direccion" varchar(200) NOT NULL, "ciudad" varchar(100) NOT NULL, "tipo" varchar(15) NOT NULL, "modalidad" varchar(10) NOT NULL, "latitud" real NOT NULL, "longitud" real NOT NULL, "usuarioId" integer NOT NULL, CONSTRAINT "CHK_6822130009bd7f6a528ce31bba" CHECK ("modalidad" IN ('CORTA', 'FIJA', 'AMBAS')), CONSTRAINT "CHK_ff3ae8681204b784a8fdd8c3b6" CHECK ("tipo" IN ('APARTAMENTO', 'CASA', 'LOFT', 'ESTUDIO', 'LOCAL')), CONSTRAINT "FK_dd31203c4b90b272109cffa7e65" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_propiedad"("id", "nombre", "direccion", "ciudad", "tipo", "modalidad", "latitud", "longitud", "usuarioId") SELECT "id", "nombre", "direccion", "ciudad", "tipo", "modalidad", "latitud", "longitud", "usuarioId" FROM "propiedad"`,
    );
    await queryRunner.query(`DROP TABLE "propiedad"`);
    await queryRunner.query(`ALTER TABLE "temporary_propiedad" RENAME TO "propiedad"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_contrato" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "propiedadId" integer NOT NULL, "inquilinoNombre" varchar(100) NOT NULL, "inquilinoDocumento" varchar(30) NOT NULL, "inquilinoCorreo" varchar(150) NOT NULL, "inquilinoTelefono" varchar(30) NOT NULL DEFAULT (''), "tipo" varchar(5) NOT NULL, "fechaInicio" varchar(10) NOT NULL, "fechaFin" varchar(10) NOT NULL, "valor" integer NOT NULL, "estado" varchar(12) NOT NULL DEFAULT ('PENDIENTE'), CONSTRAINT "CHK_5ae82bb88b5244eae98d719bb1" CHECK ("valor" > 0), CONSTRAINT "CHK_7c8bf74434834e9a887bdcd75d" CHECK ("fechaFin" > "fechaInicio"), CONSTRAINT "CHK_05b86ca761f4381ee1bffb92c9" CHECK ("estado" IN ('ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO')), CONSTRAINT "CHK_90943da7e9de2bab8457dafb53" CHECK ("tipo" IN ('CORTA', 'FIJA')), CONSTRAINT "FK_fb2f6c924d5a9e8378eb58c19f9" FOREIGN KEY ("propiedadId") REFERENCES "propiedad" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_contrato"("id", "propiedadId", "inquilinoNombre", "inquilinoDocumento", "inquilinoCorreo", "inquilinoTelefono", "tipo", "fechaInicio", "fechaFin", "valor", "estado") SELECT "id", "propiedadId", "inquilinoNombre", "inquilinoDocumento", "inquilinoCorreo", "inquilinoTelefono", "tipo", "fechaInicio", "fechaFin", "valor", "estado" FROM "contrato"`,
    );
    await queryRunner.query(`DROP TABLE "contrato"`);
    await queryRunner.query(`ALTER TABLE "temporary_contrato" RENAME TO "contrato"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_transaccion" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "propiedadId" integer NOT NULL, "contratoId" integer, "tipo" varchar(10) NOT NULL, "categoria" varchar(60) NOT NULL, "monto" integer NOT NULL, "fecha" varchar(10) NOT NULL, "descripcion" varchar(200) NOT NULL DEFAULT (''), CONSTRAINT "CHK_52a19076fa23d5abfd84d3f911" CHECK ("monto" > 0), CONSTRAINT "CHK_a3e2165a57087969f447a92c67" CHECK ("tipo" IN ('INGRESO', 'GASTO')), CONSTRAINT "FK_7da8540e020fb26a482f2628029" FOREIGN KEY ("propiedadId") REFERENCES "propiedad" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_46d54d539c6ef4d98b17db6e05d" FOREIGN KEY ("contratoId") REFERENCES "contrato" ("id") ON DELETE SET NULL ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_transaccion"("id", "propiedadId", "contratoId", "tipo", "categoria", "monto", "fecha", "descripcion") SELECT "id", "propiedadId", "contratoId", "tipo", "categoria", "monto", "fecha", "descripcion" FROM "transaccion"`,
    );
    await queryRunner.query(`DROP TABLE "transaccion"`);
    await queryRunner.query(`ALTER TABLE "temporary_transaccion" RENAME TO "transaccion"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaccion" RENAME TO "temporary_transaccion"`);
    await queryRunner.query(
      `CREATE TABLE "transaccion" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "propiedadId" integer NOT NULL, "contratoId" integer, "tipo" varchar(10) NOT NULL, "categoria" varchar(60) NOT NULL, "monto" integer NOT NULL, "fecha" varchar(10) NOT NULL, "descripcion" varchar(200) NOT NULL DEFAULT (''), CONSTRAINT "CHK_52a19076fa23d5abfd84d3f911" CHECK ("monto" > 0), CONSTRAINT "CHK_a3e2165a57087969f447a92c67" CHECK ("tipo" IN ('INGRESO', 'GASTO')))`,
    );
    await queryRunner.query(
      `INSERT INTO "transaccion"("id", "propiedadId", "contratoId", "tipo", "categoria", "monto", "fecha", "descripcion") SELECT "id", "propiedadId", "contratoId", "tipo", "categoria", "monto", "fecha", "descripcion" FROM "temporary_transaccion"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_transaccion"`);
    await queryRunner.query(`ALTER TABLE "contrato" RENAME TO "temporary_contrato"`);
    await queryRunner.query(
      `CREATE TABLE "contrato" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "propiedadId" integer NOT NULL, "inquilinoNombre" varchar(100) NOT NULL, "inquilinoDocumento" varchar(30) NOT NULL, "inquilinoCorreo" varchar(150) NOT NULL, "inquilinoTelefono" varchar(30) NOT NULL DEFAULT (''), "tipo" varchar(5) NOT NULL, "fechaInicio" varchar(10) NOT NULL, "fechaFin" varchar(10) NOT NULL, "valor" integer NOT NULL, "estado" varchar(12) NOT NULL DEFAULT ('PENDIENTE'), CONSTRAINT "CHK_5ae82bb88b5244eae98d719bb1" CHECK ("valor" > 0), CONSTRAINT "CHK_7c8bf74434834e9a887bdcd75d" CHECK ("fechaFin" > "fechaInicio"), CONSTRAINT "CHK_05b86ca761f4381ee1bffb92c9" CHECK ("estado" IN ('ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO')), CONSTRAINT "CHK_90943da7e9de2bab8457dafb53" CHECK ("tipo" IN ('CORTA', 'FIJA')))`,
    );
    await queryRunner.query(
      `INSERT INTO "contrato"("id", "propiedadId", "inquilinoNombre", "inquilinoDocumento", "inquilinoCorreo", "inquilinoTelefono", "tipo", "fechaInicio", "fechaFin", "valor", "estado") SELECT "id", "propiedadId", "inquilinoNombre", "inquilinoDocumento", "inquilinoCorreo", "inquilinoTelefono", "tipo", "fechaInicio", "fechaFin", "valor", "estado" FROM "temporary_contrato"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_contrato"`);
    await queryRunner.query(`ALTER TABLE "propiedad" RENAME TO "temporary_propiedad"`);
    await queryRunner.query(
      `CREATE TABLE "propiedad" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "nombre" varchar(100) NOT NULL, "direccion" varchar(200) NOT NULL, "ciudad" varchar(100) NOT NULL, "tipo" varchar(15) NOT NULL, "modalidad" varchar(10) NOT NULL, "latitud" real NOT NULL, "longitud" real NOT NULL, "usuarioId" integer NOT NULL, CONSTRAINT "CHK_6822130009bd7f6a528ce31bba" CHECK ("modalidad" IN ('CORTA', 'FIJA', 'AMBAS')), CONSTRAINT "CHK_ff3ae8681204b784a8fdd8c3b6" CHECK ("tipo" IN ('APARTAMENTO', 'CASA', 'LOFT', 'ESTUDIO', 'LOCAL')))`,
    );
    await queryRunner.query(
      `INSERT INTO "propiedad"("id", "nombre", "direccion", "ciudad", "tipo", "modalidad", "latitud", "longitud", "usuarioId") SELECT "id", "nombre", "direccion", "ciudad", "tipo", "modalidad", "latitud", "longitud", "usuarioId" FROM "temporary_propiedad"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_propiedad"`);
    await queryRunner.query(`DROP TABLE "transaccion"`);
    await queryRunner.query(`DROP TABLE "contrato"`);
    await queryRunner.query(`DROP TABLE "propiedad"`);
    await queryRunner.query(`DROP TABLE "usuario"`);
  }
}
