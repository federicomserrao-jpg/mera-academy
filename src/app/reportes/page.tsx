'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard, HBarChart, Spinner } from '@/components/ui'
import type { DashboardStats } from '@/types'
import { ESTADO_LABELS } from '@/types'
import { useCampanas } from '@/context/CampanasContext'

export default function ReportesPage() {
  const { labelOf } = useCampanas()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (d.data) setStats(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <AppShell>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button className="btn-primary" onClick={() => window.open('/api/export', '_blank')}>
          ⬇ Exportar CSV
        </button>
      </div>

      {loading ? <Spinner /> : !stats ? (
        <div style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>Error al cargar datos.</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
            <StatCard label="Tasa de Conversión" value={`${stats.pctConversion}%`} sub={`${stats.ingresados} de ${stats.total}`} color="var(--green)" />
            <StatCard label="Score Prom. Ops" value={stats.avgScoreOps} sub="sobre 5" color="var(--blue)" />
            <StatCard label="Score Prom. RRHH" value={stats.avgScoreRRHH} sub="sobre 5" color="var(--purple)" />
            <StatCard label="Score Prom. Cap" value={stats.avgScoreCap} sub="sobre 5" color="var(--green)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 14, color: 'var(--text2)' }}>Candidatos por Campaña</h4>
              <HBarChart items={stats.porCampana.map(c => ({ label: labelOf(c.campana), value: c.total }))} color="var(--accent)" />
            </div>
            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
              <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 14, color: 'var(--text2)' }}>Candidatos por Estado</h4>
              <HBarChart items={stats.porEstado.map(e => ({ label: ESTADO_LABELS[e.estado as keyof typeof ESTADO_LABELS], value: e.total }))} color="var(--green)" />
            </div>
          </div>
        </>
      )}
    </AppShell>
  )
}
