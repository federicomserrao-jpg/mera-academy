'use client'

import { useEffect, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { StatCard, CompletitudCard, HBarChart, Spinner } from '@/components/ui'
import type { DashboardStats } from '@/types'
import { CAMPANA_LABELS, ESTADO_LABELS } from '@/types'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { if (d.data) setStats(d.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <AppShell><Spinner /></AppShell>
  if (!stats) return <AppShell><div style={{ color: 'var(--text3)', textAlign: 'center', padding: 40 }}>Error al cargar datos.</div></AppShell>

  return (
    <AppShell alertCount={stats.conAlerta}>
      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Candidatos" value={stats.total} />
        <StatCard label="Ingresados" value={stats.ingresados} sub={`${stats.pctConversion}% conversión`} color="var(--green)" />
        <StatCard label="Con Alerta" value={stats.conAlerta} color="var(--yellow)" />
        <StatCard label="Riesgo Alto" value={stats.riesgoAlto} color="var(--red)" />
      </div>

      {/* Completitud */}
      <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: 'var(--text2)' }}>Completitud de Evaluaciones</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <CompletitudCard titulo="Operaciones" pct={stats.completitudOps} done={Math.round(stats.total * stats.completitudOps / 100)} total={stats.total} color="var(--blue)" />
        <CompletitudCard titulo="RRHH" pct={stats.completitudRRHH} done={Math.round(stats.total * stats.completitudRRHH / 100)} total={stats.total} color="var(--purple)" />
        <CompletitudCard titulo="Capacitación" pct={stats.completitudCap} done={Math.round(stats.total * stats.completitudCap / 100)} total={stats.total} color="var(--green)" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 14, color: 'var(--text2)' }}>Por Campaña</h4>
          <HBarChart items={stats.porCampana.map(c => ({ label: CAMPANA_LABELS[c.campana], value: c.total }))} color="var(--accent)" />
        </div>
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 14, color: 'var(--text2)' }}>Por Estado</h4>
          <HBarChart items={stats.porEstado.map(e => ({ label: ESTADO_LABELS[e.estado as keyof typeof ESTADO_LABELS], value: e.total }))} color="var(--green)" />
        </div>
      </div>
    </AppShell>
  )
}
