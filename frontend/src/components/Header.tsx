import { LogOut, LayoutDashboard, PlusCircle, FileText, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ActivePage } from '../App';

interface HeaderProps {
  onLogout?: () => void;
  activePage?: ActivePage;
  onNavigate?: (page: ActivePage) => void;
}

const navItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'create-trip', label: 'Create Trip', icon: <PlusCircle className="w-4 h-4" /> },
  { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  { id: 'vehicles', label: 'Vehicles', icon: <Truck className="w-4 h-4" /> },
];

export default function Header({ onLogout, activePage, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top row: branding + logout */}
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <div className="header-logo">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h1 className="header-title">Trip Data Manager</h1>
              <p className="header-subtitle hidden sm:block">Track, analyze & export your trip records</p>
            </div>
          </div>
          {onLogout && (
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </div>

        {/* Navigation tabs row */}
        {onNavigate && (
          <nav className="flex items-center gap-1 -mx-1 px-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-all duration-150 rounded-t-md
                    ${
                      isActive
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/40'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
