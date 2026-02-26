import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="header-logo">
              <span className="text-2xl">🚗</span>
            </div>
            <div>
              <h1 className="header-title">Trip Data Manager</h1>
              <p className="header-subtitle">Track, analyze & export your trip records</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#form-section" className="nav-link">Add Trip</a>
              <a href="#dashboard-section" className="nav-link">Dashboard</a>
              <a href="#table-section" className="nav-link">Records</a>
              <a href="#report-section" className="nav-link">Reports</a>
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
        </div>
      </div>
    </header>
  );
}
