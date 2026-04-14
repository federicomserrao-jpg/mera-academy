'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Spinner, EmptyState } from '@/components/ui'
import { ETAPA_LABELS, ALERTA_TIPO_LABELS, CAMPANA_LABELS } from '@/types'
import type { EtapaAlerta, TipoAlerta, Campana } from '@/types'

interface AlertaConCandidato {
  id: string
  etapa: EtapaAlerta
  tipo: TipoAlerta
  descripcion: string
  createdAt: string
  candidato: { id: string; nombre: string; campana: Campana; estado: string }
}

const TIPO_COLOR: Record<TipoAlerta, string> = {
  TECNICA: 'var(--blue)',
  CONDUCTUAL: 'var(--red)',
  ASISTENCIA: 'var(--yellow)',
}

export default function AlertasPage() {
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
            <div key={a.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: TIPO_COLOR[a.tipo], marginTop: 4, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: TIPO_COLOR[a.tipo] }}>
                    {ETAPA_LABELS[a.etapa]} — {ALERTA_TIPO_LABELS[a.tipo]}
                  </span>
                  <span className="badge-gray">{CAMPANA_LABELS[a.candidato.campana]}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{a.candidato.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>{a.descripcion}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', flexShrink: 0 }}>{a.createdAt.split('T')[0]}</div>
            </div>
          ))}
        </div>
      )}
    </AppShell>
  )
}
