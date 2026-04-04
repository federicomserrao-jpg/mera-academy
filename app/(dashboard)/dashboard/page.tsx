'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users, CalendarDays, Clock, TrendingUp, TrendingDown,
  ArrowRight, CheckCircle2, AlertCircle, Circle,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

// --- Datos demo ---
const kpis = [
  {
    label: 'Total Empleados',
    value: '148',
    change: '+3',
    trend: 'up',
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
  },
  {
    label: 'Ausencias hoy',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: CalendarDays,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Horas extra (mes)',
    value: '347h',
    change: '-18h',
    trend: 'down',
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Candidatos activos',
    value: '34',
    change: '+8',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
];

const headcountData = [
  { mes: 'Oct', empleados: 131 },
  { mes: 'Nov', empleados: 135 },
  { mes: 'Dic', empleados: 133 },
  { mes: 'Ene', empleados: 138 },
  { mes: 'Feb', empleados: 142 },
  { mes: 'Mar', empleados: 145 },
  { mes: 'Abr', empleados: 148 },
];

const ausenciasData = [
  { dia: 'Lun', ausencias: 4 },
  { dia: 'Mar', ausencias: 7 },
  { dia: 'Mié', ausencias: 5 },
  { dia: 'Jue', ausencias: 12 },
  { dia: 'Vie', ausencias: 9 },
];

const solicitudesPendientes = [
  { nombre: 'Laura Martínez', tipo: 'Vacaciones', dias: '14–21 abr', estado: 'pendiente' },
  { nombre: 'Carlos Ruiz', tipo: 'Teletrabajo', dias: '7–11 abr', estado: 'pendiente' },
  { nombre: 'Ana García', tipo: 'Permiso médico', dias: '5 abr', estado: 'pendiente' },
  { nombre: 'Javier López', tipo: 'Vacaciones', dias: '1–5 may', estado: 'pendiente' },
];

const cumpleanios = [
  { nombre: 'María Sánchez', puesto: 'Diseñadora UX', dias: 'Hoy' },
  { nombre: 'Pedro Alonso', puesto: 'Backend Developer', dias: 'Mañana' },
  { nombre: 'Isabel Torres', puesto: 'Project Manager', dias: 'En 3 días' },
];

const departamentos = [
  { nombre: 'Tecnología', empleados: 42, porcentaje: 28 },
  { nombre: 'Ventas', empleados: 35, porcentaje: 24 },
  { nombre: 'Marketing', empleados: 22, porcentaje: 15 },
  { nombre: 'Operaciones', empleados: 28, porcentaje: 19 },
  { nombre: 'RRHH', empleados: 11, porcentaje: 7 },
  { nombre: 'Finanzas', empleados: 10, porcentaje: 7 },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="border-border/60">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{kpi.value}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {kpi.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {kpi.change} este mes
                      </span>
                    </div>
                  </div>
                  <div className={`rounded-lg p-2 ${kpi.bg}`}>
                    <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Headcount */}
          <Card className="xl:col-span-2 border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Evolución de plantilla</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={headcountData}>
                  <defs>
                    <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(250,84%,54%)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="hsl(250,84%,54%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="empleados"
                    stroke="hsl(250,84%,54%)"
                    strokeWidth={2}
                    fill="url(#colorEmp)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Ausencias semana */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Ausencias esta semana</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={ausenciasData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="dia" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }}
                  />
                  <Bar dataKey="ausencias" fill="hsl(250,84%,54%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* Solicitudes pendientes */}
          <Card className="xl:col-span-2 border-border/60">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold">Solicitudes pendientes</CardTitle>
              <Link href="/vacaciones" className="flex items-center gap-1 text-xs text-primary hover:underline">
                Ver todas <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {solicitudesPendientes.map((s) => (
                <div key={s.nombre} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                        {getInitials(s.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.nombre}</p>
                      <p className="text-xs text-muted-foreground">{s.tipo} · {s.dias}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="warning">Pendiente</Badge>
                    <button className="text-xs text-emerald-600 hover:underline font-medium">Aprobar</button>
                    <button className="text-xs text-red-500 hover:underline">Rechazar</button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right column */}
          <div className="space-y-4">
            {/* Distribución por departamento */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Departamentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {departamentos.map((d) => (
                  <div key={d.nombre}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-foreground font-medium">{d.nombre}</span>
                      <span className="text-muted-foreground">{d.empleados}</span>
                    </div>
                    <Progress value={d.porcentaje} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cumpleaños */}
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Próximos cumpleaños 🎂</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {cumpleanios.map((c) => (
                  <div key={c.nombre} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-amber-50 text-amber-700 font-semibold">
                        {getInitials(c.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{c.nombre}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.puesto}</p>
                    </div>
                    <Badge variant={c.dias === 'Hoy' ? 'purple' : 'outline'} className="shrink-0 text-[10px]">
                      {c.dias}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
