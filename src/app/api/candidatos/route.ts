import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Campana, EstadoCandidato } from '@/types'

const include = {
  evalOps: true, evalRRHH: true, evalCap: true,
  alertas: { orderBy: { createdAt: 'asc' as const } },
  historial: { orderBy: { createdAt: 'asc' as const } },
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campana  = searchParams.get('campana') as Campana | null
    const estado   = searchParams.get('estado') as EstadoCandidato | null
    const alerta   = searchParams.get('alerta')
    const search   = searchParams.get('search')
    const desde    = searchParams.get('desde')
    const hasta    = searchParams.get('hasta')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (campana) where.campana = campana
    if (estado)  where.estado  = estado
    if (search)  where.OR = [
      { nombre: { contains: search, mode: 'insensitive' } },
      { dni:    { contains: search } },
    ]
    if (desde || hasta) {
      where.fechaPostulacion = {}
      if (desde) where.fechaPostulacion.gte = new Date(desde)
      if (hasta) where.fechaPostulacion.lte = new Date(hasta + 'T23:59:59')
    }

    const candidatos = await prisma.candidato.findMany({
      where,
      include,
      orderBy: { createdAt: 'desc' },
    })

    const filtered = alerta === 'con'
      ? candidatos.filter(c => c.alertas.some(a => !a.esDeEstado))
      : alerta === 'sin'
      ? candidatos.filter(c => !c.alertas.some(a => !a.esDeEstado))
      : candidatos

    return NextResponse.json({ data: filtered })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al obtener candidatos' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nombre, dni, puesto, campana } = body

    if (!nombre || !dni || !campana) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const candidato = await prisma.candidato.create({
      data: {
        nombre,
        dni,
        puesto: puesto || null,
        campana,
        historial: {
          create: [{ evento: 'Candidato creado', detalle: `Postulación registrada para campaña ${campana}`, color: 'blue' }],
        },
      },
      include,
    })

    return NextResponse.json({ data: candidato }, { status: 201 })
  } catch (e: unknown) {
    if ((e as { code?: string })?.code === 'P2002') {
      return NextResponse.json({ error: 'El DNI ya existe en el sistema' }, { status: 409 })
    }
    console.error(e)
    return NextResponse.json({ error: 'Error al crear candidato' }, { status: 500 })
  }
}
