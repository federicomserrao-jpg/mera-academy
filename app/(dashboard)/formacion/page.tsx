'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap, Plus, Clock, Users, BookOpen,
  CheckCircle2, PlayCircle, TrendingUp, Award,
} from 'lucide-react';

type CursoCategoria = 'Obligatorio' | 'Profesional' | 'Idiomas' | 'Técnico';
type CursoEstado = 'no_inscrito' | 'en_progreso' | 'completado';

interface Curso {
  id: string;
  titulo: string;
  categoria: CursoCategoria;
  horas: number;
  inscritos: number;
  color: string;
  descripcion: string;
  estado: CursoEstado;
  progreso: number;
}

const cursosDemo: Curso[] = [
  {
    id: '1',
    titulo: 'Onboarding General',
    categoria: 'Obligatorio',
    horas: 8,
    inscritos: 148,
    color: 'bg-violet-500',
    descripcion: 'Introducción a la empresa, valores, cultura y procesos internos.',
    estado: 'completado',
    progreso: 100,
  },
  {
    id: '2',
    titulo: 'Excel Avanzado',
    categoria: 'Profesional',
    horas: 16,
    inscritos: 34,
    color: 'bg-emerald-500',
    descripcion: 'Tablas dinámicas, macros, Power Query y análisis de datos.',
    estado: 'en_progreso',
    progreso: 65,
  },
  {
    id: '3',
    titulo: 'Liderazgo y Gestión de Equipos',
    categoria: 'Profesional',
    horas: 24,
    inscritos: 18,
    color: 'bg-blue-500',
    descripcion: 'Habilidades directivas, gestión del cambio y comunicación efectiva.',
    estado: 'en_progreso',
    progreso: 30,
  },
  {
    id: '4',
    titulo: 'Prevención de Riesgos Laborales',
    categoria: 'Obligatorio',
    horas: 6,
    inscritos: 148,
    color: 'bg-amber-500',
    descripcion: 'Normativa de seguridad, primeros auxilios y ergonomía en el trabajo.',
    estado: 'completado',
    progreso: 100,
  },
  {
    id: '5',
    titulo: 'GDPR y Protección de Datos',
    categoria: 'Obligatorio',
    horas: 4,
    inscritos: 148,
    color: 'bg-rose-500',
    descripcion: 'Reglamento europeo de protección de datos, derechos y obligaciones.',
    estado: 'no_inscrito',
    progreso: 0,
  },
  {
    id: '6',
    titulo: 'Inglés Empresarial B2',
    categoria: 'Idiomas',
    horas: 60,
    inscritos: 22,
    color: 'bg-cyan-500',
    descripcion: 'Inglés para negocios: presentaciones, emails y negociación.',
    estado: 'no_inscrito',
    progreso: 0,
  },
  {
    id: '7',
    titulo: 'Power BI & Análisis de Datos',
    categoria: 'Técnico',
    horas: 20,
    inscritos: 15,
    color: 'bg-indigo-500',
    descripcion: 'Visualización de datos, dashboards interactivos y DAX.',
    estado: 'no_inscrito',
    progreso: 0,
  },
  {
    id: '8',
    titulo: 'Scrum y Metodologías Ágiles',
    categoria: 'Técnico',
    horas: 12,
    inscritos: 28,
    color: 'bg-orange-500',
    descripcion: 'Sprints, retrospectivas, planificación y gestión de producto.',
    estado: 'en_progreso',
    progreso: 50,
  },
];

const categoriaColor: Record<CursoCategoria, string> = {
  Obligatorio: 'bg-red-100 text-red-700',
  Profesional: 'bg-blue-100 text-blue-700',
  Idiomas: 'bg-cyan-100 text-cyan-700',
  Técnico: 'bg-indigo-100 text-indigo-700',
};

const cursosEnProgreso = cursosDemo.filter(c => c.estado === 'en_progreso');
const cursosCompletados = cursosDemo.filter(c => c.estado === 'completado');
const totalHorasFormacion = cursosDemo
  .filter(c => c.estado !== 'no_inscrito')
  .reduce((s, c) => s + Math.round(c.horas * (c.progreso / 100)), 0);

export default function FormacionPage() {
  const [modalNuevo, setModalNuevo] = useState(false);
  const [cursos, setCursos] = useState(cursosDemo);

  function toggleInscripcion(id: string) {
    setCursos(prev => prev.map(c => {
      if (c.id !== id) return c;
      if (c.estado === 'no_inscrito') return { ...c, estado: 'en_progreso' as CursoEstado, progreso: 0 };
      return c;
    }));
  }

  const stats = [
    { label: 'Cursos activos', value: cursos.filter(c => c.estado === 'en_progreso').length, icon: BookOpen, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'En formación', value: 72, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completados este mes', value: cursosCompletados.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Horas formación', value: `${totalHorasFormacion}h`, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Formación" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">LMS — Gestión del Aprendizaje</span>
          </div>
          <Button size="sm" onClick={() => setModalNuevo(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo curso
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

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* LEFT: Cursos disponibles (2/3) */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Cursos disponibles</h3>
              <span className="text-xs text-muted-foreground">{cursos.length} cursos</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cursos.map((curso) => (
                <Card key={curso.id} className="border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-3">
                    {/* Color banner */}
                    <div className={`h-16 rounded-lg ${curso.color} flex items-center justify-center`}>
                      <GraduationCap className="h-8 w-8 text-white/80" />
                    </div>

                    {/* Info */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground leading-tight">{curso.titulo}</h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${categoriaColor[curso.categoria]}`}>
                          {curso.categoria}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{curso.descripcion}</p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {curso.horas}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {curso.inscritos} inscritos
                      </span>
                    </div>

                    {/* Progress if enrolled */}
                    {curso.estado !== 'no_inscrito' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="font-medium text-foreground">{curso.progreso}%</span>
                        </div>
                        <Progress value={curso.progreso} className="h-1.5" />
                      </div>
                    )}

                    {/* Action button */}
                    {curso.estado === 'completado' ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 className="h-4 w-4" />
                        Completado
                      </div>
                    ) : curso.estado === 'en_progreso' ? (
                      <Button size="sm" variant="outline" className="w-full gap-2 text-xs">
                        <PlayCircle className="h-3.5 w-3.5" />
                        Continuar
                      </Button>
                    ) : (
                      <Button size="sm" className="w-full gap-2 text-xs" onClick={() => toggleInscripcion(curso.id)}>
                        <Plus className="h-3.5 w-3.5" />
                        Inscribirse
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* RIGHT: Mi progreso (1/3) */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Mi progreso</h3>

            {/* Summary card */}
            <Card className="border-border/60 bg-gradient-to-br from-violet-50 to-blue-50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-violet-600" />
                  <span className="text-sm font-semibold text-violet-900">Resumen</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/70 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-foreground">{cursosEnProgreso.length}</p>
                    <p className="text-[10px] text-muted-foreground">En curso</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-2.5 text-center">
                    <p className="text-lg font-bold text-foreground">{cursosCompletados.length}</p>
                    <p className="text-[10px] text-muted-foreground">Completados</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progreso general</span>
                    <span className="font-semibold">
                      {Math.round(
                        cursos.filter(c => c.estado !== 'no_inscrito').reduce((s, c) => s + c.progreso, 0) /
                        Math.max(cursos.filter(c => c.estado !== 'no_inscrito').length, 1)
                      )}%
                    </span>
                  </div>
                  <Progress
                    value={Math.round(
                      cursos.filter(c => c.estado !== 'no_inscrito').reduce((s, c) => s + c.progreso, 0) /
                      Math.max(cursos.filter(c => c.estado !== 'no_inscrito').length, 1)
                    )}
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Enrolled courses list */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Cursos inscritos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  {cursos.filter(c => c.estado !== 'no_inscrito').map((curso) => (
                    <div key={curso.id} className="px-4 py-3 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${curso.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground leading-tight">{curso.titulo}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{curso.horas}h</span>
                            {curso.estado === 'completado' ? (
                              <span className="text-[10px] text-emerald-600 font-medium">Completado</span>
                            ) : (
                              <span className="text-[10px] text-amber-600 font-medium">{curso.progreso}% completado</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Progress value={curso.progreso} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Próximos vencimientos */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Obligatorios pendientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 pb-4">
                {cursos.filter(c => c.categoria === 'Obligatorio' && c.estado !== 'completado').map((curso) => (
                  <div key={curso.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <TrendingUp className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-amber-900 truncate">{curso.titulo}</p>
                      <p className="text-[10px] text-amber-700">{curso.horas}h · Obligatorio</p>
                    </div>
                  </div>
                ))}
                {cursos.filter(c => c.categoria === 'Obligatorio' && c.estado !== 'completado').length === 0 && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <p className="text-xs text-emerald-700 font-medium">Sin pendientes obligatorios</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal nuevo curso */}
      <Dialog open={modalNuevo} onOpenChange={setModalNuevo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Nuevo curso
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-titulo">Título del curso</Label>
              <Input id="c-titulo" placeholder="Ej: Power BI para principiantes" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-categoria">Categoría</Label>
              <Select>
                <SelectTrigger id="c-categoria">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obligatorio">Obligatorio</SelectItem>
                  <SelectItem value="profesional">Profesional</SelectItem>
                  <SelectItem value="idiomas">Idiomas</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="c-horas">Duración (horas)</Label>
                <Input id="c-horas" type="number" placeholder="0" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-fecha">Fecha inicio</Label>
                <Input id="c-fecha" type="date" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-desc">Descripción</Label>
              <Input id="c-desc" placeholder="Breve descripción del contenido" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalNuevo(false)}>Cancelar</Button>
            <Button onClick={() => setModalNuevo(false)}>Crear curso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
