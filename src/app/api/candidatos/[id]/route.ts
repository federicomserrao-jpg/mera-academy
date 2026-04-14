import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcularRiesgo } from '@/lib/utils'

const include = {
  evalOps: true, evalRRHH: true, evalCap: true,
  alertas:   { orderBy: { createdAt: 'asc' as const } },
  historial: { orderBy: { createdAt: 'asc' as const } },
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const c = await prisma.candidato.findUnique({ where: { id: params.id }, include })
    if (!c) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ data: c })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const { action } = body
    const { id } = params

    if (action === 'estado') {
      const estadoLabel: Record<string, string> = {
        INGRESADO: '✅ Ingresó', RECHAZADO: '✗ Rechazado',
        EN_CAPACITACION: '→ En Capacitación', EN_PROCESO: '→ En Proceso',
      }
      const colorMap: Record<string, string> = {
        INGRESADO: 'green', RECHAZADO: 'red', EN_CAPACITACION: 'blue', EN_PROCESO: 'gray',
      }
      const c = await prisma.candidato.update({
        where: { id },
        data: {
          estado: body.estado,
          historial: { create: [{ evento: estadoLabel[body.estado] ?? body.estado, color: colorMap[body.estado] ?? 'blue', esDeEstado: true } as { evento: string; color: string }] },
        },
        include,
      })
      return NextResponse.json({ data: c })
    }

    if (action === 'eval_ops') {
      const c = await prisma.candidato.update({
        where: { id },
        data: {
          evalOps: {
            upsert: {
              create: { score: body.score, tecnica: body.tecnica, recomendado: body.recomendado, comentarios: body.comentarios },
              update: { score: body.score, tecnica: body.tecnica, recomendado: body.recomendado, comentarios: body.comentarios },
            },
          },
          historial: { create: [{ evento: 'Evaluación Operaciones actualizada', detalle: `Score ${body.score}/5 — ${body.recomendado ? 'Recomendado' : 'No recomendado'}`, color: 'blue' }] },
        },
        include,
      })
      return NextResponse.json({ data: c })
    }

    if (action === 'eval_rrhh') {
      const c = await prisma.candidato.update({
        where: { id },
        data: {
          evalRRHH: {
            upsert: {
              create: { blandas: body.blandas, comunicacion: body.comunicacion, adaptabilidad: body.adaptabilidad, aptoC: body.aptoC, comentarios: body.comentarios },
              update: { blandas: body.blandas, comunicacion: body.comunicacion, adaptabilidad: body.adaptabilidad, aptoC: body.aptoC, comentarios: body.comentarios },
            },
          },
          historial: { create: [{ evento: 'Evaluación RRHH actualizada', detalle: `Blandas ${body.blandas}/5 — ${body.aptoC ? 'Apto Cultural' : 'No Apto'}`, color: 'purple' }] },
        },
        include,
      })
      return NextResponse.json({ data: c })
    }

    if (action === 'eval_cap') {
      const tieneAlerta = !!body.tipoAlerta
      let c = await prisma.candidato.update({
        where: { id },
        data: {
          evalCap: {
            upsert: {
              create: { herramientas: body.herramientas, curva: body.curva, cumplimiento: body.cumplimiento, listo: body.listo, tieneAlerta, tipoAlerta: body.tipoAlerta ?? null, comentarios: body.comentarios },
              update: { herramientas: body.herramientas, curva: body.curva, cumplimiento: body.cumplimiento, listo: body.listo, tieneAlerta, tipoAlerta: body.tipoAlerta ?? null, comentarios: body.comentarios },
            },
          },
          historial: { create: [{ evento: 'Evaluación Capacitación actualizada', detalle: `Herramientas ${body.herramientas}/5 — ${body.listo ? 'Listo' : 'No listo'}`, color: body.listo ? 'green' : 'yellow' }] },
        },
        include,
      })
      // Recalcular riesgo basado en alertas reales
      const riesgo = calcularRiesgo(c.alertas)
      if (riesgo !== c.riesgo) {
        c = await prisma.candidato.update({ where: { id }, data: { riesgo }, include })
      }
      return NextResponse.json({ data: c })
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.candidato.delete({ where: { id: params.id } })
    return NextResponse.json({ data: { deleted: true } })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
