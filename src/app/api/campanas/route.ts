export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const campanas = await prisma.campana.findMany({ orderBy: [{ orden: 'asc' }, { nombre: 'asc' }] })
    return NextResponse.json({ data: campanas })
  } catch {
    return NextResponse.json({ error: 'Error al obtener campañas' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { nombre, codigo } = await req.json()
    if (!nombre?.trim() || !codigo?.trim()) {
      return NextResponse.json({ error: 'Nombre y código son requeridos' }, { status: 400 })
    }
    const count = await prisma.campana.count()
    const c = await prisma.campana.create({
      data: { codigo: codigo.trim().toUpperCase().replace(/\s+/g, '_'), nombre: nombre.trim(), orden: count },
    })
    return NextResponse.json({ data: c }, { status: 201 })
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'Ya existe una campaña con ese código' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al crear campaña' }, { status: 500 })
  }
}
