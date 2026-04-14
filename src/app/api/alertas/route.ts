import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calcularRiesgo } from '@/lib/utils'

export async function GET() {
  try {
    const alertas = await prisma.alerta.findMany({
      where: { esDeEstado: false },
      include: { candidato: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ data: alertas })
  } catch {
    return NextResponse.json({ error: 'Error al obtener alertas' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { candidatoId, etapa, tipo, descripcion } = await req.json()

    if (!candidatoId || !etapa || !tipo || !descripcion) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    await prisma.alerta.create({
      data: { candidatoId, etapa, tipo, descripcion, esDeEstado: false },
    })

    // Recalcular riesgo del candidato
    const candidato = await prisma.candidato.findUnique({
      where: { id: candidatoId },
      include: { alertas: true },
    })
    if (candidato) {
      const riesgo = calcularRiesgo(candidato.alertas)
      await prisma.candidato.update({
        where: { id: candidatoId },
        data: {
          riesgo,
          historial: {
            create: [{ evento: `⚠ Alerta — ${etapa}`, detalle: `[${tipo}] ${descripcion}`, color: 'red' }],
          },
        },
      })
    }

    return NextResponse.json({ data: { ok: true } }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear alerta' }, { status: 500 })
  }
}
