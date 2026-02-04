// =====================================================
// MatFlow - Sidebar Component
// =====================================================

import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Warehouse,
  MapPin,
  Calendar,
  Briefcase,
  Boxes,
  Container,
  PackageCheck,
  Undo2,
  Wrench,
  FileText,
  Receipt,
  Users,
  Bell,
  Building2,
  Files,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore, hasRole } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import type { UserRole } from '@matflow/types';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  roles?: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigation: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Tableau de bord', icon: LayoutDashboard, href: '/dashboard' },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { label: 'Articles', icon: Package, href: '/articles' },
      { label: 'Catégories', icon: FolderTree, href: '/categories' },
      { label: 'Kits', icon: Boxes, href: '/kits' },
      { label: 'Caisses', icon: Container, href: '/cases' },
    ],
  },
  {
    label: 'Stock',
    items: [
      { label: 'Vue stock', icon: Warehouse, href: '/stock' },
      { label: 'Emplacements', icon: MapPin, href: '/locations' },
    ],
  },
  {
    label: 'Opérations',
    items: [
      { label: 'Réservations', icon: Calendar, href: '/reservations' },
      { label: 'Projets', icon: Briefcase, href: '/projects' },
      { label: 'Préparation', icon: PackageCheck, href: '/picking' },
      { label: 'Retours', icon: Undo2, href: '/returns' },
    ],
  },
  {
    label: 'Maintenance',
    items: [
      { label: 'Tâches', icon: Wrench, href: '/maintenance' },
    ],
  },
  {
    label: 'Facturation',
    items: [
      { label: 'Devis', icon: FileText, href: '/quotes' },
      { label: 'Factures', icon: Receipt, href: '/invoices' },
      { label: 'Clients', icon: Users, href: '/clients' },
    ],
  },
  {
    label: 'Système',
    items: [
      { label: 'Filiales', icon: Building2, href: '/branches', roles: ['SUPER_ADMIN', 'ADMIN'] },
      { label: 'Documents', icon: Files, href: '/documents' },
      { label: 'Notifications', icon: Bell, href: '/notifications' },
      { label: 'Paramètres', icon: Settings, href: '/settings' },
    ],
  },
];

export function Sidebar() {
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const userRole = useAuthStore((state) => state.user?.role);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300',
        sidebarCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!sidebarCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              M
            </div>
            <span className="text-lg font-semibold">MatFlow</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(sidebarCollapsed && 'mx-auto')}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {navigation.map((group) => (
          <div key={group.label} className="mb-4">
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
                {group.label}
              </p>
            )}
            <ul className="space-y-1">
              {group.items
                .filter((item) => !item.roles || hasRole(userRole, item.roles))
                .map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                          sidebarCollapsed && 'justify-center'
                        )}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!sidebarCollapsed && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
