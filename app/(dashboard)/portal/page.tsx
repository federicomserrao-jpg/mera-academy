'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Heart, MessageCircle, Share2, Paperclip, Send,
  CalendarDays, Clock, FileText, Download, Plus,
  PartyPopper, Megaphone, ImageIcon, ChevronRight,
  CheckCircle2, AlertCircle, Briefcase, Building2, User,
} from 'lucide-react';
import { formatFecha, formatMoneda, getInitials } from '@/lib/utils';

// ── Datos del empleado logueado ──────────────────────────────────────────────
const yo = {
  nombre: 'Admin', apellidos: 'User',
  puesto: 'HR Administrator', departamento: 'RRHH',
  email: 'admin@fsource.app', fechaAlta: '2021-01-15',
  contrato: 'Indefinido', jornada: 40,
  salarioBruto: 42000,
  vacaciones: { total: 23, usados: 8 },
};

// ── Feed de comunicados / noticias ───────────────────────────────────────────
const feedItems = [
  {
    id: '1', tipo: 'comunicado', autor: 'Recursos Humanos', avatar: 'RH',
    color: 'bg-violet-500', hace: '2h',
    titulo: '🎉 Resultados Q1 2026 — Superamos los objetivos',
    contenido: 'Equipo, tenemos el orgullo de anunciar que hemos cerrado el primer trimestre superando los objetivos en un 18%. Gracias a todos por el esfuerzo y dedicación. Hay una reunión general el próximo jueves a las 11:00h para celebrarlo juntos.',
    adjunto: null, likes: 14, comentarios: 3, liked: false,
  },
  {
    id: '2', tipo: 'cumpleanos', autor: 'F-Source', avatar: '🎂',
    color: 'bg-amber-400', hace: '5h',
    titulo: null,
    contenido: '¡Hoy es el cumpleaños de María Sánchez (Marketing) y Pedro Alonso (Tecnología)! Uníte a los saludos 🎈',
    adjunto: null, likes: 22, comentarios: 7, liked: true,
  },
  {
    id: '3', tipo: 'comunicado', autor: 'Dirección General', avatar: 'DG',
    color: 'bg-blue-500', hace: '1d',
    titulo: 'Actualización política de teletrabajo',
    contenido: 'A partir del 1 de mayo, el modelo híbrido pasa a ser de 3 días presenciales y 2 en remoto para todos los departamentos. El nuevo protocolo está disponible en el portal de documentos.',
    adjunto: 'Protocolo_Teletrabajo_2026.pdf', likes: 8, comentarios: 12, liked: false,
  },
  {
    id: '4', tipo: 'evento', autor: 'Recursos Humanos', avatar: 'RH',
    color: 'bg-emerald-500', hace: '2d',
    titulo: '📅 Team Building — 23 de mayo',
    contenido: 'Reservad el jueves 23 de mayo. Tendremos una jornada de team building en el Parque de la Ciudadela. Actividades deportivas, comida incluida. Confirmad asistencia antes del 15/05.',
    adjunto: null, likes: 31, comentarios: 9, liked: true,
  },
];

// ── Mis solicitudes pendientes ───────────────────────────────────────────────
const misSolicitudes = [
  { tipo: 'Vacaciones', fechas: '15 Jul – 26 Jul', dias: 10, estado: 'PENDIENTE' },
  { tipo: 'Teletrabajo', fechas: '12 May – 16 May', dias: 5, estado: 'APROBADA' },
];

// ── Mis nóminas recientes ────────────────────────────────────────────────────
const misNominas = [
  { periodo: '2026-03', neto: 2646.66 },
  { periodo: '2026-02', neto: 2646.66 },
  { periodo: '2026-01', neto: 2646.66 },
];

const MESES: Record<string, string> = {
  '01':'Ene','02':'Feb','03':'Mar','04':'Abr','05':'May','06':'Jun',
  '07':'Jul','08':'Ago','09':'Sep','10':'Oct','11':'Nov','12':'Dic',
};

// ── Componente tarjeta de feed ───────────────────────────────────────────────
function FeedCard({ item, onLike }: { item: typeof feedItems[0]; onLike: (id: string) => void }) {
  const [comentando, setComentando] = useState(false);
  const [comentario, setComentario] = useState('');

  return (
    <Card className="border-border/60">
      <CardContent className="p-5">
        {/* Cabecera */}
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className={`text-xs font-bold text-white ${item.color}`}>
              {item.avatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{item.autor}</span>
              {item.tipo === 'cumpleanos' && <Badge variant="warning" className="text-[10px]">Cumpleaños</Badge>}
              {item.tipo === 'comunicado' && <Badge variant="purple" className="text-[10px]">Comunicado</Badge>}
              {item.tipo === 'evento' && <Badge variant="success" className="text-[10px]">Evento</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{item.hace}</p>
          </div>
        </div>

        {/* Contenido */}
        {item.titulo && <p className="text-sm font-semibold text-foreground mb-1">{item.titulo}</p>}
        <p className="text-sm text-muted-foreground leading-relaxed">{item.contenido}</p>

        {/* Adjunto */}
        {item.adjunto && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground hover:bg-muted cursor-pointer w-fit">
            <Paperclip className="h-3.5 w-3.5" />
            {item.adjunto}
            <Download className="h-3.5 w-3.5 ml-1" />
          </div>
        )}

        {/* Acciones */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
          <button
            onClick={() => onLike(item.id)}
            className={`flex items-center gap-1.5 text-xs transition-colors ${item.liked ? 'text-rose-500 font-medium' : 'text-muted-foreground hover:text-rose-400'}`}
          >
            <Heart className={`h-4 w-4 ${item.liked ? 'fill-rose-500' : ''}`} />
            {item.likes}
          </button>
          <button
            onClick={() => setComentando(!comentando)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {item.comentarios} comentarios
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors ml-auto">
            <Share2 className="h-4 w-4" />
            Compartir
          </button>
        </div>

        {/* Caja comentario */}
        {comentando && (
          <div className="flex items-center gap-2 mt-3">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarFallback className="text-[10px] font-bold bg-primary text-white">AU</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center gap-2 border border-border rounded-full px-3 py-1.5 bg-muted/30">
              <input
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 bg-transparent text-xs outline-none"
              />
              <button className="text-primary hover:text-primary/80 shrink-0">
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function PortalPage() {
  const [feed, setFeed] = useState(feedItems);
  const [activeTab, setActiveTab] = useState('inicio');
  const vacUsados = yo.vacaciones.usados;
  const vacTotal = yo.vacaciones.total;

  function toggleLike(id: string) {
    setFeed(prev => prev.map(item =>
      item.id === id
        ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
        : item
    ));
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Mi Portal" />

      <div className="flex-1 overflow-y-auto">
        {/* Banner bienvenida */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 px-6 py-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-2 ring-white/30">
              <AvatarFallback className="text-lg font-bold bg-white/20 text-white">
                {getInitials(yo.nombre, yo.apellidos)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-lg font-bold text-white">¡Hola, {yo.nombre}! 👋</h2>
              <p className="text-white/70 text-sm">{yo.puesto} · {yo.departamento}</p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs">
                <Clock className="h-3.5 w-3.5 mr-1.5" />
                Fichar entrada
              </Button>
              <Button size="sm" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                Pedir vacaciones
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs navegación */}
        <div className="border-b border-border bg-white px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-0 h-11 gap-1 p-0">
              {['inicio','nominas','ausencias','mis-datos'].map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none h-11 px-4 text-sm"
                >
                  {tab === 'inicio' ? 'Inicio' : tab === 'nominas' ? 'Mis nóminas' : tab === 'ausencias' ? 'Mis ausencias' : 'Mis datos'}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6">
          {/* TAB INICIO */}
          {activeTab === 'inicio' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Feed principal */}
              <div className="xl:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">Novedades de la empresa</h3>
                </div>
                {feed.map(item => (
                  <FeedCard key={item.id} item={item} onLike={toggleLike} />
                ))}
              </div>

              {/* Sidebar derecho */}
              <div className="space-y-4">
                {/* Vacaciones */}
                <Card className="border-border/60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vacaciones</p>
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-3xl font-bold text-foreground">{vacTotal - vacUsados}</span>
                      <span className="text-sm text-muted-foreground mb-1">días disponibles</span>
                    </div>
                    <Progress value={(vacUsados / vacTotal) * 100} className="h-1.5 mb-2" />
                    <p className="text-xs text-muted-foreground">{vacUsados} usados · {vacTotal} totales</p>
                    <Button size="sm" className="w-full mt-3 h-8 text-xs">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Solicitar vacaciones
                    </Button>
                  </CardContent>
                </Card>

                {/* Mis solicitudes */}
                <Card className="border-border/60">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Mis solicitudes</p>
                    <div className="space-y-3">
                      {misSolicitudes.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          {s.estado === 'APROBADA'
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                          }
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground">{s.tipo}</p>
                            <p className="text-[11px] text-muted-foreground">{s.fechas}</p>
                          </div>
                          <Badge variant={s.estado === 'APROBADA' ? 'success' : 'warning'} className="ml-auto text-[10px] shrink-0">
                            {s.estado === 'APROBADA' ? 'Aprobada' : 'Pendiente'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <button className="flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                      Ver todas <ChevronRight className="h-3 w-3" />
                    </button>
                  </CardContent>
                </Card>

                {/* Próxima nómina */}
                <Card className="border-border/60">
                  <CardContent className="p-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Última nómina</p>
                    {misNominas[0] && (() => {
                      const [anio, mes] = misNominas[0].periodo.split('-');
                      return (
                        <div>
                          <p className="text-2xl font-bold text-emerald-700">{formatMoneda(misNominas[0].neto)}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{MESES[mes]} {anio} · Pagada</p>
                          <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-xs">
                            <Download className="h-3.5 w-3.5 mr-1.5" />
                            Descargar PDF
                          </Button>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB NÓMINAS */}
          {activeTab === 'nominas' && (
            <Card className="border-border/60 max-w-2xl">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Período</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground">Neto</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {misNominas.map((n) => {
                      const [anio, mes] = n.periodo.split('-');
                      return (
                        <tr key={n.periodo} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-5 py-3 font-medium">{MESES[mes]} {anio}</td>
                          <td className="px-5 py-3 text-right font-mono font-semibold text-emerald-700">{formatMoneda(n.neto)}</td>
                          <td className="px-5 py-3"><Badge variant="success">Pagada</Badge></td>
                          <td className="px-5 py-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <Download className="h-3.5 w-3.5 mr-1" />PDF
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* TAB AUSENCIAS */}
          {activeTab === 'ausencias' && (
            <div className="space-y-4 max-w-2xl">
              <div className="flex justify-end">
                <Button size="sm"><Plus className="h-4 w-4 mr-2" />Solicitar ausencia</Button>
              </div>
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Tipo</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Período</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Días</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misSolicitudes.map((a, i) => (
                        <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                          <td className="px-5 py-3 font-medium">{a.tipo}</td>
                          <td className="px-5 py-3 text-muted-foreground text-xs">{a.fechas}</td>
                          <td className="px-5 py-3">{a.dias}d</td>
                          <td className="px-5 py-3">
                            <Badge variant={a.estado === 'APROBADA' ? 'success' : 'warning'}>
                              {a.estado === 'APROBADA' ? 'Aprobada' : 'Pendiente'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB MIS DATOS */}
          {activeTab === 'mis-datos' && (
            <Card className="border-border/60 max-w-2xl">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Nombre completo', value: `${yo.nombre} ${yo.apellidos}`, icon: User },
                    { label: 'Email', value: yo.email, icon: User },
                    { label: 'Departamento', value: yo.departamento, icon: Building2 },
                    { label: 'Puesto', value: yo.puesto, icon: Briefcase },
                    { label: 'Contrato', value: yo.contrato, icon: FileText },
                    { label: 'Jornada', value: `${yo.jornada}h/semana`, icon: Clock },
                    { label: 'Fecha de alta', value: formatFecha(yo.fechaAlta), icon: CalendarDays },
                    { label: 'Salario bruto anual', value: formatMoneda(yo.salarioBruto), icon: FileText },
                  ].map((campo) => (
                    <div key={campo.label}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{campo.label}</p>
                      <p className="text-sm font-medium text-foreground">{campo.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Editar mis datos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
