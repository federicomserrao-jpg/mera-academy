'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Plus, Search, Filter, MoreHorizontal, Mail, Phone,
  Building2, Users, LayoutGrid, List, Download,
} from 'lucide-react';
import { getInitials, getColorAvatar, formatFecha } from '@/lib/utils';

type EstadoEmpleado = 'ACTIVO' | 'INACTIVO' | 'BAJA' | 'VACACIONES';

interface Empleado {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  puesto: string;
  departamento: string;
  estado: EstadoEmpleado;
  fechaAlta: string;
  salarioBruto: number;
  rol: string;
}

const empleadosDemo: Empleado[] = [
  { id: '1', nombre: 'Laura', apellidos: 'Martínez García', email: 'laura.martinez@empresa.com', telefono: '+34 612 345 678', puesto: 'Diseñadora UX', departamento: 'Tecnología', estado: 'ACTIVO', fechaAlta: '2022-03-15', salarioBruto: 42000, rol: 'EMPLEADO' },
  { id: '2', nombre: 'Carlos', apellidos: 'Ruiz López', email: 'carlos.ruiz@empresa.com', telefono: '+34 623 456 789', puesto: 'Backend Developer', departamento: 'Tecnología', estado: 'ACTIVO', fechaAlta: '2021-07-01', salarioBruto: 55000, rol: 'EMPLEADO' },
  { id: '3', nombre: 'Ana', apellidos: 'García Fernández', email: 'ana.garcia@empresa.com', telefono: '+34 634 567 890', puesto: 'Project Manager', departamento: 'Operaciones', estado: 'VACACIONES', fechaAlta: '2020-01-10', salarioBruto: 62000, rol: 'MANAGER' },
  { id: '4', nombre: 'Javier', apellidos: 'López Sánchez', email: 'javier.lopez@empresa.com', telefono: '+34 645 678 901', puesto: 'Sales Manager', departamento: 'Ventas', estado: 'ACTIVO', fechaAlta: '2019-05-20', salarioBruto: 58000, rol: 'MANAGER' },
  { id: '5', nombre: 'María', apellidos: 'Sánchez Torres', email: 'maria.sanchez@empresa.com', telefono: '+34 656 789 012', puesto: 'Marketing Specialist', departamento: 'Marketing', estado: 'ACTIVO', fechaAlta: '2023-02-14', salarioBruto: 38000, rol: 'EMPLEADO' },
  { id: '6', nombre: 'Pedro', apellidos: 'Alonso Díaz', email: 'pedro.alonso@empresa.com', telefono: '+34 667 890 123', puesto: 'Frontend Developer', departamento: 'Tecnología', estado: 'ACTIVO', fechaAlta: '2022-09-05', salarioBruto: 48000, rol: 'EMPLEADO' },
  { id: '7', nombre: 'Isabel', apellidos: 'Torres Moreno', email: 'isabel.torres@empresa.com', telefono: '+34 678 901 234', puesto: 'HR Specialist', departamento: 'RRHH', estado: 'ACTIVO', fechaAlta: '2021-11-22', salarioBruto: 40000, rol: 'ADMIN' },
  { id: '8', nombre: 'Roberto', apellidos: 'Gómez Jiménez', email: 'roberto.gomez@empresa.com', telefono: '+34 689 012 345', puesto: 'Financial Analyst', departamento: 'Finanzas', estado: 'BAJA', fechaAlta: '2018-03-01', salarioBruto: 0, rol: 'EMPLEADO' },
];

const estadoBadge: Record<EstadoEmpleado, { label: string; variant: 'success' | 'warning' | 'destructive' | 'info' }> = {
  ACTIVO: { label: 'Activo', variant: 'success' },
  INACTIVO: { label: 'Inactivo', variant: 'warning' },
  BAJA: { label: 'Baja', variant: 'destructive' },
  VACACIONES: { label: 'Vacaciones', variant: 'info' },
};

export default function EmpleadosPage() {
  const [busqueda, setBusqueda] = useState('');
  const [deptFiltro, setDeptFiltro] = useState('todos');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [vista, setVista] = useState<'grid' | 'list'>('list');
  const [modalNuevo, setModalNuevo] = useState(false);

  const empleadosFiltrados = empleadosDemo.filter((e) => {
    const matchBusqueda =
      `${e.nombre} ${e.apellidos} ${e.email} ${e.puesto}`.toLowerCase().includes(busqueda.toLowerCase());
    const matchDept = deptFiltro === 'todos' || e.departamento === deptFiltro;
    const matchEstado = estadoFiltro === 'todos' || e.estado === estadoFiltro;
    return matchBusqueda && matchDept && matchEstado;
  });

  const departamentos = [...new Set(empleadosDemo.map((e) => e.departamento))];

  return (
    <div className="flex flex-col h-full">
      <Header title="Empleados" />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-48 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar empleado..."
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <Select value={deptFiltro} onValueChange={setDeptFiltro}>
            <SelectTrigger className="w-44">
              <Building2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los dptos.</SelectItem>
              {departamentos.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={estadoFiltro} onValueChange={setEstadoFiltro}>
            <SelectTrigger className="w-36">
              <Filter className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="ACTIVO">Activo</SelectItem>
              <SelectItem value="VACACIONES">Vacaciones</SelectItem>
              <SelectItem value="INACTIVO">Inactivo</SelectItem>
              <SelectItem value="BAJA">Baja</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setVista('list')}
                className={`p-2 ${vista === 'list' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setVista('grid')}
                className={`p-2 ${vista === 'grid' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" onClick={() => setModalNuevo(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo empleado
            </Button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total', value: empleadosDemo.length, icon: Users, color: 'text-violet-600' },
            { label: 'Activos', value: empleadosDemo.filter(e => e.estado === 'ACTIVO').length, icon: Users, color: 'text-emerald-600' },
            { label: 'Vacaciones', value: empleadosDemo.filter(e => e.estado === 'VACACIONES').length, icon: Users, color: 'text-blue-600' },
            { label: 'Bajas', value: empleadosDemo.filter(e => e.estado === 'BAJA').length, icon: Users, color: 'text-red-600' },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vista lista */}
        {vista === 'list' ? (
          <Card className="border-border/60">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Departamento</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Puesto</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Alta</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Contacto</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {empleadosFiltrados.map((emp) => {
                    const badge = estadoBadge[emp.estado];
                    return (
                      <tr key={emp.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={`text-xs font-semibold text-white ${getColorAvatar(emp.nombre)}`}>
                                {getInitials(emp.nombre, emp.apellidos)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{emp.nombre} {emp.apellidos}</p>
                              <p className="text-xs text-muted-foreground">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{emp.departamento}</td>
                        <td className="px-4 py-3 text-foreground">{emp.puesto}</td>
                        <td className="px-4 py-3">
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{formatFecha(emp.fechaAlta)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a href={`mailto:${emp.email}`} className="text-muted-foreground hover:text-primary">
                              <Mail className="h-4 w-4" />
                            </a>
                            <a href={`tel:${emp.telefono}`} className="text-muted-foreground hover:text-primary">
                              <Phone className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          // Vista grid (tarjetas)
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {empleadosFiltrados.map((emp) => {
              const badge = estadoBadge[emp.estado];
              return (
                <Card key={emp.id} className="border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-5 flex flex-col items-center text-center">
                    <Avatar className="h-14 w-14 mb-3">
                      <AvatarFallback className={`text-lg font-bold text-white ${getColorAvatar(emp.nombre)}`}>
                        {getInitials(emp.nombre, emp.apellidos)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-foreground text-sm">{emp.nombre} {emp.apellidos}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{emp.puesto}</p>
                    <Badge variant={badge.variant} className="mt-2">{badge.label}</Badge>
                    <p className="text-xs text-muted-foreground mt-2">{emp.departamento}</p>
                    <div className="flex gap-3 mt-3">
                      <a href={`mailto:${emp.email}`} className="text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" />
                      </a>
                      <a href={`tel:${emp.telefono}`} className="text-muted-foreground hover:text-primary">
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal nuevo empleado */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nuevo empleado</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            {[
              { id: 'nombre', label: 'Nombre' },
              { id: 'apellidos', label: 'Apellidos' },
              { id: 'email', label: 'Email', type: 'email' },
              { id: 'telefono', label: 'Teléfono' },
              { id: 'puesto', label: 'Puesto' },
              { id: 'salario', label: 'Salario bruto anual', type: 'number' },
            ].map((f) => (
              <div key={f.id} className="space-y-1.5">
                <Label htmlFor={f.id}>{f.label}</Label>
                <Input id={f.id} type={f.type || 'text'} />
              </div>
            ))}
            <div className="space-y-1.5">
              <Label>Departamento</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {departamentos.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Tipo de contrato</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INDEFINIDO">Indefinido</SelectItem>
                  <SelectItem value="TEMPORAL">Temporal</SelectItem>
                  <SelectItem value="PRACTICAS">Prácticas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button onClick={() => setModalNuevo(false)}>Crear empleado</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
