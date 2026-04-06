'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus, Users, Building2, Briefcase, GitBranch,
  MoreHorizontal, Pencil, Trash2, UserPlus, Network,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

// ── Tipos ────────────────────────────────────────────────────────────────────
interface NodoOrg {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  color: string;
  parentId: string | null;
}

const COLORES = [
  { label: 'Violeta',  value: 'bg-violet-500' },
  { label: 'Azul',     value: 'bg-blue-500' },
  { label: 'Verde',    value: 'bg-emerald-500' },
  { label: 'Naranja',  value: 'bg-orange-500' },
  { label: 'Rojo',     value: 'bg-rose-500' },
  { label: 'Amber',    value: 'bg-amber-500' },
  { label: 'Cyan',     value: 'bg-cyan-500' },
  { label: 'Índigo',   value: 'bg-indigo-500' },
];

const DEPTS = ['Dirección', 'Tecnología', 'Ventas', 'Marketing', 'RRHH', 'Finanzas', 'Operaciones', 'Legal', 'Otro'];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ── Tarjeta de un nodo ───────────────────────────────────────────────────────
function OrgCard({
  node, isRoot, onEdit, onDelete, onAddChild,
}: {
  node: NodoOrg;
  isRoot: boolean;
  onEdit: (n: NodoOrg) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  return (
    <div className={`
      group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 bg-white
      transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 select-none
      ${isRoot ? 'border-violet-300 shadow-md w-52' : 'border-border/60 hover:border-border w-44'}
    `}>
      <Avatar className={isRoot ? 'h-14 w-14' : 'h-10 w-10'}>
        <AvatarFallback className={`font-bold text-white ${node.color} ${isRoot ? 'text-base' : 'text-sm'}`}>
          {getInitials(node.nombre)}
        </AvatarFallback>
      </Avatar>

      <div className="text-center w-full px-1">
        <p className={`font-semibold text-foreground leading-tight truncate ${isRoot ? 'text-sm' : 'text-xs'}`}>
          {node.nombre}
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">{node.cargo}</p>
      </div>

      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        {node.departamento}
      </span>

      {/* Acciones — visible en hover */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={() => onAddChild(node.id)}
          className="h-5 w-5 rounded bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center"
          title="Agregar subordinado"
        >
          <Plus className="h-3 w-3" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-5 w-5 rounded bg-muted hover:bg-muted/80 flex items-center justify-center">
              <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(node)}>
              <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAddChild(node.id)}>
              <UserPlus className="mr-2 h-3.5 w-3.5" /> Agregar subordinado
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(node.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ── Árbol recursivo ──────────────────────────────────────────────────────────
function OrgTree({
  parentId, nodes, isRoot = false, onEdit, onDelete, onAddChild,
}: {
  parentId: string | null;
  nodes: NodoOrg[];
  isRoot?: boolean;
  onEdit: (n: NodoOrg) => void;
  onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void;
}) {
  const children = nodes.filter(n => n.parentId === parentId);

  if (children.length === 0) return null;

  return (
    <div className="flex items-start justify-center gap-8">
      {children.map((node, idx) => {
        const hasChildren = nodes.some(n => n.parentId === node.id);
        return (
          <div key={node.id} className="flex flex-col items-center">
            {/* Conector vertical desde padre */}
            <div className="w-0.5 h-8 bg-border/60" />

            <OrgCard
              node={node}
              isRoot={isRoot}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />

            {hasChildren && (
              <>
                <div className="w-0.5 h-6 bg-border/60" />
                <OrgTree
                  parentId={node.id}
                  nodes={nodes}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onAddChild={onAddChild}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Formulario de nodo ───────────────────────────────────────────────────────
const FORM_VACÍO = { nombre: '', cargo: '', departamento: '', color: 'bg-violet-500', parentId: '' };

// ── Página principal ─────────────────────────────────────────────────────────
export default function OrganigramaPage() {
  const [nodos, setNodos] = useState<NodoOrg[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<NodoOrg | null>(null);
  const [form, setForm] = useState(FORM_VACÍO);
  const [parentIdPreset, setParentIdPreset] = useState<string | null>(null);

  // Raíces = nodos sin padre
  const raices = nodos.filter(n => n.parentId === null);

  function abrirNuevo(parentId?: string) {
    setEditando(null);
    setForm({ ...FORM_VACÍO, parentId: parentId ?? '' });
    setParentIdPreset(parentId ?? null);
    setModalAbierto(true);
  }

  function abrirEditar(node: NodoOrg) {
    setEditando(node);
    setForm({
      nombre: node.nombre,
      cargo: node.cargo,
      departamento: node.departamento,
      color: node.color,
      parentId: node.parentId ?? '',
    });
    setModalAbierto(true);
  }

  function guardar() {
    if (!form.nombre.trim() || !form.cargo.trim() || !form.departamento) return;
    if (editando) {
      setNodos(prev => prev.map(n =>
        n.id === editando.id
          ? { ...n, nombre: form.nombre, cargo: form.cargo, departamento: form.departamento, color: form.color, parentId: form.parentId || null }
          : n
      ));
    } else {
      const nuevo: NodoOrg = {
        id: uid(),
        nombre: form.nombre,
        cargo: form.cargo,
        departamento: form.departamento,
        color: form.color,
        parentId: form.parentId || null,
      };
      setNodos(prev => [...prev, nuevo]);
    }
    setModalAbierto(false);
    setEditando(null);
    setForm(FORM_VACÍO);
  }

  function eliminar(id: string) {
    // Eliminar nodo y todos sus descendientes
    const idsAEliminar = new Set<string>();
    function marcar(nId: string) {
      idsAEliminar.add(nId);
      nodos.filter(n => n.parentId === nId).forEach(n => marcar(n.id));
    }
    marcar(id);
    setNodos(prev => prev.filter(n => !idsAEliminar.has(n.id)));
  }

  function limpiar() {
    if (confirm('¿Borrar todo el organigrama y empezar de cero?')) setNodos([]);
  }

  const stats = [
    { label: 'Personas', value: nodos.length, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Departamentos', value: new Set(nodos.map(n => n.departamento)).size, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Managers', value: nodos.filter(n => nodos.some(c => c.parentId === n.id)).length, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Niveles', value: (() => {
      function depth(id: string): number {
        const children = nodos.filter(n => n.parentId === id);
        if (children.length === 0) return 0;
        return 1 + Math.max(...children.map(c => depth(c.id)));
      }
      return raices.length ? 1 + Math.max(...raices.map(r => depth(r.id))) : 0;
    })(), icon: GitBranch, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Organigrama" />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label} className="border-border/60">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Network className="h-4 w-4" />
            <span>Hacé hover sobre un nodo para editar o agregar subordinados</span>
          </div>
          <div className="flex gap-2">
            {nodos.length > 0 && (
              <Button variant="outline" size="sm" onClick={limpiar} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
            <Button size="sm" onClick={() => abrirNuevo()}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar persona
            </Button>
          </div>
        </div>

        {/* Organigrama o estado vacío */}
        <Card className="border-border/60 min-h-[400px]">
          <CardContent className="p-8">
            {nodos.length === 0 ? (
              // Estado vacío
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center">
                  <Network className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-foreground">El organigrama está vacío</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Empezá agregando al responsable máximo de la empresa
                  </p>
                </div>
                <Button onClick={() => abrirNuevo()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primera persona
                </Button>
              </div>
            ) : (
              // Árbol
              <div className="flex flex-col items-center overflow-auto">
                {/* Raíces */}
                <div className="flex gap-16 items-start">
                  {raices.map(raiz => (
                    <div key={raiz.id} className="flex flex-col items-center">
                      <OrgCard
                        node={raiz}
                        isRoot
                        onEdit={abrirEditar}
                        onDelete={eliminar}
                        onAddChild={abrirNuevo}
                      />
                      {nodos.some(n => n.parentId === raiz.id) && (
                        <>
                          <div className="w-0.5 h-6 bg-border/60" />
                          <OrgTree
                            parentId={raiz.id}
                            nodes={nodos}
                            onEdit={abrirEditar}
                            onDelete={eliminar}
                            onAddChild={abrirNuevo}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal agregar / editar */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editando ? 'Editar persona' : 'Agregar persona'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Nombre */}
            <div className="space-y-1.5">
              <Label>Nombre completo *</Label>
              <Input
                placeholder="Ej: María García"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              />
            </div>

            {/* Cargo */}
            <div className="space-y-1.5">
              <Label>Cargo / Puesto *</Label>
              <Input
                placeholder="Ej: Directora de Marketing"
                value={form.cargo}
                onChange={e => setForm(f => ({ ...f, cargo: e.target.value }))}
              />
            </div>

            {/* Departamento */}
            <div className="space-y-1.5">
              <Label>Departamento *</Label>
              <Select value={form.departamento} onValueChange={v => setForm(f => ({ ...f, departamento: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento..." />
                </SelectTrigger>
                <SelectContent>
                  {DEPTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Reporta a */}
            <div className="space-y-1.5">
              <Label>Reporta a</Label>
              <Select
                value={form.parentId || '__ninguno__'}
                onValueChange={v => setForm(f => ({ ...f, parentId: v === '__ninguno__' ? '' : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sin responsable (nivel raíz)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ninguno__">— Sin responsable (nivel raíz)</SelectItem>
                  {nodos
                    .filter(n => !editando || n.id !== editando.id)
                    .map(n => (
                      <SelectItem key={n.id} value={n.id}>
                        {n.nombre} — {n.cargo}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            {/* Color avatar */}
            <div className="space-y-1.5">
              <Label>Color del avatar</Label>
              <div className="flex flex-wrap gap-2">
                {COLORES.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setForm(f => ({ ...f, color: c.value }))}
                    className={`h-7 w-7 rounded-full ${c.value} transition-all ${
                      form.color === c.value ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'hover:scale-105'
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            {form.nombre && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 border border-border/60">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`font-bold text-white text-sm ${form.color}`}>
                    {getInitials(form.nombre)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{form.nombre}</p>
                  <p className="text-xs text-muted-foreground">{form.cargo || '—'}</p>
                  {form.departamento && (
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                      {form.departamento}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
            <Button
              onClick={guardar}
              disabled={!form.nombre.trim() || !form.cargo.trim() || !form.departamento}
            >
              {editando ? 'Guardar cambios' : 'Agregar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
