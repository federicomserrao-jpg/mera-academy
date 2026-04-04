'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Check, X, CalendarDays, Clock, TrendingDown } from 'lucide-react';
import { getInitials, getColorAvatar, formatFecha } from '@/lib/utils';

type Estado = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
type Tipo = 'VACACIONES' | 'ENFERMEDAD' | 'PERSONAL' | 'MATERNIDAD' | 'OTRO';

interface Ausencia {
  id: string;
  empleado: string;
  tipo: Tipo;
  fechaInicio: string;
  fechaFin: string;
  dias: number;
  estado: Estado;
  descripcion?: string;
}

const ausenciasDemo: Ausencia[] = [
  { id: '1', empleado: 'Laura Martínez', tipo: 'VACACIONES', fechaInicio: '2024-04-14', fechaFin: '2024-04-21', dias: 6, estado: 'PENDIENTE' },
  { id: '2', empleado: 'Carlos Ruiz', tipo: 'PERSONAL', fechaInicio: '2024-04-07', fechaFin: '2024-04-11', dias: 5, estado: 'PENDIENTE' },
  { id: '3', empleado: 'Ana García', tipo: 'VACACIONES', fechaInicio: '2024-03-25', fechaFin: '2024-04-05', dias: 10, estado: 'APROBADA' },
  { id: '4', empleado: 'Javier López', tipo: 'ENFERMEDAD', fechaInicio: '2024-04-01', fechaFin: '2024-04-03', dias: 3, estado: 'APROBADA' },
  { id: '5', empleado: 'María Sánchez', tipo: 'VACACIONES', fechaInicio: '2024-05-01', fechaFin: '2024-05-05', dias: 5, estado: 'PENDIENTE' },
  { id: '6', empleado: 'Pedro Alonso', tipo: 'PERSONAL', fechaInicio: '2024-03-18', fechaFin: '2024-03-19', dias: 2, estado: 'RECHAZADA', descripcion: 'Período de cierre de proyecto' },
];

const tipoLabel: Record<Tipo, string> = {
  VACACIONES: 'Vacaciones',
  ENFERMEDAD: 'Enfermedad',
  PERSONAL: 'Permiso personal',
  MATERNIDAD: 'Maternidad/Paternidad',
  OTRO: 'Otro',
};

const estadoConfig: Record<Estado, { label: string; variant: 'warning' | 'success' | 'destructive' }> = {
  PENDIENTE: { label: 'Pendiente', variant: 'warning' },
  APROBADA: { label: 'Aprobada', variant: 'success' },
  RECHAZADA: { label: 'Rechazada', variant: 'destructive' },
};

// Mini calendario del mes actual
const DIAS_MES = Array.from({ length: 30 }, (_, i) => i + 1);
const AUSENCIAS_MES: Record<number, string> = {
  1: 'bg-blue-100', 2: 'bg-blue-100', 3: 'bg-blue-100',
  14: 'bg-amber-100', 15: 'bg-amber-100', 16: 'bg-amber-100',
  17: 'bg-amber-100', 18: 'bg-amber-100', 19: 'bg-amber-100', 20: 'bg-amber-100',
  25: 'bg-emerald-100', 26: 'bg-emerald-100', 27: 'bg-emerald-100',
};

export default function VacacionesPage() {
  const [ausencias, setAusencias] = useState(ausenciasDemo);
  const [modalSolicitud, setModalSolicitud] = useState(false);
  const [tabActivo, setTabActivo] = useState('todas');

  const filtradas = ausencias.filter((a) => {
    if (tabActivo === 'pendientes') return a.estado === 'PENDIENTE';
    if (tabActivo === 'aprobadas') return a.estado === 'APROBADA';
    if (tabActivo === 'rechazadas') return a.estado === 'RECHAZADA';
    return true;
  });

  const aprobar = (id: string) =>
    setAusencias((prev) => prev.map((a) => a.id === id ? { ...a, estado: 'APROBADA' } : a));
  const rechazar = (id: string) =>
    setAusencias((prev) => prev.map((a) => a.id === id ? { ...a, estado: 'RECHAZADA' } : a));

  return (
    <div className="flex flex-col h-full">
      <Header title="Vacaciones y Ausencias" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-amber-50 p-2.5">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Solicitudes pendientes</p>
                <p className="text-2xl font-bold">{ausencias.filter(a => a.estado === 'PENDIENTE').length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ausentes hoy</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Días usados (mes)</p>
                <p className="text-2xl font-bold">31</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Tabla solicitudes */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Tabs value={tabActivo} onValueChange={setTabActivo}>
                <TabsList>
                  <TabsTrigger value="todas">Todas</TabsTrigger>
                  <TabsTrigger value="pendientes">
                    Pendientes
                    {ausencias.filter(a => a.estado === 'PENDIENTE').length > 0 && (
                      <span className="ml-1.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5">
                        {ausencias.filter(a => a.estado === 'PENDIENTE').length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="aprobadas">Aprobadas</TabsTrigger>
                  <TabsTrigger value="rechazadas">Rechazadas</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" onClick={() => setModalSolicitud(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva solicitud
              </Button>
            </div>

            <Card className="border-border/60">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Período</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Días</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((a) => {
                      const cfg = estadoConfig[a.estado];
                      return (
                        <tr key={a.id} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className={`text-[10px] font-bold text-white ${getColorAvatar(a.empleado)}`}>
                                  {getInitials(a.empleado)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-foreground">{a.empleado}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{tipoLabel[a.tipo]}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {formatFecha(a.fechaInicio)} — {formatFecha(a.fechaFin)}
                          </td>
                          <td className="px-4 py-3 font-medium">{a.dias}d</td>
                          <td className="px-4 py-3">
                            <Badge variant={cfg.variant}>{cfg.label}</Badge>
                          </td>
                          <td className="px-4 py-3">
                            {a.estado === 'PENDIENTE' && (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => aprobar(a.id)}
                                  className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                                  title="Aprobar"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => rechazar(a.id)}
                                  className="rounded p-1 text-red-500 hover:bg-red-50"
                                  title="Rechazar"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Calendario mini */}
          <Card className="border-border/60 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Abril 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['L','M','X','J','V','S','D'].map((d) => (
                  <div key={d} className="text-[10px] font-semibold text-muted-foreground py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Empieza lunes 1 abril 2024 */}
                {DIAS_MES.map((dia) => (
                  <div
                    key={dia}
                    className={`text-xs py-1.5 rounded-md font-medium ${
                      AUSENCIAS_MES[dia] || 'text-foreground hover:bg-muted'
                    } ${dia === 4 ? 'bg-primary text-white' : ''}`}
                  >
                    {dia}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-primary" />
                  <span className="text-muted-foreground">Hoy</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-amber-100" />
                  <span className="text-muted-foreground">Vacaciones pendientes</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-emerald-100" />
                  <span className="text-muted-foreground">Vacaciones aprobadas</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded bg-blue-100" />
                  <span className="text-muted-foreground">Enfermedad / Permiso</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal nueva solicitud */}
      <Dialog open={modalSolicitud} onOpenChange={setModalSolicitud}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nueva solicitud de ausencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Tipo de ausencia</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoLabel).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Fecha inicio</Label>
                <Input type="date" />
              </div>
              <div className="space-y-1.5">
                <Label>Fecha fin</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Descripción (opcional)</Label>
              <Textarea placeholder="Motivo o comentario..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalSolicitud(false)}>Cancelar</Button>
            <Button onClick={() => setModalSolicitud(false)}>Enviar solicitud</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
