export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const include = {
  candidatos: {
    include: { evalOps: true, evalRRHH: true, evalCap: true, alertas: true },
    orderBy: { createdAt: 'asc' as const },
  },
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const grupo = await prisma.grupoCapacitacion.findUnique({
      where: { id: params.id },
      include,
    })
    if (!grupo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ data: grupo })
  } catch {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const grupo = await prisma.grupoCapacitacion.update({
      where: { id: params.id },
      data: {
        nombre: body.nombre,
        fechaFin: body.fechaFin ? new Date(body.fechaFin) : null,
        activo: body.activo,
      },
      include,
    })
    return NextResponse.json({ data: grupo })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al actualizar grupo' }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    // Desasociar candidatos antes de eliminar
    await prisma.candidato.updateMany({
      where: { grupoCapId: params.id },
      data: { grupoCapId: null },
    })
    await prisma.grupoCapacitacion.delete({ where: { id: params.id } })
    return NextResponse.json({ data: { deleted: true } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al eliminar grupo' }, { status: 500 })
  }
}
