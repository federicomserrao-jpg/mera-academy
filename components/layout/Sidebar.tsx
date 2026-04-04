'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Clock,
  FileText,
  UserSearch,
  Star,
  CalendarRange,
  ClipboardList,
  BarChart3,
  Megaphone,
  User,
  Settings,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  {
    label: 'Principal',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Personas',
    items: [
      { href: '/empleados', icon: Users, label: 'Empleados' },
      { href: '/onboarding', icon: ClipboardList, label: 'Onboarding' },
      { href: '/evaluaciones', icon: Star, label: 'Evaluaciones' },
    ],
  },
  {
    label: 'Tiempo',
    items: [
      { href: '/vacaciones', icon: CalendarDays, label: 'Vacaciones' },
      { href: '/fichaje', icon: Clock, label: 'Fichaje' },
      { href: '/turnos', icon: CalendarRange, label: 'Turnos' },
    ],
  },
  {
    label: 'Talento',
    items: [
      { href: '/reclutamiento', icon: UserSearch, label: 'Reclutamiento' },
    ],
  },
  {
    label: 'Finanzas',
    items: [
      { href: '/nominas', icon: FileText, label: 'Nóminas' },
    ],
  },
  {
    label: 'Comunicación',
    items: [
      { href: '/comunicados', icon: Megaphone, label: 'Comunicados' },
    ],
  },
  {
    label: 'Análisis',
    items: [
      { href: '/reportes', icon: BarChart3, label: 'Reportes' },
    ],
  },
];

const bottomItems = [
  { href: '/portal', icon: User, label: 'Mi Portal' },
  { href: '/configuracion', icon: Settings, label: 'Configuración' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-white border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-border', collapsed && 'justify-center px-0')}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-foreground leading-none">F-Source</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Recursos Humanos</p>
          </div>
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-white shadow-sm hover:bg-muted transition-colors"
      >
        <ChevronLeft className={cn('h-3 w-3 text-muted-foreground transition-transform', collapsed && 'rotate-180')} />
      </button>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>
            )}
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors mb-0.5',
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  collapsed && 'justify-center px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn('h-4 w-4 shrink-0', isActive(item.href) && 'text-primary')} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border py-3 px-2">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors mb-0.5',
              isActive(item.href)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </aside>
  );
}
