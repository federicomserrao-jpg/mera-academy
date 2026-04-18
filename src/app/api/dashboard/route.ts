export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { EstadoCandidato } from '@/types'

function diasDesde(fecha: Date) {
  return Math.floor((Date.now() - fecha.getTime()) / 86_400_000)
}

export async function GET() {
  try {
    const candidatos = await prisma.candidato.findMany({
      include: { evalOps: true, evalRRHH: true, evalCap: true, alertas: true },
      orderBy: { createdAt: 'desc' },
    })

    const total     = candidatos.length
    const ingresados = candidatos.filter(c => c.estado === 'INGRESADO').length
    const conAlerta  = candidatos.filter(c => c.alertas.some(a => !a.esDeEstado)).length
    const riesgoAlto = candidatos.filter(c => c.riesgo === 'ALTO').length
    const ingresadosConAlerta = candidatos.filter(c => c.estado === 'INGRESADO' && c.alertas.some(a => !a.esDeEstado)).length

    const conOps  = candidatos.filter(c => c.evalOps)
    const conRRHH = candidatos.filter(c => c.evalRRHH)
    const conCap  = candidatos.filter(c => c.evalCap)

    const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length * 10) / 10 : 0

    // Pendientes por área — ordenados por días en espera (más antiguos primero)
    const pendientesOps = candidatos
      .filter(c => !c.evalOps && (c.estado === 'EN_PROCESO' || c.estado === 'EN_CAPACITACION'))
      .map(c => ({ id: c.id, nombre: c.nombre, campana: c.campana, dias: diasDesde(c.fechaPostulacion) }))
      .sort((a, b) => b.dias - a.dias)
      .slice(0, 10)

    const pendientesRRHH = candidatos
      .filter(c => !c.evalRRHH && (c.estado === 'EN_PROCESO' || c.estado === 'EN_CAPACITACION'))
      .map(c => ({ id: c.id, nombre: c.nombre, campana: c.campana, dias: diasDesde(c.fechaPostulacion) }))
      .sort((a, b) => b.dias - a.dias)
      .slice(0, 10)

    const pendientesCap = candidatos
      .filter(c => !c.evalCap && c.estado === 'EN_CAPACITACION')
      .map(c => ({ id: c.id, nombre: c.nombre, campana: c.campana, dias: diasDesde(c.fechaPostulacion) }))
      .sort((a, b) => b.dias - a.dias)
      .slice(0, 10)

    // Últimos ingresados
    const ultimosIngresados = candidatos
      .filter(c => c.estado === 'INGRESADO')
      .slice(0, 5)
      .map(c => ({ id: c.id, nombre: c.nombre, campana: c.campana, fechaIngresoPiso: c.fechaIngresoPiso?.toISOString() ?? null, createdAt: c.createdAt.toISOString() }))

    // Alertas recientes (last 5 real alerts)
    const alertasRecientes = await prisma.alerta.findMany({
      where: { esDeEstado: false },
      include: { candidato: { select: { id: true, nombre: true, campana: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })

    // Por campaña
    const campanaCounts = new Map<string, { total: number; conAlerta: number }>()
    candidatos.forEach(c => {
      if (!campanaCounts.has(c.campana)) campanaCounts.set(c.campana, { total: 0, conAlerta: 0 })
      const entry = campanaCounts.get(c.campana)!
      entry.total++
      if (c.alertas.some(a => !a.esDeEstado)) entry.conAlerta++
    })

    // Por estado
    const estadoCounts = new Map<EstadoCandidato, number>()
    candidatos.forEach(c => estadoCounts.set(c.estado, (estadoCounts.get(c.estado) ?? 0) + 1))

    return NextResponse.json({
      data: {
        total,
        ingresados,
        conAlerta,
        riesgoAlto,
        ingresadosConAlerta,
        pctConversion: total ? Math.round(ingresados / total * 100) : 0,
        pctRiesgoEnIngresados: ingresados ? Math.round(ingresadosConAlerta / ingresados * 100) : 0,
        avgScoreOps:  avg(conOps.map(c => c.evalOps!.score)),
        avgScoreRRHH: avg(conRRHH.map(c => c.evalRRHH!.score)),
        avgScoreCap:  avg(conCap.map(c => c.evalCap!.score)),
        completitudOps:  total ? Math.round(conOps.length  / total * 100) : 0,
        completitudRRHH: total ? Math.round(conRRHH.length / total * 100) : 0,
        completitudCap:  total ? Math.round(conCap.length  / total * 100) : 0,
        porCampana: Array.from(campanaCounts.entries())
          .map(([campana, v]) => ({ campana, ...v }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 8),
        porEstado: Array.from(estadoCounts.entries())
          .map(([estado, total]) => ({ estado, total })),
        pendientesOps,
        pendientesRRHH,
        pendientesCap,
        ultimosIngresados,
        alertasRecientes: alertasRecientes.map(a => ({
          id: a.id, tipo: a.tipo, etapa: a.etapa, descripcion: a.descripcion,
          createdAt: a.createdAt.toISOString(),
          candidato: a.candidato,
        })),
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener métricas' }, { status: 500 })
  }
}
