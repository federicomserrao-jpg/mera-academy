'use client'

import { useEffect, useState, useCallback } from 'react'
import AppShell from '@/components/layout/AppShell'
import { Spinner, Avatar } from '@/components/ui'
import type { Candidato, Campana } from '@/types'
import { CAMPANA_LABELS } from '@/types'

const Stars = ({ value }: { value: number }) => (
  <span style={{ color: 'var(--yellow)', fontSize: 14 }}>
    {'★'.repeat(value)}{'☆'.repeat(5 - value)}
    <span style={{ color: 'var(--text3)', fontSize: 11, marginLeft: 4 }}>{value}/5</span>
  </span>
)

function avgScore(c: Candidato) {
  const scores = [c.evalOps?.score, c.evalRRHH?.score, c.evalCap?.score].filter((v): v is number => v != null)
  if (!scores.length) return 0
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10
}

export default function PoolPage() {
  const [colaboradores, setColaboradores] = useState<Candidato[]>([])
  const [loading, setLoading] = useState(true)
  const [campanaFilter, setCampanaFilter] = useState<Campana | ''>('')
  const [reFilter, setReFilter] = useState<'todos' | 'si' | 'no' | 'sin_evaluar'>('todos')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchPool = useCallback(async () => {
    const params = new URLSearchParams({ estado: 'INGRESADO' })
    if (campanaFilter) params.set('campana', campanaFilter)
    const r = await fetch(`/api/candidatos?${params}`)
    const d = await r.json()
    if (d.data) setColaboradores(d.data)
    setLoading(false)
  }, [campanaFilter])

  useEffect(() => { fetchPool() }, [fetchPool])

  async function toggleReContratable(c: Candidato, value: boolean | null) {
    setUpdating(c.id)
    await fetch(`/api/candidatos/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'info', reContratable: value }),
    })
    setUpdating(null)
    fetchPool()
  }

  const filtered = colaboradores.filter(c => {
    if (reFilter === 'si')          return c.reContratable === true
    if (reFilter === 'no')          return c.reContratable === false
    if (reFilter === 'sin_evaluar') return c.reContratable == null
    return true
  }).sort((a, b) => avgScore(b) - avgScore(a))

  const inp: React.CSSProperties = {
    background: 'var(--card)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '8px 12px', borderRadius: 8, fontSize: 12,
  }

  return (
    <AppShell>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Pool de Talentos</h2>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
          Colaboradores ingresados · Ordenados por score promedio
        </span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={campanaFilter} onChange={e => setCampanaFilter(e.target.value as Campana | '')} style={inp}>
          <option value="">Todas las campañas</option>
          {Object.entries(CAMPANA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={reFilter} onChange={e => setReFilter(e.target.value as typeof reFilter)} style={inp}>
          <option value="todos">Todos</option>
          <option value="si">✔ Re-contratables</option>
          <option value="no">✗ No re-contratables</option>
          <option value="sin_evaluar">Sin evaluar</option>
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--text3)' }}>{filtered.length} colaboradores</span>
        </div>
      </div>

      {loading ? <Spinner /> : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)', fontSize: 14 }}>
          No hay colaboradores ingresados con los filtros seleccionados.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {filtered.map(c => {
            const avg = avgScore(c)
            const re  = c.reContratable

            return (
              <div key={c.id} style={{
                background: 'var(--card)', border: `1px solid ${re === true ? '#22c55e30' : re === false ? '#ef444430' : 'var(--border)'}`,
                borderRadius: 10, padding: '16px 20px',
                display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 16, alignItems: 'center',
              }}>
                {/* Avatar */}
                <Avatar nombre={c.nombre} size={44} />

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{c.nombre}</span>
                    <span className="badge-blue" style={{ fontSize: 10 }}>{CAMPANA_LABELS[c.campana]}</span>
                    {c.grupoCap && (
                      <span className="badge-gray" style={{ fontSize: 10 }}>📚 {c.grupoCap.nombre}</span>
                    )}
                  </div>

                  {/* Scores */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
                    {c.evalRRHH  && <span style={{ fontSize: 12 }}><span style={{ color: 'var(--text3)' }}>RRHH </span><Stars value={c.evalRRHH.score} /></span>}
                    {c.evalOps   && <span style={{ fontSize: 12 }}><span style={{ color: 'var(--text3)' }}>Ops </span><Stars value={c.evalOps.score} /></span>}
                    {c.evalCap   && <span style={{ fontSize: 12 }}><span style={{ color: 'var(--text3)' }}>Cap </span><Stars value={c.evalCap.score} /></span>}
                    <span style={{ fontSize: 12, fontWeight: 700, color: avg >= 4 ? 'var(--green)' : avg >= 3 ? 'var(--yellow)' : 'var(--red)' }}>
                      Prom: {avg}/5
                    </span>
                  </div>

                  {/* Contact */}
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    {c.legajo   && <span style={{ fontSize: 11, color: 'var(--text3)' }}>🪪 Leg. {c.legajo}</span>}
                    {c.telefono && <span style={{ fontSize: 11, color: 'var(--text3)' }}>📱 {c.telefono}</span>}
                    {c.email    && <span style={{ fontSize: 11, color: 'var(--text3)' }}>✉ {c.email}</span>}
                    {c.fechaIngresoPiso && <span style={{ fontSize: 11, color: 'var(--text3)' }}>🏢 Ingresó {c.fechaIngresoPiso.split('T')[0]}</span>}
                    {!c.legajo && !c.telefono && !c.email && (
                      <span style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>Sin datos de contacto</span>
                    )}
                  </div>
                </div>

                {/* Re-contratable toggle */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>¿Re-contratable?</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {([
                      { v: true,  l: '✔ Sí', cls: re === true  ? 'badge-green' : 'badge-gray' },
                      { v: false, l: '✗ No', cls: re === false ? 'badge-red'   : 'badge-gray' },
                    ] as const).map(opt => (
                      <button
                        key={String(opt.v)}
                        disabled={updating === c.id}
                        onClick={() => toggleReContratable(c, re === opt.v ? null : opt.v)}
                        className={opt.cls}
                        style={{ cursor: 'pointer', border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}
                      >
                        {opt.l}
                      </button>
                    ))}
                  </div>
                  {avg >= 4 && re !== false && (
                    <span style={{ fontSize: 10, color: 'var(--green)' }}>⭐ Score alto</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AppShell>
  )
}
