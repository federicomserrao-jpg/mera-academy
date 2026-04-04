'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, ChevronLeft, ChevronRight, Sun, Moon, Coffee } from 'lucide-react';
import { getInitials, getColorAvatar, DIAS_SEMANA } from '@/lib/utils';

const turnos = [
  { id: '1', nombre: 'Mañana', color: 'bg-amber-400', horaInicio: '08:00', horaFin: '16:00' },
  { id: '2', nombre: 'Tarde', color: 'bg-blue-400', horaInicio: '14:00', horaFin: '22:00' },
  { id: '3', nombre: 'Noche', color: 'bg-indigo-500', horaInicio: '22:00', horaFin: '06:00' },
  { id: '4', nombre: 'Partido', color: 'bg-emerald-400', horaInicio: '09:00', horaFin: '14:00' },
];

const empleados = [
  { nombre: 'Laura Martínez', puesto: 'Diseñadora UX' },
  { nombre: 'Carlos Ruiz', puesto: 'Backend Dev' },
  { nombre: 'Ana García', puesto: 'Project Manager' },
  { nombre: 'Javier López', puesto: 'Sales Manager' },
  { nombre: 'María Sánchez', puesto: 'Marketing' },
  { nombre: 'Pedro Alonso', puesto: 'Frontend Dev' },
];

// Semana: {empleado: {dia: turnoId | null}}
const planificacion: Record<string, (string | null)[]> = {
  'Laura Martínez': ['1', '1', '1', '1', '1', null, null],
  'Carlos Ruiz': ['1', '1', '2', '2', '1', null, null],
  'Ana García': ['1', '1', '1', null, '1', null, null],
  'Javier López': ['1', '1', '1', '1', '1', null, null],
  'María Sánchez': ['4', '4', '4', '4', '4', null, null],
  'Pedro Alonso': ['1', '2', '2', '1', '1', null, null],
};

const turnoById = Object.fromEntries(turnos.map(t => [t.id, t]));

const DIAS_SEMANA_CORTOS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function TurnosPage() {
  const [semanaOffset, setSemanaOffset] = useState(0);

  const inicioSemana = new Date(2024, 3, 1 + semanaOffset * 7); // Semana del 1 de abril

  return (
    <div className="flex flex-col h-full">
      <Header title="Gestión de Turnos" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Leyenda de turnos */}
        <div className="flex flex-wrap gap-3">
          {turnos.map((t) => (
            <div key={t.id} className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2">
              <div className={`h-3 w-3 rounded-full ${t.color}`} />
              <span className="text-sm font-medium">{t.nombre}</span>
              <span className="text-xs text-muted-foreground">{t.horaInicio}–{t.horaFin}</span>
            </div>
          ))}
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo turno
          </Button>
        </div>

        {/* Calendario semanal */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Semana del {inicioSemana.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSemanaOffset(s => s - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8" onClick={() => setSemanaOffset(0)}>
                  Esta semana
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setSemanaOffset(s => s + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-48">Empleado</th>
                  {DIAS_SEMANA_CORTOS.map((dia, i) => {
                    const fecha = new Date(inicioSemana);
                    fecha.setDate(inicioSemana.getDate() + i);
                    return (
                      <th key={dia} className="text-center px-2 py-3 text-xs font-semibold text-muted-foreground">
                        <div>{dia}</div>
                        <div className="font-bold text-foreground">{fecha.getDate()}</div>
                      </th>
                    );
                  })}
                  <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground">Total</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => {
                  const semana = planificacion[emp.nombre] || [];
                  const horasTotal = semana.filter(Boolean).length * 8;
                  return (
                    <tr key={emp.nombre} className="border-b border-border/50 hover:bg-muted/10">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className={`text-[10px] font-bold text-white ${getColorAvatar(emp.nombre)}`}>
                              {getInitials(emp.nombre)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">{emp.nombre}</p>
                            <p className="text-[10px] text-muted-foreground">{emp.puesto}</p>
                          </div>
                        </div>
                      </td>
                      {semana.map((turnoId, i) => {
                        const turno = turnoId ? turnoById[turnoId] : null;
                        const isWeekend = i >= 5;
                        return (
                          <td key={i} className={`px-2 py-3 text-center ${isWeekend ? 'bg-muted/30' : ''}`}>
                            {turno ? (
                              <div className={`mx-auto w-16 rounded-md px-2 py-1 text-[10px] font-semibold text-white ${turno.color}`}>
                                {turno.nombre}
                              </div>
                            ) : (
                              <div className="mx-auto w-16 rounded-md px-2 py-1 text-[10px] text-muted-foreground/50 border border-dashed border-border">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <span className="text-sm font-bold">{horasTotal}h</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Resumen por turno */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {turnos.map((t) => {
            const count = Object.values(planificacion)
              .flat()
              .filter((id) => id === t.id).length;
            return (
              <Card key={t.id} className="border-border/60">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${t.color}`}>
                    {t.nombre === 'Mañana' && <Sun className="h-5 w-5 text-white" />}
                    {t.nombre === 'Tarde' && <Coffee className="h-5 w-5 text-white" />}
                    {t.nombre === 'Noche' && <Moon className="h-5 w-5 text-white" />}
                    {t.nombre === 'Partido' && <Sun className="h-4 w-4 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.nombre}</p>
                    <p className="text-xl font-bold">{count} <span className="text-sm font-normal text-muted-foreground">asignaciones</span></p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
