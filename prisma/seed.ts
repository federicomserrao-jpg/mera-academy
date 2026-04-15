// prisma/seed.ts
// Ejecutar con: npm run db:seed

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding MERA Tracker...')

  // Limpiar todo primero
  await prisma.historial.deleteMany()
  await prisma.alerta.deleteMany()
  await prisma.evalCapacitacion.deleteMany()
  await prisma.evalRRHH.deleteMany()
  await prisma.evalOperaciones.deleteMany()
  await prisma.candidato.deleteMany()
  await prisma.grupoCapacitacion.deleteMany()
  await prisma.campana.deleteMany()

  // ── Campañas ─────────────────────────────────────────────
  const campanas = [
    { codigo: 'CSV',          nombre: 'CSV',          orden: 0 },
    { codigo: 'TLMK',         nombre: 'TLMK',         orden: 1 },
    { codigo: 'EDESUR',       nombre: 'EDESUR',       orden: 2 },
    { codigo: 'AYSA',         nombre: 'AYSA',         orden: 3 },
    { codigo: 'ADT',          nombre: 'ADT',          orden: 4 },
    { codigo: 'CAR_ONE',      nombre: 'CAR ONE',      orden: 5 },
    { codigo: 'EDENRED',      nombre: 'EDENRED',      orden: 6 },
    { codigo: 'FARMACITY',    nombre: 'FARMACITY',    orden: 7 },
    { codigo: 'LEBEN_SALUD',  nombre: 'LEBEN SALUD',  orden: 8 },
    { codigo: 'STRIX',        nombre: 'STRIX',        orden: 9 },
    { codigo: 'MATER_DEI',    nombre: 'MATER DEI',    orden: 10 },
    { codigo: 'MIRGOR',       nombre: 'MIRGOR',       orden: 11 },
    { codigo: 'RIO_GAS',      nombre: 'RIO GAS',      orden: 12 },
    { codigo: 'DENTAL_TOTAL', nombre: 'DENTAL TOTAL', orden: 13 },
  ]
  for (const c of campanas) {
    await prisma.campana.upsert({ where: { codigo: c.codigo }, update: {}, create: c })
  }

  // ── Colaboradores ─────────────────────────────────────────

  // Federico Serrao — ADT — RIESGO ALTO
  await prisma.candidato.create({
    data: {
      nombre: 'Federico Serrao', dni: '37241100', puesto: 'Agente Contact Center',
      campana: 'ADT', estado: 'INGRESADO', riesgo: 'ALTO',
      fechaPostulacion: new Date('2024-01-15'),
      evalOps: { create: { score: 5, recomendado: true, feedback: 'Gran perfil, muy proactivo. Demostró excelente manejo de objeciones y orientación al cliente.' } },
      evalRRHH: { create: { score: 4, aptoC: true, feedback: 'Excelente fit cultural. Comunicación clara, actitud positiva y muy buena adaptabilidad al equipo.' } },
      evalCap: { create: { score: 3, listo: false, tieneAlerta: true, tipoAlerta: 'TECNICA', feedback: 'Problemas con herramientas CRM. Necesita refuerzo en el sistema antes de pasar a piso.' } },
      alertas: { create: [{ etapa: 'CAPACITACION', tipo: 'TECNICA', descripcion: 'Dificultades con sistema CRM', esDeEstado: false }] },
      historial: { create: [
        { evento: 'Colaborador registrado', detalle: 'Postulación para campaña ADT', color: 'blue' },
        { evento: 'Evaluación Operaciones', detalle: 'Score 5/5 — Recomendado', color: 'blue' },
        { evento: 'Evaluación RRHH', detalle: 'Score 4/5 — Apto Cultural', color: 'purple' },
        { evento: 'Evaluación Capacitación', detalle: 'Score 3/5 — Alerta técnica', color: 'red' },
        { evento: '✅ Ingresó', detalle: 'Incorporado como Agente Contact Center en campaña ADT', color: 'green' },
      ]},
    },
  })

  // Luciana Torres — TLMK
  await prisma.candidato.create({
    data: {
      nombre: 'Luciana Torres', dni: '38500222', puesto: 'Agente Telemarketing',
      campana: 'TLMK', estado: 'EN_CAPACITACION', riesgo: 'BAJO',
      fechaPostulacion: new Date('2024-01-20'),
      evalOps: { create: { score: 4, recomendado: true, feedback: 'Buen perfil comercial. Experiencia previa en ventas telefónicas, manejo correcto del producto.' } },
      evalRRHH: { create: { score: 3, aptoC: true, feedback: 'Perfil aceptable. Comunicación fluida aunque algo tímida en situaciones de presión.' } },
      evalCap: { create: { score: 4, listo: false, tieneAlerta: false, feedback: 'Buen ritmo de aprendizaje. Incorporó los sistemas rápidamente, pendiente completar módulo final.' } },
      historial: { create: [
        { evento: 'Colaborador registrado', color: 'blue' },
        { evento: 'Evaluación Operaciones', detalle: 'Score 4/5 — Recomendado', color: 'blue' },
        { evento: 'Evaluación RRHH', detalle: 'Score 3/5 — Apto', color: 'purple' },
      ]},
    },
  })

  // Marcos Villalba — EDESUR — RECHAZADO
  await prisma.candidato.create({
    data: {
      nombre: 'Marcos Villalba', dni: '39100400', puesto: 'Agente Atención',
      campana: 'EDESUR', estado: 'RECHAZADO', riesgo: 'ALTO',
      fechaPostulacion: new Date('2024-01-22'),
      evalOps: { create: { score: 2, recomendado: false, feedback: 'No cumple el perfil técnico mínimo requerido. Desconocimiento de herramientas básicas.' } },
      evalRRHH: { create: { score: 2, aptoC: false, feedback: 'Actitud defensiva durante la entrevista. Dificultades para trabajar bajo feedback. No recomendado.' } },
      alertas: { create: [
        { etapa: 'RRHH', tipo: 'CONDUCTUAL', descripcion: 'Actitud conflictiva en entrevista', esDeEstado: false },
        { etapa: 'OPERACIONES', tipo: 'TECNICA', descripcion: 'No alcanza mínimos técnicos requeridos', esDeEstado: false },
      ]},
      historial: { create: [
        { evento: 'Colaborador registrado', color: 'blue' },
        { evento: '⚠ Alerta — RRHH', detalle: '[CONDUCTUAL] Actitud conflictiva', color: 'red' },
        { evento: '✗ Rechazado', detalle: 'No superó el proceso de selección', color: 'red' },
      ]},
    },
  })

  // Valentina Ríos — FARMACITY — INGRESADA
  await prisma.candidato.create({
    data: {
      nombre: 'Valentina Ríos', dni: '40200150', puesto: 'Agente CSR',
      campana: 'FARMACITY', estado: 'INGRESADO', riesgo: 'BAJO',
      fechaPostulacion: new Date('2024-02-01'),
      evalOps: { create: { score: 4, recomendado: true, feedback: 'Muy buena trayectoria en atención al cliente. Conoce el rubro farmacéutico.' } },
      evalRRHH: { create: { score: 5, aptoC: true, feedback: 'Perfil sobresaliente. Empatía, proactividad y comunicación excepcionales.' } },
      evalCap: { create: { score: 5, listo: true, tieneAlerta: false, feedback: 'Lista para piso desde el día 3. Absorbió todos los contenidos, apoya a sus compañeros.' } },
      historial: { create: [
        { evento: 'Colaborador registrado', color: 'blue' },
        { evento: '✅ Ingresó', color: 'green' },
      ]},
    },
  })

  // Rodrigo Mendez — MIRGOR
  await prisma.candidato.create({
    data: {
      nombre: 'Rodrigo Mendez', dni: '41300700', puesto: 'Agente Cobranzas',
      campana: 'MIRGOR', estado: 'EN_PROCESO', riesgo: 'MEDIO',
      fechaPostulacion: new Date('2024-02-05'),
      evalOps: { create: { score: 3, recomendado: true, feedback: 'Perfil aceptable para cobranzas. Tiene manejo de presión aunque necesita pulir el discurso.' } },
      evalRRHH: { create: { score: 4, aptoC: true, feedback: 'Buen potencial. Actitud positiva frente al trabajo en equipo.' } },
      evalCap: { create: { score: 2, listo: false, tieneAlerta: true, tipoAlerta: 'TECNICA', feedback: 'Bajo rendimiento en simulaciones. Necesita refuerzo en técnicas de negociación.' } },
      alertas: { create: [{ etapa: 'CAPACITACION', tipo: 'TECNICA', descripcion: 'Bajo rendimiento en simulaciones de atención', esDeEstado: false }] },
      historial: { create: [{ evento: 'Colaborador registrado', color: 'blue' }] },
    },
  })

  // Sabrina Castro — AYSA
  await prisma.candidato.create({
    data: {
      nombre: 'Sabrina Castro', dni: '42100900', puesto: 'Agente Atención',
      campana: 'AYSA', estado: 'EN_CAPACITACION', riesgo: 'BAJO',
      fechaPostulacion: new Date('2024-02-08'),
      evalOps: { create: { score: 5, recomendado: true, feedback: 'Excelente perfil para atención al cliente de servicios públicos. Muy organizada y empática.' } },
      evalRRHH: { create: { score: 5, aptoC: true, feedback: 'Candidata ideal. Vocación de servicio muy marcada, excelente comunicación.' } },
      evalCap: { create: { score: 5, listo: true, tieneAlerta: false, feedback: 'Rápida curva de aprendizaje. Dominó todos los sistemas en tiempo récord.' } },
      historial: { create: [{ evento: 'Colaborador registrado', color: 'blue' }] },
    },
  })

  // Diego Herrera — CSV
  await prisma.candidato.create({
    data: {
      nombre: 'Diego Herrera', dni: '39800300', puesto: 'Agente CSR',
      campana: 'CSV', estado: 'INGRESADO', riesgo: 'MEDIO',
      fechaPostulacion: new Date('2024-01-10'),
      evalOps: { create: { score: 4, recomendado: true, feedback: 'Buena actitud y predisposición. Conoce el producto, aunque le falta experiencia en atención formal.' } },
      evalRRHH: { create: { score: 2, aptoC: false, feedback: 'Poca adaptabilidad al cambio detectada. Resistencia a incorporar nueva metodología.' } },
      evalCap: { create: { score: 3, listo: true, tieneAlerta: false, feedback: 'Mejoró notablemente durante la capacitación. Superó las expectativas iniciales.' } },
      alertas: { create: [{ etapa: 'RRHH', tipo: 'CONDUCTUAL', descripcion: 'Baja adaptabilidad al cambio detectada en entrevista', esDeEstado: false }] },
      historial: { create: [
        { evento: 'Colaborador registrado', color: 'blue' },
        { evento: '✅ Ingresó', color: 'green' },
      ]},
    },
  })

  console.log('✅ Seed completado — 14 campañas + 7 colaboradores')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
