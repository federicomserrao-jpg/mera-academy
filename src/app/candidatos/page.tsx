'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { Candidato, EstadoCandidato, FiltrosCandidatos, GrupoCapacitacion, Campana } from '@/types'
import { CAMPANA_LABELS } from '@/types'
import AppShell from '@/components/layout/AppShell'
import CandidatoTable from '@/components/candidatos/CandidatoTable'
import CandidatoModal from '@/components/candidatos/CandidatoModal'
import FiltersBar from '@/components/ui/FiltersBar'
import { Spinner } from '@/components/ui'

export default function CandidatosPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Candidato | null>(null)
  const [role, setRole] = useState('admin')
  const [showNew, setShowNew] = useState(false)
  const [filters, setFilters] = useState<FiltrosCandidatos>({})
  const [saving, setSaving] = useState(false)
  const [newError, setNewError] = useState<string | null>(null)
  const [grupos, setGrupos] = useState<GrupoCapacitacion[]>([])
  const [newCampana, setNewCampana] = useState<Campana>('ADT')

  const fetchCandidatos = useCallback(async () => {
    const params = new URLSearchParams()
    if (filters.campana) params.set('campana', filters.campana)
    if (filters.estado) params.set('estado', filters.estado)
    if (filters.alerta) params.set('alerta', filters.alerta)
    if (filters.search) params.set('search', filters.search)
    if (filters.desde) params.set('desde', filters.desde)
    if (filters.hasta) params.set('hasta', filters.hasta)
    if (filters.grupoCapId) params.set('grupoCapId', filters.grupoCapId)
    if (filters.riesgo)     params.set('riesgo', filters.riesgo)
    const r = await fetch(`/api/candidatos?${params}`)
    const d = await r.json()
    if (d.data) setCandidatos(d.data)
    setLoading(false)
  }, [filters])

  useEffect(() => { fetchCandidatos() }, [fetchCandidatos])

  // Auto-open modal when navigated from alertas page (?open=<id>)
  useEffect(() => {
    const openId = searchParams.get('open')
    if (!openId || loading) return
    const match = candidatos.find(c => c.id === openId)
    if (match) {
      setSelected(match)
      router.replace('/candidatos') // clean the URL
    } else {
      // candidato not in current filter — fetch directly
      fetch(`/api/candidatos/${openId}`)
        .then(r => r.json())
        .then(d => { if (d.data) setSelected(d.data) })
      router.replace('/candidatos')
    }
  }, [searchParams, loading, candidatos, router])

  useEffect(() => {
    fetch('/api/grupos').then(r => r.json()).then(d => { if (d.data) setGrupos(d.data) })
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('mera_role')
    if (saved) setRole(saved)
    const roleHandler = (e: Event) => setRole((e as CustomEvent).detail)
    const newHandler = () => setShowNew(true)
    window.addEventListener('mera_role_change', roleHandler)
    window.addEventListener('mera_open_new_candidate', newHandler)
    return () => {
      window.removeEventListener('mera_role_change', roleHandler)
      window.removeEventListener('mera_open_new_candidate', newHandler)
    }
  }, [])

  const handleEstadoChange = async (id: string, estado: EstadoCandidato) => {
    await fetch(`/api/candidatos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'estado', estado }),
    })
    fetchCandidatos()
    if (selected?.id === id) {
      const r = await fetch(`/api/candidatos/${id}`)
      const d = await r.json()
      if (d.data) setSelected(d.data)
    }
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/candidatos/${id}`, { method: 'DELETE' })
    setSelected(null)
    fetchCandidatos()
  }

  const handleSaveEval = async (id: string, _stage: string, data: Record<string, unknown>) => {
    await fetch(`/api/candidatos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    fetchCandidatos()
    const r = await fetch(`/api/candidatos/${id}`)
    const d = await r.json()
    if (d.data) setSelected(d.data)
  }

  const handleSaveAlert = async (id: string, data: { etapa: string; tipo: string; descripcion: string }) => {
    await fetch('/api/alertas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidatoId: id, ...data }),
    })
    fetchCandidatos()
    const r = await fetch(`/api/candidatos/${id}`)
    const d = await r.json()
    if (d.data) setSelected(d.data)
  }

  const handleCreateCandidato = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNewError(null)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setSaving(true)
    const r = await fetch('/api/candidatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    if (r.ok) { setShowNew(false); setNewError(null); fetchCandidatos() }
    else { const d = await r.json(); setNewError(d.error ?? 'Error al crear el colaborador.') }
  }

  const alertCount = candidatos.filter(c => c.alertas?.some(a => !a.esDeEstado)).length

  return (
    <AppShell alertCount={alertCount}>
      <FiltersBar filters={filters} onChange={f => setFilters(prev => ({ ...prev, ...f }))} grupos={grupos} />

      {loading ? <Spinner /> : (
        <CandidatoTable
          candidatos={candidatos}
          onRowClick={setSelected}
          onEstadoChange={handleEstadoChange}
        />
      )}

      {selected && (
        <CandidatoModal
          candidato={selected}
          role={role}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
          onSaveEval={handleSaveEval}
          onSaveAlert={handleSaveAlert}
        />
      )}

      {/* Modal nuevo candidato */}
      {showNew && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
          onClick={() => { setShowNew(false); setNewError(null) }}
        >
          <div
            style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 14, width: '100%', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Nuevo Colaborador</span>
              <button onClick={() => { setShowNew(false); setNewError(null) }} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
            {newError && (
              <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: '#ef444415', border: '1px solid #ef444430', borderRadius: 8, fontSize: 12, color: 'var(--red)', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠ {newError}
              </div>
            )}
            <form onSubmit={handleCreateCandidato}>
              <div style={{ padding: '18px 20px', display: 'grid', gap: 12 }}>
                {/* Row: nombre + DNI */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'nombre', label: 'Nombre completo *', required: true },
                    { id: 'dni',    label: 'DNI *',             required: true },
                  ].map(f => (
                    <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
                      <input name={f.id} required={f.required} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13 }} />
                    </div>
                  ))}
                </div>

                {/* Row: puesto + legajo */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'puesto', label: 'Puesto' },
                    { id: 'legajo', label: 'Legajo interno' },
                  ].map(f => (
                    <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
                      <input name={f.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13 }} />
                    </div>
                  ))}
                </div>

                {/* Row: telefono + email */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { id: 'telefono', label: 'Teléfono' },
                    { id: 'email',    label: 'Email' },
                  ].map(f => (
                    <div key={f.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{f.label}</label>
                      <input name={f.id} type={f.id === 'email' ? 'email' : 'text'} style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13 }} />
                    </div>
                  ))}
                </div>

                {/* Campaña */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Campaña *</label>
                  <select
                    name="campana" required
                    value={newCampana}
                    onChange={e => setNewCampana(e.target.value as Campana)}
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13 }}
                  >
                    {Object.entries(CAMPANA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                {/* Grupo de capacitación */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <label style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Grupo de capacitación</label>
                  <select
                    name="grupoCapId"
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 10px', borderRadius: 7, fontSize: 13 }}
                  >
                    <option value="">Sin asignar</option>
                    {grupos.filter(g => g.campana === newCampana && g.activo).map(g => (
                      <option key={g.id} value={g.id}>{g.nombre}{g.site ? ` — ${g.site === 'OLIVOS' ? 'Olivos' : 'Parque Patricios'}` : ''}</option>
                    ))}
                  </select>
                  {grupos.filter(g => g.campana === newCampana && g.activo).length === 0 && (
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      No hay grupos activos para {CAMPANA_LABELS[newCampana]}. Creá uno en Campañas.
                    </span>
                  )}
                </div>
              </div>
              <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowNew(false)}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Creando...' : 'Registrar Colaborador'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  )
}
