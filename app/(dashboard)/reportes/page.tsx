'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Users, Clock, TrendingUp, CalendarDays } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const headcountMensual = [
  { mes: 'Oct', altas: 3, bajas: 1, total: 131 },
  { mes: 'Nov', altas: 5, bajas: 1, total: 135 },
  { mes: 'Dic', altas: 1, bajas: 3, total: 133 },
  { mes: 'Ene', altas: 6, bajas: 1, total: 138 },
  { mes: 'Feb', altas: 5, bajas: 1, total: 142 },
  { mes: 'Mar', altas: 4, bajas: 1, total: 145 },
  { mes: 'Abr', altas: 4, bajas: 1, total: 148 },
];

const ausenciasPorTipo = [
  { tipo: 'Vacaciones', dias: 312, fill: '#8B5CF6' },
  { tipo: 'Enfermedad', dias: 89, fill: '#3B82F6' },
  { tipo: 'Personal', dias: 45, fill: '#F59E0B' },
  { tipo: 'Maternidad', dias: 120, fill: '#10B981' },
  { tipo: 'Otro', dias: 22, fill: '#6B7280' },
];

const horasExtraMensual = [
  { mes: 'Oct', horas: 312 },
  { mes: 'Nov', horas: 287 },
  { mes: 'Dic', horas: 198 },
  { mes: 'Ene', horas: 356 },
  { mes: 'Feb', horas: 423 },
  { mes: 'Mar', horas: 389 },
  { mes: 'Abr', horas: 347 },
];

const distribucionDept = [
  { dept: 'Tecnología', count: 42 },
  { dept: 'Ventas', count: 35 },
  { dept: 'Operaciones', count: 28 },
  { dept: 'Marketing', count: 22 },
  { dept: 'RRHH', count: 11 },
  { dept: 'Finanzas', count: 10 },
];

const costeSalarial = [
  { mes: 'Oct', coste: 412000 },
  { mes: 'Nov', coste: 425000 },
  { mes: 'Dic', coste: 428000 },
  { mes: 'Ene', coste: 441000 },
  { mes: 'Feb', coste: 456000 },
  { mes: 'Mar', coste: 469000 },
  { mes: 'Abr', coste: 482000 },
];

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: '1px solid hsl(240 6% 90%)',
  fontSize: 12,
};

export default function ReportesPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Reportes y Analytics" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select defaultValue="2024">
              <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los departamentos</SelectItem>
                <SelectItem value="tech">Tecnología</SelectItem>
                <SelectItem value="ventas">Ventas</SelectItem>
                <SelectItem value="mkt">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar informe
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Headcount actual', value: '148', sub: '+3 este mes', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Rotación anual', value: '8.2%', sub: '-1.3% vs año ant.', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'Horas extra (mes)', value: '347h', sub: '-42h vs mes ant.', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Días de ausencia (mes)', value: '588', sub: '+12 vs mes ant.', icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((kpi) => (
            <Card key={kpi.label} className="border-border/60">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`rounded-lg p-2.5 ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Row 1: Headcount + Horas extra */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Altas y bajas por mes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={headcountMensual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="altas" name="Altas" fill="#10B981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="bajas" name="Bajas" fill="#EF4444" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Horas extra por mes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={horasExtraMensual}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="horas" name="Horas extra" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Distribución dept + Ausencias por tipo + Coste salarial */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Distribución por departamento</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={distribucionDept} layout="vertical" barSize={16}>
                  <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="dept" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Bar dataKey="count" name="Empleados" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Ausencias por tipo (días)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={ausenciasPorTipo} dataKey="dias" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                    {ausenciasPorTipo.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, n, p) => [v + ' días', p.payload.tipo]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                {ausenciasPorTipo.map((a) => (
                  <div key={a.tipo} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: a.fill }} />
                    <span className="text-muted-foreground">{a.tipo}</span>
                    <span className="font-medium ml-auto">{a.dias}d</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Coste salarial mensual (€)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={costeSalarial}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 90%)" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v.toLocaleString('es-ES')} €`, 'Coste']}
                  />
                  <Line type="monotone" dataKey="coste" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
