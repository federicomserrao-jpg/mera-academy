'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { Spinner, EmptyState } from '@/components/ui'
import { ETAPA_LABELS, ALERTA_TIPO_LABELS } from '@/types'
import type { EtapaAlerta, TipoAlerta } from '@/types'
import { useCampanas } from '@/context/CampanasContext'

interface AlertaConCandidato {
  id: string
  etapa: EtapaAlerta
  tipo: TipoAlerta
  descripcion: string
  createdAt: string
  candidato: { id: string; nombre: string; campana: string; estado: string }
}

const TIPO_COLOR: Record<TipoAlerta, string> = {
  TECNICA: 'var(--blue)',
  CONDUCTUAL: 'var(--red)',
  ASISTENCIA: 'var(--yellow)',
}

export default function AlertasPage() {
  const router = useRouter()
  const { labelOf } = useCampanas()
  const [alertas, setAlertas] = useState<AlertaConCandidato[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/alertas')
      .then(r => r.json())
      .then(d => { if (d.data) setAlertas(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <AppShell alertCount={alertas.length}>
      {loading ? <Spinner /> : alertas.length === 0 ? (
        <EmptyState message="No hay alertas registradas." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {alertas.map(a => (
            <div
              key={a.id}
              onClick={() => router.push(`/candidatos?open=${a.candidato.id}`)}
              style={{
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10,
                padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start',
                cursor: 'pointer', transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: TIPO_COLOR[a.tipo], marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TIPO_COLOR[a.tipo] }}>
                    {ETAPA_LABELS[a.etapa]} — {ALERTA_TIPO_LABELS[a.tipo]}
                  </span>
                  <span className="badge-gray">{labelOf(a.candidato.campana)}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{a.candidato.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.descripcion}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{a.createdAt.split('T')[0]}</span>
                <span style={{ fontSize: 10, color: 'var(--accent)' }}>Ver perfil →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
