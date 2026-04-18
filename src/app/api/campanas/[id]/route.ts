export const dynamic = 'force-dynamic'
import { unstable_noStore as noStore } from 'next/cache'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const data: Record<string, unknown> = {}
    if (body.nombre !== undefined) data.nombre = body.nombre.trim()
    if (body.activo !== undefined) data.activo = body.activo
    const c = await prisma.campana.update({ where: { id: params.id }, data })
    return NextResponse.json({ data: c })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar campaña' }, { status: 500 })
  }
}
