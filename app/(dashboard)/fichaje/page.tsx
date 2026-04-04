'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Clock, LogIn, LogOut, Coffee, MapPin, Laptop, Timer,
  TrendingUp, AlertCircle, CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getInitials, getColorAvatar } from '@/lib/utils';

interface RegistroFichaje {
  empleado: string;
  entrada: string;
  salida?: string;
  pausa?: string;
  horas?: string;
  tipo: 'PRESENCIAL' | 'REMOTO';
  estado: 'EN_TRABAJO' | 'EN_PAUSA' | 'FINALIZADO';
}

const registrosHoy: RegistroFichaje[] = [
  { empleado: 'Laura Martínez', entrada: '09:02', tipo: 'PRESENCIAL', estado: 'EN_TRABAJO' },
  { empleado: 'Carlos Ruiz', entrada: '08:47', pausa: '14:00–14:30', tipo: 'REMOTO', estado: 'EN_TRABAJO' },
  { empleado: 'Ana García', entrada: '09:15', salida: '14:00', horas: '4h 45m', tipo: 'PRESENCIAL', estado: 'FINALIZADO' },
  { empleado: 'Javier López', entrada: '08:30', tipo: 'PRESENCIAL', estado: 'EN_PAUSA' },
  { empleado: 'María Sánchez', entrada: '09:00', tipo: 'REMOTO', estado: 'EN_TRABAJO' },
  { empleado: 'Pedro Alonso', entrada: '09:30', tipo: 'PRESENCIAL', estado: 'EN_TRABAJO' },
];

const historialSemana = [
  { dia: 'Lunes 1', entrada: '09:02', salida: '18:05', horas: '9h 03m', extra: '1h 03m' },
  { dia: 'Martes 2', entrada: '08:55', salida: '17:58', horas: '9h 03m', extra: '1h 03m' },
  { dia: 'Miércoles 3', entrada: '09:10', salida: '18:15', horas: '9h 05m', extra: '1h 05m' },
  { dia: 'Jueves 4', entrada: '—', salida: '—', horas: '0h', extra: '0h' },
  { dia: 'Hoy', entrada: '09:02', salida: '—', horas: '—', extra: '—' },
];

type FichajeEstado = 'sin_fichar' | 'trabajando' | 'en_pausa' | 'finalizado';

export default function FichajePage() {
  const [ahora, setAhora] = useState(new Date());
  const [estado, setEstado] = useState<FichajeEstado>('sin_fichar');
  const [horaEntrada, setHoraEntrada] = useState<Date | null>(null);
  const [horaPausa, setHoraPausa] = useState<Date | null>(null);
  const [tiempoTrabajado, setTiempoTrabajado] = useState(0); // segundos

  useEffect(() => {
    const timer = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (estado !== 'trabajando') return;
    const timer = setInterval(() => {
      setTiempoTrabajado((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [estado]);

  const formatTiempo = (segundos: number) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleEntrada = () => {
    setHoraEntrada(new Date());
    setEstado('trabajando');
  };

  const handlePausa = () => {
    if (estado === 'trabajando') {
      setHoraPausa(new Date());
      setEstado('en_pausa');
    } else if (estado === 'en_pausa') {
      setEstado('trabajando');
    }
  };

  const handleSalida = () => {
    setEstado('finalizado');
  };

  const estadoConfig = {
    EN_TRABAJO: { label: 'Trabajando', variant: 'success' as const },
    EN_PAUSA: { label: 'En pausa', variant: 'warning' as const },
    FINALIZADO: { label: 'Finalizado', variant: 'secondary' as const },
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Control Horario" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Panel principal de fichaje */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Reloj + botones */}
          <Card className="xl:col-span-1 border-border/60">
            <CardContent className="p-6 flex flex-col items-center">
              {/* Reloj */}
              <div className="mb-6 text-center">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                  {format(ahora, "EEEE, d 'de' MMMM", { locale: es })}
                </p>
                <p className="text-5xl font-bold tabular-nums text-foreground">
                  {format(ahora, 'HH:mm:ss')}
                </p>
              </div>

              {/* Tiempo trabajado */}
              {(estado === 'trabajando' || estado === 'en_pausa' || estado === 'finalizado') && (
                <div className="mb-6 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Tiempo trabajado</p>
                  <p className="text-3xl font-bold tabular-nums text-primary">{formatTiempo(tiempoTrabajado)}</p>
                  {horaEntrada && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Entrada: {format(horaEntrada, 'HH:mm')}
                    </p>
                  )}
                </div>
              )}

              {/* Botones */}
              <div className="w-full space-y-3">
                {estado === 'sin_fichar' && (
                  <Button className="w-full gap-2" size="lg" onClick={handleEntrada}>
                    <LogIn className="h-5 w-5" />
                    Fichar entrada
                  </Button>
                )}

                {(estado === 'trabajando' || estado === 'en_pausa') && (
                  <>
                    <Button
                      variant={estado === 'en_pausa' ? 'default' : 'outline'}
                      className="w-full gap-2"
                      onClick={handlePausa}
                    >
                      <Coffee className="h-5 w-5" />
                      {estado === 'en_pausa' ? 'Volver del descanso' : 'Iniciar pausa'}
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full gap-2"
                      onClick={handleSalida}
                    >
                      <LogOut className="h-5 w-5" />
                      Fichar salida
                    </Button>
                  </>
                )}

                {estado === 'finalizado' && (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Jornada completada</span>
                  </div>
                )}
              </div>

              {/* Tipo trabajo */}
              <div className="mt-4 flex gap-2 w-full">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-primary bg-primary/5 py-2 text-xs font-medium text-primary">
                  <MapPin className="h-3.5 w-3.5" />
                  Presencial
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground hover:bg-muted">
                  <Laptop className="h-3.5 w-3.5" />
                  Remoto
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Historial de la semana */}
          <Card className="xl:col-span-2 border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Mi semana</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {historialSemana.map((d) => (
                  <div
                    key={d.dia}
                    className={`flex items-center gap-4 rounded-lg px-4 py-3 ${
                      d.dia === 'Hoy' ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'
                    }`}
                  >
                    <p className={`w-28 text-sm font-medium ${d.dia === 'Hoy' ? 'text-primary' : 'text-foreground'}`}>
                      {d.dia}
                    </p>
                    <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Entrada</p>
                        <p className="font-medium">{d.entrada}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Salida</p>
                        <p className="font-medium">{d.salida}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total</p>
                        <p className="font-medium">{d.horas}</p>
                      </div>
                    </div>
                    {d.extra !== '0h' && d.extra !== '—' && (
                      <Badge variant="info" className="text-[10px]">+{d.extra}</Badge>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Horas semana</p>
                  <p className="text-lg font-bold mt-0.5">27h 11m</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Horas extra</p>
                  <p className="text-lg font-bold text-amber-600 mt-0.5">+3h 11m</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xs text-muted-foreground">Jornada objetivo</p>
                  <p className="text-lg font-bold mt-0.5">40h / sem</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fichajes del equipo hoy */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Estado del equipo — Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Empleado</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Estado</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Entrada</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Pausa</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Salida</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {registrosHoy.map((r) => {
                    const cfg = estadoConfig[r.estado];
                    return (
                      <tr key={r.empleado} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className={`text-[10px] font-bold text-white ${getColorAvatar(r.empleado)}`}>
                                {getInitials(r.empleado)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{r.empleado}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={cfg.variant}>{cfg.label}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{r.entrada}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{r.pausa || '—'}</td>
                        <td className="px-4 py-3 font-mono text-xs">{r.salida || '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            {r.tipo === 'REMOTO' ? <Laptop className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />}
                            {r.tipo === 'REMOTO' ? 'Remoto' : 'Presencial'}
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
    </div>
  );
}
