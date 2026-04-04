'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus, Search, Briefcase, MapPin, Users, Star, ChevronRight,
} from 'lucide-react';
import { getInitials, getColorAvatar, formatFechaRelativa } from '@/lib/utils';

type Fase =
  | 'RECIBIDA'
  | 'REVISION'
  | 'TELEFONICA'
  | 'ENTREVISTA'
  | 'PRUEBA_TECNICA'
  | 'OFERTA'
  | 'CONTRATADO'
  | 'DESCARTADO';

interface Candidato {
  id: string;
  nombre: string;
  email: string;
  puesto: string;
  fase: Fase;
  puntuacion: number;
  fecha: string;
  cv?: boolean;
}

interface Oferta {
  id: string;
  titulo: string;
  departamento: string;
  ubicacion: string;
  modalidad: string;
  candidatos: number;
  estado: 'ABIERTA' | 'PAUSADA' | 'CERRADA';
  publicado: string;
}

const ofertas: Oferta[] = [
  { id: '1', titulo: 'Senior Frontend Developer', departamento: 'Tecnología', ubicacion: 'Madrid', modalidad: 'Híbrido', candidatos: 14, estado: 'ABIERTA', publicado: '2024-03-15' },
  { id: '2', titulo: 'Product Manager', departamento: 'Producto', ubicacion: 'Barcelona', modalidad: 'Remoto', candidatos: 9, estado: 'ABIERTA', publicado: '2024-03-20' },
  { id: '3', titulo: 'Sales Account Executive', departamento: 'Ventas', ubicacion: 'Madrid', modalidad: 'Presencial', candidatos: 6, estado: 'ABIERTA', publicado: '2024-03-25' },
  { id: '4', titulo: 'Data Analyst', departamento: 'Tecnología', ubicacion: 'Valencia', modalidad: 'Híbrido', candidatos: 5, estado: 'PAUSADA', publicado: '2024-02-10' },
];

const candidatosKanban: Record<string, Candidato[]> = {
  RECIBIDA: [
    { id: 'c1', nombre: 'Marco Rodríguez', email: 'marco@email.com', puesto: 'Senior Frontend', fase: 'RECIBIDA', puntuacion: 0, fecha: '2024-04-02', cv: true },
    { id: 'c2', nombre: 'Sara Blanco', email: 'sara@email.com', puesto: 'Senior Frontend', fase: 'RECIBIDA', puntuacion: 0, fecha: '2024-04-03' },
  ],
  REVISION: [
    { id: 'c3', nombre: 'Diego Morales', email: 'diego@email.com', puesto: 'Senior Frontend', fase: 'REVISION', puntuacion: 3, fecha: '2024-03-28', cv: true },
    { id: 'c4', nombre: 'Lucía Navarro', email: 'lucia@email.com', puesto: 'Product Manager', fase: 'REVISION', puntuacion: 4, fecha: '2024-03-29' },
  ],
  TELEFONICA: [
    { id: 'c5', nombre: 'Álvaro Jiménez', email: 'alvaro@email.com', puesto: 'Senior Frontend', fase: 'TELEFONICA', puntuacion: 4, fecha: '2024-03-25', cv: true },
  ],
  ENTREVISTA: [
    { id: 'c6', nombre: 'Elena Castro', email: 'elena@email.com', puesto: 'Product Manager', fase: 'ENTREVISTA', puntuacion: 5, fecha: '2024-03-20', cv: true },
    { id: 'c7', nombre: 'Rubén Ortega', email: 'ruben@email.com', puesto: 'Sales AE', fase: 'ENTREVISTA', puntuacion: 4, fecha: '2024-03-22' },
  ],
  PRUEBA_TECNICA: [
    { id: 'c8', nombre: 'Nuria Vega', email: 'nuria@email.com', puesto: 'Senior Frontend', fase: 'PRUEBA_TECNICA', puntuacion: 5, fecha: '2024-03-18', cv: true },
  ],
  OFERTA: [
    { id: 'c9', nombre: 'Pablo Ramos', email: 'pablo@email.com', puesto: 'Product Manager', fase: 'OFERTA', puntuacion: 5, fecha: '2024-03-10', cv: true },
  ],
  CONTRATADO: [],
  DESCARTADO: [],
};

const faseConfig: Record<string, { label: string; color: string }> = {
  RECIBIDA: { label: 'Recibida', color: 'border-t-gray-300' },
  REVISION: { label: 'Revisión', color: 'border-t-blue-400' },
  TELEFONICA: { label: 'Tel. inicial', color: 'border-t-indigo-400' },
  ENTREVISTA: { label: 'Entrevista', color: 'border-t-violet-500' },
  PRUEBA_TECNICA: { label: 'Prueba técnica', color: 'border-t-amber-400' },
  OFERTA: { label: 'Oferta', color: 'border-t-emerald-400' },
  CONTRATADO: { label: 'Contratado', color: 'border-t-emerald-600' },
  DESCARTADO: { label: 'Descartado', color: 'border-t-red-400' },
};

const fasesKanban = ['RECIBIDA', 'REVISION', 'TELEFONICA', 'ENTREVISTA', 'PRUEBA_TECNICA', 'OFERTA', 'CONTRATADO'];

function Estrellas({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${i <= n ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export default function ReclutamientoPage() {
  const [vista, setVista] = useState<'ofertas' | 'kanban'>('kanban');
  const [modalOferta, setModalOferta] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <Header title="Reclutamiento" />

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={vista === 'kanban' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVista('kanban')}
            >
              Pipeline
            </Button>
            <Button
              variant={vista === 'ofertas' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setVista('ofertas')}
            >
              Ofertas
            </Button>
          </div>
          <Button size="sm" onClick={() => setModalOferta(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva oferta
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Ofertas activas', value: ofertas.filter(o => o.estado === 'ABIERTA').length },
            { label: 'Candidatos totales', value: Object.values(candidatosKanban).flat().length },
            { label: 'En proceso', value: Object.values(candidatosKanban).flat().filter(c => !['CONTRATADO', 'DESCARTADO'].includes(c.fase)).length },
            { label: 'Contratados (mes)', value: 2 },
          ].map((s) => (
            <Card key={s.label} className="border-border/60">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vista Kanban */}
        {vista === 'kanban' && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max">
              {fasesKanban.map((fase) => {
                const cfg = faseConfig[fase];
                const candidatos = candidatosKanban[fase] || [];
                return (
                  <div key={fase} className="w-60 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">{cfg.label}</p>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                        {candidatos.length}
                      </span>
                    </div>
                    <div className={`flex flex-col gap-2 rounded-xl bg-muted/30 p-2 min-h-[200px] border-t-2 ${cfg.color}`}>
                      {candidatos.map((c) => (
                        <div key={c.id} className="rounded-lg bg-white border border-border p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={`text-[10px] font-bold text-white ${getColorAvatar(c.nombre)}`}>
                                {getInitials(c.nombre)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-foreground truncate">{c.nombre}</p>
                              <p className="text-[10px] text-muted-foreground truncate">{c.email}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-muted-foreground mb-1.5">{c.puesto}</p>
                          {c.puntuacion > 0 && <Estrellas n={c.puntuacion} />}
                          <p className="text-[10px] text-muted-foreground mt-1.5">
                            {formatFechaRelativa(c.fecha)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Vista Ofertas */}
        {vista === 'ofertas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ofertas.map((o) => (
              <Card key={o.id} className="border-border/60 hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground">{o.titulo}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{o.departamento}</p>
                    </div>
                    <Badge variant={o.estado === 'ABIERTA' ? 'success' : o.estado === 'PAUSADA' ? 'warning' : 'secondary'}>
                      {o.estado === 'ABIERTA' ? 'Abierta' : o.estado === 'PAUSADA' ? 'Pausada' : 'Cerrada'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{o.ubicacion}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{o.modalidad}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{o.candidatos} candidatos</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Publicada {formatFechaRelativa(o.publicado)}</p>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Ver candidatos <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal nueva oferta */}
      <Dialog open={modalOferta} onOpenChange={setModalOferta}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nueva oferta de empleo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Título del puesto</Label>
              <Input placeholder="Ej: Senior Frontend Developer" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Departamento</Label>
                <Input placeholder="Tecnología" />
              </div>
              <div className="space-y-1.5">
                <Label>Ubicación</Label>
                <Input placeholder="Madrid" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Modalidad</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                    <SelectItem value="REMOTO">Remoto</SelectItem>
                    <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tipo contrato</Label>
                <Select>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDEFINIDO">Indefinido</SelectItem>
                    <SelectItem value="TEMPORAL">Temporal</SelectItem>
                    <SelectItem value="PRACTICAS">Prácticas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Descripción</Label>
              <Textarea placeholder="Describe el puesto, responsabilidades..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOferta(false)}>Cancelar</Button>
            <Button onClick={() => setModalOferta(false)}>Publicar oferta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
