// src/lib/utils.ts

import type { Candidato, NivelRiesgo, EtapaAlerta } from '@/types'

// ─── RIESGO ──────────────────────────────────────────────

export function calcularRiesgo(alertas: { etapa: EtapaAlerta; esDeEstado: boolean }[]): NivelRiesgo {
  const etapas = new Set(
    alertas.filter(a => !a.esDeEstado).map(a => a.etapa)
  )
  if (etapas.size >= 2) return 'ALTO'
  if (etapas.size === 1) return 'MEDIO'
  return 'BAJO'
}

export function tieneDiscrepancia(c: Candidato): boolean {
  if (!c.evalOps || !c.evalCap) return false
  return Math.abs(c.evalOps.score - c.evalCap.score) >= 2
}

// ─── CSV EXPORT ──────────────────────────────────────────

export function generarCSV(candidatos: Candidato[]): string {
  const headers = [
    'Nombre', 'DNI', 'Puesto', 'Campaña', 'Estado', 'Fecha Ingreso', 'Riesgo',
    'Score RRHH', 'RRHH Apto Cultural', 'Feedback RRHH',
    'Score Ops', 'Ops Recomendado', 'Feedback Ops',
    'Score Cap', 'Cap Listo', 'Feedback Capacitación',
    'Cantidad Alertas',
  ]

  const esc = (s?: string | null) => `"${(s ?? '').replace(/"/g, '""')}"`

  const rows = candidatos.map(c => [
    esc(c.nombre),
    c.dni,
    esc(c.puesto),
    c.campana.replace(/_/g, ' '),
    c.estado.replace(/_/g, ' '),
    c.fechaPostulacion.split('T')[0],
    c.riesgo,
    c.evalRRHH?.score ?? '',
    c.evalRRHH?.aptoC !== undefined ? (c.evalRRHH.aptoC ? 'Sí' : 'No') : '',
    esc(c.evalRRHH?.feedback),
    c.evalOps?.score ?? '',
    c.evalOps?.recomendado !== undefined ? (c.evalOps.recomendado ? 'Sí' : 'No') : '',
    esc(c.evalOps?.feedback),
    c.evalCap?.score ?? '',
    c.evalCap?.listo !== undefined ? (c.evalCap.listo ? 'Sí' : 'No') : '',
    esc(c.evalCap?.feedback),
    c.alertas.filter(a => !a.esDeEstado).length,
  ])

  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  return '\uFEFF' + csv // BOM para Excel argentino
}

// ─── FORMATO ─────────────────────────────────────────────

export function formatFecha(fecha: string | Date): string {
  const d = typeof fecha === 'string' ? new Date(fecha) : fecha
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function iniciales(nombre: string): string {
  return nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
}
