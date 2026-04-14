export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const include = {
  candidatos: {
    include: { evalOps: true, evalRRHH: true, evalCap: true },
  },
}

export async function GET() {
  try {
    const grupos = await prisma.grupoCapacitacion.findMany({
      include,
      orderBy: { fechaInicio: 'desc' },
    })
    return NextResponse.json({ data: grupos })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener grupos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, campana, fechaInicio, fechaFin } = await req.json()
    if (!nombre || !campana || !fechaInicio) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }
    const grupo = await prisma.grupoCapacitacion.create({
      data: {
        nombre,
        campana,
        fechaInicio: new Date(fechaInicio),
        fechaFin: fechaFin ? new Date(fechaFin) : null,
      },
      include,
    })
    return NextResponse.json({ data: grupo }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al crear grupo' }, { status: 500 })
  }
}
