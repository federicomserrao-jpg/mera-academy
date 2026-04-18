export const dynamic = 'force-dynamic'
import { unstable_noStore as noStore } from 'next/cache'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarCSV } from '@/lib/utils'
import type { EstadoCandidato } from '@/types'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const campana = searchParams.get('campana')
    const estado  = searchParams.get('estado')  as EstadoCandidato | null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {}
    if (campana) where.campana = campana
    if (estado)  where.estado  = estado

    const candidatos = await prisma.candidato.findMany({
      where,
      include: {
        evalOps: true, evalRRHH: true, evalCap: true,
        alertas: true, historial: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const csv = generarCSV(candidatos as any)
    const date = new Date().toISOString().split('T')[0]

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="mera-candidatos-${date}.csv"`,
      },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error al exportar' }, { status: 500 })
  }
}
