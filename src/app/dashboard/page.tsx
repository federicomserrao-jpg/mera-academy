'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { StatCard, CompletitudCard, HBarChart, Spinner } from '@/components/ui'
import type { DashboardStats } from '@/types'
import { ESTADO_LABELS, ALERTA_TIPO_LABELS, ETAPA_LABELS } from '@/types'
import { useCampanas } from '@/context/CampanasContext'

const TIPO_COLOR: Record<string, string> = {
  TECNICA: 'var(--blue)', CONDUCTUAL: 'var(--red)', ASISTENCIA: 'var(--yellow)',
}

function DiasChip({ dias }: { dias: number }) {
  const color = dias >= 7 ? 'var(--red)' : dias >= 3 ? 'var(--yellow)' : 'var(--text3)'
  return (
    <span style={{ fontSize: 10, color, fontWeight: 600, background: `${color}18`, padding: '2px 7px', borderRadius: 20 }}>
      {dias === 0 ? 'hoy' : `${dias}d`}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { labelOf } = useCampanas()
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

  const totalPendientes = stats.pendientesOps.length + stats.pendientesRRHH.length + stats.pendientesCap.length

  return (
    <AppShell alertCount={stats.conAlerta}>

      {/* ── KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Colaboradores" value={stats.total} />
        <StatCard label="Ingresados" value={stats.ingresados} sub={`${stats.pctConversion}% conversión`} color="var(--green)" />
        <StatCard label="Con Alerta" value={stats.conAlerta} color="var(--yellow)" />
        <StatCard label="Riesgo Alto" value={stats.riesgoAlto} color="var(--red)" />
        <StatCard label="Pendientes de Eval" value={totalPendientes} sub="sin evaluar" color={totalPendientes > 0 ? 'var(--yellow)' : 'var(--text3)'} />
      </div>

      {/* ── Completitud ── */}
      <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Completitud de Evaluaciones
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 24 }}>
        <CompletitudCard titulo="Operaciones" pct={stats.completitudOps} done={Math.round(stats.total * stats.completitudOps / 100)} total={stats.total} color="var(--blue)" />
        <CompletitudCard titulo="RRHH" pct={stats.completitudRRHH} done={Math.round(stats.total * stats.completitudRRHH / 100)} total={stats.total} color="var(--purple)" />
        <CompletitudCard titulo="Capacitación" pct={stats.completitudCap} done={Math.round(stats.total * stats.completitudCap / 100)} total={stats.total} color="var(--green)" />
      </div>

      {/* ── Pendientes por área ── */}
      {totalPendientes > 0 && (
        <>
          <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⏳ Pendientes de Evaluación
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Operaciones', color: 'var(--blue)', items: stats.pendientesOps },
              { label: 'RRHH', color: '#a855f7', items: stats.pendientesRRHH },
              { label: 'Capacitación', color: 'var(--green)', items: stats.pendientesCap },
            ].map(({ label, color, items }) => items.length > 0 && (
              <div key={label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {label} — {items.length} pendiente{items.length > 1 ? 's' : ''}
                </div>
                {items.map(p => (
                  <div
                    key={p.id}
                    onClick={() => router.push(`/candidatos?open=${p.id}`)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>{p.nombre}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>{labelOf(p.campana)}</div>
                    </div>
                    <DiasChip dias={p.dias} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Bottom row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>

        {/* Últimos ingresados */}
        {stats.ultimosIngresados.length > 0 && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, marginBottom: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ✅ Últimos Ingresados
            </h4>
            {stats.ultimosIngresados.map(c => (
              <div
                key={c.id}
                onClick={() => router.push(`/candidatos?open=${c.id}`)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.nombre}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{labelOf(c.campana)}</div>
                </div>
                {c.fechaIngresoPiso && (
                  <span style={{ fontSize: 10, color: 'var(--green)' }}>🏢 {c.fechaIngresoPiso.split('T')[0]}</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Alertas recientes */}
        {stats.alertasRecientes.length > 0 && (
          <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
            <h4 style={{ fontSize: 11, fontWeight: 700, marginBottom: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ⚠ Alertas Recientes
            </h4>
            {stats.alertasRecientes.map(a => (
              <div
                key={a.id}
                onClick={() => router.push(`/candidatos?open=${a.candidato.id}`)}
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: TIPO_COLOR[a.tipo] ?? 'var(--text3)', marginTop: 4, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{a.candidato.nombre}</div>
                  <div style={{ fontSize: 10, color: TIPO_COLOR[a.tipo] ?? 'var(--text3)', fontWeight: 600 }}>
                    {ETAPA_LABELS[a.etapa as keyof typeof ETAPA_LABELS]} — {ALERTA_TIPO_LABELS[a.tipo as keyof typeof ALERTA_TIPO_LABELS]}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{a.descripcion}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Por campaña */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <h4 style={{ fontSize: 11, fontWeight: 700, marginBottom: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Por Campaña
          </h4>
          <HBarChart items={stats.porCampana.map(c => ({ label: labelOf(c.campana), value: c.total }))} color="var(--accent)" />
        </div>

        {/* Por estado */}
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
          <h4 style={{ fontSize: 11, fontWeight: 700, marginBottom: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Por Estado
          </h4>
          <HBarChart items={stats.porEstado.map(e => ({ label: ESTADO_LABELS[e.estado as keyof typeof ESTADO_LABELS], value: e.total }))} color="var(--green)" />
        </div>

      </div>
    </AppShell>
  )
}
