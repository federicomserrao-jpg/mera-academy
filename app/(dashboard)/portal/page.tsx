'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  FileText, CalendarDays, Clock, Download, Plus, CheckCircle2,
  AlertCircle, User, Building2, CreditCard, Briefcase,
} from 'lucide-react';
import { formatFecha, formatMoneda } from '@/lib/utils';

const miPerfil = {
  nombre: 'Admin User',
  apellidos: 'Demo',
  email: 'admin@fsource.app',
  telefono: '+34 600 000 000',
  puesto: 'HR Administrator',
  departamento: 'RRHH',
  fechaAlta: '2021-01-15',
  contrato: 'Indefinido',
  jornadaHoras: 40,
  salarioBruto: 42000,
  diasVacaciones: 23,
  diasUsados: 8,
  diasPendientes: 15,
};

const misNominas = [
  { periodo: '2024-03', neto: 2646.66, estado: 'PAGADA' },
  { periodo: '2024-02', neto: 2646.66, estado: 'PAGADA' },
  { periodo: '2024-01', neto: 2646.66, estado: 'PAGADA' },
  { periodo: '2023-12', neto: 2646.66, estado: 'PAGADA' },
];

const misAusencias = [
  { tipo: 'Vacaciones', fechaInicio: '2024-03-25', fechaFin: '2024-04-05', dias: 10, estado: 'APROBADA' },
  { tipo: 'Vacaciones', fechaInicio: '2024-07-15', fechaFin: '2024-07-26', dias: 10, estado: 'PENDIENTE' },
];

const misFichajes = [
  { dia: 'Lun 1 Abr', entrada: '09:02', salida: '18:05', horas: '9h 03m' },
  { dia: 'Mar 2 Abr', entrada: '08:55', salida: '17:58', horas: '9h 03m' },
  { dia: 'Mié 3 Abr', entrada: '09:10', salida: '18:15', horas: '9h 05m' },
  { dia: 'Hoy 4 Abr', entrada: '09:02', salida: '—', horas: '—' },
];

const MESES: Record<string, string> = {
  '01': 'Enero', '02': 'Febrero', '03': 'Marzo', '04': 'Abril',
  '05': 'Mayo', '06': 'Junio', '07': 'Julio', '08': 'Agosto',
  '09': 'Septiembre', '10': 'Octubre', '11': 'Noviembre', '12': 'Diciembre',
};

export default function PortalPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Mi Portal" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Header perfil */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl font-bold bg-primary text-white">AU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{miPerfil.nombre} {miPerfil.apellidos}</h2>
                <p className="text-muted-foreground">{miPerfil.puesto} · {miPerfil.departamento}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Alta: {formatFecha(miPerfil.fechaAlta)}</span>
                  <span>·</span>
                  <span>{miPerfil.contrato}</span>
                  <span>·</span>
                  <span>{miPerfil.jornadaHoras}h/semana</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Editar perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* KPIs personales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Salario bruto anual</p>
              <p className="text-xl font-bold mt-1">{formatMoneda(miPerfil.salarioBruto)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{formatMoneda(miPerfil.salarioBruto / 12)} / mes</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Vacaciones</p>
              <p className="text-xl font-bold mt-1">{miPerfil.diasPendientes} días</p>
              <Progress value={(miPerfil.diasUsados / miPerfil.diasVacaciones) * 100} className="h-1.5 mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{miPerfil.diasUsados} usados de {miPerfil.diasVacaciones}</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Horas extra (mes)</p>
              <p className="text-xl font-bold mt-1 text-amber-600">+3h 11m</p>
              <p className="text-xs text-muted-foreground mt-0.5">Esta semana</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">Mi evaluación</p>
              <p className="text-xl font-bold mt-1">8.5 <span className="text-sm font-normal text-muted-foreground">/10</span></p>
              <p className="text-xs text-emerald-600 mt-0.5">Q1 2024 · Completada</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="nominas">
          <TabsList>
            <TabsTrigger value="nominas">Mis nóminas</TabsTrigger>
            <TabsTrigger value="ausencias">Mis ausencias</TabsTrigger>
            <TabsTrigger value="fichajes">Mis fichajes</TabsTrigger>
            <TabsTrigger value="datos">Mis datos</TabsTrigger>
          </TabsList>

          <TabsContent value="nominas" className="mt-4">
            <Card className="border-border/60">
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
                          <td className="px-5 py-3">
                            <Badge variant="success">Pagada</Badge>
                          </td>
                          <td className="px-5 py-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <Download className="h-3.5 w-3.5 mr-1" />
                              PDF
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ausencias" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Solicitar ausencia
              </Button>
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
                    {misAusencias.map((a, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="px-5 py-3 font-medium">{a.tipo}</td>
                        <td className="px-5 py-3 text-muted-foreground text-xs">
                          {formatFecha(a.fechaInicio)} — {formatFecha(a.fechaFin)}
                        </td>
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
          </TabsContent>

          <TabsContent value="fichajes" className="mt-4">
            <Card className="border-border/60">
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Día</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Entrada</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Salida</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Horas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misFichajes.map((f) => (
                      <tr key={f.dia} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="px-5 py-3 font-medium">{f.dia}</td>
                        <td className="px-5 py-3 font-mono">{f.entrada}</td>
                        <td className="px-5 py-3 font-mono">{f.salida}</td>
                        <td className="px-5 py-3 font-medium">{f.horas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="datos" className="mt-4">
            <Card className="border-border/60">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Nombre completo', value: `${miPerfil.nombre} ${miPerfil.apellidos}`, icon: User },
                    { label: 'Email corporativo', value: miPerfil.email, icon: User },
                    { label: 'Teléfono', value: miPerfil.telefono, icon: User },
                    { label: 'Departamento', value: miPerfil.departamento, icon: Building2 },
                    { label: 'Tipo de contrato', value: miPerfil.contrato, icon: Briefcase },
                    { label: 'Jornada laboral', value: `${miPerfil.jornadaHoras}h/semana`, icon: Clock },
                  ].map((campo) => (
                    <div key={campo.label}>
                      <p className="text-xs font-medium text-muted-foreground mb-1">{campo.label}</p>
                      <p className="text-sm font-medium text-foreground">{campo.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
