'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Building2, Users, Shield, Bell, Globe, Plus, Pencil, Trash2,
} from 'lucide-react';

const usuarios = [
  { nombre: 'Admin User', email: 'admin@fsource.app', rol: 'ADMIN', estado: 'ACTIVO' },
  { nombre: 'Ana García', email: 'ana.garcia@empresa.com', rol: 'MANAGER', estado: 'ACTIVO' },
  { nombre: 'Javier López', email: 'javier.lopez@empresa.com', rol: 'MANAGER', estado: 'ACTIVO' },
  { nombre: 'Isabel Torres', email: 'isabel.torres@empresa.com', rol: 'ADMIN', estado: 'ACTIVO' },
  { nombre: 'Laura Martínez', email: 'laura.martinez@empresa.com', rol: 'EMPLEADO', estado: 'ACTIVO' },
];

const rolConfig: Record<string, { label: string; variant: 'purple' | 'info' | 'secondary' }> = {
  SUPERADMIN: { label: 'Superadmin', variant: 'purple' },
  ADMIN: { label: 'Admin', variant: 'info' },
  MANAGER: { label: 'Manager', variant: 'secondary' },
  EMPLEADO: { label: 'Empleado', variant: 'secondary' },
};

const permisosPorRol = [
  { modulo: 'Empleados', admin: true, manager: true, empleado: false },
  { modulo: 'Vacaciones (aprobar)', admin: true, manager: true, empleado: false },
  { modulo: 'Vacaciones (solicitar)', admin: true, manager: true, empleado: true },
  { modulo: 'Fichaje', admin: true, manager: true, empleado: true },
  { modulo: 'Nóminas (ver todas)', admin: true, manager: false, empleado: false },
  { modulo: 'Nóminas (ver propias)', admin: true, manager: true, empleado: true },
  { modulo: 'Reclutamiento', admin: true, manager: true, empleado: false },
  { modulo: 'Evaluaciones (gestionar)', admin: true, manager: true, empleado: false },
  { modulo: 'Reportes', admin: true, manager: false, empleado: false },
  { modulo: 'Configuración', admin: true, manager: false, empleado: false },
];

export default function ConfiguracionPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Configuración" />

      <div className="flex-1 overflow-y-auto p-6">
        <Tabs defaultValue="empresa">
          <TabsList className="mb-6">
            <TabsTrigger value="empresa">
              <Building2 className="h-4 w-4 mr-2" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="usuarios">
              <Users className="h-4 w-4 mr-2" />
              Usuarios y roles
            </TabsTrigger>
            <TabsTrigger value="permisos">
              <Shield className="h-4 w-4 mr-2" />
              Permisos
            </TabsTrigger>
            <TabsTrigger value="notificaciones">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </TabsTrigger>
          </TabsList>

          {/* Empresa */}
          <TabsContent value="empresa">
            <div className="max-w-2xl space-y-6">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-sm">Datos de la empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Nombre de la empresa</Label>
                      <Input defaultValue="Mi Empresa S.L." />
                    </div>
                    <div className="space-y-1.5">
                      <Label>CIF</Label>
                      <Input defaultValue="B12345678" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>País</Label>
                      <Select defaultValue="es">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">España</SelectItem>
                          <SelectItem value="mx">México</SelectItem>
                          <SelectItem value="ar">Argentina</SelectItem>
                          <SelectItem value="co">Colombia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Zona horaria</Label>
                      <Select defaultValue="europe_madrid">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="europe_madrid">Europe/Madrid</SelectItem>
                          <SelectItem value="america_mexico">America/Mexico_City</SelectItem>
                          <SelectItem value="america_bogota">America/Bogota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleSave}>
                    {saved ? '✓ Guardado' : 'Guardar cambios'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-sm">Política de vacaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Días de vacaciones anuales</Label>
                      <Input type="number" defaultValue="23" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Días de asuntos propios</Label>
                      <Input type="number" defaultValue="6" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Días mínimos por solicitud</Label>
                      <Input type="number" defaultValue="1" />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Antelación mínima (días)</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                  </div>
                  <Button onClick={handleSave}>
                    {saved ? '✓ Guardado' : 'Guardar cambios'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Usuarios */}
          <TabsContent value="usuarios">
            <div className="max-w-3xl space-y-4">
              <div className="flex justify-end">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Invitar usuario
                </Button>
              </div>
              <Card className="border-border/60">
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Usuario</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Rol</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Estado</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((u) => {
                        const rcfg = rolConfig[u.rol];
                        return (
                          <tr key={u.email} className="border-b border-border/50 hover:bg-muted/20">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                    {u.nombre.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{u.nombre}</p>
                                  <p className="text-xs text-muted-foreground">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant={rcfg.variant}>{rcfg.label}</Badge>
                            </td>
                            <td className="px-5 py-3">
                              <Badge variant="success">Activo</Badge>
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-1">
                                <button className="rounded p-1 text-muted-foreground hover:text-primary hover:bg-muted">
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button className="rounded p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Permisos */}
          <TabsContent value="permisos">
            <div className="max-w-3xl">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-sm">Permisos por rol</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Módulo</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Admin</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Manager</th>
                        <th className="text-center px-5 py-3 text-xs font-semibold text-muted-foreground">Empleado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {permisosPorRol.map((p) => (
                        <tr key={p.modulo} className="border-b border-border/50">
                          <td className="px-5 py-3 font-medium">{p.modulo}</td>
                          {(['admin', 'manager', 'empleado'] as const).map((rol) => (
                            <td key={rol} className="px-5 py-3 text-center">
                              {p[rol] ? (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">✓</span>
                              ) : (
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground/50 text-xs">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notificaciones */}
          <TabsContent value="notificaciones">
            <div className="max-w-2xl">
              <Card className="border-border/60">
                <CardHeader>
                  <CardTitle className="text-sm">Preferencias de notificación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'Solicitudes de vacaciones pendientes', desc: 'Cuando un empleado solicita vacaciones' },
                    { label: 'Nuevos candidatos', desc: 'Cuando se recibe una nueva candidatura' },
                    { label: 'Evaluaciones pendientes', desc: 'Recordatorio de evaluaciones sin completar' },
                    { label: 'Nuevos comunicados', desc: 'Cuando se publica un comunicado interno' },
                    { label: 'Fin de contrato próximo', desc: 'Alerta 30 días antes del fin de contrato' },
                    { label: 'Incidencias de fichaje', desc: 'Empleados sin fichar o con anomalías' },
                  ].map((notif) => (
                    <div key={notif.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked className="peer sr-only" />
                        <div className="peer h-5 w-9 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full" />
                      </label>
                    </div>
                  ))}
                  <Button onClick={handleSave}>
                    {saved ? '✓ Guardado' : 'Guardar preferencias'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
