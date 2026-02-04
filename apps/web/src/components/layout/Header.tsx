// =====================================================
// MatFlow - Header Component
// =====================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setSidebarMobileOpen = useUIStore((state) => state.setSidebarMobileOpen);
  const { theme, setTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-6">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setSidebarMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher... (Ctrl+K)"
            className="pl-9"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" asChild>
          <Link to="/notifications">
            <Bell className="h-5 w-5" />
          </Link>
        </Button>

        {/* User menu */}
        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
            <span className="hidden md:inline">{user?.displayName}</span>
          </Button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-card py-1 shadow-lg">
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                onClick={() => setDropdownOpen(false)}
              >
                <User className="h-4 w-4" />
                Profil
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Paramètres
              </Link>
              <hr className="my-1" />
              <button
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted"
                onClick={() => {
                  logout();
                  setDropdownOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
