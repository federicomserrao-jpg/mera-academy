'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pin, Megaphone, Bell, Calendar, Heart, AlertTriangle, Eye } from 'lucide-react';
import { formatFechaRelativa } from '@/lib/utils';

type TipoAnuncio = 'COMUNICADO' | 'NOTICIA' | 'URGENTE' | 'EVENTO' | 'FELICITACION';

interface Anuncio {
  id: string;
  titulo: string;
  contenido: string;
  tipo: TipoAnuncio;
  autor: string;
  publicadoEn: string;
  fijado: boolean;
  lecturas: number;
}

const anuncios: Anuncio[] = [
  {
    id: '1', titulo: '¡Felicitamos a nuestro equipo por el mejor trimestre en la historia! 🎉',
    contenido: 'Este Q1 hemos superado todos los objetivos marcados: ventas +28%, NPS 72, lanzamiento del nuevo producto en tiempo y forma. Esto es el resultado del esfuerzo de cada uno de vosotros. ¡GRACIAS!',
    tipo: 'FELICITACION', autor: 'Dirección', publicadoEn: '2024-04-03', fijado: true, lecturas: 142,
  },
  {
    id: '2', titulo: 'Cambio en la política de trabajo remoto — Efectivo desde mayo',
    contenido: 'A partir del 1 de mayo, todos los empleados podrán teletrabajar hasta 3 días a la semana, previa coordinación con su manager. El equipo de RRHH compartirá la guía completa esta semana.',
    tipo: 'COMUNICADO', autor: 'RRHH', publicadoEn: '2024-04-02', fijado: true, lecturas: 138,
  },
  {
    id: '3', titulo: 'Team building — Escape room el viernes 19 de abril',
    contenido: 'Este viernes organizamos una actividad de team building: ¡escape room para todos! Será en el Escape Madrid (C/ Gran Vía 42) a las 18:00. Hay plazas limitadas — confirma tu asistencia antes del miércoles.',
    tipo: 'EVENTO', autor: 'Cultura y Bienestar', publicadoEn: '2024-04-01', fijado: false, lecturas: 98,
  },
  {
    id: '4', titulo: '⚠️ Mantenimiento programado del sistema — Sábado 6 de abril',
    contenido: 'Este sábado de 22:00 a 06:00 realizaremos mantenimiento en los servidores. Todos los servicios estarán temporalmente fuera de servicio. Planifica con antelación.',
    tipo: 'URGENTE', autor: 'IT', publicadoEn: '2024-04-01', fijado: false, lecturas: 89,
  },
  {
    id: '5', titulo: 'Bienvenida a Sofía Mendoza y Marcos García',
    contenido: 'Esta semana se incorporan dos nuevos compañeros: Sofía Mendoza como UX Designer en el equipo de Producto, y Marcos García como Sales Executive en Ventas. ¡Dadles la bienvenida!',
    tipo: 'NOTICIA', autor: 'RRHH', publicadoEn: '2024-03-31', fijado: false, lecturas: 122,
  },
];

const tipoConfig: Record<TipoAnuncio, { label: string; icon: typeof Megaphone; variant: 'purple' | 'info' | 'destructive' | 'success' | 'warning'; color: string }> = {
  COMUNICADO: { label: 'Comunicado', icon: Megaphone, variant: 'purple', color: 'text-violet-600' },
  NOTICIA: { label: 'Noticia', icon: Bell, variant: 'info', color: 'text-blue-600' },
  URGENTE: { label: 'Urgente', icon: AlertTriangle, variant: 'destructive', color: 'text-red-600' },
  EVENTO: { label: 'Evento', icon: Calendar, variant: 'warning', color: 'text-amber-600' },
  FELICITACION: { label: 'Felicitación', icon: Heart, variant: 'success', color: 'text-emerald-600' },
};

export default function ComunicadosPage() {
  const [modalNuevo, setModalNuevo] = useState(false);
  const [anuncioDetalle, setAnuncioDetalle] = useState<Anuncio | null>(null);

  const fijados = anuncios.filter((a) => a.fijado);
  const resto = anuncios.filter((a) => !a.fijado);

  return (
    <div className="flex flex-col h-full">
      <Header title="Comunicados" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">{anuncios.length} comunicados</h2>
          <Button size="sm" onClick={() => setModalNuevo(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo comunicado
          </Button>
        </div>

        {/* Fijados */}
        {fijados.length > 0 && (
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              <Pin className="h-3.5 w-3.5" />
              Fijados
            </p>
            {fijados.map((a) => <AnuncioCard key={a.id} anuncio={a} onClick={() => setAnuncioDetalle(a)} />)}
          </div>
        )}

        {/* Resto */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recientes</p>
          {resto.map((a) => <AnuncioCard key={a.id} anuncio={a} onClick={() => setAnuncioDetalle(a)} />)}
        </div>
      </div>

      {/* Modal nuevo comunicado */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo comunicado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Tipo</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Seleccionar tipo..." /></SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoConfig).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Título</Label>
              <Input placeholder="Escribe el asunto del comunicado..." />
            </div>
            <div className="space-y-1.5">
              <Label>Contenido</Label>
              <Textarea placeholder="Escribe el comunicado aquí..." rows={5} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button onClick={() => setModalNuevo(false)}>Publicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal detalle */}
      <Dialog open={!!anuncioDetalle} onOpenChange={() => setAnuncioDetalle(null)}>
        <DialogContent className="max-w-lg">
          {anuncioDetalle && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-3">
                  <div>
                    <Badge variant={tipoConfig[anuncioDetalle.tipo].variant} className="mb-2">
                      {tipoConfig[anuncioDetalle.tipo].label}
                    </Badge>
                    <DialogTitle className="text-base leading-snug">{anuncioDetalle.titulo}</DialogTitle>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                      {anuncioDetalle.autor[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span>{anuncioDetalle.autor}</span>
                  <span>·</span>
                  <span>{formatFechaRelativa(anuncioDetalle.publicadoEn)}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {anuncioDetalle.lecturas}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{anuncioDetalle.contenido}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AnuncioCard({ anuncio, onClick }: { anuncio: Anuncio; onClick: () => void }) {
  const cfg = tipoConfig[anuncio.tipo];
  const Icon = cfg.icon;
  return (
    <Card
      className="border-border/60 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={`mt-0.5 rounded-lg bg-muted p-2 ${cfg.color}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="font-semibold text-sm text-foreground leading-snug">{anuncio.titulo}</p>
              <div className="flex items-center gap-2 shrink-0">
                {anuncio.fijado && <Pin className="h-3.5 w-3.5 text-muted-foreground" />}
                <Badge variant={cfg.variant} className="text-[10px]">{cfg.label}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{anuncio.contenido}</p>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span>{anuncio.autor}</span>
              <span>·</span>
              <span>{formatFechaRelativa(anuncio.publicadoEn)}</span>
              <span className="ml-auto flex items-center gap-1">
                <Eye className="h-3 w-3" /> {anuncio.lecturas} lecturas
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
