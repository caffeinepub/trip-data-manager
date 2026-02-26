import { useState, useCallback } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import TripForm from './components/TripForm';
import Dashboard from './components/Dashboard';
import TripTable from './components/TripTable';
import DailyReport from './components/DailyReport';
import Login from './components/Login';
import { useTripData } from './hooks/useTripData';
import { useAuth } from './hooks/useAuth';
import type { TripRecord } from './types/trip';

export default function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const { trips, addTrip, updateTrip, deleteTrip } = useTripData();
  const [editingTrip, setEditingTrip] = useState<TripRecord | null>(null);

  const handleEdit = useCallback((trip: TripRecord) => {
    setEditingTrip(trip);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingTrip(null);
  }, []);

  const handleFormSubmit = useCallback(
    (trip: TripRecord) => {
      if (editingTrip) {
        updateTrip(trip);
        setEditingTrip(null);
      } else {
        addTrip(trip);
      }
    },
    [editingTrip, addTrip, updateTrip]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {!isAuthenticated ? (
        <Login onLogin={login} />
      ) : (
        <div className="min-h-screen bg-surface flex flex-col">
          <Header onLogout={logout} />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-8">
            {/* Trip Entry Form */}
            <section id="form-section">
              <div className="section-header">
                <h2 className="section-title">
                  {editingTrip ? '✏️ Edit Trip Record' : '➕ Add New Trip'}
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
                onSubmit={handleFormSubmit}
                onCancel={handleCancelEdit}
              />
            </section>

            {/* Dashboard */}
            <section id="dashboard-section">
              <div className="section-header">
                <h2 className="section-title">📊 Dashboard</h2>
                <p className="section-subtitle">Summary statistics and trip cost trends</p>
              </div>
              <Dashboard trips={trips} />
            </section>

            {/* Trip Records Table */}
            <section id="table-section">
              <div className="section-header">
                <h2 className="section-title">📋 Trip Records</h2>
                <p className="section-subtitle">All recorded trips — edit or delete as needed</p>
              </div>
              <TripTable trips={trips} onEdit={handleEdit} onDelete={deleteTrip} />
            </section>

            {/* Daily Report */}
            <section id="report-section">
              <div className="section-header">
                <h2 className="section-title">📄 End of Day Report</h2>
                <p className="section-subtitle">Generate and export daily trip summaries</p>
              </div>
              <DailyReport trips={trips} />
            </section>
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </div>
      )}
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
