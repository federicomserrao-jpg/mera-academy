'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { FileText, Download, Eye, Send, TrendingUp, Euro, Users, CheckCircle2 } from 'lucide-react';
import { formatMoneda, getInitials, getColorAvatar, MESES } from '@/lib/utils';

type EstadoNomina = 'BORRADOR' | 'GENERADA' | 'PAGADA';

interface Nomina {
  id: string;
  empleado: string;
  puesto: string;
  periodo: string;
  bruto: number;
  irpf: number;
  ss: number;
  neto: number;
  estado: EstadoNomina;
}

const nominasDemo: Nomina[] = [
  { id: '1', empleado: 'Laura Martínez', puesto: 'Diseñadora UX', periodo: '2024-03', bruto: 3500, irpf: 490, ss: 231, neto: 2779, estado: 'PAGADA' },
  { id: '2', empleado: 'Carlos Ruiz', puesto: 'Backend Developer', periodo: '2024-03', bruto: 4583.33, irpf: 825, ss: 302.5, neto: 3455.83, estado: 'PAGADA' },
  { id: '3', empleado: 'Ana García', puesto: 'Project Manager', periodo: '2024-03', bruto: 5166.67, irpf: 1033.33, ss: 341, neto: 3792.34, estado: 'PAGADA' },
  { id: '4', empleado: 'Javier López', puesto: 'Sales Manager', periodo: '2024-03', bruto: 4833.33, irpf: 917.33, ss: 319, neto: 3597, estado: 'PAGADA' },
  { id: '5', empleado: 'María Sánchez', puesto: 'Marketing Specialist', periodo: '2024-03', bruto: 3166.67, irpf: 411.67, ss: 209, neto: 2546, estado: 'GENERADA' },
  { id: '6', empleado: 'Pedro Alonso', puesto: 'Frontend Developer', periodo: '2024-03', bruto: 4000, irpf: 640, ss: 264, neto: 3096, estado: 'GENERADA' },
  { id: '7', empleado: 'Isabel Torres', puesto: 'HR Specialist', periodo: '2024-04', bruto: 3333.33, irpf: 466.67, ss: 220, neto: 2646.66, estado: 'BORRADOR' },
];

const estadoConfig: Record<EstadoNomina, { label: string; variant: 'success' | 'info' | 'warning' }> = {
  PAGADA: { label: 'Pagada', variant: 'success' },
  GENERADA: { label: 'Generada', variant: 'info' },
  BORRADOR: { label: 'Borrador', variant: 'warning' },
};

export default function NominasPage() {
  const [mesSeleccionado, setMesSeleccionado] = useState('2024-03');
  const [nominaDetalle, setNominaDetalle] = useState<Nomina | null>(null);

  const nominasFiltradas = nominasDemo.filter((n) => n.periodo === mesSeleccionado);
  const totalBruto = nominasFiltradas.reduce((acc, n) => acc + n.bruto, 0);
  const totalNeto = nominasFiltradas.reduce((acc, n) => acc + n.neto, 0);
  const totalIRPF = nominasFiltradas.reduce((acc, n) => acc + n.irpf, 0);

  const periodos = [...new Set(nominasDemo.map((n) => n.periodo))].sort().reverse();

  return (
    <div className="flex flex-col h-full">
      <Header title="Nóminas" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Selector mes + acciones */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Select value={mesSeleccionado} onValueChange={setMesSeleccionado}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodos.map((p) => {
                  const [anio, mes] = p.split('-');
                  return (
                    <SelectItem key={p} value={p}>
                      {MESES[parseInt(mes) - 1]} {anio}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Enviar nóminas
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Masa salarial bruta', value: formatMoneda(totalBruto), icon: Euro, color: 'text-violet-600', bg: 'bg-violet-50' },
            { label: 'Total neto a pagar', value: formatMoneda(totalNeto), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { label: 'IRPF retenido', value: formatMoneda(totalIRPF), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Empleados en nómina', value: nominasFiltradas.length, icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((kpi) => (
            <Card key={kpi.label} className="border-border/60">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`rounded-lg p-2.5 ${kpi.bg}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-xl font-bold mt-0.5">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabla nóminas */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Nóminas — {MESES[parseInt(mesSeleccionado.split('-')[1]) - 1]} {mesSeleccionado.split('-')[0]}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Salario bruto</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">IRPF</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Seg. Social</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Neto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {nominasFiltradas.map((n) => {
                  const cfg = estadoConfig[n.estado];
                  return (
                    <tr key={n.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`text-xs font-bold text-white ${getColorAvatar(n.empleado)}`}>
                              {getInitials(n.empleado)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{n.empleado}</p>
                            <p className="text-xs text-muted-foreground">{n.puesto}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm">{formatMoneda(n.bruto)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-red-600">-{formatMoneda(n.irpf)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm text-orange-600">-{formatMoneda(n.ss)}</td>
                      <td className="px-4 py-3.5 text-right font-mono text-sm font-bold text-emerald-700">{formatMoneda(n.neto)}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant={cfg.variant}>{cfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setNominaDetalle(n)}
                            className="rounded p-1 text-muted-foreground hover:text-primary hover:bg-muted"
                            title="Ver nómina"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="rounded p-1 text-muted-foreground hover:text-primary hover:bg-muted"
                            title="Descargar PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/50 font-semibold">
                  <td className="px-6 py-3 text-sm">TOTAL</td>
                  <td className="px-4 py-3 text-right font-mono text-sm">{formatMoneda(totalBruto)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-red-600">-{formatMoneda(totalIRPF)}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-orange-600">
                    -{formatMoneda(nominasFiltradas.reduce((acc, n) => acc + n.ss, 0))}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-emerald-700">{formatMoneda(totalNeto)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Modal detalle nómina */}
      <Dialog open={!!nominaDetalle} onOpenChange={() => setNominaDetalle(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Recibo de salario</DialogTitle>
          </DialogHeader>
          {nominaDetalle && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">{nominaDetalle.empleado}</p>
                  <p className="text-sm text-muted-foreground">{nominaDetalle.puesto}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {MESES[parseInt(nominaDetalle.periodo.split('-')[1]) - 1]} {nominaDetalle.periodo.split('-')[0]}
                  </p>
                  <Badge variant={estadoConfig[nominaDetalle.estado].variant} className="mt-1">
                    {estadoConfig[nominaDetalle.estado].label}
                  </Badge>
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">DEVENGOS</div>
                <div className="px-4 py-3 flex justify-between text-sm">
                  <span>Salario base</span>
                  <span className="font-mono">{formatMoneda(nominaDetalle.bruto)}</span>
                </div>
                <div className="border-t border-border bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">DEDUCCIONES</div>
                <div className="px-4 py-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retención IRPF</span>
                    <span className="font-mono text-red-600">-{formatMoneda(nominaDetalle.irpf)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Seguridad Social</span>
                    <span className="font-mono text-orange-600">-{formatMoneda(nominaDetalle.ss)}</span>
                  </div>
                </div>
                <div className="border-t border-border bg-emerald-50 px-4 py-3 flex justify-between font-bold">
                  <span>TOTAL LÍQUIDO</span>
                  <span className="font-mono text-emerald-700">{formatMoneda(nominaDetalle.neto)}</span>
                </div>
              </div>

              <Button className="w-full gap-2" variant="outline">
                <Download className="h-4 w-4" />
                Descargar PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
