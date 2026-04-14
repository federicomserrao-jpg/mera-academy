import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const existing = await prisma.candidato.count()
    if (existing > 0) {
      return NextResponse.json({ message: `Ya hay ${existing} colaboradores. Setup ya fue ejecutado.` })
    }

    // ── Federico Serrao — ADT — RIESGO ALTO ──
    await prisma.candidato.create({
      data: {
        nombre: 'Federico Serrao', dni: '37241100', puesto: 'Agente Contact Center',
        campana: 'ADT', estado: 'INGRESADO', riesgo: 'ALTO',
        fechaPostulacion: new Date('2024-01-15'),
        evalRRHH: { create: { score: 5, aptoC: true, feedback: 'Excelente fit cultural. Comunicación muy clara y actitud positiva frente a los desafíos. Muy buena presencia y manejo del estrés en entrevista. Seleccionado por perfil sobresaliente.' } },
        evalOps: { create: { score: 5, recomendado: true, feedback: 'Gran perfil técnico y proactivo. Conocimiento sólido del producto, respuestas precisas en el role play. Altamente recomendado para campaña ADT.' } },
        evalCap: { create: { score: 2, listo: false, tieneAlerta: true, tipoAlerta: 'TECNICA', feedback: 'Dificultades persistentes con el sistema CRM. A pesar de buen rendimiento inicial, no logró consolidar el uso de las herramientas requeridas en el tiempo estipulado.' } },
        alertas: { create: [{ etapa: 'CAPACITACION', tipo: 'TECNICA', descripcion: 'Dificultades con sistema CRM luego de la segunda semana de capacitación', esDeEstado: false }] },
        historial: { create: [
          { evento: 'Colaborador ingresado', detalle: 'Postulación registrada para campaña ADT', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 5/5 — Apto Cultural', color: 'purple' },
          { evento: 'Feedback Operaciones registrado', detalle: 'Score 5/5 — Recomendado', color: 'blue' },
          { evento: 'Feedback Capacitación registrado', detalle: 'Score 2/5 — No listo', color: 'red' },
          { evento: '✅ Ingresó', detalle: 'Incorporado como Agente Contact Center en campaña ADT', color: 'green' },
        ]},
      },
    })

    // ── Luciana Torres — TLMK ──
    await prisma.candidato.create({
      data: {
        nombre: 'Luciana Torres', dni: '38500222', puesto: 'Agente Telemarketing',
        campana: 'TLMK', estado: 'EN_CAPACITACION', riesgo: 'BAJO',
        fechaPostulacion: new Date('2024-01-20'),
        evalRRHH: { create: { score: 3, aptoC: true, feedback: 'Perfil aceptable, buena actitud aunque comunicación algo limitada. Se adapta al equipo sin problemas. Seleccionada por motivación y disponibilidad horaria.' } },
        evalOps: { create: { score: 4, recomendado: true, feedback: 'Buen perfil comercial, experiencia previa en ventas telefónicas. Manejo correcto del guión. Recomendada para TLMK.' } },
        evalCap: { create: { score: 4, listo: false, tieneAlerta: false, feedback: 'Buen ritmo de aprendizaje. Domina las herramientas, pendiente de completar el módulo de objeciones. Estimado finalizar en 3 días.' } },
        historial: { create: [
          { evento: 'Colaborador ingresado', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 3/5 — Apto Cultural', color: 'purple' },
          { evento: 'Feedback Operaciones registrado', detalle: 'Score 4/5 — Recomendada', color: 'blue' },
        ]},
      },
    })

    // ── Marcos Villalba — EDESUR — RIESGO ALTO, RECHAZADO ──
    await prisma.candidato.create({
      data: {
        nombre: 'Marcos Villalba', dni: '39100400', puesto: 'Agente Atención',
        campana: 'EDESUR', estado: 'RECHAZADO', riesgo: 'ALTO',
        fechaPostulacion: new Date('2024-01-22'),
        evalRRHH: { create: { score: 2, aptoC: false, feedback: 'Actitud defensiva durante toda la entrevista. No demostró capacidad de adaptación. Respuestas evasivas ante situaciones de conflicto con el cliente. No recomendado por fit cultural.' } },
        evalOps: { create: { score: 2, recomendado: false, feedback: 'No cumple el perfil técnico mínimo. Errores graves en el role play. No conoce los productos ni los procedimientos básicos de atención.' } },
        alertas: { create: [
          { etapa: 'RRHH', tipo: 'CONDUCTUAL', descripcion: 'Actitud conflictiva y defensiva en entrevista grupal', esDeEstado: false },
          { etapa: 'OPERACIONES', tipo: 'TECNICA', descripcion: 'No alcanza los mínimos técnicos requeridos para la campaña', esDeEstado: false },
        ]},
        historial: { create: [
          { evento: 'Colaborador ingresado', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 2/5 — No apto cultural', color: 'red' },
          { evento: '⚠ Alerta — RRHH', detalle: '[CONDUCTUAL] Actitud conflictiva en entrevista', color: 'red' },
          { evento: '⚠ Alerta — Operaciones', detalle: '[TECNICA] No alcanza mínimos técnicos', color: 'red' },
          { evento: '✗ Rechazado', detalle: 'No superó el proceso de selección', color: 'red' },
        ]},
      },
    })

    // ── Valentina Ríos — FARMACITY — INGRESADA ──
    await prisma.candidato.create({
      data: {
        nombre: 'Valentina Ríos', dni: '40200150', puesto: 'Agente CSR',
        campana: 'FARMACITY', estado: 'INGRESADO', riesgo: 'BAJO',
        fechaPostulacion: new Date('2024-02-01'),
        evalRRHH: { create: { score: 5, aptoC: true, feedback: 'Perfil absolutamente sobresaliente. Empatía natural, comunicación excepcional, manejo impecable del estrés. Ideal para atención al cliente en Farmacity. Muy recomendada.' } },
        evalOps: { create: { score: 4, recomendado: true, feedback: 'Muy buena trayectoria en atención al cliente. Domina los conceptos del servicio, respuestas claras y precisas. Adaptación inmediata al perfil de la campaña.' } },
        evalCap: { create: { score: 5, listo: true, tieneAlerta: false, feedback: 'Rendimiento excepcional desde el primer día. Dominó todas las herramientas en 3 días, ayudó a sus compañeros. Lista para piso desde la primera semana.' } },
        historial: { create: [
          { evento: 'Colaborador ingresado', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 5/5 — Apto Cultural', color: 'purple' },
          { evento: 'Feedback Operaciones registrado', detalle: 'Score 4/5 — Recomendada', color: 'blue' },
          { evento: 'Feedback Capacitación registrado', detalle: 'Score 5/5 — Lista para piso', color: 'green' },
          { evento: '✅ Ingresó', color: 'green' },
        ]},
      },
    })

    // ── Rodrigo Mendez — MIRGOR ──
    await prisma.candidato.create({
      data: {
        nombre: 'Rodrigo Mendez', dni: '41300700', puesto: 'Agente Cobranzas',
        campana: 'MIRGOR', estado: 'EN_PROCESO', riesgo: 'MEDIO',
        fechaPostulacion: new Date('2024-02-05'),
        evalRRHH: { create: { score: 4, aptoC: true, feedback: 'Buen potencial, actitud muy positiva. Algo introvertido pero con ganas de aprender. Encaja bien con el equipo. Apto cultural.' } },
        evalOps: { create: { score: 3, recomendado: true, feedback: 'Perfil aceptable para cobranzas. Conocimiento básico del proceso, necesita refuerzo en técnicas de negociación. Aceptado con reservas.' } },
        evalCap: { create: { score: 2, listo: false, tieneAlerta: true, tipoAlerta: 'TECNICA', feedback: 'Bajo rendimiento en las simulaciones de atención. Dificultades para manejar objeciones complejas. Requiere refuerzo antes de salir a piso.' } },
        alertas: { create: [{ etapa: 'CAPACITACION', tipo: 'TECNICA', descripcion: 'Bajo rendimiento sostenido en simulaciones de atención y cobranzas', esDeEstado: false }] },
        historial: { create: [
          { evento: 'Colaborador ingresado', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 4/5 — Apto Cultural', color: 'purple' },
        ]},
      },
    })

    // ── Sabrina Castro — AYSA ──
    await prisma.candidato.create({
      data: {
        nombre: 'Sabrina Castro', dni: '42100900', puesto: 'Agente Atención',
        campana: 'AYSA', estado: 'EN_CAPACITACION', riesgo: 'BAJO',
        fechaPostulacion: new Date('2024-02-08'),
        evalRRHH: { create: { score: 5, aptoC: true, feedback: 'Candidata ideal. Comunicación fluida, empatía excelente, manejo del estrés sobresaliente. Se destacó en la dinámica grupal. Muy recomendada.' } },
        evalOps: { create: { score: 5, recomendado: true, feedback: 'Excelente perfil para atención AYSA. Conoce el rubro, respuestas muy precisas. Actitud proactiva y orientación al cliente nata.' } },
        evalCap: { create: { score: 4, listo: true, tieneAlerta: false, feedback: 'Rápida curva de aprendizaje. Dominó las herramientas en 2 días. Muy buena disposición para ayudar al grupo. Lista para piso.' } },
        historial: { create: [
          { evento: 'Colaborador ingresado', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 5/5 — Apto Cultural', color: 'purple' },
          { evento: 'Feedback Operaciones registrado', detalle: 'Score 5/5 — Recomendada', color: 'blue' },
          { evento: 'Feedback Capacitación registrado', detalle: 'Score 4/5 — Lista para piso', color: 'green' },
        ]},
      },
    })

    // ── Diego Herrera — CSV ──
    await prisma.candidato.create({
      data: {
        nombre: 'Diego Herrera', dni: '39800300', puesto: 'Agente CSR',
        campana: 'CSV', estado: 'INGRESADO', riesgo: 'MEDIO',
        fechaPostulacion: new Date('2024-01-10'),
        evalRRHH: { create: { score: 2, aptoC: false, feedback: 'Poca adaptabilidad al cambio detectada en la dinámica grupal. Respuestas rígidas. No encaja del todo con la cultura, pero tiene motivación. Aceptado con reservas.' } },
        evalOps: { create: { score: 4, recomendado: true, feedback: 'Buena actitud operativa, manejo básico pero correcto del producto. Recomendado con seguimiento cercano durante los primeros meses.' } },
        evalCap: { create: { score: 3, listo: true, tieneAlerta: false, feedback: 'Mejoró notablemente durante la capacitación. Superó las dificultades iniciales con las herramientas. Actitud de mejora continua. Listo para piso.' } },
        alertas: { create: [{ etapa: 'RRHH', tipo: 'CONDUCTUAL', descripcion: 'Baja adaptabilidad al cambio detectada en dinámica grupal de entrevista', esDeEstado: false }] },
        historial: { create: [
          { evento: 'Colaborador ingresado', color: 'blue' },
          { evento: 'Feedback RRHH registrado', detalle: 'Score 2/5 — No apto cultural', color: 'red' },
          { evento: '⚠ Alerta — RRHH', detalle: '[CONDUCTUAL] Baja adaptabilidad', color: 'red' },
          { evento: 'Feedback Operaciones registrado', detalle: 'Score 4/5 — Recomendado', color: 'blue' },
          { evento: 'Feedback Capacitación registrado', detalle: 'Score 3/5 — Listo para piso', color: 'green' },
          { evento: '✅ Ingresó', color: 'green' },
        ]},
      },
    })

    return NextResponse.json({ message: '✅ Setup completado — 7 colaboradores cargados correctamente.' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error en setup', detail: String(e) }, { status: 500 })
  }
}
