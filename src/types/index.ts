// src/types/index.ts

export type Campana = string // codigo de campaña configurable (ej: "ADT", "CLARO")

export interface CampanaConfig {
  id: string
  codigo: string
  nombre: string
  activo: boolean
  orden: number
  createdAt: string
}

export type EstadoCandidato =
  | 'EN_PROCESO' | 'EN_CAPACITACION' | 'INGRESADO' | 'RECHAZADO'

export type NivelRiesgo = 'BAJO' | 'MEDIO' | 'ALTO'
export type TipoAlerta = 'TECNICA' | 'CONDUCTUAL' | 'ASISTENCIA'
export type EtapaAlerta = 'OPERACIONES' | 'RRHH' | 'CAPACITACION' | 'GENERAL'

export type Site = 'OLIVOS' | 'PARQUE_PATRICIOS'

export interface GrupoCapacitacion {
  id: string
  nombre: string
  campana: Campana
  site?: Site | null
  fechaInicio: string
  fechaFin?: string | null
  activo: boolean
  createdAt: string
  updatedAt: string
  candidatos?: Candidato[]
}

export interface EvalOps {
  id: string
  score: number
  recomendado: boolean
  feedback: string
  updatedAt: string
}

export interface EvalRRHH {
  id: string
  score: number
  aptoC: boolean
  feedback: string
  updatedAt: string
}

export interface EvalCap {
  id: string
  score: number
  listo: boolean
  tieneAlerta: boolean
  tipoAlerta?: TipoAlerta | null
  feedback: string
  updatedAt: string
}

export interface Alerta {
  id: string
  etapa: EtapaAlerta
  tipo: TipoAlerta
  descripcion: string
  esDeEstado: boolean
  createdAt: string
}

export interface Historial {
  id: string
  evento: string
  detalle?: string | null
  color: string
  createdAt: string
}

export interface Candidato {
  id: string
  nombre: string
  dni: string
  puesto?: string | null
  campana: Campana
  estado: EstadoCandidato
  fechaPostulacion: string
  fechaIngresoPiso?: string | null
  riesgo: NivelRiesgo
  telefono?: string | null
  email?: string | null
  legajo?: string | null
  reContratable?: boolean | null
  grupoCapId?: string | null
  grupoCap?: GrupoCapacitacion | null
  createdAt: string
  updatedAt: string
  evalOps?: EvalOps | null
  evalRRHH?: EvalRRHH | null
  evalCap?: EvalCap | null
  alertas: Alerta[]
  historial: Historial[]
}

// ─── LABELS ──────────────────────────────────────────────

export const SITE_LABELS: Record<Site, string> = {
  OLIVOS: 'Olivos',
  PARQUE_PATRICIOS: 'Parque Patricios',
}

// Fallback estático — reemplazado en runtime por CampanasContext
export const CAMPANA_LABELS: Record<string, string> = {
  CSV: 'CSV', TLMK: 'TLMK', EDESUR: 'EDESUR', AYSA: 'AYSA',
  ADT: 'ADT', CAR_ONE: 'CAR ONE', EDENRED: 'EDENRED',
  FARMACITY: 'FARMACITY', LEBEN_SALUD: 'LEBEN SALUD', STRIX: 'STRIX',
  MATER_DEI: 'MATER DEI', MIRGOR: 'MIRGOR', RIO_GAS: 'RIO GAS',
  DENTAL_TOTAL: 'DENTAL TOTAL',
}

export const ESTADO_LABELS: Record<EstadoCandidato, string> = {
  EN_PROCESO: 'En proceso',
  EN_CAPACITACION: 'En capacitación',
  INGRESADO: 'Ingresado',
  RECHAZADO: 'Rechazado',
}

export const ALERTA_TIPO_LABELS: Record<TipoAlerta, string> = {
  TECNICA: 'Técnica',
  CONDUCTUAL: 'Conductual',
  ASISTENCIA: 'Asistencia',
}

export const ETAPA_LABELS: Record<EtapaAlerta, string> = {
  OPERACIONES: 'Operaciones',
  RRHH: 'RRHH',
  CAPACITACION: 'Capacitación',
  GENERAL: 'General',
}

// ─── FILTROS ─────────────────────────────────────────────

export interface FiltrosCandidatos {
  campana?: Campana
  estado?: EstadoCandidato
  alerta?: 'con' | 'sin'
  riesgo?: NivelRiesgo
  search?: string
  desde?: string
  hasta?: string
  grupoCapId?: string
}

// ─── API RESPONSES ───────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
}

interface PendienteItem {
  id: string; nombre: string; campana: string; dias: number
}
interface AlertaReciente {
  id: string; tipo: string; etapa: string; descripcion: string; createdAt: string
  candidato: { id: string; nombre: string; campana: string }
}

export interface DashboardStats {
  total: number
  ingresados: number
  conAlerta: number
  riesgoAlto: number
  ingresadosConAlerta: number
  pctConversion: number
  pctRiesgoEnIngresados: number
  avgScoreOps: number
  avgScoreRRHH: number
  avgScoreCap: number
  completitudOps: number
  completitudRRHH: number
  completitudCap: number
  porCampana: { campana: string; total: number; conAlerta: number }[]
  porEstado: { estado: EstadoCandidato; total: number }[]
  pendientesOps: PendienteItem[]
  pendientesRRHH: PendienteItem[]
  pendientesCap: PendienteItem[]
  ultimosIngresados: { id: string; nombre: string; campana: string; fechaIngresoPiso: string | null; createdAt: string }[]
  alertasRecientes: AlertaReciente[]
}
