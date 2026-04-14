import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Campana, EstadoCandidato } from '@/types'

export async function GET() {
  try {
    const candidatos = await prisma.candidato.findMany({
      include: { evalOps: true, evalRRHH: true, evalCap: true, alertas: true },
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

    const avgScoreOps  = avg(conOps.map(c => c.evalOps!.score))
    const avgScoreRRHH = avg(conRRHH.map(c => c.evalRRHH!.blandas))
    const avgScoreCap  = avg(conCap.map(c => c.evalCap!.herramientas))

    // Por campaña
    const campanaCounts = new Map<Campana, { total: number; conAlerta: number }>()
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
        avgScoreOps,
        avgScoreRRHH,
        avgScoreCap,
        completitudOps:  total ? Math.round(conOps.length  / total * 100) : 0,
        completitudRRHH: total ? Math.round(conRRHH.length / total * 100) : 0,
        completitudCap:  total ? Math.round(conCap.length  / total * 100) : 0,
        porCampana: Array.from(campanaCounts.entries())
          .map(([campana, v]) => ({ campana, ...v }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 8),
        porEstado: Array.from(estadoCounts.entries())
          .map(([estado, total]) => ({ estado, total })),
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener métricas' }, { status: 500 })
  }
}
