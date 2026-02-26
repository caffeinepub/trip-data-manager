import { useMemo } from 'react';
import type { TripRecord, DashboardStats } from '../types/trip';

export function useDashboardStats(
  trips: TripRecord[],
  filterDate: string,
  filterMonth: string
) {
  const filteredTrips = useMemo(() => {
    if (filterDate) {
      return trips.filter((t) => t.date === filterDate);
    }
    if (filterMonth) {
      return trips.filter((t) => t.date.startsWith(filterMonth));
    }
    return trips;
  }, [trips, filterDate, filterMonth]);

  const stats: DashboardStats = useMemo(() => {
    return {
      totalTrips: filteredTrips.length,
      totalAmount: filteredTrips.reduce((sum, t) => sum + t.amount, 0),
      totalExtraCharges: filteredTrips.reduce((sum, t) => sum + t.extraCharge, 0),
      grandTotal: filteredTrips.reduce((sum, t) => sum + t.total, 0),
    };
  }, [filteredTrips]);

  // Chart data: aggregate by date
  const chartData = useMemo(() => {
    const map = new Map<string, { date: string; amount: number; extraCharge: number; total: number }>();
    filteredTrips.forEach((t) => {
      const existing = map.get(t.date);
      if (existing) {
        existing.amount += t.amount;
        existing.extraCharge += t.extraCharge;
        existing.total += t.total;
      } else {
        map.set(t.date, {
          date: t.date,
          amount: t.amount,
          extraCharge: t.extraCharge,
          total: t.total,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTrips]);

  return { stats, filteredTrips, chartData };
}
