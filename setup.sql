-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'NO_BINARIO', 'PREFIERO_NO_DECIR');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('SUPERADMIN', 'ADMIN', 'MANAGER', 'EMPLEADO');

-- CreateEnum
CREATE TYPE "EstadoEmpleado" AS ENUM ('ACTIVO', 'INACTIVO', 'BAJA', 'VACACIONES');

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('INDEFINIDO', 'TEMPORAL', 'PRACTICAS', 'FORMACION', 'OBRA_SERVICIO', 'AUTONOMO');

-- CreateEnum
CREATE TYPE "TipoAusencia" AS ENUM ('VACACIONES', 'ENFERMEDAD', 'PERSONAL', 'MATERNIDAD', 'PATERNIDAD', 'LUTO', 'BODA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoAusencia" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoFichaje" AS ENUM ('PRESENCIAL', 'REMOTO', 'DESPLAZAMIENTO');

-- CreateEnum
CREATE TYPE "EstadoNomina" AS ENUM ('BORRADOR', 'GENERADA', 'PAGADA');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'REMOTO', 'HIBRIDO');

-- CreateEnum
CREATE TYPE "EstadoOferta" AS ENUM ('ABIERTA', 'PAUSADA', 'CERRADA', 'ARCHIVADA');

-- CreateEnum
CREATE TYPE "FaseCandidatura" AS ENUM ('RECIBIDA', 'REVISION', 'TELEFONICA', 'ENTREVISTA', 'PRUEBA_TECNICA', 'OFERTA', 'CONTRATADO', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "TipoEvaluacion" AS ENUM ('ANUAL', 'SEMESTRAL', 'TRIMESTRAL', 'PROBACION', 'OKR');

-- CreateEnum
CREATE TYPE "EstadoEvaluacion" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'ARCHIVADA');

-- CreateEnum
CREATE TYPE "EstadoTarea" AS ENUM ('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'OMITIDA');

-- CreateEnum
CREATE TYPE "TipoDoc" AS ENUM ('CONTRATO', 'NOMINA', 'DNI', 'TITULO', 'CERTIFICADO', 'FORMACION', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoAnuncio" AS ENUM ('COMUNICADO', 'NOTICIA', 'URGENTE', 'EVENTO', 'FELICITACION');

-- CreateTable
CREATE TABLE "Empresa" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "cif" TEXT,
    "logo" TEXT,
    "pais" TEXT NOT NULL DEFAULT 'España',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Madrid',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT,
    "empresaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empleado" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "empresaId" TEXT NOT NULL,
    "departamentoId" TEXT,
    "managerId" TEXT,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "avatar" TEXT,
    "fechaNacimiento" TIMESTAMP(3),
    "nif" TEXT,
    "genero" "Genero",
    "nacionalidad" TEXT,
    "direccion" TEXT,
    "puesto" TEXT,
    "rol" "Rol" NOT NULL DEFAULT 'EMPLEADO',
    "estado" "EstadoEmpleado" NOT NULL DEFAULT 'ACTIVO',
    "fechaAlta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(3),
    "salarioBruto" DOUBLE PRECISION,
    "tipoContrato" "TipoContrato",
    "jornadaHoras" DOUBLE PRECISION NOT NULL DEFAULT 40,
    "numeroCuenta" TEXT,
    "numSS" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ausencia" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "tipo" "TipoAusencia" NOT NULL,
    "estado" "EstadoAusencia" NOT NULL DEFAULT 'PENDIENTE',
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "dias" INTEGER NOT NULL,
    "descripcion" TEXT,
    "aprobadoPor" TEXT,
    "aprobadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ausencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fichaje" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "entrada" TIMESTAMP(3),
    "salida" TIMESTAMP(3),
    "pausaInicio" TIMESTAMP(3),
    "pausaFin" TIMESTAMP(3),
    "horasTrabajadas" DOUBLE PRECISION,
    "horasExtra" DOUBLE PRECISION,
    "tipo" "TipoFichaje" NOT NULL DEFAULT 'PRESENCIAL',
    "ubicacion" TEXT,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fichaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nomina" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "periodo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "salarioBruto" DOUBLE PRECISION NOT NULL,
    "irpf" DOUBLE PRECISION NOT NULL,
    "seguridadSocial" DOUBLE PRECISION NOT NULL,
    "deducciones" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "extras" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salarioNeto" DOUBLE PRECISION NOT NULL,
    "estado" "EstadoNomina" NOT NULL DEFAULT 'BORRADOR',
    "archivoUrl" TEXT,
    "pagadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfertaEmpleo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "departamento" TEXT,
    "ubicacion" TEXT,
    "descripcion" TEXT NOT NULL,
    "requisitos" TEXT,
    "salarioMin" DOUBLE PRECISION,
    "salarioMax" DOUBLE PRECISION,
    "tipo" "TipoContrato",
    "modalidad" "Modalidad" NOT NULL DEFAULT 'PRESENCIAL',
    "estado" "EstadoOferta" NOT NULL DEFAULT 'ABIERTA',
    "publicadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cierreEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OfertaEmpleo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidatura" (
    "id" TEXT NOT NULL,
    "ofertaId" TEXT NOT NULL,
    "empleadoId" TEXT,
    "nombre" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "cvUrl" TEXT,
    "fase" "FaseCandidatura" NOT NULL DEFAULT 'RECIBIDA',
    "nota" TEXT,
    "puntuacion" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluacion" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "evaluadorId" TEXT,
    "periodo" TEXT NOT NULL,
    "tipo" "TipoEvaluacion" NOT NULL DEFAULT 'ANUAL',
    "estado" "EstadoEvaluacion" NOT NULL DEFAULT 'PENDIENTE',
    "puntuacion" DOUBLE PRECISION,
    "objetivos" JSONB,
    "competencias" JSONB,
    "comentarios" TEXT,
    "planMejora" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#5B4FCF',
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "dias" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TurnoAsignado" (
    "id" TEXT NOT NULL,
    "turnoId" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TurnoAsignado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantillaOnboarding" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantillaOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TareaOnboarding" (
    "id" TEXT NOT NULL,
    "plantillaId" TEXT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "responsable" TEXT,
    "diasDesdeAlta" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TareaOnboarding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OnboardingTarea" (
    "id" TEXT NOT NULL,
    "tareaId" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "estado" "EstadoTarea" NOT NULL DEFAULT 'PENDIENTE',
    "completadoEn" TIMESTAMP(3),
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingTarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Documento" (
    "id" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoDoc" NOT NULL DEFAULT 'OTRO',
    "url" TEXT NOT NULL,
    "tamano" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anuncio" (
    "id" TEXT NOT NULL,
    "empresaId" TEXT NOT NULL,
    "autorId" TEXT,
    "titulo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" "TipoAnuncio" NOT NULL DEFAULT 'COMUNICADO',
    "fijado" BOOLEAN NOT NULL DEFAULT false,
    "publicadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiraEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Anuncio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnuncioLeido" (
    "id" TEXT NOT NULL,
    "anuncioId" TEXT NOT NULL,
    "empleadoId" TEXT NOT NULL,
    "leidoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnuncioLeido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cif_key" ON "Empresa"("cif");

-- CreateIndex
CREATE INDEX "Departamento_empresaId_idx" ON "Departamento"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_userId_key" ON "Empleado"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_email_key" ON "Empleado"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empleado_nif_key" ON "Empleado"("nif");

-- CreateIndex
CREATE INDEX "Empleado_empresaId_idx" ON "Empleado"("empresaId");

-- CreateIndex
CREATE INDEX "Empleado_departamentoId_idx" ON "Empleado"("departamentoId");

-- CreateIndex
CREATE INDEX "Ausencia_empleadoId_idx" ON "Ausencia"("empleadoId");

-- CreateIndex
CREATE INDEX "Fichaje_empleadoId_idx" ON "Fichaje"("empleadoId");

-- CreateIndex
CREATE INDEX "Fichaje_fecha_idx" ON "Fichaje"("fecha");

-- CreateIndex
CREATE INDEX "Nomina_empleadoId_idx" ON "Nomina"("empleadoId");

-- CreateIndex
CREATE UNIQUE INDEX "Nomina_empleadoId_periodo_key" ON "Nomina"("empleadoId", "periodo");

-- CreateIndex
CREATE INDEX "Candidatura_ofertaId_idx" ON "Candidatura"("ofertaId");

-- CreateIndex
CREATE INDEX "Evaluacion_empleadoId_idx" ON "Evaluacion"("empleadoId");

-- CreateIndex
CREATE INDEX "TurnoAsignado_empleadoId_idx" ON "TurnoAsignado"("empleadoId");

-- CreateIndex
CREATE INDEX "TurnoAsignado_turnoId_idx" ON "TurnoAsignado"("turnoId");

-- CreateIndex
CREATE INDEX "OnboardingTarea_empleadoId_idx" ON "OnboardingTarea"("empleadoId");

-- CreateIndex
CREATE INDEX "Documento_empleadoId_idx" ON "Documento"("empleadoId");

-- CreateIndex
CREATE INDEX "Anuncio_empresaId_idx" ON "Anuncio"("empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "AnuncioLeido_anuncioId_empleadoId_key" ON "AnuncioLeido"("anuncioId", "empleadoId");

-- AddForeignKey
ALTER TABLE "Departamento" ADD CONSTRAINT "Departamento_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empleado" ADD CONSTRAINT "Empleado_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ausencia" ADD CONSTRAINT "Ausencia_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fichaje" ADD CONSTRAINT "Fichaje_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_ofertaId_fkey" FOREIGN KEY ("ofertaId") REFERENCES "OfertaEmpleo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidatura" ADD CONSTRAINT "Candidatura_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluacion" ADD CONSTRAINT "Evaluacion_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoAsignado" ADD CONSTRAINT "TurnoAsignado_turnoId_fkey" FOREIGN KEY ("turnoId") REFERENCES "Turno"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoAsignado" ADD CONSTRAINT "TurnoAsignado_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TareaOnboarding" ADD CONSTRAINT "TareaOnboarding_plantillaId_fkey" FOREIGN KEY ("plantillaId") REFERENCES "PlantillaOnboarding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingTarea" ADD CONSTRAINT "OnboardingTarea_tareaId_fkey" FOREIGN KEY ("tareaId") REFERENCES "TareaOnboarding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OnboardingTarea" ADD CONSTRAINT "OnboardingTarea_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documento" ADD CONSTRAINT "Documento_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anuncio" ADD CONSTRAINT "Anuncio_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnuncioLeido" ADD CONSTRAINT "AnuncioLeido_anuncioId_fkey" FOREIGN KEY ("anuncioId") REFERENCES "Anuncio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnuncioLeido" ADD CONSTRAINT "AnuncioLeido_empleadoId_fkey" FOREIGN KEY ("empleadoId") REFERENCES "Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

