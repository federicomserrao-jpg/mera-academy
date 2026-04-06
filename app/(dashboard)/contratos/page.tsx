'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  FilePen, Plus, AlertTriangle, CheckCircle2, XCircle,
  Clock, Eye, Download, Pencil, FileText,
} from 'lucide-react';
import { getInitials, getColorAvatar, formatFecha, formatMoneda } from '@/lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

type ContratoTipo = 'Indefinido' | 'Temporal' | 'Prácticas' | 'Obra y Servicio';
type ContratoEstado = 'ACTIVO' | 'POR_VENCER' | 'VENCIDO' | 'BAJA';

interface Contrato {
  id: string;
  empleado: string;
  departamento: string;
  tipo: ContratoTipo;
  fechaInicio: string;
  fechaFin: string | null;
  salario: number;
  estado: ContratoEstado;
}

const contratosDemo: Contrato[] = [
  { id: '1', empleado: 'Laura Martínez', departamento: 'Tecnología', tipo: 'Indefinido', fechaInicio: '2022-03-15', fechaFin: null, salario: 42000, estado: 'ACTIVO' },
  { id: '2', empleado: 'Carlos Ruiz', departamento: 'Tecnología', tipo: 'Indefinido', fechaInicio: '2021-07-01', fechaFin: null, salario: 55000, estado: 'ACTIVO' },
  { id: '3', empleado: 'Ana García', departamento: 'Operaciones', tipo: 'Temporal', fechaInicio: '2024-01-10', fechaFin: '2026-04-25', salario: 38000, estado: 'POR_VENCER' },
  { id: '4', empleado: 'Javier López', departamento: 'Ventas', tipo: 'Indefinido', fechaInicio: '2019-05-20', fechaFin: null, salario: 58000, estado: 'ACTIVO' },
  { id: '5', empleado: 'María Sánchez', departamento: 'Marketing', tipo: 'Temporal', fechaInicio: '2023-02-14', fechaFin: '2026-05-10', salario: 38000, estado: 'POR_VENCER' },
  { id: '6', empleado: 'Pedro Alonso', departamento: 'Tecnología', tipo: 'Prácticas', fechaInicio: '2025-09-01', fechaFin: '2026-04-15', salario: 18000, estado: 'POR_VENCER' },
  { id: '7', empleado: 'Isabel Torres', departamento: 'RRHH', tipo: 'Indefinido', fechaInicio: '2021-11-22', fechaFin: null, salario: 40000, estado: 'ACTIVO' },
  { id: '8', empleado: 'Roberto Gómez', departamento: 'Finanzas', tipo: 'Temporal', fechaInicio: '2018-03-01', fechaFin: '2025-12-31', salario: 0, estado: 'BAJA' },
  { id: '9', empleado: 'Sofía Navarro', departamento: 'Ventas', tipo: 'Indefinido', fechaInicio: '2020-06-15', fechaFin: null, salario: 45000, estado: 'ACTIVO' },
  { id: '10', empleado: 'Diego Castro', departamento: 'Ventas', tipo: 'Obra y Servicio', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', salario: 32000, estado: 'VENCIDO' },
];

const estadoConfig: Record<ContratoEstado, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary'; icon: React.ElementType }> = {
  ACTIVO: { label: 'Activo', variant: 'success', icon: CheckCircle2 },
  POR_VENCER: { label: 'Por vencer', variant: 'warning', icon: AlertTriangle },
  VENCIDO: { label: 'Vencido', variant: 'destructive', icon: XCircle },
  BAJA: { label: 'Baja', variant: 'secondary', icon: FileText },
};

const tipoColor: Record<ContratoTipo, string> = {
  Indefinido: 'bg-emerald-100 text-emerald-700',
  Temporal: 'bg-amber-100 text-amber-700',
  Prácticas: 'bg-blue-100 text-blue-700',
  'Obra y Servicio': 'bg-violet-100 text-violet-700',
};

function duracion(inicio: string, fin: string | null): string {
  if (!fin) return 'Indefinido';
  const days = differenceInDays(parseISO(fin), parseISO(inicio));
  if (days < 0) return 'Vencido';
  if (days < 365) return `${Math.round(days / 30)} meses`;
  return `${(days / 365).toFixed(1)} años`;
}

function diasRestantes(fin: string | null): number | null {
  if (!fin) return null;
  return differenceInDays(parseISO(fin), new Date());
}

export default function ContratosPage() {
  const [modalNuevo, setModalNuevo] = useState(false);

  const activos = contratosDemo.filter(c => c.estado === 'ACTIVO').length;
  const porVencer = contratosDemo.filter(c => c.estado === 'POR_VENCER').length;
  const vencidos = contratosDemo.filter(c => c.estado === 'VENCIDO').length;
  const temporales = contratosDemo.filter(c => c.tipo === 'Temporal' || c.tipo === 'Prácticas' || c.tipo === 'Obra y Servicio').length;

  const stats = [
    { label: 'Contratos activos', value: activos, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Próx. a vencer (30d)', value: porVencer, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Vencidos', value: vencidos, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Temporales', value: temporales, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Contratos" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <FilePen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Gestión de Contratos</span>
          </div>
          <Button size="sm" onClick={() => setModalNuevo(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo contrato
          </Button>
        </div>

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

        {/* Alert for expiring soon */}
        {porVencer > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                {porVencer} contrato{porVencer > 1 ? 's' : ''} próximo{porVencer > 1 ? 's' : ''} a vencer
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Revisa los contratos resaltados en la tabla y toma acción antes de su vencimiento.
              </p>
            </div>
          </div>
        )}

        {/* Table */}
        <Card className="border-border/60">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">Todos los contratos</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Fecha inicio</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Fecha fin</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Duración</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Salario</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {contratosDemo.map((contrato) => {
                    const est = estadoConfig[contrato.estado];
                    const EstIcon = est.icon;
                    const dias = diasRestantes(contrato.fechaFin);
                    const isExpiringSoon = dias !== null && dias >= 0 && dias <= 30;
                    return (
                      <tr
                        key={contrato.id}
                        className={`border-b border-border/50 transition-colors ${
                          isExpiringSoon
                            ? 'bg-amber-50/60 hover:bg-amber-50'
                            : 'hover:bg-muted/20'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={`text-[10px] font-bold text-white ${getColorAvatar(contrato.empleado)}`}>
                                {getInitials(contrato.empleado)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground whitespace-nowrap">{contrato.empleado}</p>
                              <p className="text-[10px] text-muted-foreground">{contrato.departamento}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tipoColor[contrato.tipo]}`}>
                            {contrato.tipo}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {formatFecha(contrato.fechaInicio)}
                        </td>
                        <td className="px-4 py-3">
                          {contrato.fechaFin ? (
                            <div>
                              <p className="text-xs text-muted-foreground whitespace-nowrap">{formatFecha(contrato.fechaFin)}</p>
                              {isExpiringSoon && dias !== null && (
                                <p className="text-[10px] text-amber-600 font-semibold">
                                  {dias === 0 ? 'Vence hoy' : `${dias}d restantes`}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground/60">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {duracion(contrato.fechaInicio, contrato.fechaFin)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-foreground">
                            {contrato.salario > 0 ? formatMoneda(contrato.salario) : '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={est.variant} className="gap-1">
                            <EstIcon className="h-3 w-3" />
                            {est.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end">
                            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Ver">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Descargar">
                              <Download className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal nuevo contrato */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePen className="h-5 w-5 text-primary" />
              Nuevo contrato
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="ct-empleado">Empleado</Label>
              <Select>
                <SelectTrigger id="ct-empleado">
                  <SelectValue placeholder="Selecciona empleado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laura">Laura Martínez</SelectItem>
                  <SelectItem value="carlos">Carlos Ruiz</SelectItem>
                  <SelectItem value="ana">Ana García</SelectItem>
                  <SelectItem value="javier">Javier López</SelectItem>
                  <SelectItem value="maria">María Sánchez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-tipo">Tipo de contrato</Label>
              <Select>
                <SelectTrigger id="ct-tipo">
                  <SelectValue placeholder="Selecciona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indefinido">Indefinido</SelectItem>
                  <SelectItem value="temporal">Temporal</SelectItem>
                  <SelectItem value="practicas">Prácticas</SelectItem>
                  <SelectItem value="obra">Obra y Servicio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ct-inicio">Fecha inicio</Label>
                <Input id="ct-inicio" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ct-fin">Fecha fin</Label>
                <Input id="ct-fin" type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ct-salario">Salario bruto anual (€)</Label>
              <Input id="ct-salario" type="number" placeholder="0" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button onClick={() => setModalNuevo(false)}>Crear contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
