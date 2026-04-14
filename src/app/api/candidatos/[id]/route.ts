export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcularRiesgo } from '@/lib/utils'

const include = {
  evalOps: true, evalRRHH: true, evalCap: true,
  alertas:   { orderBy: { createdAt: 'asc' as const } },
  historial: { orderBy: { createdAt: 'asc' as const } },
  grupoCap:  true,
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
          historial: { create: [{ evento: estadoLabel[body.estado] ?? body.estado, color: colorMap[body.estado] ?? 'blue' }] },
        },
        include,
      })
      return NextResponse.json({ data: c })
    }

    if (action === 'eval_ops') {
      const feedback = (body.feedback ?? '').trim()
      const c = await prisma.candidato.update({
        where: { id },
        data: {
          evalOps: {
            upsert: {
              create: { score: body.score, recomendado: body.recomendado, feedback },
              update: { score: body.score, recomendado: body.recomendado, feedback },
            },
          },
          historial: { create: [{ evento: 'Feedback Operaciones registrado', detalle: `Score ${body.score}/5 — ${body.recomendado ? 'Recomendado' : 'No recomendado'}`, color: 'blue' }] },
        },
        include,
      })
      return NextResponse.json({ data: c })
    }

    if (action === 'eval_rrhh') {
      const feedback = (body.feedback ?? '').trim()
      const c = await prisma.candidato.update({
        where: { id },
        data: {
          evalRRHH: {
            upsert: {
              create: { score: body.score, aptoC: body.aptoC, feedback },
              update: { score: body.score, aptoC: body.aptoC, feedback },
            },
          },
          historial: { create: [{ evento: 'Feedback RRHH registrado', detalle: `Score ${body.score}/5 — ${body.aptoC ? 'Apto Cultural' : 'No Apto'}`, color: 'purple' }] },
        },
        include,
      })
      return NextResponse.json({ data: c })
    }

    if (action === 'eval_cap') {
      const feedback = (body.feedback ?? '').trim()
      const tieneAlerta = !!body.tipoAlerta
      let c = await prisma.candidato.update({
        where: { id },
        data: {
          evalCap: {
            upsert: {
              create: { score: body.score, listo: body.listo, tieneAlerta, tipoAlerta: body.tipoAlerta ?? null, feedback },
              update: { score: body.score, listo: body.listo, tieneAlerta, tipoAlerta: body.tipoAlerta ?? null, feedback },
            },
          },
          historial: { create: [{ evento: 'Feedback Capacitación registrado', detalle: `Score ${body.score}/5 — ${body.listo ? 'Listo para piso' : 'No listo'}`, color: body.listo ? 'green' : 'yellow' }] },
        },
        include,
      })
      const riesgo = calcularRiesgo(c.alertas)
      if (riesgo !== c.riesgo) {
        c = await prisma.candidato.update({ where: { id }, data: { riesgo }, include })
      }
      return NextResponse.json({ data: c })
    }

    if (action === 'info') {
      const toNullable = (v: unknown) => v !== undefined ? (v || null) : undefined
      const c = await prisma.candidato.update({
        where: { id },
        data: {
          nombre:           body.nombre       || undefined,
          puesto:           toNullable(body.puesto),
          campana:          body.campana      || undefined,
          telefono:         toNullable(body.telefono),
          email:            toNullable(body.email),
          legajo:           toNullable(body.legajo),
          fechaIngresoPiso: body.fechaIngresoPiso ? new Date(body.fechaIngresoPiso) : body.fechaIngresoPiso === '' ? null : undefined,
          reContratable:    body.reContratable ?? undefined,
          grupoCapId:       toNullable(body.grupoCapId),
        },
        include,
      })
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
