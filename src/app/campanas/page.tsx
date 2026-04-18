'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { Spinner } from '@/components/ui'
import type { GrupoCapacitacion, Candidato, Site } from '@/types'
import { ESTADO_LABELS, SITE_LABELS } from '@/types'
import { useCampanas } from '@/context/CampanasContext'

type GrupoConStats = GrupoCapacitacion & {
  candidatos: (Candidato & { evalOps: { score: number } | null; evalRRHH: { score: number } | null; evalCap: { score: number } | null })[]
}

function avg(nums: number[]) {
  if (!nums.length) return null
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length * 10) / 10
}

const Stars = ({ value }: { value: number | null }) =>
  value == null ? <span style={{ color: 'var(--text3)', fontSize: 11 }}>—</span> : (
    <span style={{ fontSize: 12 }}>
      {'★'.repeat(Math.round(value))}{'☆'.repeat(5 - Math.round(value))}
      <span style={{ color: 'var(--text3)', marginLeft: 4 }}>{value}</span>
    </span>
  )

export default function CampanasPage() {
  const router = useRouter()
  const { campanas, labelOf, reload: reloadCampanas } = useCampanas()
  const [grupos, setGrupos] = useState<GrupoConStats[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Form state — grupo
  const [form, setForm] = useState({ nombre: '', campana: 'ADT', site: '' as Site | '', fechaInicio: '', fechaFin: '' })

  // Gestión de campañas
  const [showCampanas, setShowCampanas] = useState(false)
  const [newCampana, setNewCampana] = useState({ nombre: '', codigo: '' })
  const [campanaError, setCampanaError] = useState<string | null>(null)
  const [role, setRole] = useState('admin')

  useEffect(() => {
    const saved = localStorage.getItem('mera_role')
    if (saved) setRole(saved)
    const h = (e: Event) => setRole((e as CustomEvent).detail)
    window.addEventListener('mera_role_change', h)
    return () => window.removeEventListener('mera_role_change', h)
  }, [])

  async function handleToggleCampana(id: string, activo: boolean) {
    await fetch(`/api/campanas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo }),
    })
    reloadCampanas()
  }

  async function handleAddCampana(e: React.FormEvent) {
    e.preventDefault()
    setCampanaError(null)
    const res = await fetch('/api/campanas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCampana),
    })
    if (res.ok) {
      setNewCampana({ nombre: '', codigo: '' })
      reloadCampanas()
    } else {
      const d = await res.json()
      setCampanaError(d.error ?? 'Error al crear campaña')
    }
  }

  async function fetchGrupos() {
    const r = await fetch('/api/grupos')
    const d = await r.json()
    if (d.data) setGrupos(d.data)
    setLoading(false)
  }

  useEffect(() => { fetchGrupos() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/grupos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setShowForm(false)
    const firstCampana = campanas.find(c => c.activo)?.codigo ?? 'ADT'
    setForm({ nombre: '', campana: firstCampana, site: '', fechaInicio: '', fechaFin: '' })
    fetchGrupos()
  }

  async function handleCerrar(id: string) {
    const hoy = new Date().toISOString().split('T')[0]
    await fetch(`/api/grupos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activo: false, fechaFin: hoy }),
    })
    fetchGrupos()
  }

  // Agrupar por campaña
  const porCampana = grupos.reduce<Record<string, GrupoConStats[]>>((acc, g) => {
    if (!acc[g.campana]) acc[g.campana] = []
    acc[g.campana].push(g)
    return acc
  }, {})

  const inp: React.CSSProperties = {
    background: 'var(--card)', border: '1px solid var(--border)',
    color: 'var(--text)', padding: '8px 12px', borderRadius: 8, fontSize: 13,
    width: '100%', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5,
    display: 'block', marginBottom: 6, fontWeight: 600,
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Grupos de Capacitación</h2>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>
            Cohortes por campaña · {grupos.length} grupos en total
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {role === 'admin' && (
            <button className="btn-secondary" onClick={() => setShowCampanas(v => !v)}>
              ⚙ Campañas
            </button>
          )}
          <button className="btn-primary" onClick={() => setShowForm(true)}>+ Nuevo Grupo</button>
        </div>
      </div>

      {/* Panel de gestión de campañas */}
      {showCampanas && role === 'admin' && (
        <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, padding: 18, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text2)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            ⚙ Gestión de Campañas
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {campanas.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px' }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: c.activo ? 'var(--text)' : 'var(--text3)', textDecoration: c.activo ? 'none' : 'line-through' }}>
                  {c.nombre}
                </span>
                <button
                  onClick={() => handleToggleCampana(c.id, !c.activo)}
                  style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, cursor: 'pointer', border: '1px solid var(--border)', background: 'transparent', color: c.activo ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}
                >
                  {c.activo ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddCampana} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Nombre para mostrar *</label>
              <input
                value={newCampana.nombre}
                onChange={e => setNewCampana(p => ({ ...p, nombre: e.target.value }))}
                placeholder="Ej: Claro"
                required
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '7px 10px', borderRadius: 7, fontSize: 13, width: 160 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Código interno *</label>
              <input
                value={newCampana.codigo}
                onChange={e => setNewCampana(p => ({ ...p, codigo: e.target.value }))}
                placeholder="Ej: CLARO"
                required
                style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '7px 10px', borderRadius: 7, fontSize: 13, width: 130 }}
              />
            </div>
            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-end' }}>+ Agregar</button>
          </form>
          {campanaError && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--red)' }}>⚠ {campanaError}</div>
          )}
        </div>
      )}

      {loading ? <Spinner /> : Object.keys(porCampana).length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text3)', fontSize: 14 }}>
          No hay grupos creados todavía.<br />
          <span style={{ fontSize: 12 }}>Creá el primer grupo con el botón de arriba.</span>
        </div>
      ) : (
        Object.entries(porCampana).map(([campana, gs]) => (
          <div key={campana} style={{ marginBottom: 28 }}>
            {/* Campaign header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span className="badge-blue" style={{ fontSize: 13, padding: '4px 12px' }}>
                {labelOf(campana)}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>{gs.length} grupo{gs.length > 1 ? 's' : ''}</span>
            </div>

            {gs.map(g => {
              const total      = g.candidatos.length
              const ingresados = g.candidatos.filter(c => c.estado === 'INGRESADO').length
              const pct        = total ? Math.round(ingresados / total * 100) : 0
              const avgOps     = avg(g.candidatos.map(c => c.evalOps?.score).filter((v): v is number => v != null))
              const avgRRHH    = avg(g.candidatos.map(c => c.evalRRHH?.score).filter((v): v is number => v != null))
              const avgCap     = avg(g.candidatos.map(c => c.evalCap?.score).filter((v): v is number => v != null))
              const isExpanded = expanded === g.id

              return (
                <div key={g.id} style={{
                  background: 'var(--card)', border: '1px solid var(--border)',
                  borderRadius: 10, marginBottom: 8, overflow: 'hidden',
                }}>
                  {/* Group row */}
                  <div
                    onClick={() => setExpanded(isExpanded ? null : g.id)}
                    style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}
                  >
                    <span style={{ fontSize: 16, marginRight: 2 }}>{isExpanded ? '▾' : '▸'}</span>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {g.nombre}
                        {g.site && (
                          <span className="badge-gray" style={{ fontSize: 10 }}>
                            📍 {SITE_LABELS[g.site as Site]}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                        📅 {g.fechaInicio.split('T')[0]}
                        {g.fechaFin ? ` → ${g.fechaFin.split('T')[0]}` : ' → en curso'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{total}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>TOTAL</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{ingresados}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>INGRESADOS</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: pct >= 70 ? 'var(--green)' : pct >= 40 ? 'var(--yellow)' : 'var(--red)' }}>{pct}%</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)' }}>CONVERSIÓN</div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, fontSize: 12 }}>
                        <span style={{ color: 'var(--text3)', fontSize: 10 }}>Ops</span>
                        <Stars value={avgOps} />
                        <span style={{ color: 'var(--text3)', fontSize: 10, marginTop: 2 }}>RRHH</span>
                        <Stars value={avgRRHH} />
                        <span style={{ color: 'var(--text3)', fontSize: 10, marginTop: 2 }}>Cap</span>
                        <Stars value={avgCap} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                        <span className={g.activo ? 'badge-green' : 'badge-gray'} style={{ fontSize: 10 }}>
                          {g.activo ? 'Activo' : 'Cerrado'}
                        </span>
                        {g.activo && (
                          <button
                            className="btn-secondary"
                            style={{ fontSize: 11, padding: '4px 10px' }}
                            onClick={e => { e.stopPropagation(); handleCerrar(g.id) }}
                          >
                            Cerrar grupo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded: list of collaborators */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border)', padding: '12px 18px' }}>
                      {g.candidatos.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
                          Sin colaboradores asignados a este grupo.
                        </div>
                      ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                          <thead>
                            <tr>
                              {['Colaborador', 'DNI', 'Estado', 'Ops', 'RRHH', 'Cap'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: 'var(--text3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--border)' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {g.candidatos.map((c: Candidato & { evalOps: { score: number } | null; evalRRHH: { score: number } | null; evalCap: { score: number } | null }) => (
                              <tr
                                key={c.id}
                                onClick={() => router.push(`/candidatos?open=${c.id}`)}
                                style={{ cursor: 'pointer' }}
                                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg2)')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                              >
                                <td style={{ padding: '8px 10px', fontWeight: 500, color: 'var(--accent)' }}>{c.nombre}</td>
                                <td style={{ padding: '8px 10px', color: 'var(--text3)' }}>{c.dni}</td>
                                <td style={{ padding: '8px 10px' }}>
                                  <span className={
                                    c.estado === 'INGRESADO' ? 'badge-green' :
                                    c.estado === 'EN_CAPACITACION' ? 'badge-blue' :
                                    c.estado === 'RECHAZADO' ? 'badge-red' : 'badge-gray'
                                  } style={{ fontSize: 10 }}>
                                    {ESTADO_LABELS[c.estado as keyof typeof ESTADO_LABELS]}
                                  </span>
                                </td>
                                <td style={{ padding: '8px 10px' }}><Stars value={c.evalOps?.score ?? null} /></td>
                                <td style={{ padding: '8px 10px' }}><Stars value={c.evalRRHH?.score ?? null} /></td>
                                <td style={{ padding: '8px 10px' }}><Stars value={c.evalCap?.score ?? null} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))
      )}

      {/* Modal nuevo grupo */}
      {showForm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
          onClick={() => setShowForm(false)}
        >
          <div
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 14, width: '100%', maxWidth: 460 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 700 }}>Nuevo Grupo de Capacitación</span>
              <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              <div style={{ padding: '18px 20px', display: 'grid', gap: 14 }}>
                <div>
                  <label style={lbl}>Nombre del grupo *</label>
                  <input
                    value={form.nombre}
                    onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    placeholder="Ej: ADT — Enero 2024 G1"
                    required style={inp}
                  />
                </div>
                <div>
                  <label style={lbl}>Campaña *</label>
                  <select
                    value={form.campana}
                    onChange={e => setForm(f => ({ ...f, campana: e.target.value }))}
                    required style={inp}
                  >
                    {campanas.filter(c => c.activo).map(c => <option key={c.codigo} value={c.codigo}>{c.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Site *</label>
                  <select
                    value={form.site}
                    onChange={e => setForm(f => ({ ...f, site: e.target.value as Site | '' }))}
                    required style={inp}
                  >
                    <option value="">Seleccioná un site</option>
                    {Object.entries(SITE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={lbl}>Fecha inicio *</label>
                    <input type="date" value={form.fechaInicio} onChange={e => setForm(f => ({ ...f, fechaInicio: e.target.value }))} required style={inp} />
                  </div>
                  <div>
                    <label style={lbl}>Fecha fin (opcional)</label>
                    <input type="date" value={form.fechaFin} onChange={e => setForm(f => ({ ...f, fechaFin: e.target.value }))} style={inp} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creando...' : 'Crear Grupo'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
