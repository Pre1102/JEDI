import React, { useState, useEffect } from 'react';
import {
  Home,
  LayoutDashboard,
  Upload,
  BarChart3,
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

export type SidebarRoute = 'home' | 'upload' | 'dashboard' | 'analysis' | 'report';

interface NavItem {
  id: SidebarRoute;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'upload', label: 'Dataset Upload', icon: Upload },
  { id: 'analysis', label: 'Dataset Analysis', icon: BarChart3 },
  { id: 'report', label: 'Compliance Report', icon: FileCheck },
];

interface SidebarProps {
  activeRoute: SidebarRoute;
  hasAuditResults: boolean;
  onNavigate: (route: SidebarRoute) => void;
}

export function Sidebar({ activeRoute, hasAuditResults, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('jedi-sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('jedi-sidebar-collapsed', String(collapsed));
    // Set CSS custom property so the content area can dynamically adjust margin
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '68px' : '240px',
    );
  }, [collapsed]);

  // Set initial value on mount
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      collapsed ? '68px' : '240px',
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = (id: SidebarRoute) => {
    if (id === 'home' || id === 'upload') return false;
    return !hasAuditResults;
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 h-screen flex flex-col border-r transition-all duration-300 ease-in-out',
        'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700',
        collapsed ? 'w-[68px]' : 'w-[240px]',
      )}
    >
      {/* Logo / Brand */}
      <div
        className={cn(
          'flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-700 px-4 h-16 shrink-0',
          collapsed && 'justify-center px-0',
        )}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 shrink-0">
          <Shield className="w-5 h-5 text-white dark:text-zinc-900" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100 truncate">
              JEDI Code
            </h1>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
              Compliance
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const disabled = isDisabled(item.id);
          const active = activeRoute === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => !disabled && onNavigate(item.id)}
              disabled={disabled}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-colors duration-150',
                collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
                active && !disabled
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : disabled
                    ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100',
              )}
            >
              <Icon className={cn('shrink-0', collapsed ? 'w-5 h-5' : 'w-4 h-4')} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom section: theme toggle + collapse */}
      <div className="border-t border-zinc-200 dark:border-zinc-700 p-3 space-y-1 shrink-0">
        <div className={cn('flex', collapsed ? 'justify-center' : 'justify-start px-1')}>
          <ThemeToggle />
        </div>
        <button
          onClick={() => setCollapsed((c) => !c)}
          className={cn(
            'w-full flex items-center gap-3 rounded-lg text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150',
            collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
