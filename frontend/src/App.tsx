import { useState, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import TripForm from './components/TripForm';
import Dashboard from './components/Dashboard';
import TripTable from './components/TripTable';
import DailyReport from './components/DailyReport';
import DateRangeReport from './components/DateRangeReport';
import VehicleManagement from './components/VehicleManagement';
import Login from './components/Login';
import { useTripData } from './hooks/useTripData';
import { useAuth } from './hooks/useAuth';
import type { TripRecord, TripStatus } from './types/trip';

export type ActivePage = 'dashboard' | 'create-trip' | 'reports' | 'vehicles';

export default function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { trips, addTrip, updateTrip, deleteTrip, updateTripStatus } = useTripData();
  const [editingTrip, setEditingTrip] = useState<TripRecord | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const handleEdit = useCallback((trip: TripRecord) => {
    setEditingTrip(trip);
    setActivePage('create-trip');
  }, []);

  const handleFormSuccess = useCallback(
    (trip: TripRecord) => {
      if (editingTrip) {
        updateTrip(trip);
      } else {
        addTrip(trip);
      }
      setEditingTrip(null);
      setActivePage('dashboard');
    },
    [editingTrip, addTrip, updateTrip]
  );

  const handleFormCancel = useCallback(() => {
    setEditingTrip(null);
    setActivePage('dashboard');
  }, []);

  const handleNavigate = useCallback((page: ActivePage) => {
    if (page !== 'create-trip') {
      setEditingTrip(null);
    }
    setActivePage(page);
  }, []);

  const handleStatusChange = useCallback(
    (id: string, status: TripStatus) => {
      updateTripStatus(id, status);
    },
    [updateTripStatus]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {!isAuthenticated ? (
        <Login onLogin={login} />
      ) : (
        <div className="min-h-screen bg-surface flex flex-col">
          <Header onLogout={logout} activePage={activePage} onNavigate={handleNavigate} />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
            {/* Dashboard View */}
            {activePage === 'dashboard' && (
              <div className="space-y-8">
                <section>
                  <div className="section-header">
                    <h2 className="section-title">📊 Dashboard</h2>
                    <p className="section-subtitle">Summary statistics and trip cost trends</p>
                  </div>
                  <Dashboard trips={trips} />
                </section>

                <section>
                  <div className="section-header">
                    <h2 className="section-title">📋 Trip Records</h2>
                    <p className="section-subtitle">All recorded trips — edit or delete as needed</p>
                  </div>
                  <TripTable
                    trips={trips}
                    onEdit={handleEdit}
                    onDelete={deleteTrip}
                    onStatusChange={handleStatusChange}
                  />
                </section>
              </div>
            )}

            {/* Create Trip View */}
            {activePage === 'create-trip' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">
                    {editingTrip ? '✏️ Edit Trip Record' : '➕ Create Trip'}
                  </h2>
                  <p className="section-subtitle">
                    {editingTrip
                      ? 'Update the trip details below'
                      : 'Fill in the trip details to add a new record'}
                  </p>
                </div>
                <TripForm
                  trips={trips}
                  editingTrip={editingTrip}
                  onSubmit={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
            )}

            {/* Reports View */}
            {activePage === 'reports' && (
              <div className="space-y-8">
                <section>
                  <div className="section-header">
                    <h2 className="section-title">📄 End of Day Report</h2>
                    <p className="section-subtitle">Generate and export daily trip summaries</p>
                  </div>
                  <DailyReport trips={trips} />
                </section>

                <section>
                  <div className="section-header">
                    <h2 className="section-title">📅 Custom Date Range Report</h2>
                    <p className="section-subtitle">
                      Filter trips by a custom date range and export to Excel or PDF
                    </p>
                  </div>
                  <DateRangeReport trips={trips} />
                </section>
              </div>
            )}

            {/* Vehicles View */}
            {activePage === 'vehicles' && (
              <div>
                <div className="section-header">
                  <h2 className="section-title">🚛 Vehicle Management</h2>
                  <p className="section-subtitle">
                    Add and manage vehicle numbers for easy selection in trip forms
                  </p>
                </div>
                <VehicleManagement />
              </div>
            )}
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </div>
      )}
    </ThemeProvider>
  );
}
