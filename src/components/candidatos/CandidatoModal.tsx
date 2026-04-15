'use client'
// src/components/candidatos/CandidatoModal.tsx

import { useState, useEffect } from 'react'
import type { Candidato, TipoAlerta, EtapaAlerta, GrupoCapacitacion, Campana } from '@/types'
import { CAMPANA_LABELS, ESTADO_LABELS, ALERTA_TIPO_LABELS, ETAPA_LABELS, SITE_LABELS } from '@/types'
import { Avatar, EstadoBadge, RiesgoBadge, ProgressDots } from '@/components/ui'

// ─── Sub-components ───────────────────────────────────────

const Stars = ({ value }: { value: number }) => (
  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
    {[1,2,3,4,5].map(s => (
      <span key={s} style={{ fontSize: 20, color: value >= s ? 'var(--yellow)' : 'var(--border)' }}>★</span>
    ))}
    <span style={{ fontSize: 13, color: 'var(--text3)', marginLeft: 6, fontWeight: 500 }}>{value}/5</span>
  </div>
)

const ClickableStars = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
    {[1,2,3,4,5].map(s => (
      <button
        key={s} type="button" onClick={() => onChange(s)}
        style={{
          fontSize: 34, background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px',
          color: value >= s ? 'var(--yellow)' : 'var(--border)', lineHeight: 1,
          transition: 'color 0.1s',
        }}
      >★</button>
    ))}
    <span style={{ fontSize: 15, color: 'var(--text2)', marginLeft: 8, fontWeight: 600 }}>{value}/5</span>
  </div>
)

const BoolPill = ({ value, onChange, yes, no }: { value: boolean; onChange: (v: boolean) => void; yes: string; no: string }) => (
  <div style={{ display: 'flex', gap: 8 }}>
    {[{ v: true, l: yes }, { v: false, l: no }].map(opt => (
      <button
        key={String(opt.v)} type="button" onClick={() => onChange(opt.v)}
        style={{
          padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          border: `1.5px solid ${value === opt.v ? (opt.v ? 'var(--green)' : 'var(--red)') : 'var(--border)'}`,
          background: value === opt.v ? (opt.v ? '#22c55e18' : '#ef444418') : 'transparent',
          color: value === opt.v ? (opt.v ? 'var(--green)' : 'var(--red)') : 'var(--text3)',
        }}
      >
        {opt.v ? '✔ ' : '✗ '}{opt.l}
      </button>
    ))}
  </div>
)

const FeedbackSection = ({
  title, icon, score, feedback, badge, badgeClass, empty, updatedAt, onEdit, locked,
}: {
  title: string; icon: string; score?: number | null; feedback?: string | null;
  badge: string; badgeClass: string; empty?: boolean;
  updatedAt?: string | null; onEdit?: () => void; locked?: boolean;
}) => (
  <div style={{
    background: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: 10, padding: 16, marginBottom: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>{title}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {updatedAt && !empty && (
          <span style={{ fontSize: 10, color: 'var(--text3)' }}>
            {new Date(updatedAt).toLocaleDateString('es-AR', { day:'2-digit', month:'2-digit', year:'numeric' })}
          </span>
        )}
        <span className={badgeClass}>{badge}</span>
        {onEdit && (
          <button onClick={onEdit} style={{
            fontSize: 11, padding: '3px 9px', borderRadius: 6, cursor: 'pointer',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--text2)', fontWeight: 500,
          }}>✏ Editar</button>
        )}
      </div>
    </div>
    {empty ? (
      <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic', padding: '4px 0' }}>
        Pendiente de evaluación.
      </div>
    ) : (
      <>
        {score != null && <Stars value={score} />}
        {feedback ? (
          <blockquote style={{
            margin: '12px 0 0', padding: '10px 14px',
            background: 'var(--bg)', borderLeft: '3px solid var(--accent)',
            borderRadius: '0 8px 8px 0', fontSize: 13, color: 'var(--text2)',
            lineHeight: 1.7, fontStyle: 'italic',
          }}>
            "{feedback}"
          </blockquote>
        ) : (
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>
            Sin feedback escrito.
          </div>
        )}
        {locked && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>
            🔒 Solo Admin puede modificar este feedback.
          </div>
        )}
      </>
    )}
  </div>
)

// ─── Form state type ──────────────────────────────────────

interface FormState {
  score: number
  recomendado: boolean
  aptoC: boolean
  listo: boolean
  tipoAlerta: string
  feedback: string
}

// ─── Main component ───────────────────────────────────────

interface Props {
  candidato: Candidato
  role: string
  onClose: () => void
  onDelete: (id: string) => Promise<void>
  onSaveEval: (id: string, stage: string, data: Record<string, unknown>) => Promise<void>
  onSaveAlert: (id: string, data: { etapa: EtapaAlerta; tipo: TipoAlerta; descripcion: string }) => Promise<void>
}

type Tab = 'eval' | 'timeline'
type SubView = 'profile' | 'eval_form' | 'alert_form' | 'info_form' | 'nota_form'

export default function CandidatoModal({ candidato: initial, role, onClose, onDelete, onSaveEval, onSaveAlert }: Props) {
  const [c, setC] = useState(initial)
  const [tab, setTab] = useState<Tab>('eval')
  const [subview, setSubview] = useState<SubView>('profile')
  const [saving, setSaving] = useState(false)
  const [grupos, setGrupos] = useState<GrupoCapacitacion[]>([])
  const [editingStage, setEditingStage] = useState<'ops' | 'rrhh' | 'cap'>('ops')
  const [nota, setNota] = useState('')
  const [infoForm, setInfoForm] = useState({
    nombre: initial.nombre,
    puesto: initial.puesto ?? '',
    campana: initial.campana as Campana,
    grupoCapId: initial.grupoCapId ?? '',
    telefono: initial.telefono ?? '',
    email: initial.email ?? '',
    legajo: initial.legajo ?? '',
    fechaIngresoPiso: initial.fechaIngresoPiso ? initial.fechaIngresoPiso.split('T')[0] : '',
  })

  useEffect(() => {
    fetch('/api/grupos').then(r => r.json()).then(d => { if (d.data) setGrupos(d.data) })
  }, [])

  const canEdit: string[] = { admin: ['ops','rrhh','cap'], operaciones: ['ops'], rrhh: ['rrhh'], capacitacion: ['cap'] }[role] ?? []

  // Admin puede editar siempre. Otros roles solo si el eval está vacío.
  function canEditStage(stage: 'ops' | 'rrhh' | 'cap') {
    if (!canEdit.includes(stage)) return false
    if (role === 'admin') return true
    const exists = stage === 'ops' ? !!c.evalOps : stage === 'rrhh' ? !!c.evalRRHH : !!c.evalCap
    return !exists
  }

  const [form, setForm] = useState<FormState>({
    score: 3, recomendado: true, aptoC: true, listo: false, tipoAlerta: '', feedback: '',
  })

  const [alertForm, setAlertForm] = useState({ etapa: 'OPERACIONES' as EtapaAlerta, tipo: 'TECNICA' as TipoAlerta, descripcion: '' })

  const discrepancia = c.evalOps && c.evalCap && Math.abs(c.evalOps.score - c.evalCap.score) >= 2
  const realAlerts = c.alertas.filter(a => !a.esDeEstado)

  function isDirty(): boolean {
    if (subview === 'nota_form') return nota.trim().length > 0
    if (subview === 'eval_form') return form.feedback.trim().length > 0
    if (subview === 'info_form') {
      return infoForm.nombre !== c.nombre ||
        (infoForm.puesto ?? '') !== (c.puesto ?? '') ||
        infoForm.campana !== c.campana
    }
    return false
  }

  function safeBack() {
    if (isDirty() && !window.confirm('¿Descartás los cambios?')) return
    setSubview('profile')
  }

  function safeClose() {
    if (subview !== 'profile' && isDirty() && !window.confirm('¿Descartás los cambios?')) return
    onClose()
  }

  function openEditForm(stage: 'ops' | 'rrhh' | 'cap') {
    setEditingStage(stage)
    const ev = stage === 'ops' ? c.evalOps : stage === 'rrhh' ? c.evalRRHH : c.evalCap
    setForm({
      score: ev?.score ?? 3,
      recomendado: (ev as typeof c.evalOps)?.recomendado ?? true,
      aptoC: (ev as typeof c.evalRRHH)?.aptoC ?? true,
      listo: (ev as typeof c.evalCap)?.listo ?? false,
      tipoAlerta: (ev as typeof c.evalCap)?.tipoAlerta ?? '',
      feedback: ev?.feedback ?? '',
    })
    setSubview('eval_form')
  }

  function openInfoForm() {
    setInfoForm({
      nombre: c.nombre, puesto: c.puesto ?? '', campana: c.campana,
      grupoCapId: c.grupoCapId ?? '', telefono: c.telefono ?? '',
      email: c.email ?? '', legajo: c.legajo ?? '',
      fechaIngresoPiso: c.fechaIngresoPiso ? c.fechaIngresoPiso.split('T')[0] : '',
    })
    setSubview('info_form')
  }

  async function handleSaveEval() {
    if (!form.feedback.trim()) { alert('El feedback escrito es obligatorio. Explicá tu evaluación.'); return }
    let data: Record<string, unknown> = {}
    if (editingStage === 'ops')  data = { action: 'eval_ops',  score: form.score, recomendado: form.recomendado, feedback: form.feedback }
    if (editingStage === 'rrhh') data = { action: 'eval_rrhh', score: form.score, aptoC: form.aptoC, feedback: form.feedback }
    if (editingStage === 'cap')  data = { action: 'eval_cap',  score: form.score, listo: form.listo, tipoAlerta: form.tipoAlerta || null, feedback: form.feedback }

    setSaving(true)
    const res = await fetch(`/api/candidatos/${c.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    if (res.ok) {
      const json = await res.json()
      setC(json.data)
    }
    setSaving(false)
    setSubview('profile')
  }

  async function handleSaveInfo() {
    if (!infoForm.nombre.trim()) { alert('El nombre es obligatorio.'); return }
    setSaving(true)
    const res = await fetch(`/api/candidatos/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'info',
        nombre: infoForm.nombre.trim(),
        puesto: infoForm.puesto || '',
        campana: infoForm.campana,
        grupoCapId: infoForm.grupoCapId || '',
        telefono: infoForm.telefono || '',
        email: infoForm.email || '',
        legajo: infoForm.legajo || '',
        fechaIngresoPiso: infoForm.fechaIngresoPiso || '',
      }),
    })
    if (res.ok) { const j = await res.json(); setC(j.data) }
    setSaving(false)
    setSubview('profile')
  }

  async function handleSaveAlert() {
    if (!alertForm.descripcion.trim()) { alert('Describí la alerta.'); return }
    setSaving(true)
    await onSaveAlert(c.id, alertForm)
    const r = await fetch(`/api/candidatos/${c.id}`)
    const d = await r.json()
    if (d.data) setC(d.data)
    setSaving(false)
    setSubview('profile')
  }

  async function handleSaveNota() {
    if (!nota.trim()) return
    setSaving(true)
    const res = await fetch(`/api/candidatos/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'nota', texto: nota.trim(), rol: role }),
    })
    if (res.ok) { const j = await res.json(); setC(j.data) }
    setSaving(false)
    setNota('')
    setSubview('profile')
    setTab('timeline')
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar a ${c.nombre}? Esta acción no se puede deshacer.`)) return
    setSaving(true)
    await onDelete(c.id)
    setSaving(false)
    onClose()
  }

  async function handleEstadoChange(estado: string) {
    const terminal = estado === 'INGRESADO' || estado === 'RECHAZADO'
    if (terminal) {
      const label = estado === 'INGRESADO' ? 'INGRESADO' : 'RECHAZADO'
      if (!window.confirm(`¿Confirmás cambiar el estado a ${label}? Esta acción queda registrada en el historial.`)) return
    }
    setSaving(true)
    const res = await fetch(`/api/candidatos/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'estado', estado }),
    })
    if (res.ok) { const j = await res.json(); setC(j.data) }
    setSaving(false)
  }

  const stageNames: Record<string, string> = { ops: 'Operaciones', rrhh: 'RRHH', cap: 'Capacitación' }
  const curEvalForForm = editingStage === 'ops' ? c.evalOps : editingStage === 'rrhh' ? c.evalRRHH : c.evalCap

  const colorMap: Record<string, string> = {
    blue: 'var(--accent)', green: 'var(--green)', red: 'var(--red)',
    purple: '#a855f7', yellow: 'var(--yellow)', gray: 'var(--text3)',
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}
      onClick={safeClose}
    >
      <div
        style={{ background: 'var(--bg2)', border: '1px solid var(--border2)', borderRadius: 14, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            {subview === 'profile'   ? 'Ficha del Colaborador'
              : subview === 'eval_form' ? `Feedback — ${stageNames[editingStage]}`
              : subview === 'info_form' ? 'Editar Perfil'
              : subview === 'nota_form' ? '💬 Agregar Nota al Historial'
              : 'Registrar Alerta'}
          </span>
          <button onClick={safeClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {/* ─── PROFILE VIEW ─── */}
        {subview === 'profile' && (
          <>
            <div style={{ padding: '20px 22px' }}>

              {/* Identity */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <Avatar nombre={c.nombre} size={54} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{c.nombre}</h3>
                  <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span className="badge-gray">DNI {c.dni}</span>
                    {c.puesto && <span className="badge-gray">{c.puesto}</span>}
                    <span className="badge-blue">{CAMPANA_LABELS[c.campana]}</span>
                    <EstadoBadge estado={c.estado} />
                    {c.riesgo !== 'BAJO' && <RiesgoBadge riesgo={c.riesgo} />}
                  </div>
                  {/* Estado quick-change — visible para admin y operaciones */}
                  {(role === 'admin' || role === 'operaciones') && (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: 'var(--text3)', alignSelf: 'center' }}>Cambiar estado:</span>
                      {(['EN_PROCESO', 'EN_CAPACITACION', 'INGRESADO', 'RECHAZADO'] as const).map(e => {
                        const cls: Record<string, string> = {
                          EN_PROCESO: 'badge-gray', EN_CAPACITACION: 'badge-blue',
                          INGRESADO: 'badge-green', RECHAZADO: 'badge-red',
                        }
                        const active = c.estado === e
                        return (
                          <button
                            key={e}
                            disabled={active || saving}
                            onClick={() => handleEstadoChange(e)}
                            style={{
                              fontSize: 11, padding: '3px 10px', borderRadius: 20, cursor: active ? 'default' : 'pointer',
                              border: active ? '2px solid currentColor' : '1px solid var(--border)',
                              fontWeight: active ? 700 : 400, opacity: saving ? 0.5 : 1,
                              background: active ? undefined : 'transparent',
                            }}
                            className={active ? cls[e] : ''}
                          >
                            {ESTADO_LABELS[e]}{active ? ' ✓' : ''}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>Etapas:</span>
                    <ProgressDots candidato={c} />
                    <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 4 }}>
                      📅 {c.fechaPostulacion.split('T')[0]}
                    </span>
                    {c.fechaIngresoPiso && (
                      <span style={{ fontSize: 11, color: 'var(--green)' }}>
                        🏢 Piso {c.fechaIngresoPiso.split('T')[0]}
                      </span>
                    )}
                  </div>
                  {/* Contact + grupo */}
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {c.grupoCap && <span className="badge-gray" style={{ fontSize: 10 }}>🎓 {c.grupoCap.nombre}</span>}
                    {c.legajo   && <span style={{ fontSize: 11, color: 'var(--text3)' }}>🪪 {c.legajo}</span>}
                    {c.telefono && <span style={{ fontSize: 11, color: 'var(--text3)' }}>📱 {c.telefono}</span>}
                    {c.email    && <span style={{ fontSize: 11, color: 'var(--text3)' }}>✉ {c.email}</span>}
                  </div>
                </div>
              </div>

              {/* Banners */}
              {discrepancia && (
                <div style={{ background: '#71350020', border: '1px solid #eab30830', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: 'var(--yellow)' }}>
                  ⚡ <b>Discrepancia detectada:</b> Ops ({c.evalOps!.score}/5) vs Capacitación ({c.evalCap!.score}/5). Revisar historial.
                </div>
              )}
              {c.riesgo === 'ALTO' && (
                <div style={{ background: '#ef444415', border: '1px solid #ef444430', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 12, color: 'var(--red)' }}>
                  🚨 <b>RIESGO ALTO:</b> Alertas registradas en múltiples etapas del proceso.
                </div>
              )}

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 18, borderBottom: '1px solid var(--border)' }}>
                {(['eval', 'timeline'] as Tab[]).map((t, i) => (
                  <div
                    key={t} onClick={() => setTab(t)}
                    style={{
                      padding: '8px 16px', fontSize: 12, cursor: 'pointer',
                      color: tab === t ? 'var(--accent)' : 'var(--text2)',
                      borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                      marginBottom: -1, borderRadius: '6px 6px 0 0', fontWeight: tab === t ? 600 : 400,
                    }}
                  >
                    {['Feedback del Proceso', `Historial (${c.historial.length})`][i]}
                  </div>
                ))}
              </div>

              {/* ─── TAB: Feedback del proceso ─── */}
              {tab === 'eval' && (
                <>
                  <FeedbackSection
                    title="RRHH — Entrevista"
                    icon="👥"
                    score={c.evalRRHH?.score}
                    feedback={c.evalRRHH?.feedback}
                    badge={c.evalRRHH ? (c.evalRRHH.aptoC ? '✔ Apto Cultural' : '✗ No Apto') : 'Sin evaluar'}
                    badgeClass={c.evalRRHH ? (c.evalRRHH.aptoC ? 'badge-green' : 'badge-red') : 'badge-gray'}
                    empty={!c.evalRRHH}
                    updatedAt={c.evalRRHH?.updatedAt}
                    onEdit={canEditStage('rrhh') ? () => openEditForm('rrhh') : undefined}
                    locked={!!c.evalRRHH && !canEditStage('rrhh') && canEdit.includes('rrhh')}
                  />
                  <FeedbackSection
                    title="Operaciones — Entrevista"
                    icon="⚙️"
                    score={c.evalOps?.score}
                    feedback={c.evalOps?.feedback}
                    badge={c.evalOps ? (c.evalOps.recomendado ? '✔ Recomendado' : '✗ No recomendado') : 'Sin evaluar'}
                    badgeClass={c.evalOps ? (c.evalOps.recomendado ? 'badge-green' : 'badge-red') : 'badge-gray'}
                    empty={!c.evalOps}
                    updatedAt={c.evalOps?.updatedAt}
                    onEdit={canEditStage('ops') ? () => openEditForm('ops') : undefined}
                    locked={!!c.evalOps && !canEditStage('ops') && canEdit.includes('ops')}
                  />
                  <FeedbackSection
                    title="Capacitación — Resultado final"
                    icon="🎓"
                    score={c.evalCap?.score}
                    feedback={c.evalCap?.feedback}
                    badge={c.evalCap ? (c.evalCap.listo ? '✔ Listo para piso' : '✗ No listo') : 'Sin evaluar'}
                    badgeClass={c.evalCap ? (c.evalCap.listo ? 'badge-green' : 'badge-red') : 'badge-gray'}
                    empty={!c.evalCap}
                    updatedAt={c.evalCap?.updatedAt}
                    onEdit={canEditStage('cap') ? () => openEditForm('cap') : undefined}
                    locked={!!c.evalCap && !canEditStage('cap') && canEdit.includes('cap')}
                  />

                  {realAlerts.length > 0 && (
                    <div style={{ marginTop: 4 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Alertas ({realAlerts.length})
                      </div>
                      {realAlerts.map(a => (
                        <div key={a.id} style={{ background: '#ef444410', border: '1px solid #ef444425', borderRadius: 8, padding: '8px 12px', marginBottom: 6, fontSize: 12 }}>
                          <span style={{ color: 'var(--red)', fontWeight: 600 }}>{ETAPA_LABELS[a.etapa]} — {ALERTA_TIPO_LABELS[a.tipo]}</span>
                          <span style={{ color: 'var(--text3)', marginLeft: 8 }}>{a.descripcion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ─── TAB: Historial ─── */}
              {tab === 'timeline' && (
                <div style={{ position: 'relative', paddingLeft: 22 }}>
                  <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 1, background: 'var(--border)' }} />
                  {c.historial.length === 0
                    ? <div style={{ fontSize: 12, color: 'var(--text3)', fontStyle: 'italic' }}>Sin historial registrado.</div>
                    : [...c.historial].reverse().map(h => {
                        const col = colorMap[h.color] ?? 'var(--text3)'
                        return (
                          <div key={h.id} style={{ position: 'relative', marginBottom: 14 }}>
                            <div style={{ position: 'absolute', left: -18, top: 5, width: 10, height: 10, borderRadius: '50%', background: col, border: '2px solid var(--bg2)' }} />
                            <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: h.detalle ? 4 : 0 }}>
                                <span style={{ fontSize: 12, fontWeight: 600, color: col }}>{h.evento}</span>
                                <span style={{ fontSize: 10, color: 'var(--text3)' }}>{h.createdAt?.split('T')[0]}</span>
                              </div>
                              {h.detalle && <div style={{ fontSize: 12, color: 'var(--text2)' }}>{h.detalle}</div>}
                            </div>
                          </div>
                        )
                      })
                  }
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {role !== 'capacitacion' && (
                  <button className="btn-warning" onClick={() => setSubview('alert_form')}>⚠ Alerta</button>
                )}
                <button className="btn-secondary" onClick={() => setSubview('nota_form')}>💬 Nota</button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {role === 'admin' && (
                  <button
                    className="btn-secondary"
                    style={{ color: 'var(--red)', borderColor: 'var(--red)' }}
                    onClick={handleDelete}
                    disabled={saving}
                  >
                    🗑 Eliminar
                  </button>
                )}
                <button className="btn-secondary" onClick={safeClose}>Cerrar</button>
                {role !== 'capacitacion' && (
                  <button className="btn-secondary" onClick={openInfoForm}>✏ Editar Perfil</button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ─── EVAL FORM ─── */}
        {subview === 'eval_form' && (
          <>
            <div style={{ padding: '22px 22px 0' }}>

              {curEvalForForm && (
                <div style={{ background: '#71350020', border: '1px solid #eab30830', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: 'var(--yellow)' }}>
                  ⚠ Ya hay un feedback registrado. Si guardás, se sobreescribe.
                </div>
              )}

              {/* Score */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, fontWeight: 600 }}>
                  Puntaje general
                </label>
                <ClickableStars value={form.score} onChange={v => setForm(f => ({ ...f, score: v }))} />
              </div>

              {/* Boolean toggle */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, fontWeight: 600 }}>
                  {editingStage === 'ops' ? '¿Lo recomendás para esta campaña?' : editingStage === 'rrhh' ? '¿Es apto cultural?' : '¿Está listo para piso?'}
                </label>
                {editingStage === 'ops' && <BoolPill value={form.recomendado} onChange={v => setForm(f => ({ ...f, recomendado: v }))} yes="Sí, recomendado" no="No recomendado" />}
                {editingStage === 'rrhh' && <BoolPill value={form.aptoC} onChange={v => setForm(f => ({ ...f, aptoC: v }))} yes="Apto Cultural" no="No apto" />}
                {editingStage === 'cap' && <BoolPill value={form.listo} onChange={v => setForm(f => ({ ...f, listo: v }))} yes="Listo para piso" no="No listo" />}
              </div>

              {/* Alert type (cap only) */}
              {editingStage === 'cap' && (
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>
                    Tipo de alerta (opcional)
                  </label>
                  <select
                    value={form.tipoAlerta}
                    onChange={e => setForm(f => ({ ...f, tipoAlerta: e.target.value }))}
                    style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 12px', borderRadius: 8, fontSize: 13, minWidth: 200 }}
                  >
                    <option value="">Sin alerta</option>
                    {Object.entries(ALERTA_TIPO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              )}

              {/* Feedback textarea */}
              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>
                  {editingStage === 'rrhh'
                    ? '¿Qué observaste en la entrevista? ¿Por qué fue seleccionado/a? *'
                    : editingStage === 'ops'
                    ? '¿Qué observaste? ¿Por qué lo recomendás para esta campaña? *'
                    : '¿Cómo le fue en la capacitación? ¿Qué destacás? *'}
                </label>
                <textarea
                  value={form.feedback}
                  onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
                  placeholder={
                    editingStage === 'rrhh'
                      ? 'Ej: Excelente comunicación, manejo del estrés muy bueno, encaja con la cultura del equipo...'
                      : editingStage === 'ops'
                      ? 'Ej: Buen conocimiento del producto, actitud proactiva, se adaptó rápido al perfil de la campaña...'
                      : 'Ej: Rápida curva de aprendizaje, dominó las herramientas en la primera semana, cumplimiento del 95%...'
                  }
                  rows={5}
                  style={{
                    width: '100%', background: 'var(--card)', border: '1px solid var(--border)',
                    color: 'var(--text)', padding: '12px 14px', borderRadius: 8, fontSize: 13,
                    resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-secondary" onClick={safeBack}>Cancelar</button>
              <button className="btn-primary" onClick={handleSaveEval} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Feedback'}
              </button>
            </div>
          </>
        )}

        {/* ─── INFO FORM ─── */}
        {subview === 'info_form' && (
          <>
            <div style={{ padding: '22px 22px 0' }}>
              {/* Sección: Datos básicos */}
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>Datos del perfil</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>Nombre completo *</label>
                  <input
                    value={infoForm.nombre}
                    onChange={e => setInfoForm(p => ({ ...p, nombre: e.target.value }))}
                    style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>Puesto</label>
                  <input
                    value={infoForm.puesto}
                    onChange={e => setInfoForm(p => ({ ...p, puesto: e.target.value }))}
                    style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>Campaña *</label>
                  <select
                    value={infoForm.campana}
                    onChange={e => setInfoForm(p => ({ ...p, campana: e.target.value as Campana, grupoCapId: '' }))}
                    style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                  >
                    {Object.entries(CAMPANA_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              {/* Sección: Grupo */}
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>Grupo de capacitación</div>
              <div style={{ marginBottom: 20 }}>
                <select
                  value={infoForm.grupoCapId}
                  onChange={e => setInfoForm(p => ({ ...p, grupoCapId: e.target.value }))}
                  style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                >
                  <option value="">Sin asignar</option>
                  {grupos.filter(g => g.campana === infoForm.campana && g.activo).map(g => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}{g.site ? ` — ${SITE_LABELS[g.site as keyof typeof SITE_LABELS]}` : ''}
                    </option>
                  ))}
                </select>
                {grupos.filter(g => g.campana === infoForm.campana && g.activo).length === 0 && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 6 }}>
                    No hay grupos activos para {CAMPANA_LABELS[infoForm.campana]}. Creá uno en Campañas.
                  </div>
                )}
              </div>

              {/* Sección: Contacto */}
              <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: 700 }}>Datos de contacto</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 22 }}>
                {([
                  { key: 'legajo',           label: 'Legajo interno',       type: 'text'  },
                  { key: 'telefono',         label: 'Teléfono',             type: 'text'  },
                  { key: 'email',            label: 'Email',                type: 'email' },
                  { key: 'fechaIngresoPiso', label: 'Fecha ingreso a piso', type: 'date'  },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                    <input
                      type={f.type}
                      value={infoForm[f.key]}
                      onChange={e => setInfoForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-secondary" onClick={safeBack}>Cancelar</button>
              <button className="btn-primary" onClick={handleSaveInfo} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </>
        )}

        {/* ─── ALERT FORM ─── */}
        {subview === 'alert_form' && (
          <>
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ background: '#ef444410', border: '1px solid #ef444425', borderRadius: 8, padding: '10px 14px', marginBottom: 18, fontSize: 12, color: 'var(--red)' }}>
                Esta alerta quedará registrada permanentemente en el historial del colaborador.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>Etapa</label>
                  <select
                    value={alertForm.etapa}
                    onChange={e => setAlertForm(f => ({ ...f, etapa: e.target.value as EtapaAlerta }))}
                    style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                  >
                    {[['OPERACIONES','Operaciones'],['RRHH','RRHH'],['CAPACITACION','Capacitación'],['GENERAL','General']].map(([v,l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>Tipo de alerta</label>
                  <select
                    value={alertForm.tipo}
                    onChange={e => setAlertForm(f => ({ ...f, tipo: e.target.value as TipoAlerta }))}
                    style={{ width: '100%', background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--text)', padding: '9px 12px', borderRadius: 8, fontSize: 13 }}
                  >
                    {Object.entries(ALERTA_TIPO_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, fontWeight: 600 }}>
                  Descripción de la situación *
                </label>
                <textarea
                  value={alertForm.descripcion}
                  onChange={e => setAlertForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Describí qué pasó y por qué se registra esta alerta..."
                  rows={4}
                  style={{
                    width: '100%', background: 'var(--card)', border: '1px solid var(--border)',
                    color: 'var(--text)', padding: '12px 14px', borderRadius: 8, fontSize: 13,
                    resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-secondary" onClick={safeBack}>Cancelar</button>
              <button className="btn-warning" onClick={handleSaveAlert} disabled={saving}>
                {saving ? 'Guardando...' : 'Registrar Alerta'}
              </button>
            </div>
          </>
        )}

        {/* ─── NOTA FORM ─── */}
        {subview === 'nota_form' && (
          <>
            <div style={{ padding: '22px 22px 0' }}>
              <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: 'var(--text3)' }}>
                La nota quedará registrada en el historial con tu rol y la fecha de hoy. No se puede borrar.
              </div>
              <textarea
                value={nota}
                onChange={e => setNota(e.target.value)}
                placeholder="Escribí tu observación, contexto adicional o comentario sobre este colaborador..."
                rows={5}
                style={{
                  width: '100%', background: 'var(--card)', border: '1px solid var(--border)',
                  color: 'var(--text)', padding: '12px 14px', borderRadius: 8, fontSize: 13,
                  resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
                  boxSizing: 'border-box', marginBottom: 4,
                }}
              />
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 18 }}>
                Se guardará como: <b>💬 Nota — {({ admin: 'Admin', operaciones: 'Operaciones', rrhh: 'RRHH', capacitacion: 'Capacitación' } as Record<string,string>)[role] ?? role}</b>
              </div>
            </div>
            <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn-secondary" onClick={safeBack}>Cancelar</button>
              <button className="btn-primary" onClick={handleSaveNota} disabled={saving || !nota.trim()}>
                {saving ? 'Guardando...' : 'Guardar Nota'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
