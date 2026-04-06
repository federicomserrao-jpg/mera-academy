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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Eye, Download, PenLine, FileText, FolderOpen,
  FilePlus, CheckCircle2, Clock, AlertTriangle, XCircle,
} from 'lucide-react';
import { getInitials, getColorAvatar, formatFecha } from '@/lib/utils';

type DocEstado = 'FIRMADO' | 'PENDIENTE_FIRMA' | 'BORRADOR' | 'VENCIDO';
type DocTipo = 'Contrato' | 'Nómina' | 'Política' | 'Plantilla';

interface Documento {
  id: string;
  nombre: string;
  tipo: DocTipo;
  empleado: string;
  estado: DocEstado;
  fecha: string;
  tamaño: string;
}

const documentosDemo: Documento[] = [
  { id: '1', nombre: 'Contrato Indefinido - Laura Martínez', tipo: 'Contrato', empleado: 'Laura Martínez', estado: 'FIRMADO', fecha: '2022-03-15', tamaño: '245 KB' },
  { id: '2', nombre: 'Nómina Marzo 2026 - Carlos Ruiz', tipo: 'Nómina', empleado: 'Carlos Ruiz', estado: 'PENDIENTE_FIRMA', fecha: '2026-03-31', tamaño: '189 KB' },
  { id: '3', nombre: 'Política de Teletrabajo v2.1', tipo: 'Política', empleado: 'Todos', estado: 'FIRMADO', fecha: '2025-09-01', tamaño: '312 KB' },
  { id: '4', nombre: 'Contrato Temporal - Ana García', tipo: 'Contrato', empleado: 'Ana García', estado: 'VENCIDO', fecha: '2025-12-31', tamaño: '220 KB' },
  { id: '5', nombre: 'Nómina Marzo 2026 - María Sánchez', tipo: 'Nómina', empleado: 'María Sánchez', estado: 'PENDIENTE_FIRMA', fecha: '2026-03-31', tamaño: '188 KB' },
  { id: '6', nombre: 'Plantilla Acuerdo NDA', tipo: 'Plantilla', empleado: '—', estado: 'BORRADOR', fecha: '2026-02-10', tamaño: '95 KB' },
  { id: '7', nombre: 'Política GDPR y Protección de Datos', tipo: 'Política', empleado: 'Todos', estado: 'FIRMADO', fecha: '2025-01-15', tamaño: '408 KB' },
  { id: '8', nombre: 'Contrato Prácticas - Pedro Alonso', tipo: 'Contrato', empleado: 'Pedro Alonso', estado: 'FIRMADO', fecha: '2022-09-05', tamaño: '198 KB' },
  { id: '9', nombre: 'Nómina Febrero 2026 - Javier López', tipo: 'Nómina', empleado: 'Javier López', estado: 'FIRMADO', fecha: '2026-02-28', tamaño: '195 KB' },
  { id: '10', nombre: 'Acuerdo de Confidencialidad - Isabel Torres', tipo: 'Contrato', empleado: 'Isabel Torres', estado: 'PENDIENTE_FIRMA', fecha: '2026-04-01', tamaño: '143 KB' },
];

const estadoConfig: Record<DocEstado, { label: string; variant: 'success' | 'warning' | 'info' | 'destructive'; icon: React.ElementType }> = {
  FIRMADO: { label: 'Firmado', variant: 'success', icon: CheckCircle2 },
  PENDIENTE_FIRMA: { label: 'Pend. firma', variant: 'warning', icon: Clock },
  BORRADOR: { label: 'Borrador', variant: 'info', icon: FileText },
  VENCIDO: { label: 'Vencido', variant: 'destructive', icon: AlertTriangle },
};

const tipoColor: Record<DocTipo, string> = {
  Contrato: 'bg-violet-100 text-violet-700',
  Nómina: 'bg-blue-100 text-blue-700',
  Política: 'bg-emerald-100 text-emerald-700',
  Plantilla: 'bg-amber-100 text-amber-700',
};

const stats = [
  { label: 'Total documentos', value: documentosDemo.length, icon: FolderOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Pendientes firma', value: documentosDemo.filter(d => d.estado === 'PENDIENTE_FIRMA').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Firmados', value: documentosDemo.filter(d => d.estado === 'FIRMADO').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Vencidos', value: documentosDemo.filter(d => d.estado === 'VENCIDO').length, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
];

function TablaDocumentos({ docs }: { docs: Documento[] }) {
  const [firmaDoc, setFirmaDoc] = useState<Documento | null>(null);
  const [firmado, setFirmado] = useState(false);
  const [firmando, setFirmando] = useState(false);

  function handleFirmar() {
    setFirmando(true);
    setTimeout(() => {
      setFirmando(false);
      setFirmado(true);
    }, 1500);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Nombre</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Fecha</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Tamaño</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((doc) => {
              const cfg = estadoConfig[doc.estado];
              const EIcon = cfg.icon;
              return (
                <tr key={doc.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium text-foreground truncate max-w-[240px]">{doc.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tipoColor[doc.tipo]}`}>
                      {doc.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {doc.empleado !== '—' ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className={`text-[9px] font-bold text-white ${getColorAvatar(doc.empleado)}`}>
                            {getInitials(doc.empleado)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-foreground">{doc.empleado}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">Todos</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={cfg.variant} className="gap-1">
                      <EIcon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{formatFecha(doc.fecha)}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{doc.tamaño}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Ver">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Descargar">
                        <Download className="h-4 w-4" />
                      </button>
                      {doc.estado === 'PENDIENTE_FIRMA' && (
                        <button
                          onClick={() => { setFirmaDoc(doc); setFirmado(false); }}
                          className="p-1.5 rounded hover:bg-amber-50 text-amber-600 hover:text-amber-700 transition-colors"
                          title="Firmar"
                        >
                          <PenLine className="h-4 w-4" />
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

      {/* Firma modal */}
      <Dialog open={!!firmaDoc} onOpenChange={(o) => { if (!o) setFirmaDoc(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5 text-primary" />
              Firma electrónica
            </DialogTitle>
          </DialogHeader>
          {firmaDoc && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/40 border border-border p-4">
                <p className="text-xs text-muted-foreground mb-1">Documento</p>
                <p className="text-sm font-semibold text-foreground">{firmaDoc.nombre}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${tipoColor[firmaDoc.tipo]}`}>
                    {firmaDoc.tipo}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatFecha(firmaDoc.fecha)}</span>
                </div>
              </div>

              {/* Document preview simulation */}
              <div className="rounded-lg border border-border h-36 bg-white flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <FileText className="h-8 w-8 opacity-30" />
                <p className="text-xs">Vista previa del documento</p>
                <p className="text-[10px] text-muted-foreground/60">PDF · {firmaDoc.tamaño}</p>
              </div>

              {/* Signature pad simulation */}
              {!firmado ? (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Pad de firma</Label>
                  <div className="rounded-lg border-2 border-dashed border-border h-20 bg-slate-50 flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">Dibuja tu firma aquí</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">Documento firmado</p>
                    <p className="text-xs text-emerald-600">Firma registrada el {formatFecha(new Date().toISOString())}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setFirmaDoc(null)}>Cerrar</Button>
            {!firmado && (
              <Button onClick={handleFirmar} disabled={firmando}>
                {firmando ? 'Firmando...' : 'Firmar documento'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function DocumentosPage() {
  const [modalNuevo, setModalNuevo] = useState(false);

  const porTipo = (tipo: DocTipo) => documentosDemo.filter(d => d.tipo === tipo);

  return (
    <div className="flex flex-col h-full">
      <Header title="Documentos" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-sm font-semibold text-foreground flex-1">Gestión Documental</h2>
          <Button variant="outline" size="sm" onClick={() => setModalNuevo(true)}>
            <FilePlus className="h-4 w-4 mr-2" />
            Solicitar firma
          </Button>
          <Button size="sm" onClick={() => setModalNuevo(true)}>
            <FilePlus className="h-4 w-4 mr-2" />
            Nuevo documento
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

        {/* Tabs + Table */}
        <Card className="border-border/60">
          <Tabs defaultValue="todos">
            <CardHeader className="pb-0 border-b border-border">
              <TabsList className="h-9 bg-transparent gap-1 p-0">
                {(['todos', 'Contrato', 'Nómina', 'Política', 'Plantilla'] as const).map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none px-4 h-9 text-xs"
                  >
                    {tab === 'todos' ? 'Todos' : tab + 's'}
                  </TabsTrigger>
                ))}
              </TabsList>
            </CardHeader>
            <TabsContent value="todos" className="mt-0">
              <TablaDocumentos docs={documentosDemo} />
            </TabsContent>
            {(['Contrato', 'Nómina', 'Política', 'Plantilla'] as DocTipo[]).map((tipo) => (
              <TabsContent key={tipo} value={tipo} className="mt-0">
                <TablaDocumentos docs={porTipo(tipo)} />
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>

      {/* Modal nuevo documento */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="doc-nombre">Nombre del documento</Label>
              <Input id="doc-nombre" placeholder="Ej: Contrato Indefinido - Nombre Empleado" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc-tipo">Tipo</Label>
              <select id="doc-tipo" className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background">
                <option>Contrato</option>
                <option>Nómina</option>
                <option>Política</option>
                <option>Plantilla</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="doc-empleado">Empleado</Label>
              <Input id="doc-empleado" placeholder="Nombre del empleado" />
            </div>
            <div className="space-y-1.5">
              <Label>Adjuntar archivo</Label>
              <div className="border-2 border-dashed border-border rounded-lg h-20 flex items-center justify-center cursor-pointer hover:bg-muted/30 transition-colors">
                <p className="text-xs text-muted-foreground">Arrastra un PDF aquí o haz clic</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button onClick={() => setModalNuevo(false)}>Crear documento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
