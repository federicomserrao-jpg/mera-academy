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
  Plus, Receipt, CheckCircle2, Clock, XCircle, Eye, Pencil,
  Plane, UtensilsCrossed, Package, MoreHorizontal, Wallet,
  TrendingUp, Paperclip,
} from 'lucide-react';
import { getInitials, getColorAvatar, formatMoneda, formatFecha } from '@/lib/utils';

type GastoEstado = 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
type GastoCategoria = 'Viaje' | 'Comida' | 'Material' | 'Otro';

interface Gasto {
  id: string;
  empleado: string;
  categoria: GastoCategoria;
  descripcion: string;
  importe: number;
  fecha: string;
  estado: GastoEstado;
  ticket?: boolean;
}

const gastosDemo: Gasto[] = [
  { id: '1', empleado: 'Carlos Ruiz', categoria: 'Viaje', descripcion: 'Vuelo Madrid-Barcelona (cliente Banco Sabadell)', importe: 187.50, fecha: '2026-04-02', estado: 'APROBADO', ticket: true },
  { id: '2', empleado: 'Laura Martínez', categoria: 'Comida', descripcion: 'Comida de equipo diseño (8 pax)', importe: 124.80, fecha: '2026-04-03', estado: 'PENDIENTE', ticket: true },
  { id: '3', empleado: 'Javier López', categoria: 'Viaje', descripcion: 'Hotel Barceló Madrid (2 noches)', importe: 348.00, fecha: '2026-04-01', estado: 'APROBADO', ticket: true },
  { id: '4', empleado: 'Ana García', categoria: 'Material', descripcion: 'Monitor Dell 27" para teletrabajo', importe: 399.00, fecha: '2026-03-28', estado: 'PENDIENTE', ticket: false },
  { id: '5', empleado: 'Pedro Alonso', categoria: 'Comida', descripcion: 'Desayuno reunión cliente - Starbucks', importe: 22.40, fecha: '2026-04-04', estado: 'APROBADO', ticket: true },
  { id: '6', empleado: 'María Sánchez', categoria: 'Otro', descripcion: 'Suscripción Figma anual (herramienta diseño)', importe: 144.00, fecha: '2026-03-25', estado: 'RECHAZADO', ticket: false },
  { id: '7', empleado: 'Isabel Torres', categoria: 'Viaje', descripcion: 'Tren Madrid-Valencia ida y vuelta', importe: 95.60, fecha: '2026-04-05', estado: 'PENDIENTE', ticket: true },
  { id: '8', empleado: 'Carlos Ruiz', categoria: 'Material', descripcion: 'Teclado mecánico y ratón inalámbrico', importe: 89.99, fecha: '2026-03-30', estado: 'APROBADO', ticket: true },
  { id: '9', empleado: 'Sofía Navarro', categoria: 'Comida', descripcion: 'Almuerzo formación ventas (12 pax)', importe: 210.00, fecha: '2026-03-29', estado: 'APROBADO', ticket: true },
  { id: '10', empleado: 'Diego Castro', categoria: 'Viaje', descripcion: 'Parking aeropuerto Barajas (3 días)', importe: 54.00, fecha: '2026-04-02', estado: 'PENDIENTE', ticket: false },
];

const estadoConfig: Record<GastoEstado, { label: string; variant: 'success' | 'warning' | 'destructive'; icon: React.ElementType }> = {
  APROBADO: { label: 'Aprobado', variant: 'success', icon: CheckCircle2 },
  PENDIENTE: { label: 'Pendiente', variant: 'warning', icon: Clock },
  RECHAZADO: { label: 'Rechazado', variant: 'destructive', icon: XCircle },
};

const categoriaConfig: Record<GastoCategoria, { icon: React.ElementType; color: string; bg: string }> = {
  Viaje: { icon: Plane, color: 'text-blue-600', bg: 'bg-blue-50' },
  Comida: { icon: UtensilsCrossed, color: 'text-amber-600', bg: 'bg-amber-50' },
  Material: { icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
  Otro: { icon: MoreHorizontal, color: 'text-slate-500', bg: 'bg-slate-50' },
};

const MESES_ES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export default function GastosPage() {
  const [modalNuevo, setModalNuevo] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState('3'); // Abril (0-indexed)

  const totalMes = gastosDemo.reduce((s, g) => s + g.importe, 0);
  const pendientes = gastosDemo.filter(g => g.estado === 'PENDIENTE');
  const aprobados = gastosDemo.filter(g => g.estado === 'APROBADO');
  const totalReembolsado = aprobados.reduce((s, g) => s + g.importe, 0);

  const stats = [
    { label: 'Total gastos mes', value: formatMoneda(totalMes), icon: Receipt, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Pend. aprobación', value: pendientes.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Aprobados', value: aprobados.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Reembolsado', value: formatMoneda(totalReembolsado), icon: Wallet, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  // Category breakdown for mini chart
  const categorias: GastoCategoria[] = ['Viaje', 'Comida', 'Material', 'Otro'];
  const maxCat = Math.max(...categorias.map(c => gastosDemo.filter(g => g.categoria === c).reduce((s, g) => s + g.importe, 0)));
  const catTotals = categorias.map(c => ({
    nombre: c,
    total: gastosDemo.filter(g => g.categoria === c).reduce((s, g) => s + g.importe, 0),
    count: gastosDemo.filter(g => g.categoria === c).length,
  }));

  return (
    <div className="flex flex-col h-full">
      <Header title="Gestión de Gastos" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Control de Gastos</span>
          </div>
          <select
            value={mesSeleccionado}
            onChange={e => setMesSeleccionado(e.target.value)}
            className="border border-border rounded-md px-3 py-1.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {MESES_ES.map((m, i) => (
              <option key={m} value={String(i)}>{m} 2026</option>
            ))}
          </select>
          <Button size="sm" onClick={() => setModalNuevo(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo gasto
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
                  <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="border-border/60">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold">Gastos del mes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Categoría</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Descripción</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground">Importe</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Fecha</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {gastosDemo.map((gasto) => {
                    const est = estadoConfig[gasto.estado];
                    const cat = categoriaConfig[gasto.categoria];
                    const CatIcon = cat.icon;
                    const EstIcon = est.icon;
                    return (
                      <tr key={gasto.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={`text-[10px] font-bold text-white ${getColorAvatar(gasto.empleado)}`}>
                                {getInitials(gasto.empleado)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-foreground whitespace-nowrap">{gasto.empleado}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${cat.bg}`}>
                            <CatIcon className={`h-3.5 w-3.5 ${cat.color}`} />
                            <span className={`text-[11px] font-semibold ${cat.color}`}>{gasto.categoria}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground line-clamp-1 max-w-[260px] block">{gasto.descripcion}</span>
                          {gasto.ticket && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 mt-0.5">
                              <Paperclip className="h-2.5 w-2.5" /> ticket adjunto
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="font-semibold text-foreground">{formatMoneda(gasto.importe)}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{formatFecha(gasto.fecha)}</td>
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
                            {gasto.estado === 'PENDIENTE' && (
                              <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                                <Pencil className="h-4 w-4" />
                              </button>
                            )}
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

        {/* Mini chart by category */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Gastos por categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {catTotals.map((cat) => {
                const cfg = categoriaConfig[cat.nombre as GastoCategoria];
                const CatIcon = cfg.icon;
                const pct = maxCat > 0 ? (cat.total / maxCat) * 100 : 0;
                return (
                  <div key={cat.nombre} className="flex items-center gap-4">
                    <div className={`flex items-center justify-center h-8 w-8 rounded-lg shrink-0 ${cfg.bg}`}>
                      <CatIcon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{cat.nombre}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{cat.count} gastos</span>
                          <span className="text-sm font-semibold text-foreground">{formatMoneda(cat.total)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            cat.nombre === 'Viaje' ? 'bg-blue-500' :
                            cat.nombre === 'Comida' ? 'bg-amber-500' :
                            cat.nombre === 'Material' ? 'bg-violet-500' : 'bg-slate-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal nuevo gasto */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5 text-primary" />
              Nuevo gasto
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="g-categoria">Categoría</Label>
              <Select>
                <SelectTrigger id="g-categoria">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viaje">Viaje</SelectItem>
                  <SelectItem value="comida">Comida</SelectItem>
                  <SelectItem value="material">Material</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="g-desc">Descripción</Label>
              <Input id="g-desc" placeholder="Describe el gasto brevemente" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="g-importe">Importe (€)</Label>
                <Input id="g-importe" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="g-fecha">Fecha</Label>
                <Input id="g-fecha" type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Adjuntar ticket</Label>
              <div className="border-2 border-dashed border-border rounded-lg h-20 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-muted/30 transition-colors">
                <Paperclip className="h-5 w-5 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground">Arrastra imagen/PDF o haz clic</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button onClick={() => setModalNuevo(false)}>Enviar gasto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
