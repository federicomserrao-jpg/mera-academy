'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock, Plus, User, Laptop, Shield, Building2 } from 'lucide-react';
import { getInitials, getColorAvatar, formatFecha } from '@/lib/utils';

type EstadoTarea = 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA';
type Responsable = 'RRHH' | 'IT' | 'MANAGER' | 'EMPLEADO';

interface TareaOnboarding {
  id: string;
  titulo: string;
  descripcion: string;
  responsable: Responsable;
  estado: EstadoTarea;
  diasDesdeAlta: number;
}

interface NuevoEmpleado {
  id: string;
  nombre: string;
  puesto: string;
  departamento: string;
  fechaAlta: string;
  progreso: number;
  tareas: TareaOnboarding[];
}

const nuevosEmpleados: NuevoEmpleado[] = [
  {
    id: '1',
    nombre: 'Sofía Mendoza',
    puesto: 'UX Designer',
    departamento: 'Tecnología',
    fechaAlta: '2024-04-01',
    progreso: 65,
    tareas: [
      { id: 't1', titulo: 'Firma del contrato', descripcion: 'Firmar contrato de trabajo', responsable: 'RRHH', estado: 'COMPLETADA', diasDesdeAlta: 0 },
      { id: 't2', titulo: 'Alta en Seguridad Social', descripcion: 'Gestionar alta en SS', responsable: 'RRHH', estado: 'COMPLETADA', diasDesdeAlta: 1 },
      { id: 't3', titulo: 'Configurar equipo', descripcion: 'Entregar y configurar portátil, accesos', responsable: 'IT', estado: 'COMPLETADA', diasDesdeAlta: 0 },
      { id: 't4', titulo: 'Acceso a herramientas', descripcion: 'Figma, Slack, Notion, GitHub', responsable: 'IT', estado: 'COMPLETADA', diasDesdeAlta: 1 },
      { id: 't5', titulo: 'Reunión con el equipo', descripcion: 'Presentación al equipo y tour oficina', responsable: 'MANAGER', estado: 'COMPLETADA', diasDesdeAlta: 0 },
      { id: 't6', titulo: 'Plan de 30 días', descripcion: 'Revisar objetivos primeros 30 días', responsable: 'MANAGER', estado: 'EN_PROGRESO', diasDesdeAlta: 2 },
      { id: 't7', titulo: 'Formación de empresa', descripcion: 'Completar módulos de onboarding', responsable: 'EMPLEADO', estado: 'PENDIENTE', diasDesdeAlta: 5 },
      { id: 't8', titulo: 'Check-in semana 1', descripcion: 'Primera reunión 1:1 con manager', responsable: 'MANAGER', estado: 'PENDIENTE', diasDesdeAlta: 7 },
    ],
  },
  {
    id: '2',
    nombre: 'Marcos García',
    puesto: 'Sales Executive',
    departamento: 'Ventas',
    fechaAlta: '2024-04-08',
    progreso: 25,
    tareas: [
      { id: 't9', titulo: 'Firma del contrato', descripcion: 'Firmar contrato de trabajo', responsable: 'RRHH', estado: 'COMPLETADA', diasDesdeAlta: 0 },
      { id: 't10', titulo: 'Alta en Seguridad Social', descripcion: 'Gestionar alta en SS', responsable: 'RRHH', estado: 'COMPLETADA', diasDesdeAlta: 1 },
      { id: 't11', titulo: 'Configurar equipo', descripcion: 'Entregar y configurar portátil', responsable: 'IT', estado: 'EN_PROGRESO', diasDesdeAlta: 0 },
      { id: 't12', titulo: 'Formación en CRM', descripcion: 'Salesforce onboarding', responsable: 'MANAGER', estado: 'PENDIENTE', diasDesdeAlta: 3 },
    ],
  },
];

const responsableConfig: Record<Responsable, { label: string; icon: typeof User; color: string }> = {
  RRHH: { label: 'RRHH', icon: Shield, color: 'text-violet-600' },
  IT: { label: 'IT', icon: Laptop, color: 'text-blue-600' },
  MANAGER: { label: 'Manager', icon: User, color: 'text-emerald-600' },
  EMPLEADO: { label: 'Empleado', icon: Building2, color: 'text-amber-600' },
};

export default function OnboardingPage() {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<NuevoEmpleado>(nuevosEmpleados[0]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Onboarding" />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">{nuevosEmpleados.length} nuevas incorporaciones</h2>
            <p className="text-sm text-muted-foreground">Gestiona el proceso de bienvenida de cada empleado</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo onboarding
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Lista empleados */}
          <div className="space-y-3">
            {nuevosEmpleados.map((emp) => (
              <Card
                key={emp.id}
                className={`border-border/60 cursor-pointer transition-all ${
                  empleadoSeleccionado.id === emp.id
                    ? 'border-primary shadow-sm ring-1 ring-primary/20'
                    : 'hover:shadow-sm'
                }`}
                onClick={() => setEmpleadoSeleccionado(emp)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`text-sm font-bold text-white ${getColorAvatar(emp.nombre)}`}>
                        {getInitials(emp.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{emp.nombre}</p>
                      <p className="text-xs text-muted-foreground">{emp.puesto} · {emp.departamento}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Alta: {formatFecha(emp.fechaAlta)}</span>
                    <span className="font-medium text-foreground">{emp.progreso}%</span>
                  </div>
                  <Progress value={emp.progreso} className="h-1.5" />
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>{emp.tareas.filter(t => t.estado === 'COMPLETADA').length}/{emp.tareas.length} tareas</span>
                    {emp.tareas.some(t => t.estado === 'PENDIENTE') && (
                      <Badge variant="warning" className="text-[10px]">
                        {emp.tareas.filter(t => t.estado === 'PENDIENTE').length} pendientes
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detalle tareas */}
          <Card className="xl:col-span-2 border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`text-sm font-bold text-white ${getColorAvatar(empleadoSeleccionado.nombre)}`}>
                    {getInitials(empleadoSeleccionado.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-semibold">{empleadoSeleccionado.nombre}</CardTitle>
                  <p className="text-xs text-muted-foreground">{empleadoSeleccionado.puesto} · Alta {formatFecha(empleadoSeleccionado.fechaAlta)}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-2xl font-bold text-primary">{empleadoSeleccionado.progreso}%</p>
                  <p className="text-xs text-muted-foreground">completado</p>
                </div>
              </div>
              <Progress value={empleadoSeleccionado.progreso} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(['RRHH', 'IT', 'MANAGER', 'EMPLEADO'] as Responsable[]).map((resp) => {
                  const tareasResp = empleadoSeleccionado.tareas.filter(t => t.responsable === resp);
                  if (tareasResp.length === 0) return null;
                  const cfg = responsableConfig[resp];
                  return (
                    <div key={resp}>
                      <div className="flex items-center gap-2 mb-2">
                        <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cfg.label}</p>
                      </div>
                      <div className="space-y-2 pl-6">
                        {tareasResp.map((tarea) => (
                          <div
                            key={tarea.id}
                            className={`flex items-start gap-3 rounded-lg p-3 border ${
                              tarea.estado === 'COMPLETADA'
                                ? 'bg-emerald-50/50 border-emerald-100'
                                : tarea.estado === 'EN_PROGRESO'
                                ? 'bg-blue-50/50 border-blue-100'
                                : 'bg-muted/30 border-border/50'
                            }`}
                          >
                            <div className="mt-0.5">
                              {tarea.estado === 'COMPLETADA' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              ) : tarea.estado === 'EN_PROGRESO' ? (
                                <Clock className="h-4 w-4 text-blue-600" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground/50" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${tarea.estado === 'COMPLETADA' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {tarea.titulo}
                              </p>
                              <p className="text-xs text-muted-foreground">{tarea.descripcion}</p>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              Día {tarea.diasDesdeAlta}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
