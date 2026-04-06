'use client';

import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Building2, Briefcase, UserPlus } from 'lucide-react';
import { getInitials } from '@/lib/utils';

interface OrgNode {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  nivel: 'ceo' | 'director' | 'empleado';
  avatar?: string;
}

const ceo: OrgNode = {
  id: 'ceo',
  nombre: 'Alejandro Vega',
  cargo: 'CEO & Fundador',
  departamento: 'Dirección',
  nivel: 'ceo',
};

const departamentos: { director: OrgNode; empleados: OrgNode[] }[] = [
  {
    director: {
      id: 'dir-tech',
      nombre: 'Carlos Ruiz',
      cargo: 'Director de Tecnología',
      departamento: 'Tecnología',
      nivel: 'director',
    },
    empleados: [
      { id: 'emp1', nombre: 'Pedro Alonso', cargo: 'Frontend Developer', departamento: 'Tecnología', nivel: 'empleado' },
      { id: 'emp2', nombre: 'Laura Martínez', cargo: 'Diseñadora UX', departamento: 'Tecnología', nivel: 'empleado' },
      { id: 'emp3', nombre: 'Miguel Herrera', cargo: 'Backend Developer', departamento: 'Tecnología', nivel: 'empleado' },
    ],
  },
  {
    director: {
      id: 'dir-ventas',
      nombre: 'Javier López',
      cargo: 'Director de Ventas',
      departamento: 'Ventas',
      nivel: 'director',
    },
    empleados: [
      { id: 'emp4', nombre: 'Sofía Navarro', cargo: 'Account Manager', departamento: 'Ventas', nivel: 'empleado' },
      { id: 'emp5', nombre: 'Diego Castro', cargo: 'Sales Executive', departamento: 'Ventas', nivel: 'empleado' },
      { id: 'emp6', nombre: 'Lucía Vidal', cargo: 'Sales Analyst', departamento: 'Ventas', nivel: 'empleado' },
    ],
  },
  {
    director: {
      id: 'dir-mkt',
      nombre: 'María Sánchez',
      cargo: 'Directora de Marketing',
      departamento: 'Marketing',
      nivel: 'director',
    },
    empleados: [
      { id: 'emp7', nombre: 'Andrea Romero', cargo: 'Content Manager', departamento: 'Marketing', nivel: 'empleado' },
      { id: 'emp8', nombre: 'Tomás Iglesias', cargo: 'SEO Specialist', departamento: 'Marketing', nivel: 'empleado' },
    ],
  },
  {
    director: {
      id: 'dir-rrhh',
      nombre: 'Isabel Torres',
      cargo: 'Directora de RRHH',
      departamento: 'RRHH',
      nivel: 'director',
    },
    empleados: [
      { id: 'emp9', nombre: 'Marta Cano', cargo: 'HR Business Partner', departamento: 'RRHH', nivel: 'empleado' },
      { id: 'emp10', nombre: 'Raúl Flores', cargo: 'Talent Acquisition', departamento: 'RRHH', nivel: 'empleado' },
    ],
  },
];

const deptColors: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  Dirección: { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  Tecnología: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  Ventas: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  Marketing: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  RRHH: { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
};

function OrgCard({ node, size = 'md' }: { node: OrgNode; size?: 'lg' | 'md' | 'sm' }) {
  const colors = deptColors[node.departamento] ?? deptColors['Dirección'];
  const isCeo = node.nivel === 'ceo';
  const isDirector = node.nivel === 'director';

  return (
    <div
      className={`
        group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all duration-200
        hover:shadow-lg hover:-translate-y-0.5 cursor-pointer select-none
        ${isCeo ? 'bg-violet-50 border-violet-300 shadow-md w-52' : ''}
        ${isDirector ? `${colors.bg} ${colors.border} shadow-sm w-44` : ''}
        ${node.nivel === 'empleado' ? 'bg-white border-border/60 hover:border-border w-40' : ''}
      `}
    >
      <Avatar className={`${isCeo ? 'h-14 w-14' : isDirector ? 'h-11 w-11' : 'h-9 w-9'}`}>
        <AvatarFallback
          className={`font-bold text-white ${
            isCeo
              ? 'bg-violet-500 text-base'
              : isDirector
              ? `${colors.dot} text-sm`
              : 'bg-slate-400 text-xs'
          }`}
        >
          {getInitials(node.nombre)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className={`font-semibold text-foreground leading-tight ${isCeo ? 'text-sm' : 'text-xs'}`}>
          {node.nombre}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{node.cargo}</p>
      </div>
      <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
        {node.departamento}
      </span>
    </div>
  );
}

const stats = [
  { label: 'Total empleados', value: '148', icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Departamentos', value: '4', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Managers', value: '12', icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Vacantes', value: '6', icon: UserPlus, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function OrganigramaPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Organigrama" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Org Chart */}
        <Card className="border-border/60 overflow-auto">
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-0 min-w-[900px]">

              {/* CEO */}
              <OrgCard node={ceo} size="lg" />

              {/* Connector from CEO down */}
              <div className="w-0.5 h-8 bg-border" />

              {/* Horizontal bar spanning all depts */}
              <div className="relative flex items-start justify-center gap-16">
                {/* Top horizontal line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-112px)] h-0.5 bg-border" />

                {departamentos.map((dept, di) => (
                  <div key={dept.director.id} className="flex flex-col items-center gap-0">
                    {/* Vertical line from top bar to director */}
                    <div className="w-0.5 h-8 bg-border" />

                    {/* Director card */}
                    <OrgCard node={dept.director} size="md" />

                    {/* Vertical line from director to employees */}
                    <div className="w-0.5 h-6 bg-border" />

                    {/* Horizontal connector for employees */}
                    <div className="relative flex items-start justify-center gap-4">
                      {dept.empleados.length > 1 && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] h-0.5 bg-border/70" />
                      )}
                      {dept.empleados.map((emp) => (
                        <div key={emp.id} className="flex flex-col items-center">
                          <div className="w-0.5 h-6 bg-border/70" />
                          <OrgCard node={emp} size="sm" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <p className="text-xs text-muted-foreground font-medium mr-2 self-center">Leyenda:</p>
          {[
            { label: 'CEO / Dirección', color: 'bg-violet-100 border-violet-300' },
            { label: 'Directores', color: 'bg-blue-100 border-blue-300' },
            { label: 'Empleados', color: 'bg-white border-border' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`h-4 w-6 rounded border-2 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
