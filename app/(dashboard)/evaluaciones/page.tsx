'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getInitials, getColorAvatar } from '@/lib/utils';

type EstadoEval = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';

interface Evaluacion {
  id: string;
  empleado: string;
  puesto: string;
  periodo: string;
  tipo: string;
  estado: EstadoEval;
  puntuacion?: number;
  competencias: { nombre: string; puntuacion: number }[];
  objetivos: { titulo: string; cumplimiento: number }[];
}

const evaluaciones: Evaluacion[] = [
  {
    id: '1', empleado: 'Laura Martínez', puesto: 'Diseñadora UX', periodo: '2024-Q1', tipo: 'Trimestral',
    estado: 'COMPLETADA', puntuacion: 8.5,
    competencias: [
      { nombre: 'Comunicación', puntuacion: 9 },
      { nombre: 'Trabajo en equipo', puntuacion: 8 },
      { nombre: 'Iniciativa', puntuacion: 8.5 },
      { nombre: 'Calidad del trabajo', puntuacion: 9 },
    ],
    objetivos: [
      { titulo: 'Rediseño de la app móvil', cumplimiento: 100 },
      { titulo: 'Sistema de design tokens', cumplimiento: 85 },
      { titulo: 'Formación en Figma avanzado', cumplimiento: 100 },
    ],
  },
  {
    id: '2', empleado: 'Carlos Ruiz', puesto: 'Backend Developer', periodo: '2024-Q1', tipo: 'Trimestral',
    estado: 'EN_PROGRESO', puntuacion: undefined,
    competencias: [
      { nombre: 'Comunicación', puntuacion: 7 },
      { nombre: 'Trabajo en equipo', puntuacion: 8 },
      { nombre: 'Iniciativa', puntuacion: 7 },
      { nombre: 'Calidad del trabajo', puntuacion: 8.5 },
    ],
    objetivos: [
      { titulo: 'Migración a microservicios', cumplimiento: 70 },
      { titulo: 'Cobertura de tests al 80%', cumplimiento: 60 },
    ],
  },
  {
    id: '3', empleado: 'Ana García', puesto: 'Project Manager', periodo: '2024-Q1', tipo: 'Trimestral',
    estado: 'PENDIENTE', puntuacion: undefined,
    competencias: [],
    objetivos: [
      { titulo: 'Entrega Q1 en plazo', cumplimiento: 0 },
      { titulo: 'OKRs del equipo', cumplimiento: 0 },
    ],
  },
  {
    id: '4', empleado: 'Javier López', puesto: 'Sales Manager', periodo: '2024-Q1', tipo: 'Trimestral',
    estado: 'COMPLETADA', puntuacion: 9.2,
    competencias: [
      { nombre: 'Comunicación', puntuacion: 10 },
      { nombre: 'Liderazgo', puntuacion: 9 },
      { nombre: 'Orientación a resultados', puntuacion: 9.5 },
    ],
    objetivos: [
      { titulo: 'Objetivo de ventas Q1', cumplimiento: 112 },
      { titulo: 'Nuevas cuentas enterprise', cumplimiento: 90 },
    ],
  },
];

const estadoConfig: Record<EstadoEval, { label: string; icon: typeof Clock; color: string; badge: 'warning' | 'info' | 'success' }> = {
  PENDIENTE: { label: 'Pendiente', icon: AlertCircle, color: 'text-amber-600', badge: 'warning' },
  EN_PROGRESO: { label: 'En progreso', icon: Clock, color: 'text-blue-600', badge: 'info' },
  COMPLETADA: { label: 'Completada', icon: CheckCircle2, color: 'text-emerald-600', badge: 'success' },
};

function Stars({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-muted rounded-full h-2">
        <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-bold tabular-nums">{value}</span>
    </div>
  );
}

export default function EvaluacionesPage() {
  const [tab, setTab] = useState('todas');
  const [evalSeleccionada, setEvalSeleccionada] = useState<Evaluacion | null>(null);

  const filtradas = evaluaciones.filter((e) => {
    if (tab === 'pendientes') return e.estado === 'PENDIENTE';
    if (tab === 'en_progreso') return e.estado === 'EN_PROGRESO';
    if (tab === 'completadas') return e.estado === 'COMPLETADA';
    return true;
  });

  const avg = evaluaciones
    .filter((e) => e.puntuacion !== undefined)
    .reduce((acc, e, _, arr) => acc + (e.puntuacion ?? 0) / arr.length, 0);

  return (
    <div className="flex flex-col h-full">
      <Header title="Evaluaciones de desempeño" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total evaluaciones', value: evaluaciones.length },
            { label: 'Completadas', value: evaluaciones.filter(e => e.estado === 'COMPLETADA').length },
            { label: 'En progreso', value: evaluaciones.filter(e => e.estado === 'EN_PROGRESO').length },
            { label: 'Puntuación media', value: avg.toFixed(1) + '/10' },
          ].map((s) => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="en_progreso">En progreso</TabsTrigger>
              <TabsTrigger value="completadas">Completadas</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva evaluación
          </Button>
        </div>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtradas.map((ev) => {
            const cfg = estadoConfig[ev.estado];
            return (
              <Card
                key={ev.id}
                className="border-border/60 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setEvalSeleccionada(ev)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-sm font-bold text-white ${getColorAvatar(ev.empleado)}`}>
                        {getInitials(ev.empleado)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{ev.empleado}</p>
                      <p className="text-xs text-muted-foreground">{ev.puesto}</p>
                    </div>
                    <Badge variant={cfg.badge}>{cfg.label}</Badge>
                  </div>

                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{ev.periodo}</span>
                    <span>·</span>
                    <span>{ev.tipo}</span>
                  </div>

                  {ev.puntuacion !== undefined && (
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Puntuación global</p>
                      <Stars value={ev.puntuacion} />
                    </div>
                  )}

                  {/* Progreso objetivos */}
                  {ev.objetivos.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Objetivos ({ev.objetivos.filter(o => o.cumplimiento >= 100).length}/{ev.objetivos.length} completados)
                      </p>
                      <div className="space-y-1.5">
                        {ev.objetivos.slice(0, 2).map((o) => (
                          <div key={o.titulo}>
                            <div className="flex justify-between text-[10px] mb-0.5">
                              <span className="truncate text-muted-foreground">{o.titulo}</span>
                              <span className="font-medium ml-2">{Math.min(o.cumplimiento, 100)}%</span>
                            </div>
                            <Progress value={Math.min(o.cumplimiento, 100)} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Modal detalle evaluación */}
      <Dialog open={!!evalSeleccionada} onOpenChange={() => setEvalSeleccionada(null)}>
        <DialogContent className="max-w-lg">
          {evalSeleccionada && (
            <>
              <DialogHeader>
                <DialogTitle>Evaluación — {evalSeleccionada.empleado}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={`text-sm font-bold text-white ${getColorAvatar(evalSeleccionada.empleado)}`}>
                      {getInitials(evalSeleccionada.empleado)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold">{evalSeleccionada.empleado}</p>
                    <p className="text-sm text-muted-foreground">{evalSeleccionada.puesto} · {evalSeleccionada.periodo}</p>
                  </div>
                  <Badge variant={estadoConfig[evalSeleccionada.estado].badge} className="ml-auto">
                    {estadoConfig[evalSeleccionada.estado].label}
                  </Badge>
                </div>

                {evalSeleccionada.competencias.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3">Competencias</p>
                    <div className="space-y-3">
                      {evalSeleccionada.competencias.map((c) => (
                        <div key={c.nombre}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{c.nombre}</span>
                            <span>{c.puntuacion}/10</span>
                          </div>
                          <Progress value={c.puntuacion * 10} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evalSeleccionada.objetivos.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-3">Objetivos</p>
                    <div className="space-y-3">
                      {evalSeleccionada.objetivos.map((o) => (
                        <div key={o.titulo}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{o.titulo}</span>
                            <span>{Math.min(o.cumplimiento, 100)}%</span>
                          </div>
                          <Progress value={Math.min(o.cumplimiento, 100)} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {evalSeleccionada.estado !== 'COMPLETADA' && (
                  <div>
                    <Label className="text-sm font-semibold">Comentarios del evaluador</Label>
                    <Textarea className="mt-2" placeholder="Añade feedback sobre el desempeño..." rows={3} />
                  </div>
                )}
              </div>
              {evalSeleccionada.estado !== 'COMPLETADA' && (
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEvalSeleccionada(null)}>Cancelar</Button>
                  <Button onClick={() => setEvalSeleccionada(null)}>Guardar evaluación</Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
